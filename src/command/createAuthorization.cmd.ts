export default {
  actions: [
    {
      schema: "User_Management",
      model: "Users",
      action: "createAuthorization",
      values: {
        authData: {
          key: "5b68e1f5c9f84b3aa3d7e4f9ab3c3c2f1234567890abcdef1234567890abcdef",
          userId: "95600494-50d9-4169-9c01-9897382854e3",
          email: "user@example.com",
          authorizationToken:
            "",
          isAuthorize: false,
          expiration: 900
        }
      }
    }
  ]
};
