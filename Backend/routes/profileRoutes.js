import express from 'express';
import { getProfile, updateProfile } from '../controllers/profileController.js';
// import { verifyToken } from '../middleware/authMiddleware.js'; // Nanti aktifkan ini

const router = express.Router();

// Disini saya pakai parameter :id_user biar kamu gampang ngetesnya di Postman
// Nanti kalau Auth sudah jalan, :id_user ini dihapus dan ambil otomatis dari Token

// GET /api/profile/:id_user (Lihat Profile)
router.get('/:id_user', getProfile);

// PUT /api/profile/:id_user (Edit Profile & Ganti Password)
router.put('/:id_user', updateProfile);

export default router;