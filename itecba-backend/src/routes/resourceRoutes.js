import { Router } from "express";
import {
  getApprovedResources,
  getPendingResources,
  createResource,
  approveResource,
  deleteResource,
} from "../controllers/resourceController.js";

const router = Router();

router.get("/", getApprovedResources);
router.get("/pending", getPendingResources);
router.post("/", createResource);
router.put("/:id/approve", approveResource);
router.delete("/:id", deleteResource);

export default router;
