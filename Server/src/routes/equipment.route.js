// routes/equipment.route.js
import express from 'express';
import {
    createEquipment,
    getAllEquipments,
    getEquipmentById,
    getEquipmentsByLocation,
    // updateEquipment,
    updateEquipmentStatus,
    deleteEquipment,
    // getEquipmentMetrics
} from '../controllers/equipment.controller.js';
import { verifyToken, authorize } from '../middlewares/verifyToken.middleware.js';

const router = express.Router();

// router.use(protect);

// Public routes (for authenticated users)
router.get('/', 
    verifyToken,
    getAllEquipments
);

router.get('/:equipmentId', 
    verifyToken,
    getEquipmentById
);

router.get('/location/:locationId',
    verifyToken,
    getEquipmentsByLocation
);

// router.get('/:id/metrics', getEquipmentMetrics);

// Admin only routes
router.post('/',
    verifyToken,
    authorize('admin'),
    createEquipment
);

// router.put('/:id', authorize('admin'), updateEquipment);

router.patch('/:equipmentId/status', 
    verifyToken,
    authorize('admin'), 
    updateEquipmentStatus
);

router.delete('/:equipmentId',
    verifyToken,
    authorize('admin'), 
    deleteEquipment
);

export default router;