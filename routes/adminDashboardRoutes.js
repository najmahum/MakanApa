import express from 'express';
import { getVisitorStats } from '../controllers/adminDashboardController.js';
// import { verifyToken, verifyAdmin } from '../middleware/authMiddleware.js'; // Nanti dipasang

const router = express.Router();

// GET /api/admin/dashboard/stats?period=last_week
router.get('/stats', getVisitorStats);

export default router;