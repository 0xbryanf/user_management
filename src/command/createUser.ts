export default {
  actions: [
    {
      schema: "User_Management",
      model: "Users",
      action: "createUser",
      values: {
        username: "test-username",
        email: "test@gmail.com",
        password: "test123456"
      }
    }
  ]
};
