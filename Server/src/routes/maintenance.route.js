// routes/equipment.route.js
import express from 'express';
import {
    createMaintenance
} from '../controllers/maintenance.controller.js';
import { verifyToken, authorize } from '../middlewares/verifyToken.middleware.js';

const router = express.Router();

// router.use(protect);


// router.get('/:id/metrics', getEquipmentMetrics);

// Admin only routes
router.post('/',
    verifyToken,
    authorize('admin'),
    createMaintenance
);


export default router;