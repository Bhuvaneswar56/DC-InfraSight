// controllers/alert.controller.js
import Alert from '../models/alert.model.js';

export const getAlerts = async (req, res, next) => {
    try {
        const alerts = await Alert.find()
            .sort({ timestamp: -1 })
            .populate('metrics_id');
            
        res.status(200).json({
            success: true,
            data: alerts
        });
    } catch (error) {
        next(error);
    }
};

export const updateAlertStatus = async (req, res, next) => {
    try {
        const { status } = req.body;
        const alert = await Alert.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        );

        if (!alert) {
            return next(createError(404, "Alert not found"));
        }

        res.status(200).json({
            success: true,
            data: alert
        });
    } catch (error) {
        next(error);
    }
};

// Add other alert-related controllers