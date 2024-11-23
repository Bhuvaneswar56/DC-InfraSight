// controllers/alert.controller.js
import alertModel from '../models/alert.model.js';
import {ApiResponse} from '../utils/ApiResponse.js';
import { ApiError } from '../utils/ApiError.js';
import {asyncHandler} from '../utils/asyncHandler.js'

const getAlerts = asyncHandler(async (req, res) => {
    console.log('Fetching alerts from database...');
    const alerts = await alertModel.find()
        .sort({ timestamp: -1 })
        .populate('metrics_id');
        
    console.log('Found alerts:', alerts);
    res.status(200).json(new ApiResponse(200, "Alerts fetch successful", alerts));
});

const getAlertById = asyncHandler(async (req, res) => {
    const alert = await alertModel.findById(req.params.id)
        .populate('metrics_id');
    
    if (!alert) {
        throw new ApiError(404, "Alert not found");
    }

    res.status(200).json(new ApiResponse(200, "Alert fetch successful", alert));
});

const getAlertsByEquipment = asyncHandler(async (req, res) => {
    const { equipmentId } = req.params;
    
    const alerts = await alertModel.find({
        'metrics_id.equipmentId': equipmentId
    })
    .populate('metrics_id')
    .sort({ timestamp: -1 });

    res.status(200).json(new ApiResponse(200, "Equipment alerts fetch successful", alerts));
});

const updateAlertStatus = asyncHandler(async (req, res) => {

    const { status } = req.body;
    const alert = await alertModel.findByIdAndUpdate(req.params.id, { status }, { new: true });

    if (!alert) {
        throw new ApiError(404, "Alert not found");
    }

    res.status(200).json(new ApiResponse(200, "Update alert successful", alert));
});

// Add other alert-related controllers

export {
    getAlerts,
    getAlertById,
    getAlertsByEquipment,
    updateAlertStatus
};