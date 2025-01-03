import express from 'express'
import userRoutes from '../routes/user.route.js'
import locationRoutes from '../routes/location.route.js';
import equipmentRoutes from '../routes/equipment.route.js';
import incidentRoutes from '../routes/incident.route.js'
import websocketRoutes from '../routes/websocket.route.js';
import maintenanceRoutes from '../routes/maintenance.route.js'
import alertRoutes from '../routes/alert.route.js'
import notificationRoutes from '../routes/notification.route.js'

const router = express.Router()

router.use('/user', userRoutes);
router.use('/location', locationRoutes);
router.use('/equipment', equipmentRoutes);
router.use('/incident', incidentRoutes)
router.use('/websocket', websocketRoutes)
router.use('/maintenance',maintenanceRoutes)
router.use('/alerts',alertRoutes)
router.use('/notifications', notificationRoutes)


export default router;
