import express from 'express';
import {
    getAllNotifications,
    getNotificationCounts
} from '../controllers/notification.controller.js';
import { verifyToken } from '../middlewares/verifyToken.middleware.js';

const router = express.Router();

router.get('/', verifyToken, getAllNotifications);
router.get('/counts', verifyToken, getNotificationCounts);

export default router;