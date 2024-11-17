// routes/alert.route.js
import express from 'express';
import {
    getAlerts,
    updateAlertStatus
} from '../controllers/alert.controller.js';

const router = express.Router();

router.route('/')
    .get(getAlerts);

router.route('/:id/status')
    .patch(updateAlertStatus);

export default router;