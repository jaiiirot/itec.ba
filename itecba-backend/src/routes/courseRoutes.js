import express from "express";
// 1. Añade fetchPlaylistData a la importación
import {
  getCourses,
  getCourseById,
  addCourse,
  deleteCourse,
  fetchPlaylistData,
} from "../controllers/courseController.js";
import { verifyToken, requireAdmin } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/", getCourses);
router.get("/:id", getCourseById);

// 2. AÑADE ESTA RUTA ANTES DEL POST '/' PARA EVITAR CONFLICTOS
router.post("/fetch-playlist", verifyToken, requireAdmin, fetchPlaylistData);

router.post("/", verifyToken, requireAdmin, addCourse);
router.delete("/:id", verifyToken, requireAdmin, deleteCourse);

export default router;
