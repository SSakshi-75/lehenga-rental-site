import express from "express";
import { config } from "dotenv";
import compression from "compression";
import cookieParser from "cookie-parser";
import Db from "./src/database/Db.js";
import cors from "cors";
import morgan from "morgan";
import authRoutes from "./src/routes/auth.routes.js";
import productRoutes from "./src/routes/product.routes.js";
import orderRoutes from "./src/routes/order.routes.js";
import adminRoutes from "./src/routes/admin.routes.js";
import userRoutes from "./src/routes/user.routes.js";
import uploadRoutes from "./src/routes/upload.routes.js";
import contentRoutes from "./src/routes/content.routes.js";
import path from "path";

config();

const PORT = process.env.PORT || 5000;
const app = express();

app.use(cors({
  origin: "https://lehenga-rental-site.vercel.app/", credentials: true, methods: ["GET", "POST", "PUT", "PATCH", "DELETE"], allowedHeaders: ["Content - Type", "Authorization"]
}));

app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan("dev"));

app.get("/", (req, res) => {
  res.send("Welcome to RANI Luxury Rental API!");
});

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/users", userRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/content", contentRoutes);

const __dirname = path.resolve();
app.use("/uploads", express.static(path.join(__dirname, "/uploads")));

Db().then(() => {
  app.listen(PORT, () =>
    console.log("🚀 Server running at http://localhost:" + PORT)
  );
}).catch(err => {
  console.error("Failed to connect to database", err);
  process.exit(1);
});