import { Router } from "express";
import {
  getLinks,
  createLink,
  updateLink,
  deleteLink,
} from "../controllers/linksController.js";

const router = Router();

router.get("/", getLinks);
router.post("/", createLink);
router.put("/:id", updateLink);
router.delete("/:id", deleteLink);

export default router;
