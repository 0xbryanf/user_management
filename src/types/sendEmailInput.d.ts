export interface SendEmailInput {
  to: string;
  from: string;
  subject: string;
  html: string;
  otp?: string;
}
