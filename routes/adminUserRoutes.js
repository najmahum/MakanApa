import express from 'express';
import { getAllUsers, updateUserStatus, getUserStats } from '../controllers/adminUserController.js';

const router = express.Router();

router.get('/stats', getUserStats);             // GET Statistik User
router.get('/', getAllUsers);                   // GET List User (?status=active)
router.put('/:id_user/status', updateUserStatus); // PUT Update Status (Blokir)

export default router;