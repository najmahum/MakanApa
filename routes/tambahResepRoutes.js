// routes/tambahResepRoutes.js
import express from 'express'
import { tambahResep } from '../controllers/tambahResepController.js'
import { authMiddleware } from '../middleware/authMiddleware.js'

const router = express.Router()

router.post('/tambah', authMiddleware, tambahResep)

export default router
