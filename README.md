# Bank Transaction System

This project is a backend service for a simple banking application where users can register, log in, manage accounts, and perform secure money transfers. It is designed to feel like a real digital banking system on the server side, with user authentication, account validation, transaction safety checks, and email notifications.

Think of it as the engine behind a bank app: when money moves between accounts, the system checks balances, validates users, records the transfer, and keeps the records consistent.

## What this project does

- Allows users to register and log in
- Protects routes with JWT-based authentication
- Manages bank accounts and user data
- Processes transactions between accounts
- Prevents duplicate or unsafe transfers using idempotency keys
- Keeps a ledger of all debit and credit activity
- Sends email notifications for registration and transaction events
- Uses cookies for token storage in the browser flow

## Technology stack

This project is built using a modern Node.js backend stack:

### Backend runtime
- Node.js: the runtime environment that runs the server
- Express.js: the web framework used to build APIs and route requests

### Database and data modeling
- MongoDB: the database used to store users, accounts, transactions, and ledger records
- Mongoose: the ODM (Object Data Modeling) library that helps Node.js talk to MongoDB in a clean and structured way

### Authentication and security
- JWT (JSON Web Tokens): used to create and verify secure user sessions
- bcryptjs: used to hash passwords before storing them
- cookie-parser: helps read and manage cookies for auth tokens
- dotenv: loads environment variables from a `.env` file

### Email support
- nodemailer: sends emails for user registration and transaction notifications

### Overall architecture
The project follows a clean backend structure:

- `src/controllers`: handles business logic for auth, accounts, and transactions
- `src/routes`: defines API endpoints
- `src/models`: defines database schemas
- `src/middleware`: handles protected access and request checks
- `src/services`: contains reusable logic such as email sending
- `src/config`: database connection setup

## Project flow

Here is the basic flow of the application in simple terms:

1. A user signs up or logs in.
2. The server verifies the credentials and creates a JWT token.
3. The token is stored in a cookie or returned to the client.
4. The user can access protected account and transaction routes.
5. When a transaction is created, the system:
   - checks if both accounts exist
   - verifies account status
   - checks whether the sender has enough balance
   - prevents duplicate transactions with an idempotency key
   - records debit and credit entries in the ledger
   - marks the transaction as completed when everything is valid
6. The system sends a notification email to the user after key actions.

## Main dependencies

The project depends on these main libraries:

- `express` for API creation
- `mongoose` for MongoDB integration
- `jsonwebtoken` for secure authentication tokens
- `bcryptjs` for password protection
- `cookie-parser` for cookie handling
- `dotenv` for environment configuration
- `nodemailer` for sending emails

## Prerequisites

Before running the project, make sure you have:

- Node.js 18 or newer
- MongoDB running locally or on a cloud MongoDB service
- A `.env` file with the necessary environment variables

## Environment variables

Create a `.env` file in the project root and add values like:

```env
PORT=3000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
EMAIL_USER=your_email@example.com
EMAIL_PASS=your_email_password
```

## Installation

```bash
npm install
```

## Run the project

Start the server in development mode:

```bash
npm run dev
```

Or run it directly:

```bash
node server.js
```

## Scripts

```bash
npm run dev
```
Runs the project with nodemon for automatic restarts during development.

## Notes

This is a backend-focused banking system, so the main focus is on API behavior, security, and reliable transaction handling rather than a graphical frontend. The project is a strong foundation for expanding into a full real-world banking platform with features like account statements, transfers history, admin dashboards, and payment approval flows.

## License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.