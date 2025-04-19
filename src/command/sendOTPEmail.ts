const otp = Math.floor(100000 + Math.random() * 900000).toString();

export default {
  actions: [
    {
      schema: "User_Management",
      model: "Users",
      action: "sendOTPEmail",
      values: {
        to: "bjfactor041789@gmail.com",
        from: "otp@factorinnovations.com",
        subject: `Your One Time OTP Code - ${otp}`,
        html: `
        <!doctype html>
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
              .expiry {
                font-size: 14px;
                color: #000000;
              }
              .footer {
                text-align: center;
                font-size: 12px;
                color: #000000;
                background: #ffffff;
                border-top: 1px solid #000000;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">Your One-Time Verification Code</div>
              <div class="content">
                <p>Please use the following One-Time Passcode to confirm your email:</p>
                <div class="otp">${otp}</div>
                <p class="expiry">This code will expire in 15 minutes.</p>
                <p class="expiry">Please do not share your OTP.</p>
              </div>
              <div class="footer">
                <p>If you did not make this request,</p>
                <p>
                  please visit our <a href="https://factorinnovations.com/help-center" style="text-decoration: underline;">Help Center</a> for more information.
                </p>
                <p>&copy; 2025 Factor Innovations. All Rights Reserved.</p>
              </div>
            </div>
          </body>
        </html>
      `
      }
    }
  ]
};
