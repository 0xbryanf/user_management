export function generateSignupAttemptEmail(
  verifyIdentityLink: string,
  otp: string
): string {
  return `<!doctype html>
  <html>
  <head>
    <title>Verify Your Identity</title>
    <style>
      body {
        font-family: Arial, sans-serif;
        background: #ffffff;
        margin: 0;
        padding: 0;
        color: #000000;
      }
      .container {
        max-width: 600px;
        margin: 40px auto;
        padding: 40px 24px;
        text-align: center;
        border: 1px solid #000;
        border-radius: 8px;
        color: #000000;
      }
      .header {
        font-size: 20px;
        font-weight: bold;
        margin-bottom: 24px;
        color: #000000;
      }
      .message {
        font-size: 16px;
        margin-bottom: 24px;
        color: #000000;
      }
      .otp {
        display: inline-block;
        font-size: 28px;
        font-weight: bold;
        background-color: #f0f0f0;
        padding: 16px 32px;
        border-radius: 8px;
        letter-spacing: 6px;
        margin-bottom: 12px;
        color: #000000;
      }
      .warning {
        font-size: 14px;
        color: #d00000;
        margin-bottom: 24px;
      }
      .button-group {
        margin: 32px 0;
      }
      .button {
        display: inline-block;
        padding: 10px 20px;
        margin: 0 10px;
        font-size: 14px;
        font-weight: bold;
        text-decoration: none;
        color: #000000 !important;
        border: 1px solid #000000;
        border-radius: 6px;
      }
      .footer {
        font-size: 12px;
        color: #000000;
        border-top: 1px solid #000000;
        padding-top: 16px;
        margin-top: 32px;
      }
      a {
        color: #000000;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">Confirm Your Email Address</div>
      <div class="message">
        Someone tried to sign up using this email address.<br />
        If it was you, please confirm your identity using the One-Time PIN below.
      </div>
      <div class="otp">${otp}</div>
      <div class="warning">Do not share this code with anyone.</div>
      <div class="button-group">
        <a href="${verifyIdentityLink}" class="button">Yes, confirm identity</a>
        <a href="http://localhost:3000/help/report" class="button">No, this wasn't me</a>
      </div>
      <div class="footer">
        Need help? Visit our <a href="https://factorinnovations.com/help-center">Help Center</a>.<br />
        &copy; 2025 Factor Innovations. All Rights Reserved.
      </div>
    </div>
  </body>
  </html>`;
}
