import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema(
    {
        equip_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Equipment',
            required: true
        },
        content: {
            type: String,
            required: true
        },
        type: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Maintenance',
            required: true
        },
        title: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Maintenance',
            required: true
        }
    },
    {
        timestamps: true
    }
);

export default mongoose.model('Notification', notificationSchema, 'notification');
