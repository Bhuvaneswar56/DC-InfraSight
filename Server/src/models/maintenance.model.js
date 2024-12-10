import mongoose from 'mongoose';
import notificationModel from './notification.model.js'

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
            enum: ['preventive', 'corrective'],
            required: true
        },
        priority: {
            type: String,
            enum: ['critical', 'high', 'medium', 'low'],
            required: true
        },
        status: {
            type: String,
            enum: ['scheduled', 'in-progress', 'completed', 'canceled'],
            default: 'scheduled'
        },
        // notes: {
        //     type: Array,
        //     default: [
        //         // {remark: '', username: '', time: Date}
        //     ]
        // },
        notes: [
            {
                remark: { type: String },
                user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Single user reference
                time: { type: Date }
            }
        ],      
        notesLastUpdatedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            default: null,
        },
        notesLastUpdatedAt: {
            type: Date, // Stores the last update date
            default: null,
        },
        tasks: {
            type: Array,
            default: [
                { task: 'Inspect server hardware', status: 'pending', time: '' },
                { task: 'Clean cooling fans', status: 'pending', time: '' },
                { task: 'Check power supply', status: 'pending', time: '' },
                { task: 'Test backup systems', status: 'pending', time: '' },
                { task: 'Update firmware', status: 'pending', time: '' },
                { task: 'Verify network connectivity', status: 'pending', time: '' }
            ]
        },
        tasksLastUpdatedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            default: null,
        },
        tasksLastUpdatedAt: {
            type: Date, // Stores the last update date
            default: null,
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
maintenanceSchema.post('save', async (doc, next) => {
    try {
        await notificationModel.create({
            equip_id: doc.equip_id,
            type: 'Maintenance',
            title: `New Maintenance: ${doc.title}`,
            content: doc.description || 'New maintenance scheduled'
        });
    } catch (error) {
        console.error("Error creating maintenance notification:", error);
    }
    next();
});

export default mongoose.model('Maintenance', maintenanceSchema, 'maintenances');
