const otp = Math.floor(100000 + Math.random() * 900000).toString();

export default {
  actions: [
    {
      schema: "User_Management",
      model: "Users",
      action: "sendOTPEmail",
      values: {
        to: "0xbryanf@gmail.com",
        from: "bjfactor041789@gmail.com",
        subject: "Your OTP Code",
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <title>OTP Email</title>
            <style>
              body {
                font-family: Arial, sans-serif;
                margin: 0;
                padding: 0;
                background-color: #f9f9f9;
                color: #333333;
              }
              .container {
                width: 100%;
                max-width: 600px;
                margin: 20px auto;
                background: #ffffff;
                border: 1px solid #dddddd;
                border-radius: 8px;
                overflow: hidden;
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
              }
              .header {
                background-color: #0047FF;
                color: #ffffff;
                padding: 20px;
                text-align: center;
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
                color: #0047FF;
                margin: 20px 0;
              }
              .expiry {
                font-size: 14px;
                color: #555555;
              }
              .footer {
                text-align: center;
                padding: 10px;
                font-size: 12px;
                color: #777777;
                border-top: 1px solid #dddddd;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                Your OTP Code
              </div>
              <div class="content">
                <p>Please use the following OTP code to complete your action:</p>
                <div class="otp">${otp}</div>
                <p class="expiry">This code will expire in 5 minutes.</p>
              </div>
              <div class="footer">
                <p>&copy; 2025 Your Company. All Rights Reserved.</p>
              </div>
            </div>
          </body>
          </html>
        `
      }
    }
  ]
};
