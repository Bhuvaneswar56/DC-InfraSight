// routes/alert.route.js
import express from 'express';
import {
    getAlerts,
    getAlertById,
    getAlertsByEquipment,
    updateAlertStatus
} from '../controllers/alert.controller.js';

const router = express.Router();

router.get('/',getAlerts)

router.put('/:id/status', updateAlertStatus)

router.get('/:id',getAlertById)

router.get('/equipment/:equipmentId',getAlertsByEquipment)


export default router;