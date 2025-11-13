import express from "express";
import { cariTempatMakan } from "../controllers/cariTempatController.js";

const router = express.Router();

// GET /api/tempatmakan/cari
router.get("/cari", cariTempatMakan);

export default router;
