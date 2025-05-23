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

## 🛡️ Security & Best Practices

This project follows best practices aligned with modern security standards and enterprise-grade architecture:

### 🔐 Token-Based Authentication with JWT

- Uses signed, stateless JSON Web Tokens (JWT) to authenticate users.
- Middleware verifies tokens on every request to ensure user integrity.
- Tokens are encrypted and contain minimal, safe-to-expose data (e.g., `userId`, roles).

### ⏱️ Redis-Based Session & Authorization Control

- Redis is used for storing time-limited session tokens, OTPs, and authorization payloads.
- Ensures secure and scalable short-lived access management.
- Supports use cases like passwordless auth, email confirmation, and OTP validation.

### 🔐 Password Security and Reuse Protection

- Passwords are hashed using `argon2`, designed to mitigate brute-force and dictionary attacks.
- Historical password hashes are stored to **enforce password rotation policies**.
- Password change is tracked via metadata and can be audited for compliance.

### 🧩 Role-Based Access Control (RBAC)

- Fine-grained control over features and resources through `Users`, `Roles`, and `UserRoles`.
- Each role can be assigned programmatically or via admin UI.
- Business logic can restrict access based on role context, allowing flexible permission mapping.

### 🛡️ Stateful Authorization Support (Admin-Controlled)

- While JWTs are stateless, **authorization metadata is stored in Redis**, allowing:
  - Real-time admin intervention to revoke, update, or flag user access.
  - Custom rules (e.g., geo-IP checks, behavioral flags) to deny or require extra validation.
  - Enforcement of temporary suspensions or escalated permissions (step-up authentication).

### 🔭 Threat Monitoring & Tamper Resistance

- All session and token-related events are auditable and expire predictably.
- Suspicious activity (e.g., reuse of expired tokens, OTP abuse) can trigger automatic revocation or alerts.
- Designed for integration with logging tools (e.g., Elastic, Loki, CloudWatch) and SIEM pipelines.

### 🧼 Input Validation & Type Safety

- Enforced via strict TypeScript configuration and runtime guards.
- Sequelize validation prevents invalid schema-level entries (e.g., email formats, unique constraints).

### 🔐 Middleware Guards

- Custom middleware prevents:
  - Unauthorized access
  - Double responses (using `responseGuardMiddleware`)
  - Missing headers or malformed payloads

### 🛠️ Secure CI/CD and Secrets Hygiene

- Secrets (e.g., JWT keys, Redis credentials) are managed via environment variables and `.env` files.
- Designed to be used in CI/CD pipelines with secret injection.
- No secrets are hardcoded or committed.

### 🧾 Auditability & Compliance Support

- All critical models (Users, Credentials, Roles) include:
  - `created_by`, `updated_by`, and `deleted_by` fields for traceability.
  - `created_at` and `updated_at` timestamps to support forensic analysis.
- Ideal for regulated environments (HIPAA, SOC2, ISO 27001, etc.)

### 🧠 Optional: Step-Up Authentication / MFA (Extensible)

- Redis-backed state allows tracking of partial or escalated auth flows.
- Can be extended to support multi-step flows like MFA, biometric checks, or IP/device confirmation.

---

### ✅ Enterprise Readiness

This project is **suitable for enterprise use**, featuring:

- **Stateless + Stateful Hybrid Design**  
  Allows scalability with Redis, while preserving administrative override and monitoring control.
- **Horizontal Scalability**  
  Compatible with container orchestration (Kubernetes, Docker Swarm) and serverless platforms.
- **Integrations**  
  Designed to integrate with identity providers (OAuth2, SAML, Azure AD, Okta).
- **High Security Posture**  
  Focused on identity assurance, tamper detection, and controlled authorization flows.
- **Flexible Extension Model**  
  Modular service/controller design allows seamless feature expansion with minimal risk.

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
