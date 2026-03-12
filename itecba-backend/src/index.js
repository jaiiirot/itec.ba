import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectMongo } from "./config/mongo.js";
import resourceRoutes from "./routes/resourceRoutes.js";
import groupRoutes from "./routes/groupRoutes.js";
// ... tus importaciones anteriores
import courseRoutes from "./routes/courseRoutes.js";
import announcementRoutes from "./routes/announcementRoutes.js";

dotenv.config();
const app = express();

// 🔴 AQUÍ ESTÁ LA MAGIA: Configuramos CORS explícitamente
app.use(
  cors({
    origin: ["http://localhost:5173", "http://127.0.0.1:5173"], // Permite que tu React entre
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"], // Permite todos los métodos
    allowedHeaders: ["Content-Type", "Authorization"], // Permite enviar el Token de Firebase
  }),
);

app.use(express.json());

// Conectar a MongoDB
connectMongo();

// MONTAR LAS APIS
app.use("/api/resources", resourceRoutes);
app.use("/api/groups", groupRoutes);
//
app.use("/api/resources", resourceRoutes);
app.use("/api/groups", groupRoutes);
//
app.use("/api/courses", courseRoutes);
app.use("/api/announcements", announcementRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Servidor backend corriendo en http://127.0.0.1:${PORT}`);
});
