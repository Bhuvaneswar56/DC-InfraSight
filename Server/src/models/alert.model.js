// models/alert.model.js
import mongoose from 'mongoose';

const alertSchema = new mongoose.Schema({
    _id: {
        type: String,
        default: () => new mongoose.Types.ObjectId().toString()
    },
    metrics_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Metric',
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
    _id: false  // Disable automatic _id generation
});

export default mongoose.model('Alert', alertSchema, 'alerts');