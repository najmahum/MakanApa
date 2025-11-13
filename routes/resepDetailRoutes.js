import express from "express";
import { getDetailResep } from "../controllers/resepDetailController.js";

const router = express.Router();

// Contoh endpoint: GET /api/resep/12
router.get("/resep/:id", getDetailResep);

export default router;
