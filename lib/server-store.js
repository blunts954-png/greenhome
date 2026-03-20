import 'server-only';

import { PRODUCTS, getProductBySlug } from '@/lib/products';
import { getSupabaseAdmin, isSupabaseConfigured } from '@/lib/supabase/server';

const MISSED_PICKUP_REASON = 'Missed pickup after the 9:30 PM deadline.';
const VALID_ORDER_TYPES = new Set(['Shipping', 'Pickup', 'Local Delivery']);
const VALID_ORDER_STATUSES = new Set(['Pending', 'Completed', 'Cancelled', 'Missed Pickup']);
const VALID_PAYMENT_METHODS = {
  Shipping: new Set(['Card', 'Venmo']),
  Pickup: new Set(['Card', 'Cash', 'Venmo']),
  'Local Delivery': new Set(['Card', 'Cash', 'Venmo'])
};

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
    total: Number(row.total),
    pickupDeadline: row.pickup_deadline,
    missedPickupAt: row.missed_pickup_at,
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
    .select('id, account_id, submitted_ip')
    .eq('order_type', 'Pickup')
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
    const { error: orderError } = await client
      .from('store_orders')
      .update({
        status: 'Missed Pickup',
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
        ban_reason: MISSED_PICKUP_REASON,
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
      reason: MISSED_PICKUP_REASON,
      source: 'missed-pickup'
    });

    if (banEventError) {
      throw banEventError;
    }

    await upsertIpBan(client, {
      accountId: order.account_id,
      ipAddress,
      reason: MISSED_PICKUP_REASON
    });
  }

  return {
    backendReady: true,
    processed: expiredOrders.length
  };
}

export async function checkBanStatus({ email, phone, ipAddress }) {
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

export async function createOrderRecord({ order, ipAddress }) {
  const client = getClientOrThrow();
  await sweepMissedPickups(client);

  const customer = order?.customer || {};
  const email = normalizeEmail(customer.email);
  const normalizedPhone = normalizePhone(customer.phone);
  const firstName = customer.firstName?.trim() || '';
  const lastName = customer.lastName?.trim() || '';

  if (!firstName || !lastName || !email || !normalizedPhone) {
    throw createHttpError(400, 'MISSING_CUSTOMER_FIELDS', 'First name, last name, email, and phone are required.');
  }

  const type = order?.type || '';
  const payment = order?.payment || '';

  if (!VALID_ORDER_TYPES.has(type)) {
    throw createHttpError(400, 'INVALID_ORDER_TYPE', 'Choose a valid fulfillment option.');
  }

  if (!VALID_PAYMENT_METHODS[type]?.has(payment)) {
    throw createHttpError(400, 'INVALID_PAYMENT_METHOD', 'Choose a valid payment method for this fulfillment option.');
  }

  const items = sanitizeItems(order?.items);
  const hasLocalOnlyItems = items.some((item) => item.pickupOnly);

  if (hasLocalOnlyItems && type === 'Shipping') {
    throw createHttpError(400, 'LOCAL_ONLY_ITEMS', 'Local-only items cannot be shipped.');
  }

  if (hasLocalOnlyItems) {
    if (!customer.birthDate) {
      throw createHttpError(400, 'AGE_REQUIRED', 'Date of birth is required for local-only items.');
    }

    if (getAgeInYears(customer.birthDate) < 21) {
      throw createHttpError(403, 'UNDERAGE', 'You must be 21 or older to reserve local-only items.');
    }
  }

  if (type !== 'Pickup' && !customer.address?.trim()) {
    throw createHttpError(400, 'ADDRESS_REQUIRED', 'A delivery or shipping address is required.');
  }

  const banStatus = await checkBanStatus({
    email,
    phone: normalizedPhone,
    ipAddress
  });

  if (banStatus.blocked) {
    throw createHttpError(403, 'ACCOUNT_BANNED', banStatus.banReason || 'This account is blocked from checkout.');
  }

  const createdAt = new Date().toISOString();
  const fullName = `${firstName} ${lastName}`.trim();

  const accountPayload = {
    email,
    phone: customer.phone.trim(),
    normalized_phone: normalizedPhone,
    first_name: firstName,
    last_name: lastName,
    full_name: fullName,
    birth_date: customer.birthDate || null,
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

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const orderPayload = {
    order_number: generateOrderNumber(),
    account_id: accountRow.id,
    customer_first_name: firstName,
    customer_last_name: lastName,
    customer_name: fullName,
    customer_email: email,
    customer_phone: customer.phone.trim(),
    customer_birth_date: customer.birthDate || null,
    customer_address: type === 'Pickup' ? 'Pickup arranged in Bakersfield' : customer.address.trim(),
    notes: customer.notes?.trim() || null,
    order_type: type,
    payment_method: payment,
    total,
    status: 'Pending',
    pickup_deadline: type === 'Pickup' ? getPickupDeadlineIso(createdAt) : null,
    submitted_ip: ipAddress,
    items
  };

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
  const todayOrders = orders.filter((order) => order.date?.startsWith(today));

  return {
    backendReady: true,
    orders,
    accounts,
    stats: {
      totalOrders: orders.length,
      pendingOrders: orders.filter((order) => order.status === 'Pending').length,
      todayOrders: todayOrders.length,
      revenueToday: todayOrders.reduce((sum, order) => sum + Number(order.total || 0), 0),
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
