import { Twilio } from 'twilio';

import { getOrderAlertInbox, isMailConfigured, sendEmail } from '@/lib/server-mail';

const recipients = [
  process.env.ALERT_PHONE_1,
  process.env.ALERT_PHONE_2,
  process.env.ALERT_PHONE_3,
  process.env.ALERT_PHONE_4,
  process.env.ALERT_PHONE_5,
  process.env.ALERT_PHONE_6,
].filter(Boolean);

function escapeHtml(value = '') {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

export async function POST(req) {
  try {
    const {
      orderId,
      customerName,
      customerEmail,
      customerPhone,
      customerAddress,
      total,
      type,
      payment,
      items
    } = await req.json();
    const safeItems = Array.isArray(items) ? items : [];
    const orderAlertInbox = getOrderAlertInbox();
    const mailConfigured = isMailConfigured();
    const shouldSendCustomerOrderEmail = process.env.ENABLE_CUSTOMER_ORDER_EMAIL !== 'false';
    let adminEmailDelivered = false;
    let customerEmailDelivered = false;
    let adminSmsDelivered = false;
    let customerSmsDelivered = false;

    // 1. Send SMS via Twilio (Only for local Pickup/Delivery)
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const fromNumber = process.env.TWILIO_PHONE_NUMBER;

    if (accountSid && authToken && fromNumber && (type === 'Pickup' || type === 'Delivery')) {
      const client = new Twilio(accountSid, authToken);
      
      // ADMIN ALERTS (Targeting 5 key numbers)
      if (recipients.length > 0) {
        const smsBody = `HGM ORDER: ${orderId} | ${customerName} | $${total} | ${String(type || '').toUpperCase()}`;
        try {
          await Promise.all(recipients.map(num => 
            client.messages.create({ body: smsBody, from: fromNumber, to: num })
          ));
          adminSmsDelivered = true;
        } catch (smsErr) {
          console.error('Twilio Admin SMS error:', smsErr);
        }
      }

      // CUSTOMER CONFIRMATION (Optional)
      if (customerPhone && process.env.ENABLE_CUSTOMER_SMS === 'true') {
        const customerBody = `HGM: Order ${orderId} confirmed! Thanks for the support, ${customerName.split(' ')[0]}. We'll reach out shortly for ${type.toLowerCase()} details.`;
        try {
          await client.messages.create({ body: customerBody, from: fromNumber, to: customerPhone });
          customerSmsDelivered = true;
        } catch (custSmsErr) {
          console.error('Twilio Customer SMS error:', custSmsErr);
        }
      }
    }

    const itemsHtml = safeItems
      .map((item) => `<li>${escapeHtml(item.name)} (${escapeHtml(String(item.quantity))})</li>`)
      .join('');

    // 2. Send admin email alert
    if (mailConfigured && orderAlertInbox) {
      try {
        await sendEmail({
          to: orderAlertInbox,
          replyTo: customerEmail,
          subject: `New ${type} Order: ${orderId}`,
          html: `
            <div style="font-family: Arial, sans-serif; padding: 24px; background: #0a0e05; color: #ffffff;">
              <h2 style="color: #478527; margin: 0 0 18px;">New ${escapeHtml(String(type || 'Order')).toUpperCase()} Order</h2>
              <p><strong>Order ID:</strong> ${escapeHtml(orderId)}</p>
              <p><strong>Customer:</strong> ${escapeHtml(customerName)}</p>
              <p><strong>Email:</strong> ${escapeHtml(customerEmail || 'N/A')}</p>
              <p><strong>Phone:</strong> ${escapeHtml(customerPhone || 'N/A')}</p>
              <p><strong>Address:</strong> ${escapeHtml(customerAddress || 'Local fulfillment')}</p>
              <p><strong>Payment:</strong> ${escapeHtml(payment || 'N/A')}</p>
              <p><strong>Total:</strong> $${escapeHtml(String(total))}</p>
              <h3 style="color: #9de27b; margin-top: 18px;">Items</h3>
              <ul>${itemsHtml}</ul>
            </div>
          `
        });
        adminEmailDelivered = true;
      } catch (mailErr) {
        console.error('Order alert email error:', mailErr);
      }
    }

    // 3. Send customer confirmation email when mail is configured
    if (mailConfigured && shouldSendCustomerOrderEmail && customerEmail) {
      try {
        await sendEmail({
          to: customerEmail,
          subject: `Your Home Grown Money Order ${orderId}`,
          html: `
            <div style="font-family: Arial, sans-serif; padding: 24px; background: #0a0e05; color: #ffffff;">
              <h2 style="color: #478527; margin: 0 0 18px;">Order Received</h2>
              <p>Thanks for shopping with Home Grown Money.</p>
              <p><strong>Order ID:</strong> ${escapeHtml(orderId)}</p>
              <p><strong>Fulfillment:</strong> ${escapeHtml(type || 'N/A')}</p>
              <p><strong>Payment:</strong> ${escapeHtml(payment || 'N/A')}</p>
              <p><strong>Total:</strong> $${escapeHtml(String(total))}</p>
              <div style="margin-top: 18px; padding: 18px; background: #141414; border-radius: 8px;">
                <h3 style="margin: 0 0 10px; color: #9de27b;">Items</h3>
                <ul>${itemsHtml}</ul>
              </div>
              <p style="margin-top: 18px;">We will follow up using the contact information provided if any pickup, delivery, or shipping coordination is needed.</p>
            </div>
          `
        });
        customerEmailDelivered = true;
      } catch (resendErr) {
        console.error('Customer order email error:', resendErr);
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        adminSmsDelivered,
        customerSmsDelivered,
        adminEmailDelivered,
        customerEmailDelivered
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error('Order alert error:', error);
    return new Response(JSON.stringify({ success: false, error: error.message }), { status: 500 });
  }
}
