import { Twilio } from 'twilio';
import { Resend } from 'resend';

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

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
    const { intent, category, name, email, message } = await req.json();

    // 1. Send SMS via Twilio (if configured)
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const fromNumber = process.env.TWILIO_PHONE_NUMBER;

    if (accountSid && authToken && fromNumber && recipients.length > 0) {
      const client = new Twilio(accountSid, authToken);
      const smsBody = `📬 HGM NEW CONTACT: ${intent} | ${category} | ${name} | ${email}`;
      
      try {
        await Promise.all(recipients.map(num => 
          client.messages.create({ body: smsBody, from: fromNumber, to: num })
        ));
      } catch (smsErr) {
        console.error('Twilio Contact SMS error:', smsErr);
      }
    }

    // 2. Send Email via Resend
    if (resend) {
      await resend.emails.send({
        from: 'Home Grown Money <onboarding@resend.dev>',
        to: ['chaoticallyorganizedai@gmail.com'],
        subject: `📬 New Contact Inquiry: ${intent} - ${category}`,
        html: `
          <div style="font-family: sans-serif; padding: 20px; background: #0a0e05; color: #fff; border: 1px solid #478527;">
            <h2 style="color: #478527; margin-bottom: 20px;">NEW INQUIRY RECEIVED</h2>
            <div style="margin-bottom: 20px;">
              <p><strong>Intent:</strong> ${intent}</p>
              <p><strong>Category:</strong> ${category}</p>
              <p><strong>Name:</strong> ${name}</p>
              <p><strong>Email:</strong> ${email}</p>
            </div>
            <div style="padding: 15px; background: #1a1a1a; border-radius: 4px;">
              <h3 style="margin-top: 0; font-size: 14px; text-transform: uppercase; color: #888;">Message:</h3>
              <p style="white-space: pre-line;">${message}</p>
            </div>
            <footer style="margin-top: 20px; font-size: 12px; color: #555;">
              HGM Growth Protocol • Bakersfield, CA
            </footer>
          </div>
        `
      });
    }

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    console.error('Contact api error:', error);
    return new Response(JSON.stringify({ success: false, error: error.message }), { status: 500 });
  }
}
