# Aharyas

Aharyas is a full-stack e-commerce platform built on the MERN stack. It provides a complete shopping experience — product discovery, cart management, order tracking, and coupon support — alongside a full admin dashboard for catalog and business operations.

---

Live Demo  
[aharyas](https://aharyas.com)

---

## Features

### Storefront
- Product browsing, search, and filtering
- Add to cart, checkout, and order placement
- Order history and status tracking
- Coupon and discount code support

### Authentication
- Email and password sign-up and login
- JWT-based access and refresh token flow
- Role-based access control (customer / admin)

### Admin Dashboard
- Full CRUD for products and categories
- Order and user management
- Analytics and stats panels

### Media
- Cloud-based image uploads and asset management via Cloudinary

---

## Tech Stack

| Layer          | Technology                   |
| -------------- | ---------------------------- |
| Frontend       | React, Vite, Tailwind CSS    |
| Backend        | Node.js, Express             |
| Database       | MongoDB Atlas                |
| Cloud Storage  | Cloudinary                   |
| Authentication | JWT (access + refresh tokens)|

---

## Getting Started

### Prerequisites
- Node.js 18+
- MongoDB Atlas connection string
- Cloudinary account credentials

### Backend

```bash
cd backend
npm install
```

Copy `.env.example` to `.env` and fill in your values:

```env
MONGODB_URI=
JWT_SECRET=
JWT_REFRESH_SECRET=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

```bash
npm run dev
```

### Frontend

```bash
cd frontend
npm install
```

Add environment variables to `.env`:

```env
VITE_API_BASE_URL=
```

```bash
npm run dev
```

---

## Project Structure

```
aharya/
├── backend/        → Express API, routes, models, middleware
├── frontend/       → React app, components, pages
├── .env.example    → Required environment variable keys
└── README.md
```

---

## Environment Variables

All required keys are listed in `.env.example`. Never commit `.env` files — they are excluded via `.gitignore`.

---

## License

Proprietary. All rights reserved. This codebase is not open for public use, redistribution, or modification without explicit written permission from Aharyas.
