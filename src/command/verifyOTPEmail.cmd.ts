export default {
  actions: [
    {
      schema: "User_Management",
      model: "Credentials",
      action: "verifyOTPEmail",
      values: {
        email: "0xbryanf@gmail.com",
        otp: 902276
      }
    }
  ]
};
