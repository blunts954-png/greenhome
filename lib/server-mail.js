import 'server-only';

import nodemailer from 'nodemailer';
import { Resend } from 'resend';

const DEFAULT_TO_EMAIL = 'moneygrowontrees80@gmail.com';

function getDefaultTo() {
  return process.env.MAIL_TO || process.env.CONTACT_TO_EMAIL || process.env.ORDER_ALERT_TO_EMAIL || DEFAULT_TO_EMAIL;
}

function getDefaultFrom() {
  return (
    process.env.MAIL_FROM ||
    process.env.SMTP_FROM ||
    process.env.GMAIL_USER ||
    process.env.SMTP_USER ||
    `Home Grown Money <${getDefaultTo()}>`
  );
}

function createGmailTransport() {
  if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
    return null;
  }

  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD
    }
  });
}

function createSmtpTransport() {
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
    return null;
  }

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });
}

async function sendWithTransport(transporter, payload) {
  const info = await transporter.sendMail({
    from: getDefaultFrom(),
    to: payload.to,
    replyTo: payload.replyTo,
    subject: payload.subject,
    text: payload.text,
    html: payload.html
  });

  return {
    provider: 'smtp',
    messageId: info.messageId
  };
}

async function sendWithResend(payload) {
  if (!process.env.RESEND_API_KEY) {
    return null;
  }

  const resend = new Resend(process.env.RESEND_API_KEY);

  const response = await resend.emails.send({
    from: process.env.RESEND_FROM || 'Home Grown Money <onboarding@resend.dev>',
    to: payload.to.split(',').map((entry) => entry.trim()),
    subject: payload.subject,
    text: payload.text,
    html: payload.html
  });

  return {
    provider: 'resend',
    response
  };
}

export async function sendMail({
  to,
  replyTo,
  subject,
  text,
  html
}) {
  const finalTo = Array.isArray(to)
    ? to.filter(Boolean).join(', ')
    : (to || getDefaultTo());

  const payload = {
    to: finalTo,
    replyTo,
    subject,
    text,
    html
  };

  const gmailTransport = createGmailTransport();
  if (gmailTransport) {
    return sendWithTransport(gmailTransport, payload);
  }

  const smtpTransport = createSmtpTransport();
  if (smtpTransport) {
    return sendWithTransport(smtpTransport, payload);
  }

  const resendResult = await sendWithResend(payload);
  if (resendResult) {
    return resendResult;
  }

  throw new Error('No email provider configured.');
}
