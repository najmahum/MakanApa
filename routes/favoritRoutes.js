import express from "express";
import { 
  tambahFavorit, 
  hapusFavorit, 
  getFavoritUser 
} from "../controllers/favoritController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

// Semua route di bawah ini harus Login dulu
router.use(authMiddleware);

// GET /api/favorit -> Lihat semua favorit saya
router.get("/", getFavoritUser);

// POST /api/favorit -> Tambah favorit (Body: { "id_resep": 123 })
router.post("/", tambahFavorit);

// DELETE /api/favorit/:id_resep -> Hapus favorit berdasarkan ID Resep
router.delete("/:id_resep", hapusFavorit);

export default router;