import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import admin from "firebase-admin";
import { readFileSync } from "fs";

import productRoutes from "./routes/products.js";
import categoryRoutes from "./routes/categories.js";
import logRoutes from "./routes/logs.js";
import chatRoutes from "./routes/chat.js";

const app = express();
app.use(cors());
app.use(bodyParser.json());

// 🔥 Khởi tạo Firebase Admin SDK
const serviceAccount = JSON.parse(
  readFileSync("./firebase/serviceAccountKey.json", "utf-8")
);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});
const db = admin.firestore();

// Cho phép truy cập db trong các route
app.use((req, res, next) => {
  req.db = db;
  req.admin = admin;
  next();
});

// Đăng ký các route
app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/logs", logRoutes);
app.use("/api/chats", chatRoutes);

// Route mặc định
app.get("/", (req, res) => {
  res.send("🚀 Warehouse API Server is running...");
});

// Khởi động server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () =>
  console.log(`✅ API running on http://localhost:${PORT}`)
);
