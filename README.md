src/
│── auth/ # Authentication & Authorization module
│ ├── auth.module.ts # Auth module definition
│ ├── auth.controller.ts # Handles authentication routes
│ ├── auth.service.ts # Business logic for authentication
│ ├── jwt.strategy.ts # JWT authentication strategy
│ ├── local.strategy.ts # Local authentication strategy (email/password)
│ ├── roles.guard.ts # Role-based access control (RBAC)
│ ├── session.strategy.ts # Session management & refresh tokens
│ ├── google-auth.guard.ts # Google OAuth guard
│ ├── google.strategy.ts # Google OAuth strategy
│ ├── email.service.ts # Handles email verification & password reset
│ ├── otp.service.ts # Handles two-factor authentication (2FA)
│ ├── decorators/ # Custom decorators (e.g., Roles decorator)
│ │ ├── roles.decorator.ts
│ ├── guards/ # Custom guards
│ │ ├── jwt-auth.guard.ts
│ │ ├── local-auth.guard.ts
│ │ ├── roles.guard.ts
│
│── user/ # User module
│ ├── user.module.ts # User module definition
│ ├── user.controller.ts # Handles user-related routes
│ ├── user.service.ts # Business logic for user management
│ ├── user.entity.ts # User entity for TypeORM
│
│── common/ # Shared utilities, decorators, and interceptors
│ ├── decorators/ # Custom decorators
│ │ ├── roles.decorator.ts
│ ├── interceptors/ # Response interceptors, logging, etc.
│ ├── filters/ # Exception filters
│
│── config/ # Configuration files
│ ├── config.module.ts # Configuration module
│ ├── config.service.ts # Config service for environment variables
│
│── main.ts # Entry point of the application
│── app.module.ts # Root module
│── app.controller.ts # Root controller
│── app.service.ts # Root service
│
├── .env # Environment variables
├── tsconfig.json # TypeScript configuration
├── package.json # Dependencies and scripts
