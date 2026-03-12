import express from "express";
import {
  getApprovedResources,
  getPendingResources,
  createResource,
  approveResource,
  deleteResource,
} from "../controllers/resourceController.js";
import { verifyToken, requireAdmin } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/approved", getApprovedResources);
router.post("/", verifyToken, createResource);

// Rutas de Admin
router.get("/pending", verifyToken, requireAdmin, getPendingResources);
router.patch("/:id/approve", verifyToken, requireAdmin, approveResource);
router.delete("/:id", verifyToken, requireAdmin, deleteResource);

export default router;
