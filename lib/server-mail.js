import 'server-only';

import nodemailer from 'nodemailer';
import { Resend } from 'resend';

let cachedTransporter = null;
let cachedResend = null;

function clean(value) {
  return typeof value === 'string' ? value.trim() : '';
}

function getGmailConfig() {
  const user = clean(process.env.GMAIL_USER);
  const pass = clean(process.env.GMAIL_APP_PASSWORD);

  if (!user || !pass) {
    return null;
  }

  return {
    type: 'gmail',
    user,
    pass,
    from: clean(process.env.SMTP_FROM) || `Home Grown Money <${user}>`
  };
}

function getSmtpConfig() {
  const host = clean(process.env.SMTP_HOST);
  const port = Number(process.env.SMTP_PORT || 587);
  const secure = String(process.env.SMTP_SECURE || 'false').toLowerCase() === 'true';
  const user = clean(process.env.SMTP_USER);
  const pass = clean(process.env.SMTP_PASS);

  if (!host || !user || !pass) {
    return null;
  }

  return {
    type: 'smtp',
    host,
    port,
    secure,
    user,
    pass,
    from: clean(process.env.SMTP_FROM) || `Home Grown Money <${user}>`
  };
}

function getResendConfig() {
  const apiKey = clean(process.env.RESEND_API_KEY);

  if (!apiKey) {
    return null;
  }

  return {
    type: 'resend',
    apiKey,
    from: clean(process.env.RESEND_FROM) || 'Home Grown Money <onboarding@resend.dev>'
  };
}

function getMailerConfig() {
  return getGmailConfig() || getSmtpConfig() || getResendConfig();
}

function getTransporter(config) {
  if (!config || config.type === 'resend') {
    return null;
  }

  if (cachedTransporter) {
    return cachedTransporter;
  }

  cachedTransporter =
    config.type === 'gmail'
      ? nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: config.user,
            pass: config.pass
          }
        })
      : nodemailer.createTransport({
          host: config.host,
          port: config.port,
          secure: config.secure,
          auth: {
            user: config.user,
            pass: config.pass
          }
        });

  return cachedTransporter;
}

function getResendClient(config) {
  if (!config || config.type !== 'resend') {
    return null;
  }

  if (!cachedResend) {
    cachedResend = new Resend(config.apiKey);
  }

  return cachedResend;
}

function normalizeRecipients(to) {
  if (Array.isArray(to)) {
    return to.map(clean).filter(Boolean);
  }

  const single = clean(to);
  return single ? [single] : [];
}

export function isMailConfigured() {
  return Boolean(getMailerConfig());
}

export function getContactInbox() {
  return clean(process.env.CONTACT_TO_EMAIL) || clean(process.env.MAIL_TO) || '';
}

export function getOrderAlertInbox() {
  return clean(process.env.ORDER_ALERT_TO_EMAIL) || clean(process.env.MAIL_TO) || '';
}

export async function sendEmail({ to, subject, html, replyTo }) {
  const config = getMailerConfig();

  if (!config) {
    throw new Error('Mail delivery is not configured.');
  }

  const recipients = normalizeRecipients(to);

  if (recipients.length === 0) {
    throw new Error('No email recipient is configured.');
  }

  if (config.type === 'resend') {
    const resend = getResendClient(config);

    await resend.emails.send({
      from: config.from,
      to: recipients,
      subject,
      html,
      replyTo: clean(replyTo) || undefined
    });

    return {
      provider: 'resend',
      recipients
    };
  }

  const transporter = getTransporter(config);

  await transporter.sendMail({
    from: config.from,
    to: recipients.join(', '),
    subject,
    html,
    replyTo: clean(replyTo) || undefined
  });

  return {
    provider: config.type,
    recipients
  };
}
