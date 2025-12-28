// routes/cariTempatRoutes.js
import express from "express";
import { cariTempatMakan } from "../controllers/cariTempatController.js";

const router = express.Router();

// GET /api/tempatmakan/cari
// Contoh call: /api/tempatmakan/cari?query=Bakso&lat=-7.56&lng=110.82&jarak=1
router.get("/cari", cariTempatMakan);

export default router;