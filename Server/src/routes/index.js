import express from 'express'
import authRoutes from '../routes/auth.route.js'
import locationRoutes from '../routes/location.route.js';
import equipmentRoutes from '../routes/equipment.route.js';
import incidentRoutes from '../routes/incident.route.js'

const router = express.Router()

router.use('/auth', authRoutes);
router.use('/locations', locationRoutes);
router.use('/equipment', equipmentRoutes);
router.use('/incident', incidentRoutes)

export default router;
