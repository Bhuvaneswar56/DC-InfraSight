// routes/equipment.route.js
import express from 'express';
import {
    createMaintenance,
    cancelMaintenance,
    rescheduleMaintenance,
    updateMaintenanceStatus,
    updateMaintenanceTask,
    updateMaintenanceNotes,
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

router.put('/update/task/:maintenanceId',
    verifyToken,
    updateMaintenanceTask
);

router.post('/update/note/:maintenanceId',
    verifyToken,
    updateMaintenanceNotes
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