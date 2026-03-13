import { Router } from "express";
import {
  getApprovedGroups,
  getPendingGroups,
  createGroup,
  approveGroup,
  deleteGroup,
} from "../controllers/groupController.js";

const router = Router();

router.get("/", getApprovedGroups);
router.get("/pending", getPendingGroups); // 🔒 Debería estar protegida por admin auth
router.post("/", createGroup);
router.put("/:id/approve", approveGroup); // 🔒 Debería estar protegida
router.delete("/:id", deleteGroup); // 🔒 Debería estar protegida

export default router;
