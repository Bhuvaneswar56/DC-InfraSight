// routes/location.route.js
import express from 'express';
import {
    createLocation, 
    getAllLocations, 
    getLocationById,
    updateLocation, 
    deleteLocation
 } from '../controllers/location.controller.js';
//  import { protect, authorize } from '../middleware/auth.middleware.js';
import { verifyToken } from '../middlewares/verifyToken.middleware.js';
const router = express.Router();

// All routes need authentication
//  router.use(protect);

router.route('/')
    .get(verifyToken,getAllLocations)
    .post(verifyToken,createLocation);

    router.route('/:id')
     .get(verifyToken,getLocationById)
     .put(verifyToken, updateLocation)
     .delete(verifyToken,deleteLocation);

export default router;