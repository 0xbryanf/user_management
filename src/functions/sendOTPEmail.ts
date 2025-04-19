import sgMail from "@sendgrid/mail";
import { SendEmailInput } from "types/sendEmailInput";

export const sendOTPEmail = async (values: SendEmailInput) => {
  const { to, from, subject, html } = values;

  if (!to || !from || !subject || !html) {
    return {
      status: 400,
      message:
        "All required fields (to, subject, html) must be provided to send an email."
    };
  }

  sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

  const message: sgMail.MailDataRequired = {
    to,
    from,
    subject,
    html
  };

  try {
    const response = await sgMail.send(message);
    return {
      status: 200,
      message: "OTP Email sent successfully",
      data: response
    };
  } catch (error: unknown) {
    console.error("Error sending email:", error);

    return {
      status: 500,
      message: "Error sending email",
      error: error instanceof Error ? error.message : String(error)
    };
  }
};
