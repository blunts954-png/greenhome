import { Twilio } from 'twilio';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

const recipients = [
  process.env.ALERT_PHONE_1,
  process.env.ALERT_PHONE_2,
  process.env.ALERT_PHONE_3,
  process.env.ALERT_PHONE_4,
  process.env.ALERT_PHONE_5,
  process.env.ALERT_PHONE_6,
].filter(Boolean);

export async function POST(req) {
  try {
    const { orderId, customerName, customerEmail, total, type, items } = await req.json();

    // 1. Send SMS via Twilio
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const fromNumber = process.env.TWILIO_PHONE_NUMBER;

    if (accountSid && authToken && fromNumber) {
      const client = new Twilio(accountSid, authToken);
      const smsBody = `🚨 HGM NEW ORDER: ${orderId} | ${customerName} | $${total} | ${type.toUpperCase()}`;
      
      try {
        await Promise.all(recipients.map(num => 
          client.messages.create({ body: smsBody, from: fromNumber, to: num })
        ));
      } catch (smsErr) {
        console.error('Twilio SMS error:', smsErr);
      }
    }

    // 2. Send EMail via Resend
    if (process.env.RESEND_API_KEY) {
      await resend.emails.send({
        from: 'Home Grown Money <onboarding@resend.dev>',
        to: ['chaoticallyorganizedai@gmail.com'],
        subject: `🚨 New Order: ${orderId}`,
        html: `
          <div style="font-family: sans-serif; padding: 20px; background: #0a0e05; color: #fff;">
            <h2 style="color: #478527;">NEW ORDER RECEIVED: ${orderId}</h2>
            <p><strong>Customer:</strong> ${customerName}</p>
            <p><strong>Total:</strong> $${total}</p>
            <p><strong>Type:</strong> ${type}</p>
            <h3>Items:</h3>
            <ul>
              ${items.map(item => `<li>${item.name} (${item.quantity}) - $${item.price}</li>`).join('')}
            </ul>
          </div>
        `
      });
    }

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    console.error('Order alert error:', error);
    return new Response(JSON.stringify({ success: false, error: error.message }), { status: 500 });
  }
}
