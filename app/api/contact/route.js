import { NextResponse } from 'next/server';
import twilio from 'twilio';

import { getContactInbox, isMailConfigured, sendEmail } from '@/lib/server-mail';
import { checkRateLimit, getRateLimitKey } from '@/lib/rate-limit';

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
  // Rate Limit: 3 contact requests per minute
  const limit = checkRateLimit(getRateLimitKey(req, 'contact'), { maxRequests: 3 });
  if (limit.limited) {
    return NextResponse.json(
      { success: false, error: 'Too many requests. Please try again later.' },
      { status: 429, headers: { 'Retry-After': String(Math.ceil(limit.retryAfterMs / 1000)) } }
    );
  }

  try {
    const { intent, category, name, email, message } = await req.json();
    const cleanIntent = String(intent || '').trim();
    const cleanCategory = String(category || '').trim();
    const cleanName = String(name || '').trim();
    const cleanEmail = String(email || '').trim();
    const cleanMessage = String(message || '').trim();

    if (!cleanIntent || !cleanCategory || !cleanName || !cleanEmail || !cleanMessage) {
      return NextResponse.json(
        {
          success: false,
          error: 'Intent, category, name, email, and message are required.'
        },
        { status: 400 }
      );
    }

    let smsDelivered = false;
    let emailDelivered = false;

    // 1. Send SMS via Twilio (if configured)
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const fromNumber = process.env.TWILIO_PHONE_NUMBER;

    if (accountSid && authToken && fromNumber && recipients.length > 0) {
      const client = twilio(accountSid, authToken);
      const smsBody = `HGM CONTACT: ${cleanIntent} | ${cleanCategory} | ${cleanName} | ${cleanEmail}`;
      
      try {
        await Promise.all(recipients.map(num => 
          client.messages.create({ body: smsBody, from: fromNumber, to: num })
        ));
        smsDelivered = true;
      } catch (smsErr) {
        console.error('Twilio Contact SMS error:', smsErr);
      }
    }

    // 2. Send Email via configured mail provider
    const contactInbox = getContactInbox();
    if (contactInbox && isMailConfigured()) {
      await sendEmail({
        to: contactInbox,
        replyTo: cleanEmail,
        subject: `New Contact Inquiry: ${cleanIntent} - ${cleanCategory}`,
        html: `
          <div style="font-family: Arial, sans-serif; padding: 24px; background: #0a0e05; color: #ffffff;">
            <h2 style="color: #478527; margin: 0 0 18px;">New Contact Inquiry</h2>
            <p><strong>Intent:</strong> ${escapeHtml(cleanIntent)}</p>
            <p><strong>Category:</strong> ${escapeHtml(cleanCategory)}</p>
            <p><strong>Name:</strong> ${escapeHtml(cleanName)}</p>
            <p><strong>Email:</strong> ${escapeHtml(cleanEmail)}</p>
            <div style="margin-top: 22px; padding: 18px; background: #141414; border-radius: 8px;">
              <h3 style="margin: 0 0 10px; font-size: 14px; color: #9de27b; text-transform: uppercase;">Message</h3>
              <p style="margin: 0; white-space: pre-line; line-height: 1.7;">${escapeHtml(cleanMessage)}</p>
            </div>
          </div>
        `
      });
      emailDelivered = true;
    }

    if (!smsDelivered && !emailDelivered) {
      return NextResponse.json(
        {
          success: false,
          error: 'Contact delivery is not configured yet. Add contact email credentials or Twilio alert settings first.'
        },
        { status: 503 }
      );
    }

    return NextResponse.json({
      success: true,
      smsDelivered,
      emailDelivered
    });
  } catch (error) {
    console.error('Contact api error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Unable to send the contact request.'
      },
      { status: 500 }
    );
  }
}
