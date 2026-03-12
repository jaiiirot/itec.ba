import express from "express";
import {
  getCourses,
  getCourseById,
  addCourse,
  deleteCourse,
} from "../controllers/courseController.js";
import { verifyToken, requireAdmin } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Públicas
router.get("/", getCourses);
router.get("/:id", getCourseById);

// Solo Admins
router.post("/", verifyToken, requireAdmin, addCourse);
router.delete("/:id", verifyToken, requireAdmin, deleteCourse);

export default router;
