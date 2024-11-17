// routes/equipment.route.js
import express from 'express';
import {
    createMaintenance,
    cancelMaintenance,
    rescheduleMaintenance,
    updateMaintenanceStatus,
    getMaintenanceByEquipId,
    getMaintenanceById,
    getAllMaintenance
} from '../controllers/maintenance.controller.js';
import { verifyToken, authorize } from '../middlewares/verifyToken.middleware.js';

const router = express.Router();

// router.use(protect);


// router.get('/:id/metrics', getEquipmentMetrics);

// Admin only routes
router.post('/',
    verifyToken,
    createMaintenance
);

router.delete('/:maintenanceId',
    verifyToken,
    cancelMaintenance
);

router.post('/:maintenanceId',
    verifyToken,
    rescheduleMaintenance
);

router.post('/:maintenanceId',
    verifyToken,
    updateMaintenanceStatus
);

router.get('/:equipId',
    verifyToken,
    getMaintenanceByEquipId
);

router.get('/:maintenanceId',
    verifyToken,
    getMaintenanceById
);

router.get('/',
    verifyToken,
    getAllMaintenance
);
export default router;