export default {
  actions: [
    {
      schema: "User_Management",
      model: "Credentials",
      action: "verifyCredentials",
      values: {
        email: "hello@gmail.com",
        password: "password"
      }
    }
  ]
};
