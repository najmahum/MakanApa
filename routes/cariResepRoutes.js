import express from "express";
import { cariResep } from "../controllers/cariResepController.js";

const router = express.Router();

router.post("/resep/cari", cariResep);

export default router;
