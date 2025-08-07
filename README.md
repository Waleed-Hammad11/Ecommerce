
```md
# 🛒 Full Stack E-Commerce App

A modern, full-featured E-Commerce web application built using **Angular** for the frontend and **Node.js + Express + MongoDB** for the backend. It supports user and admin roles, authentication, image uploads, JWT-protected routes, and modular API design.
---

## ✨ Features

### 👤 User
- Sign up with email verification
- JWT-based login
- Add/remove items to/from cart
- Browse products with image support

### 🛠️ Admin
- Separate admin login
- Full control over users, products, and carts
- Access to all CRUD operations

### 🌐 General
- Protected routes for both user and admin
- Modular route architecture (User vs Admin separation)
- Multer-powered image uploads
- Email sending with Nodemailer & JWT links
- MongoDB + Mongoose schema design

---

## 🧱 Tech Stack

| Frontend     | Backend          | DB         | Auth        | Utilities      |
|--------------|------------------|------------|-------------|----------------|
| Angular      | Node.js + Express| MongoDB    | JWT         | Multer         |
| TypeScript   | Mongoose         | Compass    | bcrypt      | Nodemailer     |

---

## 📁 Folder Structure

```

📦 project-root
├── db
│   ├── db.connection.js
│   └── models/
│       ├── user.model.js
│       ├── product.model.js
│       └── cart.model.js
├── src/
│   ├── modules/
│   │   ├── admin/
│   │   ├── cart/
│   │   ├── products/
│   │   └── user/
│   ├── middleware/
│   │   ├── verifyToken.js
│   │   ├── isAdmin.js
│   │   ├── multer.middleware.js
│   │   └── checkEmail.js
│   └── utilities/
│       └── email/
│           ├── sendMail.js
│           └── email.template.js
├── uploads/
├── index.js
└── README.md

````

---

## ⚙️ How to Run Locally

### 1️⃣ Backend Setup
```bash
# Clone the repo
git clone https://github.com/your-username/ecommerce-app.git
cd ecommerce-app

# Install dependencies
npm install

# Configure MongoDB URI and Email creds in .env
touch .env
# Add:
# DB_URI=mongodb://localhost:27017/your-db-name
# JWT_SECRET=your_jwt_secret
# EMAIL_USER=your_email
# EMAIL_PASS=your_pass

# Run server
node index.js
````

### 2️⃣ Frontend Setup

```bash
# Navigate to Angular app
cd frontend

# Install Angular dependencies
npm install

# Serve the app
ng serve
```

---

## 🔐 Authentication Flow

1. User registers
2. Email sent with verification link (using JWT)
3. After confirmation, user logs in and receives access token
4. All sensitive routes protected using `verifyToken` and `isAdmin` middleware

---

## 🧪 Sample API Response

```json
{
  "message": "All products",
  "data": [
    {
      "_id": "64ff39...",
      "title": "Pizza",
      "price": 150,
      "quantity": 3,
      "image": "uploads/pizza.jpg",
      "createdBy": "64ee78..."
    }
  ]
}
```

---

## 📧 Contact

Made with ❤️ by [Waleed](www.linkedin.com/in/waleed-hammad-26890221a)

For support, email: **[MY Mail](mailto:waleedhammadmohammed@gmail.com)**

---

## 🌟 Give it a Star

If you like this project, don’t forget to ⭐ it on GitHub!

```
