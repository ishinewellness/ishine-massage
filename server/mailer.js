// Booking email notifications via SMTP (configured through environment variables).
// Secrets are NEVER hardcoded — they come from Vercel env vars (or a local .env).
const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, 'data');

function loadJson(name) {
  try {
    return JSON.parse(fs.readFileSync(path.join(DATA_DIR, name), 'utf-8'));
  } catch {
    return null;
  }
}

function resolveNames(order) {
  const servicesData = loadJson('services.json');
  const services = Array.isArray(servicesData) ? servicesData : servicesData && servicesData.services;
  const stores = loadJson('stores.json') || [];
  const therapists = loadJson('therapists.json') || [];

  const svc = (services || []).find((s) => s.id === order.serviceId);
  const store = stores.find((s) => s.id === order.storeId);
  const th = therapists.find((t) => t.id === order.therapistId);

  return {
    service: svc
      ? `${svc.name || ''}${svc.nameZh ? '（' + svc.nameZh + '）' : ''} · ${svc.duration || ''} · $${svc.price || ''}`
      : order.serviceId,
    store: store ? store.name || store.nameFr : order.storeId,
    storeEmail: store && store.email ? store.email : null,
    therapist: th ? th.name : order.therapistId || '—'
  };
}

function esc(s) {
  return String(s == null ? '' : s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function buildHtml(order, names) {
  const rows = [
    ['预约号 / Order ID', order.id],
    ['服务 / Service', names.service],
    ['方式 / Mode', order.mode === 'home' ? '上门 Home visit' : '到店 In-store'],
    ['门店 / Store', names.store],
    ['治疗师 / Therapist', names.therapist],
    ['客户 / Customer', order.customerName],
    ['电话 / Phone', order.phone],
    ['地址 / Address', order.address || '—'],
    ['日期 / Date', order.date],
    ['时间 / Time', order.time],
    ['备注 / Note', order.note || '—'],
    ['提交时间 / Submitted', order.createdAt]
  ];
  const trs = rows
    .map(
      ([k, v]) =>
        `<tr><td style="padding:6px 10px;color:#666;border-bottom:1px solid #eee;">${esc(k)}</td>` +
        `<td style="padding:6px 10px;font-weight:600;border-bottom:1px solid #eee;">${esc(v)}</td></tr>`
    )
    .join('');
  return `
  <div style="font-family:Arial,Helvetica,sans-serif;max-width:520px;margin:0 auto;">
    <h2 style="color:#b8860b;">💆 新预约 New Booking</h2>
    <table style="width:100%;border-collapse:collapse;font-size:14px;">${trs}</table>
    <p style="color:#999;font-size:12px;margin-top:16px;">iShine Wellness · 自动通知</p>
  </div>`;
}

function buildText(order, names) {
  return [
    '新预约 New Booking',
    '预约号: ' + order.id,
    '服务: ' + names.service,
    '方式: ' + (order.mode === 'home' ? '上门 Home visit' : '到店 In-store'),
    '门店: ' + names.store,
    '治疗师: ' + names.therapist,
    '客户: ' + order.customerName,
    '电话: ' + order.phone,
    '地址: ' + (order.address || '—'),
    '日期: ' + order.date,
    '时间: ' + order.time,
    '备注: ' + (order.note || '—'),
    '提交时间: ' + order.createdAt
  ].join('\n');
}

let _transporter = null;
function getTransporter() {
  if (_transporter) return _transporter;
  _transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: process.env.SMTP_SECURE === 'true' || Number(process.env.SMTP_PORT) === 465,
    auth:
      process.env.SMTP_USER && process.env.SMTP_PASS
        ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
        : undefined
  });
  return _transporter;
}

// Returns true if an email was attempted & accepted, false if skipped/failed.
async function sendBookingNotification(order) {
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.warn('[mailer] SMTP not configured; skipping email notification');
    return false;
  }
  const names = resolveNames(order);
  const to = process.env.NOTIFY_EMAIL || names.storeEmail;
  if (!to) {
    console.warn('[mailer] no recipient email (set NOTIFY_EMAIL or store.email); skipping');
    return false;
  }
  const fromAddr = process.env.SMTP_FROM || process.env.SMTP_USER;
  const from = process.env.FROM_NAME ? `${process.env.FROM_NAME} <${fromAddr}>` : fromAddr;

  try {
    await getTransporter().sendMail({
      from,
      to,
      subject: `【新预约】${order.customerName} · ${order.date} ${order.time}`,
      html: buildHtml(order, names),
      text: buildText(order, names)
    });
    console.log('[mailer] booking notification sent to', to);
    return true;
  } catch (e) {
    console.warn('[mailer] failed to send:', e && e.message);
    return false;
  }
}

module.exports = { sendBookingNotification };
