import mongoose from 'mongoose';

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

export default mongoose.model('Alert', alertSchema, 'alerts');