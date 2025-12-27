// routes/tambahResepRoutes.js
import express from 'express'
import { tambahResep, getResepSaya, editResep } from '../controllers/tambahResepController.js'
import { authMiddleware } from '../middleware/authMiddleware.js'

const router = express.Router()

// Route POST tambah resep
router.post('/tambah', authMiddleware, tambahResep)
router.get('/user', authMiddleware, getResepSaya)
router.put('/edit/:id', authMiddleware, editResep)

export default router