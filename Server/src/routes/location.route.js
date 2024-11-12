// routes/location.route.js
import express from 'express';
import {
    createLocation,
    getLocations,
    getLocation,
    updateLocation,
    deleteLocation
} from '../controllers/location.controller.js';
import { protect, authorize } from '../middleware/auth.middleware.js';

const router = express.Router();

// All routes need authentication
router.use(protect);

router.route('/')
    .get(getLocations)
    .post(authorize('admin'), createLocation);

router.route('/:id')
    .get(getLocation)
    .put(authorize('admin'), updateLocation)
    .delete(authorize('admin'), deleteLocation);

export default router;