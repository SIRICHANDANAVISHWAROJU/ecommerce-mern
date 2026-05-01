# ShopMERN — MERN Stack E-Commerce Platform

A full-stack e-commerce web application built with **MongoDB, Express, React (Vite), and Node.js**, featuring user authentication, shopping cart, order management, and a complete admin panel.

---

##  Features

### Customer side
- Browse products with **search** & **pagination**
- Product detail pages
- Shopping cart (persisted in `localStorage`)
- User registration & login with **JWT**
- Checkout with shipping address & mock payment
- Order history & order detail pages

### Admin panel
- Dashboard with stats (users, products, orders, revenue)
- Product CRUD (create, edit, delete)
- User management (list, delete)
- Order management (view all, mark delivered)

### Backend
- REST API with Express
- MongoDB via Mongoose ODM
- JWT auth + bcrypt password hashing
- Role-based middleware (`protect`, `admin`)
- Centralised error handling
- Database seeder with sample data

---

##  Tech Stack

| Layer    | Technology                                                       |
|----------|------------------------------------------------------------------|
| Frontend | React 18, Vite, React Router v6, Axios, Context API, react-toastify |
| Backend  | Node.js, Express, Mongoose, JSON Web Tokens, bcryptjs            |
| Database | MongoDB (local or MongoDB Atlas)                                 |
| Tooling  | concurrently, nodemon, morgan, dotenv, cors                      |

---

##  Prerequisites

Before you start, make sure these are installed:

1. **Node.js** v18 or higher → [https://nodejs.org](https://nodejs.org)
2. **MongoDB** running locally **OR** a free MongoDB Atlas cluster
   - Local: [https://www.mongodb.com/try/download/community](https://www.mongodb.com/try/download/community)
   - Atlas: [https://www.mongodb.com/cloud/atlas/register](https://www.mongodb.com/cloud/atlas/register)
3. **VS Code** (recommended) → [https://code.visualstudio.com](https://code.visualstudio.com)
4. **Git** (optional, for version control)

---

##  Setup & Run (in VS Code)

### Step 1 — Open the project

```bash
# Unzip the folder, then open it in VS Code
cd ecommerce-mern
code .
```

### Step 2 — Install dependencies

In the integrated terminal (`Ctrl + ~`):

```bash
npm run install-all
```

This installs packages for the root, backend, and frontend in one go.

### Step 3 — Configure environment variables

```bash
cd backend
# Windows:  copy .env.example .env
# macOS/Linux:
cp .env.example .env
```

Open `backend/.env` and edit:

```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://127.0.0.1:27017/ecommerce_mern
JWT_SECRET=replace_this_with_a_long_random_string
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
```

> If using MongoDB Atlas, paste your connection URI in `MONGO_URI` (whitelist your IP first).

### Step 4 — Seed the database

```bash
cd ..
npm run seed
```

This loads 6 sample products and 3 users (1 admin, 2 customers).

### Step 5 — Start both servers

```bash
npm run dev
```

You should see:

```
[BACKEND]   MongoDB connected: localhost
[BACKEND]   Server running in development mode on port 5000
[FRONTEND] VITE v5.x  ready in 400 ms
[FRONTEND] ➜  Local:   http://localhost:5173/
```

Open **[http://localhost:5173](http://localhost:5173)** in your browser. 

---

##  Default Accounts (after seeding)

| Role   | Email               | Password   |
|--------|---------------------|------------|
| Admin  | admin@example.com   | admin123   |
| User   | john@example.com    | 123456     |
| User   | jane@example.com    | 123456     |

---

##  API Reference

Base URL: `http://localhost:5000/api`

### Users / Auth

| Method | Route                | Access  | Description                     |
|--------|----------------------|---------|---------------------------------|
| POST   | `/users/register`    | Public  | Register new user               |
| POST   | `/users/login`       | Public  | Login & receive JWT             |
| GET    | `/users/profile`     | Auth    | Get current user                |
| PUT    | `/users/profile`     | Auth    | Update current user             |
| GET    | `/users`             | Admin   | List all users                  |
| DELETE | `/users/:id`         | Admin   | Delete user (non-admin only)    |

### Products

| Method | Route                       | Access | Description                                |
|--------|-----------------------------|--------|--------------------------------------------|
| GET    | `/products?keyword=&page=`  | Public | List products with search & pagination     |
| GET    | `/products/:id`             | Public | Single product                             |
| POST   | `/products`                 | Admin  | Create sample product                      |
| PUT    | `/products/:id`             | Admin  | Update product                             |
| DELETE | `/products/:id`             | Admin  | Delete product                             |

### Orders

| Method | Route                    | Access  | Description                          |
|--------|--------------------------|---------|--------------------------------------|
| POST   | `/orders`                | Auth    | Create new order                     |
| GET    | `/orders/myorders`       | Auth    | Current user's orders                |
| GET    | `/orders/:id`            | Auth    | Get order (owner or admin only)      |
| PUT    | `/orders/:id/pay`        | Auth    | Mark order as paid (mock)            |
| PUT    | `/orders/:id/deliver`    | Admin   | Mark order as delivered              |
| GET    | `/orders`                | Admin   | List all orders                      |

---

##  Testing the application

### Manual functional test checklist

1. **Register** a new account → should redirect to home and show your name in the navbar
2. **Login** with `admin@example.com / admin123` → "Admin" link appears in navbar
3. **Browse products** on the home page; try the search bar with "headphone"
4. Click a product → see detail page → **Add to Cart**
5. View **Cart**, change quantities, remove items, click **Checkout**
6. Fill shipping address → **Place Order** → redirected to order detail page
7. Click **Mark as Paid** → status updates
8. As admin, go to **Admin → Orders** → click order → click **Mark Delivered**
9. **Admin → Products** → click **+ Create Product** → edit fields → save
10. **Admin → Users** → verify list → try deleting a non-admin user

### Testing the API directly (REST Client / Postman)

Install the [REST Client extension](https://marketplace.visualstudio.com/items?itemName=humao.rest-client) in VS Code, create a `test.http` file:

```http
### Login as admin
POST http://localhost:5000/api/users/login
Content-Type: application/json

{
  "email": "admin@example.com",
  "password": "admin123"
}

### Get all products
GET http://localhost:5000/api/products

### Get single product (replace ID)
GET http://localhost:5000/api/products/<product_id>
```

---

##  Project Structure

```
ecommerce-mern/
├── backend/
│   ├── config/
│   │   └── db.js                    ← MongoDB connection
│   ├── controllers/
│   │   ├── orderController.js
│   │   ├── productController.js
│   │   └── userController.js
│   ├── middleware/
│   │   ├── authMiddleware.js        ← JWT + admin guards
│   │   └── errorMiddleware.js       ← 404 + error handler
│   ├── models/
│   │   ├── Order.js
│   │   ├── Product.js
│   │   └── User.js                  ← bcrypt hashing
│   ├── routes/
│   │   ├── orderRoutes.js
│   │   ├── productRoutes.js
│   │   └── userRoutes.js
│   ├── utils/
│   │   └── generateToken.js
│   ├── .env.example
│   ├── package.json
│   ├── seeder.js                    ← DB seeder
│   └── server.js                    ← Express entry
├── frontend/
│   ├── public/
│   │   └── favicon.svg
│   ├── src/
│   │   ├── components/
│   │   │   ├── Footer.jsx
│   │   │   ├── Loader.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── ProductCard.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   ├── context/
│   │   │   ├── AuthContext.jsx
│   │   │   └── CartContext.jsx
│   │   ├── pages/
│   │   │   ├── admin/
│   │   │   │   ├── Dashboard.jsx
│   │   │   │   ├── OrderList.jsx
│   │   │   │   ├── ProductEdit.jsx
│   │   │   │   ├── ProductList.jsx
│   │   │   │   └── UserList.jsx
│   │   │   ├── Cart.jsx
│   │   │   ├── Checkout.jsx
│   │   │   ├── Home.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── OrderDetail.jsx
│   │   │   ├── Orders.jsx
│   │   │   ├── ProductDetail.jsx
│   │   │   └── Register.jsx
│   │   ├── services/
│   │   │   └── api.js               ← Axios instance + JWT
│   │   ├── App.jsx                  ← Routes
│   │   ├── index.css                ← Global styles
│   │   └── main.jsx                 ← Entry point
│   ├── index.html
│   ├── package.json
│   └── vite.config.js               ← Proxy to backend
├── screenshots/                      ← Add your screenshots here
├── package.json                      ← Root scripts
└── README.md
```

---

##  Available Scripts

Run from the project root:

| Command                | What it does                                    |
|------------------------|-------------------------------------------------|
| `npm run install-all`  | Install deps for root, backend, frontend        |
| `npm run dev`          | Run backend + frontend concurrently             |
| `npm run backend`      | Run backend only (production mode)              |
| `npm run backend:dev`  | Run backend only (with nodemon hot reload)      |
| `npm run frontend`     | Run frontend only                                |
| `npm run seed`         | Reset DB and import sample data                  |

---

##  Architecture Overview

```
   ┌───────────────────────┐         ┌──────────────────────┐
   │   React (Vite) :5173  │ ◄─────► │ Express API :5000    │
   │  - Routing            │  HTTP   │ - JWT auth           │
   │  - Context (Auth/Cart)│  Axios  │ - Mongoose models    │
   │  - Pages + Components │         │ - Role middleware    │
   └───────────────────────┘         └──────────┬───────────┘
                                                │
                                                ▼
                                     ┌──────────────────────┐
                                     │ MongoDB              │
                                     │ - users              │
                                     │ - products           │
                                     │ - orders             │
                                     └──────────────────────┘
```

### Authentication flow

1. User submits credentials → backend validates → returns JWT
2. Token stored in `localStorage` under `userInfo`
3. Axios interceptor attaches `Authorization: Bearer <token>` to every request
4. Backend `protect` middleware verifies the token and loads the user
5. `admin` middleware adds the role check on top for admin-only routes

### Frontend state management

- **AuthContext** — current user, login, register, logout
- **CartContext** — cart items, shipping address, totals (synced to `localStorage`)
- Page-level state managed with `useState` / `useEffect` and Axios calls

---

##  Troubleshooting

| Problem                                | Solution                                                         |
|----------------------------------------|------------------------------------------------------------------|
| `MongoDB connection error`             | Make sure MongoDB is running, or verify your Atlas URI           |
| `Port 5000 already in use`             | Change `PORT` in `backend/.env`                                  |
| Frontend shows "Network Error"         | Confirm backend is running on port 5000                          |
| `401 Not authorized, no token`         | Login again — token may have expired                             |
| Seeder fails                           | Make sure `MONGO_URI` is correct in `.env`                       |
| `bcrypt` install errors on Windows     | Use `bcryptjs` (already used here, no native compile required)   |

---

##  Deployment Notes (optional)

- **Backend** — deploy to Render / Railway / Heroku. Set the same env vars.
- **Frontend** — `npm run build` produces `frontend/dist/` which can be hosted on Vercel, Netlify, or served statically by Express.
- **Database** — use MongoDB Atlas free tier in production.
- Update `CLIENT_URL` in backend `.env` to the deployed frontend URL.

---


##  Author

Built as a full-stack MERN assignment demonstrating the complete cycle of authentication, REST API design, state management, and role-based access control.
