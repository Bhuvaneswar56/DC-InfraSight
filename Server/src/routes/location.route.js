// routes/location.route.js
import express from 'express';
import {
    createLocation, 
    getAllLocations, 
    getLocationById,
    updateLocation, 
    deleteLocation
 } from '../controllers/location.controller.js';

import { verifyToken, authorize } from '../middlewares/verifyToken.middleware.js';
const router = express.Router();

// All routes need authentication
//  router.use(protect);

router.route('/')
    .get(verifyToken,getAllLocations)
    .post(verifyToken ,authorize('admin'),createLocation);

    router.route('/:id')
     .get(verifyToken,getLocationById)
     .put(verifyToken,authorize('admin'), updateLocation)
     .delete(verifyToken,authorize('admin'),deleteLocation);

export default router;