import express from "express";
import {
  getActiveAnnouncements,
  createAnnouncement,
  deleteAnnouncement,
} from "../controllers/announcementController.js";
import { verifyToken, requireAdmin } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Públicas
router.get("/active", getActiveAnnouncements);

// Solo Admins
router.post("/", verifyToken, requireAdmin, createAnnouncement);
router.delete("/:id", verifyToken, requireAdmin, deleteAnnouncement);

export default router;
