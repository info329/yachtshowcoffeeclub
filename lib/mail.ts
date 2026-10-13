import nodemailer from "nodemailer";

/** Send an internal email over the SMTP configured in the environment. */
export async function sendInternalMail(args: { subject: string; text: string; replyTo?: string }): Promise<boolean> {
  const to = process.env.ENQUIRY_TO || "hello@yachtshowcoffeeclub.com";
  if (!process.env.SMTP_HOST) {
    console.warn("[mail] SMTP_HOST not set; enquiry logged only:\n" + args.subject + "\n" + args.text);
    return false;
  }
  const port = Number(process.env.SMTP_PORT || 587);
  const transport = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port,
    secure: port === 465,
    auth: process.env.SMTP_USER ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS } : undefined,
  });
  await transport.sendMail({
    from: process.env.SMTP_FROM || process.env.SMTP_USER || to,
    to,
    replyTo: args.replyTo,
    subject: args.subject,
    text: args.text,
  });
  return true;
}
