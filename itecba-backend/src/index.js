import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectMongo } from "./config/mongo.js";

// Importación de rutas
import resourceRoutes from "./routes/resourceRoutes.js";
import groupRoutes from "./routes/groupRoutes.js";
import courseRoutes from "./routes/courseRoutes.js";
import announcementRoutes from "./routes/announcementRoutes.js";
import linksRoutes from "./routes/linksRoutes.js";

dotenv.config();
const app = express();

// Configuración estricta de CORS para tu frontend
app.use(
  cors({
    origin: ["http://localhost:5173", "http://127.0.0.1:5173"],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.use(express.json());

// Conexión a Base de Datos
connectMongo();

// Montaje de APIs (Una sola vez por cada entidad)
app.use("/api/resources", resourceRoutes);
app.use("/api/groups", groupRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/announcements", announcementRoutes);
app.use("/api/links", linksRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Servidor backend corriendo en http://127.0.0.1:${PORT}`);
});
