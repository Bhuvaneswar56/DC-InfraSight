import express from 'express'
import { createIncident,updateIncident, getAllIncidents,getIncidentById} from '../controllers/incident.controller.js'
import { verifyToken } from '../middlewares/verifyToken.middleware.js';
import { handleValidationErrors } from '../middlewares/validation.middleware.js';

const router = express.Router()

router.post('/', verifyToken,handleValidationErrors, createIncident)
router.put('/:id', verifyToken, updateIncident)
router.get('/', verifyToken, getAllIncidents)
router.get('/:id', verifyToken, getIncidentById)

export default router;