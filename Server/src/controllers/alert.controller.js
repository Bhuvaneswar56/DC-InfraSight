// controllers/alert.controller.js
import alertModel from '../models/alert.model.js';
import ApiResponse from '../utils/ApiResponse.js';
import { ApiError } from '../utils/ApiError.js';
import asyncHandler from '../utils/asyncHandler.js'

const getAlerts = asyncHandler(async (req, res) => {

    const alerts = await alertModel.find()
        .sort({ timestamp: -1 })
        .populate('metrics_id');

    res.status(200).json(new ApiResponse(200, "Alerts fetch successful", alerts));
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
    updateAlertStatus
};