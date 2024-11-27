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
        notes: {
            type: Array,
            default: [
                // {remark: '', user: '', time: Date}
            ]
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
