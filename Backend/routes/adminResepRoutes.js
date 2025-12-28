import express from 'express';
import { getAllResepAdmin, getResepDetailAdmin, updateResepStatus } from '../controllers/adminResepController.js';

const router = express.Router();

router.get('/', getAllResepAdmin);              // GET List Resep (?status=waiting)
router.get('/:id_resep', getResepDetailAdmin);  // GET Detail Resep
router.put('/:id_resep/status', updateResepStatus); // PUT Approve/Reject

export default router;