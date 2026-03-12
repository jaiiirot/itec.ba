import express from "express";
import {
  getLinks,
  createLink,
  updateLink,
  deleteLink,
} from "../controllers/linksController.js";
import { verifyToken, requireAdmin } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Público
router.get("/", getLinks);

// Solo Admins (Protegido por el middleware de Firebase)
router.post("/", verifyToken, requireAdmin, createLink);
router.put("/:id", verifyToken, requireAdmin, updateLink);
router.delete("/:id", verifyToken, requireAdmin, deleteLink);

export default router;
