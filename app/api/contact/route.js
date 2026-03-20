import { Resend } from 'resend';

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

export async function POST(req) {
  try {
    if (!resend) {
      return new Response(
        JSON.stringify({ success: false, error: 'Contact email is not configured.' }),
        { status: 503 }
      );
    }

    const { name, email, message } = await req.json();

    const data = await resend.emails.send({
      from: 'Home Grown Money <onboarding@resend.dev>',
      to: ['chaoticallyorganizedai@gmail.com'],
      subject: `New Lead: ${name}`,
      text: `New contact form submission from ${name} (${email}):\n\n${message}`,
      html: `
        <div style="font-family: sans-serif; padding: 20px; background: #0a0e05; color: #fff;">
          <h2 style="color: #478527;">🚨 NEW CONTACT LEAD</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Message:</strong></p>
          <div style="background: rgba(255,255,255,0.05); padding: 15px; border-radius: 8px;">
            ${message}
          </div>
          <hr style="border-color: #222; margin-top: 20px;">
          <p style="font-size: 12px; color: #666;">This lead was captured via your Home Grown Money website.</p>
        </div>
      `
    });

    return new Response(JSON.stringify({ success: true, data }), { status: 200 });
  } catch (error) {
    console.error('Error sending contact email:', error);
    return new Response(JSON.stringify({ success: false, error: error.message }), { status: 500 });
  }
}
