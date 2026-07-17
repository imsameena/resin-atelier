import nodemailer from "nodemailer";

// Sends order-notification emails via Gmail SMTP using an app password.
// See README "WhatsApp/Email order notifications" for setup steps.
function getTransport() {
  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_APP_PASSWORD;
  if (!user || !pass) return null;

  return nodemailer.createTransport({
    service: "gmail",
    auth: { user, pass },
  });
}

export async function sendOrderNotificationEmail(subject: string, text: string): Promise<void> {
  const transport = getTransport();
  const to = process.env.ADMIN_EMAIL;

  if (!transport || !to) {
    console.warn("Email notification skipped: missing EMAIL_USER, EMAIL_APP_PASSWORD, or ADMIN_EMAIL.");
    return;
  }

  await transport.sendMail({
    from: process.env.EMAIL_USER,
    to,
    subject,
    text,
  });
}
