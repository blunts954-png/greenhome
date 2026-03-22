import 'server-only';

import { PRODUCTS, getProductBySlug } from '@/lib/products';
import { isStripeServerConfigured, retrieveStripePaymentIntent } from '@/lib/stripe-server';
import { getSupabaseAdmin, isSupabaseConfigured } from '@/lib/supabase/server';

const MISSED_PICKUP_REASON = 'Missed pickup or delivery after the 9:30 PM deadline or no-show.';
const VALID_ORDER_TYPES = new Set(['Shipping', 'Pickup', 'Delivery']);
const VALID_ORDER_STATUSES = new Set(['Pending', 'Completed', 'Cancelled', 'Missed Pickup', 'Missed Delivery', 'No Show']);
const VALID_PAYMENT_METHODS = {
  Shipping: new Set(['Card']),
  Pickup: new Set(['Card', 'Cash']),
  Delivery: new Set(['Card', 'Cash'])
};

export function requiresStripeCheckout(preparedOrder) {
  return (preparedOrder.type === 'Shipping' || preparedOrder.type === 'Pickup' || preparedOrder.type === 'Delivery') && preparedOrder.payment === 'Card';
}

function getManualPaymentStatus(preparedOrder) {
  if (preparedOrder.type === 'Shipping') {
    return preparedOrder.payment === 'Venmo' ? 'PENDING_REMOTE_PAYMENT' : 'PENDING_MANUAL_REVIEW';
  }

  return preparedOrder.payment === 'Venmo' ? 'PENDING_REMOTE_PAYMENT' : 'PENDING_AT_FULFILLMENT';
}

function isCheckoutDemoMode() {
  return process.env.CHECKOUT_DEMO_MODE === 'true' || process.env.NEXT_PUBLIC_CHECKOUT_DEMO_MODE === 'true';
}

function createHttpError(status, code, message) {
  const error = new Error(message);
  error.status = status;
  error.code = code;
  return error;
}

function getClientOrThrow() {
  const client = getSupabaseAdmin();

  if (!client) {
    throw createHttpError(503, 'BACKEND_NOT_CONFIGURED', 'Supabase backend is not configured yet.');
  }

  return client;
}

export function normalizePhone(phone = '') {
  return phone.replace(/\D/g, '');
}

function normalizeEmail(email = '') {
  return email.trim().toLowerCase();
}

export function getClientIp(request) {
  const forwarded =
    request.headers.get('x-forwarded-for') ||
    request.headers.get('x-real-ip') ||
    request.headers.get('x-vercel-forwarded-for');

  return forwarded?.split(',')[0]?.trim() || null;
}

function getPickupDeadlineIso(createdAtIso) {
  const createdAt = new Date(createdAtIso);
  const deadline = new Date(createdAt);
  deadline.setHours(21, 30, 0, 0);

  if (createdAt > deadline) {
    deadline.setDate(deadline.getDate() + 1);
  }

  return deadline.toISOString();
}

function getAgeInYears(dateString) {
  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) {
    return 0;
  }

  const today = new Date();
  let age = today.getFullYear() - date.getFullYear();
  const monthDelta = today.getMonth() - date.getMonth();

  if (monthDelta < 0 || (monthDelta === 0 && today.getDate() < date.getDate())) {
    age -= 1;
  }

  return age;
}

function getProductByItem(item) {
  if (item?.slug) {
    return getProductBySlug(item.slug);
  }

  return PRODUCTS.find((product) => product.id === Number(item?.id));
}

function sanitizeItems(submittedItems) {
  if (!Array.isArray(submittedItems) || submittedItems.length === 0) {
    throw createHttpError(400, 'INVALID_ITEMS', 'Your cart is empty.');
  }

  return submittedItems.map((item) => {
    const product = getProductByItem(item);

    if (!product) {
      throw createHttpError(400, 'PRODUCT_NOT_FOUND', 'One of the selected products is no longer available.');
    }

    const quantity = Math.max(1, Number(item.quantity) || 1);
    const size = item.size || item.selectedSize || null;

    if (product.sizes?.length > 0 && (!size || !product.sizes.includes(size))) {
      throw createHttpError(400, 'INVALID_SIZE', `Please choose a valid size for ${product.name}.`);
    }

    return {
      productId: product.id,
      slug: product.slug,
      name: product.name,
      category: product.category,
      price: Number(product.price),
      quantity,
      size,
      pickupOnly: Boolean(product.pickupOnly)
    };
  });
}

function serializeOrderRow(row) {
  return {
    id: row.order_number,
    dbId: row.id,
    date: row.created_at,
    status: row.status,
    type: row.order_type,
    payment: row.payment_method,
    paymentProvider: row.payment_provider || 'manual',
    paymentStatus: row.payment_status || null,
    paymentReferenceId: row.payment_reference_id || null,
    stripePaymentIntentId: row.stripe_payment_intent_id || null,
    stripePaymentMethodId: row.stripe_payment_method_id || null,
    stripeChargeId: row.stripe_charge_id || null,
    total: Number(row.total),
    pickupDeadline: row.pickup_deadline,
    missedPickupAt: row.missed_pickup_at,
    demo: Boolean(row.demo_order),
    customer: {
      firstName: row.customer_first_name,
      lastName: row.customer_last_name,
      name: row.customer_name,
      email: row.customer_email,
      phone: row.customer_phone,
      birthDate: row.customer_birth_date,
      address: row.customer_address,
      notes: row.notes
    },
    items: Array.isArray(row.items) ? row.items : []
  };
}

function serializeAccountRow(row) {
  return {
    id: row.id,
    firstName: row.first_name,
    lastName: row.last_name,
    name: row.full_name,
    email: row.email,
    phone: row.phone,
    normalizedPhone: row.normalized_phone,
    birthDate: row.birth_date,
    banned: row.banned,
    banReason: row.ban_reason,
    bannedAt: row.banned_at,
    missedPickups: row.missed_pickups,
    lastIp: row.last_ip,
    lastOrderAt: row.last_order_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

async function getAccountByIdentity(client, email, normalizedPhone) {
  if (!email || !normalizedPhone) {
    return null;
  }

  const { data, error } = await client
    .from('customer_accounts')
    .select('*')
    .eq('email', email)
    .eq('normalized_phone', normalizedPhone)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data;
}

async function getActiveIpBan(client, ipAddress) {
  if (!ipAddress) {
    return null;
  }

  const { data, error } = await client
    .from('banned_ips')
    .select('*')
    .eq('ip_address', ipAddress)
    .eq('active', true)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data;
}

async function upsertIpBan(client, { accountId, ipAddress, reason }) {
  if (!ipAddress) {
    return;
  }

  const timestamp = new Date().toISOString();

  const { error } = await client.from('banned_ips').upsert(
    {
      ip_address: ipAddress,
      account_id: accountId,
      reason,
      active: true,
      updated_at: timestamp
    },
    {
      onConflict: 'ip_address'
    }
  );

  if (error) {
    throw error;
  }
}

export async function sweepMissedPickups(existingClient) {
  if (!isSupabaseConfigured()) {
    return {
      backendReady: false,
      processed: 0
    };
  }

  const client = existingClient || getClientOrThrow();
  const nowIso = new Date().toISOString();

  const { data: expiredOrders, error } = await client
    .from('store_orders')
    .select('id, account_id, submitted_ip, order_type')
    .in('order_type', ['Pickup', 'Delivery'])
    .eq('status', 'Pending')
    .lte('pickup_deadline', nowIso);

  if (error) {
    throw error;
  }

  if (!expiredOrders?.length) {
    return {
      backendReady: true,
      processed: 0
    };
  }

  for (const order of expiredOrders) {
    const isDelivery = order.order_type === 'Delivery';
    const status = isDelivery ? 'No Show' : 'Missed Pickup';
    const reason = isDelivery ? 'Customer no-show for delivery.' : MISSED_PICKUP_REASON;

    const { error: orderError } = await client
      .from('store_orders')
      .update({
        status,
        missed_pickup_at: nowIso,
        updated_at: nowIso
      })
      .eq('id', order.id);

    if (orderError) {
      throw orderError;
    }

    if (!order.account_id) {
      continue;
    }

    const { data: account, error: accountError } = await client
      .from('customer_accounts')
      .select('*')
      .eq('id', order.account_id)
      .single();

    if (accountError) {
      throw accountError;
    }

    const ipAddress = order.submitted_ip || account.last_ip || null;

    const { error: updateAccountError } = await client
      .from('customer_accounts')
      .update({
        banned: true,
        banned_at: nowIso,
        ban_reason: reason,
        missed_pickups: (account.missed_pickups || 0) + 1,
        updated_at: nowIso
      })
      .eq('id', order.account_id);

    if (updateAccountError) {
      throw updateAccountError;
    }

    const { error: banEventError } = await client.from('ban_events').insert({
      account_id: order.account_id,
      ip_address: ipAddress,
      reason: reason,
      source: 'missed-fulfillment'
    });

    if (banEventError) {
      throw banEventError;
    }

    await upsertIpBan(client, {
      accountId: order.account_id,
      ipAddress,
      reason: reason
    });
  }

  return {
    backendReady: true,
    processed: expiredOrders.length
  };
}

export async function checkBanStatus({ email, phone, ipAddress }) {
  if (isCheckoutDemoMode()) {
    return {
      backendReady: true,
      blocked: false,
      demo: true
    };
  }

  if (!isSupabaseConfigured()) {
    return {
      backendReady: false,
      blocked: false
    };
  }

  const client = getClientOrThrow();
  await sweepMissedPickups(client);

  const normalizedEmail = normalizeEmail(email);
  const normalizedPhone = normalizePhone(phone);
  const account = await getAccountByIdentity(client, normalizedEmail, normalizedPhone);

  if (account?.banned) {
    return {
      backendReady: true,
      blocked: true,
      source: 'account',
      banReason: account.ban_reason || MISSED_PICKUP_REASON,
      account: serializeAccountRow(account)
    };
  }

  const ipBan = await getActiveIpBan(client, ipAddress);

  if (ipBan) {
    return {
      backendReady: true,
      blocked: true,
      source: 'ip',
      banReason: ipBan.reason || 'This IP address is blocked from checkout.'
    };
  }

  return {
    backendReady: true,
    blocked: false,
    account: account ? serializeAccountRow(account) : null
  };
}

function generateOrderNumber() {
  return `ORD-${Date.now().toString().slice(-8)}-${Math.floor(Math.random() * 900 + 100)}`;
}

export function prepareOrderInput(order) {
  const customer = order?.customer || {};
  const email = normalizeEmail(customer.email);
  const normalizedPhone = normalizePhone(customer.phone);
  const firstName = customer.firstName?.trim() || '';
  const lastName = customer.lastName?.trim() || '';
  const paymentRequest =
    order?.paymentRequest && typeof order.paymentRequest === 'object'
      ? {
          provider: String(order.paymentRequest.provider || '').trim().toLowerCase(),
          paymentIntentId: String(order.paymentRequest.paymentIntentId || '').trim(),
          paymentMethodId: String(order.paymentRequest.paymentMethodId || '').trim()
        }
      : null;

  if (!firstName || !lastName || !email || !normalizedPhone) {
    throw createHttpError(400, 'MISSING_CUSTOMER_FIELDS', 'First name, last name, email, and phone are required.');
  }

  const type = order?.type || '';
  const payment = order?.payment || '';

  if (!VALID_ORDER_TYPES.has(type)) {
    throw createHttpError(400, 'INVALID_ORDER_TYPE', 'Choose a valid fulfillment option.');
  }

  const items = sanitizeItems(order?.items);
  const hasLocalOnlyItems = items.some((item) => item.pickupOnly);

  // Business Rules: Cash or Card for local fulfillment
  if ((type === 'Pickup' || type === 'Delivery') && !VALID_PAYMENT_METHODS[type].has(payment)) {
    throw createHttpError(400, 'INVALID_PAYMENT_METHOD', 'Local fulfillment requires Cash or Card payment.');
  }

  if (!VALID_PAYMENT_METHODS[type]?.has(payment)) {
    throw createHttpError(400, 'INVALID_PAYMENT_METHOD', 'Choose a valid payment method for this fulfillment option.');
  }

  if (hasLocalOnlyItems && (type !== 'Pickup' && type !== 'Delivery')) {
    throw createHttpError(400, 'LOCAL_ONLY_ITEMS', 'Cannabis and other local-only items must be for pickup or delivery.');
  }

  if (hasLocalOnlyItems) {
    if (!customer.birthDate) {
      throw createHttpError(400, 'AGE_REQUIRED', 'Date of birth is required for local-only items.');
    }

    if (getAgeInYears(customer.birthDate) < 21) {
      throw createHttpError(403, 'UNDERAGE', 'You must be 21 or older to reserve local-only items.');
    }
  }

  if (type === 'Shipping' && !customer.address?.trim()) {
    throw createHttpError(400, 'ADDRESS_REQUIRED', 'A shipping address is required.');
  }

  if (paymentRequest?.provider && paymentRequest.provider !== 'stripe') {
    throw createHttpError(400, 'INVALID_PAYMENT_PROVIDER', 'Unsupported online payment provider.');
  }

  const fullName = `${firstName} ${lastName}`.trim();
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return {
    customer,
    email,
    normalizedPhone,
    firstName,
    lastName,
    fullName,
    type,
    payment,
    paymentRequest,
    hasLocalOnlyItems,
    items,
    total
  };
}

function createDemoOrderRecord({ preparedOrder, ipAddress }) {
  const createdAt = new Date().toISOString();
  const orderId = `DEMO-${Date.now().toString().slice(-8)}-${Math.floor(Math.random() * 900 + 100)}`;
  const pickupDeadline = (preparedOrder.type === 'Pickup' || preparedOrder.type === 'Delivery') ? getPickupDeadlineIso(createdAt) : null;
  const usesStripe = requiresStripeCheckout(preparedOrder);

  return {
    backendReady: true,
    demo: true,
    order: {
      id: orderId,
      dbId: null,
      date: createdAt,
      status: 'Demo',
      type: preparedOrder.type,
      payment: preparedOrder.payment,
      paymentProvider: usesStripe ? 'stripe' : 'manual',
      paymentStatus: usesStripe ? 'DEMO_AUTHORIZED' : getManualPaymentStatus(preparedOrder),
      paymentReferenceId: usesStripe ? orderId : null,
      stripePaymentIntentId: null,
      stripePaymentMethodId: null,
      stripeChargeId: null,
      total: preparedOrder.total,
      pickupDeadline,
      missedPickupAt: null,
      demo: true,
      customer: {
        firstName: preparedOrder.firstName,
        lastName: preparedOrder.lastName,
        name: preparedOrder.fullName,
        email: preparedOrder.email,
        phone: preparedOrder.customer.phone.trim(),
        birthDate: preparedOrder.customer.birthDate || null,
        address: (preparedOrder.type === 'Pickup' || preparedOrder.type === 'Delivery') ? 'Local fulfillment arranged in demo mode' : preparedOrder.customer.address.trim(),
        notes: preparedOrder.customer.notes?.trim() || ''
      },
      items: preparedOrder.items
    },
    account: {
      id: `demo-${Date.now()}`,
      firstName: preparedOrder.firstName,
      lastName: preparedOrder.lastName,
      name: preparedOrder.fullName,
      email: preparedOrder.email,
      phone: preparedOrder.customer.phone.trim(),
      normalizedPhone: preparedOrder.normalizedPhone,
      birthDate: preparedOrder.customer.birthDate || null,
      banned: false,
      banReason: null,
      bannedAt: null,
      missedPickups: 0,
      lastIp: ipAddress,
      lastOrderAt: createdAt,
      createdAt,
      updatedAt: createdAt
    }
  };
}

export function getOrderAmountInCents(total) {
  const amount = Math.round(Number(total || 0) * 100);

  if (!Number.isFinite(amount) || amount <= 0) {
    throw createHttpError(400, 'INVALID_TOTAL', 'Order total must be greater than zero.');
  }

  return amount;
}

function buildOrderPayload({
  preparedOrder,
  accountRow,
  orderNumber,
  createdAt,
  ipAddress,
  paymentMetadata
}) {
  const payload = {
    order_number: orderNumber,
    account_id: accountRow.id,
    customer_first_name: preparedOrder.firstName,
    customer_last_name: preparedOrder.lastName,
    customer_name: preparedOrder.fullName,
    customer_email: preparedOrder.email,
    customer_phone: preparedOrder.customer.phone.trim(),
    customer_birth_date: preparedOrder.customer.birthDate || null,
    customer_address: (preparedOrder.type === 'Pickup' || preparedOrder.type === 'Delivery') ? 'Local fulfillment arranged in Bakersfield' : preparedOrder.customer.address.trim(),
    notes: preparedOrder.customer.notes?.trim() || null,
    order_type: preparedOrder.type,
    payment_method: preparedOrder.payment,
    total: preparedOrder.total,
    status: 'Pending',
    pickup_deadline: (preparedOrder.type === 'Pickup' || preparedOrder.type === 'Delivery') ? getPickupDeadlineIso(createdAt) : null,
    submitted_ip: ipAddress,
    items: preparedOrder.items
  };

  if (!paymentMetadata) {
    return payload;
  }

  return {
    ...payload,
    payment_provider: paymentMetadata.provider,
    payment_status: paymentMetadata.status,
    payment_reference_id: paymentMetadata.referenceId || null,
    stripe_payment_intent_id: paymentMetadata.stripePaymentIntentId || null,
    stripe_payment_method_id: paymentMetadata.stripePaymentMethodId || null,
    stripe_charge_id: paymentMetadata.stripeChargeId || null,
    demo_order: Boolean(paymentMetadata.demoOrder)
  };
}

function getStripeObjectId(value) {
  if (!value) {
    return null;
  }

  return typeof value === 'string' ? value : value.id || null;
}

function getAllowedStripeStatuses() {
  return new Set(['succeeded', 'processing', 'requires_capture']);
}

export async function createOrderRecord({ order, ipAddress }) {
  const preparedOrder = prepareOrderInput(order);

  if (isCheckoutDemoMode()) {
    return createDemoOrderRecord({ preparedOrder, ipAddress });
  }

  const client = getClientOrThrow();
  await sweepMissedPickups(client);

  const banStatus = await checkBanStatus({
    email: preparedOrder.email,
    phone: preparedOrder.normalizedPhone,
    ipAddress
  });

  if (banStatus.blocked) {
    throw createHttpError(403, 'ACCOUNT_BANNED', banStatus.banReason || 'This account is blocked from checkout.');
  }

  const createdAt = new Date().toISOString();
  const orderNumber = generateOrderNumber();
  const usesStripe = requiresStripeCheckout(preparedOrder);

  const accountPayload = {
    email: preparedOrder.email,
    phone: preparedOrder.customer.phone.trim(),
    normalized_phone: preparedOrder.normalizedPhone,
    first_name: preparedOrder.firstName,
    last_name: preparedOrder.lastName,
    full_name: preparedOrder.fullName,
    birth_date: preparedOrder.customer.birthDate || null,
    banned: false,
    ban_reason: null,
    last_ip: ipAddress,
    last_order_at: createdAt,
    updated_at: createdAt
  };

  const { data: accountRow, error: accountError } = await client
    .from('customer_accounts')
    .upsert(accountPayload, {
      onConflict: 'email,normalized_phone'
    })
    .select('*')
    .single();

  if (accountError) {
    throw accountError;
  }

  if (usesStripe) {
    if (!isStripeServerConfigured()) {
      throw createHttpError(
        503,
        'STRIPE_NOT_CONFIGURED',
        'Stripe checkout is not configured yet. Add the Stripe publishable key and secret key first.'
      );
    }

    if (preparedOrder.paymentRequest?.provider !== 'stripe' || !preparedOrder.paymentRequest.paymentIntentId) {
      throw createHttpError(400, 'STRIPE_PAYMENT_REQUIRED', 'A confirmed Stripe payment is required before submitting this order.');
    }

    const paymentIntent = await retrieveStripePaymentIntent(preparedOrder.paymentRequest.paymentIntentId);
    const allowedStatuses = getAllowedStripeStatuses();

    if (!paymentIntent || !allowedStatuses.has(paymentIntent.status)) {
      throw createHttpError(502, 'STRIPE_PAYMENT_INCOMPLETE', 'Stripe did not complete the card payment.');
    }

    if (paymentIntent.amount !== getOrderAmountInCents(preparedOrder.total) || paymentIntent.currency !== 'usd') {
      throw createHttpError(400, 'STRIPE_PAYMENT_MISMATCH', 'Stripe payment details do not match the current order total.');
    }

    const paymentIntentId = paymentIntent.id;
    const paymentMethodId = getStripeObjectId(paymentIntent.payment_method) || preparedOrder.paymentRequest.paymentMethodId || null;
    const chargeId = getStripeObjectId(paymentIntent.latest_charge);

    const { data: existingOrderRow, error: existingOrderError } = await client
      .from('store_orders')
      .select('*')
      .eq('stripe_payment_intent_id', paymentIntentId)
      .maybeSingle();

    if (existingOrderError) {
      throw existingOrderError;
    }

    if (existingOrderRow) {
      return {
        backendReady: true,
        order: serializeOrderRow(existingOrderRow),
        account: serializeAccountRow(accountRow)
      };
    }

    const stripeOrderPayload = buildOrderPayload({
      preparedOrder,
      accountRow,
      orderNumber,
      createdAt,
      ipAddress,
      paymentMetadata: {
        provider: 'stripe',
        status: paymentIntent.status,
        referenceId: paymentIntentId,
        stripePaymentIntentId: paymentIntentId,
        stripePaymentMethodId: paymentMethodId,
        stripeChargeId: chargeId
      }
    });

    const { data: orderRow, error: orderError } = await client
      .from('store_orders')
      .insert(stripeOrderPayload)
      .select('*')
      .single();

    if (orderError) {
      throw orderError;
    }

    return {
      backendReady: true,
      order: serializeOrderRow(orderRow),
      account: serializeAccountRow(accountRow)
    };
  }

  const orderPayload = buildOrderPayload({
    preparedOrder,
    accountRow,
    orderNumber,
    createdAt,
    ipAddress
  });

  const { data: orderRow, error: orderError } = await client
    .from('store_orders')
    .insert(orderPayload)
    .select('*')
    .single();

  if (orderError) {
    throw orderError;
  }

  return {
    backendReady: true,
    order: serializeOrderRow(orderRow),
    account: serializeAccountRow(accountRow)
  };
}

export async function getDashboardSnapshot() {
  if (!isSupabaseConfigured()) {
    return {
      backendReady: false,
      orders: [],
      accounts: [],
      stats: {
        totalOrders: 0,
        pendingOrders: 0,
        todayOrders: 0,
        revenueToday: 0,
        totalRevenue: 0,
        averageOrderValue: 0,
        stripeRevenue: 0,
        venmoRevenue: 0,
        bannedAccounts: 0,
        bannedIps: 0
      }
    };
  }

  const client = getClientOrThrow();
  await sweepMissedPickups(client);

  const [ordersResult, accountsResult, bannedIpsResult] = await Promise.all([
    client.from('store_orders').select('*').order('created_at', { ascending: false }).limit(200),
    client.from('customer_accounts').select('*').order('updated_at', { ascending: false }).limit(200),
    client.from('banned_ips').select('id', { count: 'exact', head: true }).eq('active', true)
  ]);

  if (ordersResult.error) {
    throw ordersResult.error;
  }

  if (accountsResult.error) {
    throw accountsResult.error;
  }

  if (bannedIpsResult.error) {
    throw bannedIpsResult.error;
  }

  const orders = (ordersResult.data || []).map(serializeOrderRow);
  const accounts = (accountsResult.data || []).map(serializeAccountRow);
  const today = new Date().toISOString().slice(0, 10);
  const saleOrders = orders.filter(
    (order) => !order.demo && !['Cancelled', 'Missed Pickup', 'No Show'].includes(order.status)
  );
  const todayOrders = saleOrders.filter((order) => order.date?.startsWith(today));
  const totalRevenue = saleOrders.reduce((sum, order) => sum + Number(order.total || 0), 0);
  const stripeRevenue = saleOrders
    .filter((order) => order.paymentProvider === 'stripe')
    .reduce((sum, order) => sum + Number(order.total || 0), 0);
  const venmoRevenue = saleOrders
    .filter((order) => order.payment === 'Venmo')
    .reduce((sum, order) => sum + Number(order.total || 0), 0);

  return {
    backendReady: true,
    orders,
    accounts,
    stats: {
      totalOrders: orders.length,
      pendingOrders: orders.filter((order) => order.status === 'Pending').length,
      todayOrders: todayOrders.length,
      revenueToday: todayOrders.reduce((sum, order) => sum + Number(order.total || 0), 0),
      totalRevenue,
      averageOrderValue: saleOrders.length ? totalRevenue / saleOrders.length : 0,
      stripeRevenue,
      venmoRevenue,
      bannedAccounts: accounts.filter((account) => account.banned).length,
      bannedIps: bannedIpsResult.count || 0
    }
  };
}

export async function updateOrderStatusRecord(orderNumber, status) {
  const client = getClientOrThrow();
  await sweepMissedPickups(client);

  if (!VALID_ORDER_STATUSES.has(status)) {
    throw createHttpError(400, 'INVALID_ORDER_STATUS', 'Choose a valid order status.');
  }

  const { data, error } = await client
    .from('store_orders')
    .update({
      status,
      updated_at: new Date().toISOString()
    })
    .eq('order_number', orderNumber)
    .select('*')
    .single();

  if (error) {
    throw error;
  }

  return serializeOrderRow(data);
}

export async function setAccountBanState(accountId, { banned, reason }) {
  const client = getClientOrThrow();
  const timestamp = new Date().toISOString();

  const { data: account, error: fetchError } = await client
    .from('customer_accounts')
    .select('*')
    .eq('id', accountId)
    .single();

  if (fetchError) {
    throw fetchError;
  }

  const payload = banned
    ? {
        banned: true,
        ban_reason: reason || 'Blocked by admin.',
        banned_at: timestamp,
        updated_at: timestamp
      }
    : {
        banned: false,
        ban_reason: null,
        banned_at: null,
        updated_at: timestamp
      };

  const { data: updatedAccount, error: updateError } = await client
    .from('customer_accounts')
    .update(payload)
    .eq('id', accountId)
    .select('*')
    .single();

  if (updateError) {
    throw updateError;
  }

  if (banned) {
    const reasonText = payload.ban_reason;

    const { error: banEventError } = await client.from('ban_events').insert({
      account_id: accountId,
      ip_address: updatedAccount.last_ip,
      reason: reasonText,
      source: 'admin'
    });

    if (banEventError) {
      throw banEventError;
    }

    await upsertIpBan(client, {
      accountId,
      ipAddress: updatedAccount.last_ip,
      reason: reasonText
    });
  } else if (updatedAccount.last_ip) {
    const { error: unbanIpError } = await client
      .from('banned_ips')
      .update({
        active: false,
        updated_at: timestamp
      })
      .eq('account_id', accountId)
      .eq('ip_address', updatedAccount.last_ip);

    if (unbanIpError) {
      throw unbanIpError;
    }
  }

  return serializeAccountRow(updatedAccount);
}
