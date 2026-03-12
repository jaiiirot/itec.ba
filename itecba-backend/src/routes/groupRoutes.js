import express from "express";
import {
  getApprovedGroups,
  getPendingGroups,
  createGroup,
  approveGroup,
  deleteGroup,
} from "../controllers/groupController.js";
import { verifyToken, requireAdmin } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/approved", getApprovedGroups);
router.post("/", verifyToken, createGroup);
router.get("/pending", verifyToken, requireAdmin, getPendingGroups);
router.patch("/:id/approve", verifyToken, requireAdmin, approveGroup);
router.delete("/:id", verifyToken, requireAdmin, deleteGroup);

export default router;
