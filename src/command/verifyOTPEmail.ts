export default {
  actions: [
    {
      schema: "User_Management",
      model: "Users",
      action: "verifyOTPEmail",
      values: {
        to: "bjfactor041789@gmail.com",
        otp: 550551
      }
    }
  ]
};
