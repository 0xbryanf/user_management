/**
 * Generates HTML content for an OTP email using the provided code.
 *
 * @param otp - The One-Time Passcode to display in the email.
 * @returns A formatted HTML string for the OTP email.
 */
export function generateOtpEmailHtml(otp: string): string {
  return `<!doctype html>
  <html>
  <head>
    <title>OTP Email</title>
    <style>
      body {
        font-family: Arial, sans-serif;
        margin: 0;
        padding: 0;
        background-color: #ffffff;
        color: #000000;
      }
      .container {
        width: 100%;
        max-width: 600px;
        margin: 20px auto;
        background: #ffffff;
        border: 1px solid #000000;
        border-radius: 8px;
        overflow: hidden;
      }
      .header {
        color: #000000;
        padding: 20px;
        text-align: center;
        background: #ffffff;
        border-bottom: 1px solid #000000;
        font-size: 24px;
        font-weight: bold;
      }
      .content {
        padding: 20px;
        text-align: center;
      }
      .otp {
        font-size: 30px;
        font-weight: bold;
        color: #000000;
        margin: 20px 0;
      }
      .otpDetails {
        margin: 0px;
        text-align: center;
        color: green;
      }
      .expiry {
        font-size: 14px;
        color: #000000;
        padding: 2px;
        margin: 0px;
      }
      .time {
        font-weight: bold;
      }
      .footer {
        text-align: center;
        font-size: 12px;
        color: #000000;
        background: #ffffff;
        border-top: 1px solid #000000;
      }
      .footer-content {
        padding: 20px;
      }
      .footer p {
        margin: 4px;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">Your One-Time Verification Code</div>
      <div class="content">
        <p>Please use the following One-Time Passcode to confirm your email:</p>
        <div class="otp">${otp}</div>
        <div class="otpDetails">
          <p class="expiry">This code will expire in <span class="time">15 minutes.</span></p>
          <p class="expiry">Please do not share your OTP.</p>
        </div>
      </div>
      <div class="footer">
        <div class="footer-content">
          <p>If you did not make this request,</p>
          <p>
            please visit our
            <a href="https://factorinnovations.com/help-center" style="text-decoration: underline">Help Center</a>
            for more information.
          </p>
          <p>&copy; 2025 Factor Innovations. All Rights Reserved.</p>
        </div>
      </div>
    </div>
  </body>
  </html>`;
}
