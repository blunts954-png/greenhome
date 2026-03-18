import { Twilio } from 'twilio';

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
    const { orderId, customerName, total, type } = await req.json();

    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const fromNumber = process.env.TWILIO_PHONE_NUMBER;

    if (!accountSid || !authToken || !fromNumber) {
      console.warn('Twilio credentials missing. Skipping SMS alert.');
      return new Response(JSON.stringify({ success: true, message: 'Twilio not configured, but order processed.' }), { status: 200 });
    }

    const client = new Twilio(accountSid, authToken);
    const body = `🚨 HGM NEW ORDER: ${orderId} | ${customerName} | $${total} | ${type.toUpperCase()}`;

    await Promise.all(recipients.map(num => 
      client.messages.create({ body, from: fromNumber, to: num })
    ));

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    console.error('Error sending SMS alert:', error);
    return new Response(JSON.stringify({ success: false, error: error.message }), { status: 500 });
  }
}
