// routes/equipment.route.js
import express from 'express';
import {
    createEquipment,
    getAllEquipment,
    getEquipmentById,
    getEquipmentByLocation,
    updateEquipment,
    updateEquipmentStatus,
    deleteEquipment,
    getEquipmentMetrics
} from '../controllers/equipment.controller.js';
import { protect, authorize } from '../middleware/auth.middleware.js';

const router = express.Router();

router.use(protect);

// Public routes (for authenticated users)
router.get('/', getAllEquipment);
router.get('/:id', getEquipmentById);
router.get('/location/:locationId', getEquipmentByLocation);
router.get('/:id/metrics', getEquipmentMetrics);

// Admin only routes
router.post('/', authorize('admin'), createEquipment);
router.put('/:id', authorize('admin'), updateEquipment);
router.patch('/:id/status', authorize('admin'), updateEquipmentStatus);
router.delete('/:id', authorize('admin'), deleteEquipment);

export default router;