
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
    import cluster from "cluster";
    import path from "path";
    import os from "os";

    config();

    const PORT = process.env.PORT || 5000;
    const numCPUs = os.cpus().length;

    if (cluster.isPrimary) {
      console.log("Master process running:", process.pid);

      for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
      }

      cluster.on("exit", (worker) => {
        console.log("Worker died:", worker.process.pid);
        cluster.fork();
      });

    } else {

    const app = express();

    app.use(cors({ origin: "*", credentials: true }));
    
    app.use(compression());
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(cookieParser());
    app.use(morgan("dev"));

    app.get("/", (req, res) => {
      res.send("Welcome to Auto Generated Backend!");
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
    });

    }
    