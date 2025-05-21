# User Management

A modular, secure, and scalable user management system built with **TypeScript**, **Express**, **Sequelize** (PostgreSQL), and **Redis**.  
This system provides APIs for registration, authentication, role management, password policies, email/OTP verification, and robust audit/compliance support.

---

## 🚀 Getting Started

### Installation

```bash
yarn install
# or
npm install
```

---

## Available Commands

| Command                      | Description                                                  |
| ---------------------------- | ------------------------------------------------------------ |
| `yarn dev run`               | Start the development server.                                |
| `yarn dev run -c <function>` | Run a specific function/command without starting the server. |
| `yarn build`                 | Build the TypeScript project into the `dist` folder.         |
| `yarn start`                 | Start the server from the compiled JavaScript code.          |

---

## Project Structure

```
.
├── controllers/        # API controllers (Users, Roles, Credentials, etc.)
├── services/           # Business logic and service classes
├── schema/             # Sequelize model schemas and associations
├── functions/          # Utility and domain-specific functions
├── lib/                # Helper libraries (JWT, email, Redis, etc.)
├── utils/              # Utility scripts (e.g. DB connection, model loading)
├── src/                # Main TypeScript source code
└── dist/               # Compiled JavaScript output
```

---

## Key Features & Advantages

- **Separation of Concerns**  
  Modular structure for controllers, services, models, and utilities.

- **Strong Type Safety**  
  Written entirely in TypeScript with strict type-checking enabled.

- **Redis Integration**

  - Fast, in-memory session and authorization storage for authentication flows.
  - OTPs and tokens stored securely for time-limited access.
  - Enables horizontal scaling and distributed deployments.

- **Sequelize ORM**  
  For strong data modeling, migrations, and association management with PostgreSQL.

- **Secure Authentication**

  - JWT-based session handling.
  - Email/OTP-based verification for secure onboarding.
  - Password history and validation to prevent reuse.

- **Role-Based Access Control**  
  Assign and enforce user roles for fine-grained authorization.

- **API-Ready**  
  Well-defined RESTful endpoints and middleware for error handling and validation.

- **Extensible & Testable**  
  Clear module boundaries and single-responsibility design for easy extension and unit testing.

---

## Example API Endpoints

- `POST /api/v1/activate-user`
- `POST /api/v1/create-authorization`
- `POST /api/v1/get-authorization`
- `POST /api/v1/activate-authorization`
- `POST /api/v1/verify-user-activation`
- `POST /api/v1/update-user-authorization`
- `POST /api/v1/register-init-credentials`
- `POST /api/v1/request-email-confirmation`
- `POST /api/v1/send-otp-email`
- `POST /api/v1/verify-otp-email`
- `POST /api/v1/verify-credential`
- `GET /api/v1/get-credential-by-email`
- `GET /api/v1/get-credential-by-user-id`
- `POST /api/v1/assign-role`
- `POST /api/v1/create-role`
- `POST /api/v1/update-password`

---

## Security & Best Practices

- Uses Redis for fast, in-memory, and time-limited storage of sensitive session and OTP data.
- Passwords are never stored in plain text (hashed and salted).
- Sensitive endpoints protected by JWT authentication middleware.
- All database models enforce strict validation and unique constraints.
- Modular design allows easy upgrades and integration with other services.

---

## Documentation & Conventions

- All classes, services, and controllers use [TSDoc](https://tsdoc.org/) for inline documentation.

---

## 🧑‍💻 Contributing

Contributions are welcome!  
Please open an issue or submit a pull request for improvements, new features, or bug fixes.

---

## 📝 License

This project is licensed under the MIT License.
