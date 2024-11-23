// routes/location.route.js
import express from 'express';
import {
    createLocation, 
    getAllLocations, 
    getLocationById,
    updateLocation, 
    deleteLocation
 } from '../controllers/location.controller.js';
import { locationValidation } from '../middlewares/validation.middleware.js';
import { verifyToken, authorize } from '../middlewares/verifyToken.middleware.js';
const router = express.Router();

router.get('/' , verifyToken,getAllLocations)
router.post('/', 
     verifyToken,
     authorize('admin'),
     createLocation);

router.route('/:id')
     .get(verifyToken,getLocationById)
     .put(verifyToken,authorize('admin'), updateLocation)
     .delete(verifyToken,authorize('admin'),deleteLocation);

export default router;