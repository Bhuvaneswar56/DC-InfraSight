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
router.post('/create',
    verifyToken,
    createMaintenance
);

router.delete('/cancel/:maintenanceId',
    verifyToken,
    cancelMaintenance
);

router.patch('/reschedule/:maintenanceId',
    verifyToken,
    rescheduleMaintenance
);

router.patch('/update/:maintenanceId',
    verifyToken,
    updateMaintenanceStatus
);

router.get('/equipmentId/:equipId',
    verifyToken,
    getMaintenanceByEquipId
);

router.get('/maintenanceId/:maintenanceId',
    verifyToken,
    getMaintenanceById
);

router.get('/all',
    verifyToken,
    getAllMaintenance
);
export default router;