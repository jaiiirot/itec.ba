import { Router } from "express";
import {
  getCourses,
  getCourseById,
  createCourse, // 🔴 Cambiado de addCourse a createCourse
  updateCourse,
  deleteCourse,
} from "../controllers/courseController.js";

const router = Router();

// Rutas públicas
router.get("/", getCourses);
router.get("/:id", getCourseById);

// Rutas protegidas (Idealmente aquí iría tu middleware de Auth para Admins)
router.post("/", createCourse); // 🔴 Actualizado
router.put("/:id", updateCourse);
router.delete("/:id", deleteCourse);

export default router;
