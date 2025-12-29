import express from 'express';
import { getVisitorStats } from '../controllers/adminDashboardController.js';

const router = express.Router();

// GET /api/admin/dashboard/stats?period=last_week
router.get('/stats', getVisitorStats);

console.log('✅ Admin Dashboard Routes loaded');

export default router;