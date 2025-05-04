import sgMail from "@sendgrid/mail";
import { Email } from "types/email";

/**
 * Sends an email using SendGrid.
 *
 * @param to - Recipient email address.
 * @param from - Sender email address.
 * @param subject - Email subject line.
 * @param html - HTML content of the email.
 * @returns SendGrid response object.
 * @throws If any required field is missing, email is invalid, or SendGrid fails.
 */
export const sendEmail = async ({
  to,
  from,
  subject,
  html
}: Email): Promise<[sgMail.ClientResponse, {}]> => {
  if (!to || !from || !subject || !html) {
    throw new Error("Missing required information to send email.");
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(to)) {
    throw new Error("Invalid recipient email format.");
  }

  if (!emailRegex.test(from)) {
    throw new Error("Invalid sender email format.");
  }

  const apiKey = process.env.SENDGRID_API_KEY;
  if (!apiKey) {
    throw new Error("SendGrid API key is not defined.");
  }

  sgMail.setApiKey(apiKey);

  const message: sgMail.MailDataRequired = {
    to,
    from,
    subject,
    html
  };

  const response = await sgMail.send(message);
  return response;
};
