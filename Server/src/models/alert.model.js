import mongoose from 'mongoose';
import notificationModel from './notification.model.js'

const alertSchema = new mongoose.Schema({
    metrics_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Metric',
        required: true
    },
    equipment_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Equipment',
        required: true
    },
    type: {
        type: String,
        required: true
    },
    priority: {
        type: String,
        enum: ['warning', 'critical'],
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: String,
    status: {
        type: String,
        enum: ['active', 'acknowledged', 'resolved'],
        default: 'active'
    }
}, { 
    timestamps: true,
});

alertSchema.post('save', async (doc, next) => {
    try {
        await notificationModel.create({
            equip_id: doc.equipment_id,
            type: 'Alert',
            title: doc.title,
            content: doc.description
        });
    } catch (error) {
        console.error("Error creating alert notification:", error);
    }
    next();
});

export default mongoose.model('Alert', alertSchema, 'alerts');