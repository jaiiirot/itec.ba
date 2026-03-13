import { Router } from "express";
import {
  getActiveAnnouncement,
  createAnnouncement,
  deactivateAnnouncement,
} from "../controllers/announcementController.js";

const router = Router();

router.get("/active", getActiveAnnouncement);
router.post("/", createAnnouncement);
router.put("/:id/deactivate", deactivateAnnouncement);

export default router;
