import mongoose from 'mongoose';

const maintenanceSchema = new mongoose.Schema(
    {
        user_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        equip_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Equipment',
            required: true
        },
        title: {
            type: String,
            required: true
        },
        description: {
            type: String
        },
        type: {
            type: String,
            required: true
        },
        status: {
            type: String,
            enum: ['scheduled', 'in-progress', 'completed', 'canceled'],
            default: 'scheduled'
        },
        scheduled: {
            type: Date,
            required: true
        },
        completed: {
            type: Date
        }
    },
    {
        timestamps: true
    }
);

export default mongoose.model('Maintenance', maintenanceSchema, 'maintenances');
