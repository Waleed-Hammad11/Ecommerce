# 🛒 Full Stack E-Commerce App

A modern, full-featured **E-Commerce** web application built using **Angular** for the frontend and **Node.js + Express + MongoDB** for the backend.

It supports **user and admin roles**, **authentication**, **image uploads**, **JWT-protected routes**, and **modular API design**.

---

## ✨ Features

### 👤 User
- Sign up with email verification
- JWT-based secure login
- Browse products with images
- Add or remove items from the cart

### 🛠️ Admin
- Dedicated admin login
- Full CRUD access to users, products, and carts
- Admin dashboard integration ready

### 🌐 General
- Protected routes for users & admins
- Multer for image uploads
- Nodemailer for sending emails with JWT
- MongoDB + Mongoose schema management
- Scalable modular folder architecture

---

## 🧱 Tech Stack

| Frontend     | Backend           | Database   | Auth        | Utilities      |
|--------------|-------------------|------------|-------------|----------------|
| Angular      | Node.js + Express | MongoDB    | JWT         | Multer         |
| TypeScript   | Mongoose          | Compass    | bcrypt      | Nodemailer     |

---

## 📁 Folder Structure

``` Strructure

📦 project-root
├── db/
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

### 🔧 Backend Setup

```bash
# Clone the repo
git clone https://github.com/your-username/ecommerce-app.git
cd ecommerce-app

# Install dependencies
npm install

# Create .env file
touch .env
````

Add to `.env`:

```env
DB_URI=mongodb://localhost:27017/ecommerce-db
JWT_SECRET=your_jwt_secret
EMAIL_USER=your_email@example.com
EMAIL_PASS=your_password
```

```bash
# Start the backend server
node index.js
```

---

### 💻 Frontend Setup

```bash
# Navigate to Angular frontend
cd frontend

# Install Angular dependencies
npm install

# Run the Angular dev server
ng serve
```

---

## 🔐 Authentication Flow

1. User registers from the frontend.
2. An email is sent with a verification link using JWT.
3. Once confirmed, user can log in.
4. All secure routes are protected using middleware like `verifyToken` and `isAdmin`.

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

Made with ❤️ by **Waleed**

For support or inquiries, email: **[My Mail](mailto:waleedhammadmohammed@gmail.com)**

---

## 🌟 Give it a Star

If you found this project helpful or interesting, please consider giving it a ⭐ on GitHub!

---

### 📌 Note

Feel free to fork, contribute, or raise an issue.
