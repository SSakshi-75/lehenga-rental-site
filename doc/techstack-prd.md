# ⚙️ Tech Stack - Lehenga Rental App (MERN)

## 🧱 Architecture
- Frontend + Backend separated
- REST API based communication

---

## 💻 Frontend
- React (Vite)
- Tailwind CSS
- Axios (API calls)
- React Router DOM

### Folder Structure (Frontend)

client/
│── src/
│   ├── components/
│   ├── pages/
│   ├── services/ (API)
│   ├── context/
│   ├── hooks/
│   ├── utils/
│   ├── App.jsx
│   └── main.jsx

---

## 🖥 Backend
- Node.js
- Express.js
- MongoDB (Mongoose)
- JWT Authentication
- Cookie-parser

---

## 📁 Backend Folder Structure

server/
│── config/
│   └── db.js
│
│── controllers/
│   ├── auth.controller.js
│   ├── product.controller.js
│   └── order.controller.js
│
│── models/
│   ├── user.model.js
│   ├── product.model.js
│   └── order.model.js
│
│── routes/
│   ├── auth.routes.js
│   ├── product.routes.js
│   └── order.routes.js
│
│── middleware/
│   └── authMiddleware.js
│
│── utils/
│   └── generateToken.js
│
│── app.js
│── server.js
│── .env

---

## 🚀 Server Setup (npx create-server style)

```bash
mkdir server
cd server
npm init -y
npm install express mongoose dotenv cors cookie-parser jsonwebtoken bcryptjs