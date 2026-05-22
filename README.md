<div align="center">

<br />

<!-- Logo / Hero Banner -->
<img src="https://capsule-render.vercel.app/api?type=waving&color=0:1a1a2e,50:16213e,100:0f3460&height=200&section=header&text=🛒%20E-Commerce%20Platform&fontSize=40&fontColor=e94560&fontAlignY=38&desc=Full-Stack%20%7C%20Angular%2019%20+%20Node.js%20+%20MongoDB&descAlignY=60&descColor=a8b2d8" alt="header" width="100%" />

<br />

<!-- Badges Row 1 -->
[![Node.js](https://img.shields.io/badge/Node.js-18%2B-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Angular](https://img.shields.io/badge/Angular-19-DD0031?style=for-the-badge&logo=angular&logoColor=white)](https://angular.io/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://mongodb.com/)
[![Express](https://img.shields.io/badge/Express.js-ESM-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)

<!-- Badges Row 2 -->
[![JWT](https://img.shields.io/badge/Auth-JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)](https://jwt.io/)
[![Jest](https://img.shields.io/badge/Testing-Jest%20%2B%20Supertest-C21325?style=for-the-badge&logo=jest&logoColor=white)](https://jestjs.io/)
[![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)](LICENSE)
[![Status](https://img.shields.io/badge/Status-Production%20Ready-success?style=for-the-badge)](/)

<br />

> **A production-ready, secure, and fully-featured E-Commerce application built with a clean modular architecture.**  
> Handles everything from user onboarding and email verification to cart management and admin dashboards.

<br />

[🚀 Quick Start](#-quick-start) • [📖 API Docs](#-api-documentation) • [🏗️ Architecture](#️-architecture) • [🔐 Security](#-security) • [🧪 Testing](#-testing) • [📋 Roadmap](#-roadmap)

<br />

</div>

---

## 📌 Table of Contents

- [✨ Features](#-features)
- [🛠️ Tech Stack](#️-tech-stack)
- [🏗️ Architecture](#️-architecture)
- [🚀 Quick Start](#-quick-start)
- [🔧 Environment Variables](#-environment-variables)
- [📖 API Documentation](#-api-documentation)
- [🔐 Security](#-security)
- [🧪 Testing](#-testing)
- [🐛 Troubleshooting](#-troubleshooting)
- [📋 Roadmap](#-roadmap)

---

## ✨ Features

<table>
<tr>
<td width="50%">

### 👤 User Features
- ✅ Secure registration with **two-factor email verification**
- ✅ JWT-based login with role management
- ✅ Product browsing, searching & filtering
- ✅ Real-time cart with persistent database state
- ✅ Quantity updates & live price calculation
- ✅ Verified account-only checkout flow

</td>
<td width="50%">

### 🛡️ Admin Features
- ✅ Protected admin routes with role-based access
- ✅ Full **CRUD** for Products with image uploads
- ✅ Global user registry monitoring
- ✅ System-wide cart visibility dashboard
- ✅ Structured activity logs via **Winston**
- ✅ Automated test coverage enforcement

</td>
</tr>
</table>

---

## 🛠️ Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend** | Angular 19, TypeScript | SPA, routing, state management |
| **Backend** | Node.js, Express (ESM) | REST API server |
| **Database** | MongoDB, Mongoose ODM | Data persistence & modeling |
| **Auth** | JWT, bcrypt (cost=12) | Secure session & password management |
| **Email** | Nodemailer | Registration verification emails |
| **Uploads** | Multer | Image handling (jpeg, png, webp / max 5MB) |
| **Validation** | Joi | Schema-level request validation |
| **Security** | Helmet, CORS, Rate Limiter, express-mongo-sanitize, xss-clean | Multi-layer hardening |
| **Logging** | Winston | Structured backend logging |
| **Testing** | Jest, Supertest | Integration test suites |

---

## 🏗️ Architecture

### 📁 Folder Structure

```
📦 project-root
├── 📂 Backend/
│   ├── 📂 src/
│   │   ├── 📂 config/           ─── Database, environment, mailer setup
│   │   ├── 📂 constants/        ─── HTTP status codes & global constants
│   │   ├── 📂 middlewares/      ─── Auth, authorization, error handler, rate limiter
│   │   ├── 📂 models/           ─── Mongoose schemas (User, Product, Cart)
│   │   ├── 📂 modules/
│   │   │   ├── 📂 auth/         ─── Register, login, email confirmation
│   │   │   ├── 📂 cart/         ─── Cart state + admin cart views
│   │   │   ├── 📂 product/      ─── Product CRUD + image upload
│   │   │   └── 📂 user/         ─── Profile & account lookups
│   │   └── 📂 utils/            ─── ApiError class, logger, mail template
│   ├── 📂 tests/                ─── Jest + Supertest integration suites
│   ├── 📄 index.js              ─── Server entrypoint
│   └── 📄 package.json
├── 📂 front/                    ─── Angular 19 Frontend Application
└── 📄 README.md
```

### 🔄 Request Flow

```
 ┌─────────────┐     ┌────────┐     ┌──────────────────────┐     ┌────────────┐     ┌──────────┐     ┌──────────┐
 │ HTTP Request │────▶│ Routes │────▶│ Middlewares/Validators│────▶│ Controllers│────▶│ Services │────▶│ Models/DB│
 └─────────────┘     └────────┘     └──────────────────────┘     └────────────┘     └──────────┘     └──────────┘
                                         JWT + Joi + Role                                Business         MongoDB
                                           Enforcement                                    Logic          Mongoose
```

> Each layer has a **single responsibility**. Controllers only parse request/response. Services hold all business logic. Models define data shapes.

---

## 🚀 Quick Start

### Prerequisites

```
✔ Node.js v18 or higher
✔ MongoDB (local) or MongoDB Atlas URI
✔ Gmail account with App Password enabled (for email verification)
```

### Step 1 — Clone the Repository

```bash
git clone https://github.com/your-username/ecommerce-app.git
cd ecommerce-app
```

### Step 2 — Setup the Backend

```bash
# Navigate to backend folder
cd Backend

# Install dependencies
npm install

# Copy the environment config template
cp .env.example .env
```

> ⚠️ **Important:** Open `.env` and fill in all required values (see [Environment Variables](#-environment-variables)).

### Step 3 — Run the Backend Server

```bash
# Development mode (with live reload)
npm run dev

# Production mode
npm start
```

> The backend will start at **`http://localhost:3000`**

### Step 4 — Setup & Run the Frontend

```bash
# Open a new terminal and navigate to frontend
cd ../front

# Install Angular dependencies
npm install

# Start the development server
npm start
```

> Open your browser at **`http://localhost:4200`** 🎉

---

## 🔧 Environment Variables

Create a `Backend/.env` file with the following configuration:

```env
# ─── Server ─────────────────────────────────────
NODE_ENV=development
PORT=3000

# ─── Database ───────────────────────────────────
MONGO_URI=mongodb://localhost:27017/ecommerce

# ─── JWT Secrets ────────────────────────────────
JWT_SECRET=your_super_long_random_secret_min_32_chars
JWT_EMAIL_SECRET=another_distinct_secure_secret_key

# ─── App URLs ───────────────────────────────────
BACKEND_URL=http://localhost:3000
FRONTEND_URL=http://localhost:4200

# ─── Email (Nodemailer) ─────────────────────────
SMTP_USER=your_gmail@gmail.com
SMTP_PASS=xxxx xxxx xxxx xxxx   # 16-char Google App Password
```

| Variable | Description | Example |
|----------|-------------|---------|
| `NODE_ENV` | Runtime environment | `development` / `production` |
| `PORT` | Server port | `3000` |
| `MONGO_URI` | MongoDB connection string | `mongodb://localhost:27017/ecommerce` |
| `JWT_SECRET` | Token signing key (≥32 chars) | `random_long_secret...` |
| `JWT_EMAIL_SECRET` | Email token signing key | `another_secret...` |
| `BACKEND_URL` | API base URL | `http://localhost:3000` |
| `FRONTEND_URL` | Allowed CORS origin | `http://localhost:4200` |
| `SMTP_USER` | Gmail sender address | `example@gmail.com` |
| `SMTP_PASS` | Google App Password (not regular password) | `xxxx xxxx xxxx xxxx` |

---

## 📖 API Documentation

> **Base URL:** `http://localhost:3000/api/v1`  
> **Headers:** `Content-Type: application/json`  
> **Auth Header:** `Authorization: Bearer <token>`

### 🔑 Auth Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `POST` | `/auth/register` | Register a new user account | ❌ Public |
| `GET` | `/auth/verify-email/:token` | Confirm email address | ❌ Public |
| `POST` | `/auth/login` | Login and receive JWT token | ❌ Public |

<details>
<summary><b>POST /auth/register — Request & Response</b></summary>

**Request Body:**
```json
{
  "username": "johndoe",
  "email": "johndoe@example.com",
  "password": "SecurePassword123",
  "confirmPassword": "SecurePassword123"
}
```

**Success Response `201 Created`:**
```json
{
  "success": true,
  "message": "Registration successful. Please check your email to verify your account.",
  "data": {
    "username": "johndoe",
    "email": "johndoe@example.com",
    "role": "user",
    "isVerified": false,
    "_id": "603d2e1f4f1a2c3b8c9d0e1f"
  }
}
```
</details>

<details>
<summary><b>POST /auth/login — Request & Response</b></summary>

**Request Body:**
```json
{
  "email": "johndoe@example.com",
  "password": "SecurePassword123"
}
```

**Success Response `200 OK`:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "603d2e1f4f1a2c3b8c9d0e1f",
      "username": "johndoe",
      "email": "johndoe@example.com",
      "role": "user"
    }
  }
}
```
</details>

---

### 👤 User Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `GET` | `/users/me` | Get current user profile | 🔒 User |

---

### 📦 Product Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `GET` | `/products` | List paginated active products | ❌ Public |
| `POST` | `/products` | Create new product with image | 🛡️ Admin |
| `PUT` | `/products/:id` | Update existing product | 🛡️ Admin |
| `DELETE` | `/products/:id` | Soft-delete a product | 🛡️ Admin |

> **Note:** Deleted products use **soft-deletion** — data is preserved in cart history but hidden from active queries.

---

### 🛒 Cart Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `GET` | `/cart/my-cart` | Get current user's cart | 🔒 User |
| `POST` | `/cart` | Add item/quantity to cart | 🔒 User |
| `PUT` | `/cart` | Update item quantity | 🔒 User |
| `DELETE` | `/cart/item/:productId` | Remove specific item | 🔒 User |
| `DELETE` | `/cart` | Clear entire cart | 🔒 User |
| `GET` | `/cart/admin` | View all system carts | 🛡️ Admin |

<details>
<summary><b>GET /cart/my-cart — Response Example</b></summary>

```json
{
  "success": true,
  "message": "Cart retrieved successfully",
  "data": {
    "_id": "603d3aef4f1a2c3b8c9d4f2a",
    "items": [
      {
        "product": {
          "_id": "603d3bf14f1a2c3b8c9d5e3c",
          "title": "Leather Wallet",
          "price": 45,
          "imageUrl": "uploads/wallet.jpg"
        },
        "quantity": 2,
        "priceAtAddition": 45,
        "_id": "603d3aef4f1a2c3b8c9d4f2b"
      }
    ],
    "totalItems": 2,
    "totalPrice": 90
  }
}
```
</details>

---

## 🔐 Security

This application is hardened with multiple security layers:

| Layer | Implementation | Protection Against |
|-------|---------------|-------------------|
| **JWT Auth** | Signed tokens with expiry in `Authorization` header | Session hijacking |
| **Password Hashing** | `bcrypt` with work factor `12` | Credential leaks |
| **HTTP Headers** | `Helmet` middleware | Clickjacking, MIME sniffing |
| **CORS Policy** | Restricted to `FRONTEND_URL` only | Unauthorized cross-origin requests |
| **Rate Limiting** | Per-IP request caps on all routes | Brute-force & DoS attacks |
| **NoSQL Injection** | `express-mongo-sanitize` strips `$` and `.` keys | MongoDB injection |
| **XSS Prevention** | `xss-clean` sanitizes body, params, query | Cross-site scripting |
| **Input Validation** | Joi schemas at middleware level | Malformed payloads |
| **File Upload Safety** | Multer: MIME check + 5MB max | Disk exhaustion attacks |

---

## 🧪 Testing

### Run Tests

```bash
# Run all test suites
npm run test

# Generate coverage report
npm run test:coverage
```

### Test Coverage

| Suite | What's Tested |
|-------|--------------|
| **Auth Flow** | Registration, invalid emails, weak passwords, NoSQL injection, token expiry, login combinations |
| **Product CRUD** | Public browsing, admin-only creation, Joi schema bounds, soft-delete behavior |
| **Cart Operations** | Item insertion, stock limit enforcement, duplicate quantity merging, item deletion, admin retrieval |

---

## 🐛 Troubleshooting

<details>
<summary><b>🔴 MongoDB connection timeout on startup</b></summary>

**Problem:** Backend fails to boot with database timeout errors.

**Solution:**
- **Local MongoDB:** Ensure the service is running:
  ```bash
  # Windows
  net start MongoDB

  # macOS
  brew services start mongodb-community
  ```
- **Atlas URI:** Verify your `MONGO_URI` credentials and confirm your current IP is whitelisted in Atlas → Network Access.
</details>

<details>
<summary><b>🔴 Port 3000 already in use (EADDRINUSE)</b></summary>

**Problem:** `Error: listen EADDRINUSE :::3000`

**Solution:** Change the port in `.env`:
```env
PORT=3001
```
Or find and kill the conflicting process using your OS's task manager or `lsof -i :3000` on Unix.
</details>

<details>
<summary><b>🔴 Email fails with "535 BadCredentials"</b></summary>

**Problem:** User registration triggers email failure.

**Solution:**
1. Enable **Two-Factor Authentication** on your Google account.
2. Go to Google Account → Security → **App Passwords**.
3. Generate a 16-character App Password and place it in `SMTP_PASS`.
4. Your regular Google password will **not** work here.
</details>

---

## 📋 Roadmap

Planned improvements for future versions:

- [ ] **Password Reset Flow** — Secure token-based password reset via email
- [ ] **Order System** — Mongoose `Order` model with cart-to-order transitions and shipping status
- [ ] **Product Search Auto-Complete** — Lightweight regex-based endpoint for instant results
- [ ] **Interactive UI Enhancements** — Checkout wizard, search filters, product gallery
- [ ] **Pagination & Sorting** — Advanced query controls for product listing

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

<div align="center">

<br />

**Built with ❤️ using Node.js · Angular · MongoDB**

<br />

<img src="https://capsule-render.vercel.app/api?type=waving&color=0:1a1a2e,50:16213e,100:0f3460&height=100&section=footer" alt="footer" width="100%" />

</div>