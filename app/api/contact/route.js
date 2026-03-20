import { sendMail } from '@/lib/server-mail';

export async function POST(req) {
  try {
    const { name, email, message, intent, category } = await req.json();

    const subject = `New Lead: ${name}`;
    const text = [
      `Intent: ${intent || 'Not specified'}`,
      `Category: ${category || 'Not specified'}`,
      `Name: ${name}`,
      `Email: ${email}`,
      '',
      message
    ].join('\n');

    const html = `
      <div style="font-family: sans-serif; padding: 20px; background: #0a0e05; color: #fff;">
        <h2 style="color: #478527;">NEW CONTACT LEAD</h2>
        <p><strong>Intent:</strong> ${intent || 'Not specified'}</p>
        <p><strong>Category:</strong> ${category || 'Not specified'}</p>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong></p>
        <div style="background: rgba(255,255,255,0.05); padding: 15px; border-radius: 8px;">
          ${message}
        </div>
      </div>
    `;

    const data = await sendMail({
      subject,
      text,
      html,
      replyTo: email
    });

    return new Response(JSON.stringify({ success: true, data }), { status: 200 });
  } catch (error) {
    console.error('Error sending contact email:', error);
    return new Response(JSON.stringify({ success: false, error: error.message }), { status: 500 });
  }
}
