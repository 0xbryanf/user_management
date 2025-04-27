export default {
  actions: [
    {
      schema: "User_Management",
      model: "Credentials",
      action: "registerInitCredentials",
      values: {
        email: "test@gmail.com",
        password: "password"
      }
    }
  ]
};
