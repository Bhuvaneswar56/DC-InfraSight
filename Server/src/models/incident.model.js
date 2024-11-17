import mongoose from 'mongoose';

const incidentSchema = new mongoose.Schema({
    title: { 
        type: String, 
        required: true 
    },
    description: String,
    relatedAlert: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Alert' 
    },
    equipment: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Equipment' 
    },
    priority: { 
        type: String, 
        enum: ['low', 'medium', 'high', 'critical'], 
        required: true 
    },
    status: { 
        type: String, 
        enum: ['open', 'inProgress', 'resolved', 'closed'], 
        default: 'open' 
    },
    timeline: [{ 
        action: String, 
        performedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, 
        timestamp: Date, 
        notes: String 
    }],
    comments: [{ 
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, 
        message: String, 
        timestamp: Date 
    }],
}, {timestamps: true});


// // Pre-hook for updates (to add to the timeline)
// incidentSchema.pre('findOneAndUpdate', async function(next) {
//     const update = this.getUpdate();
//     if (update.priority || update.status) {
//         const changes = [];
//         if (update.priority) changes.push(`Priority updated to ${update.priority}`);
//         if (update.status) changes.push(`Status updated to ${update.status}`);

//         update.$push = update.$push || {};
//         update.$push.timeline = {
//             action: changes.join(', '),
//             performedBy: update.performedBy || null,  // Pass the user ID, if applicable
//             timestamp: new Date(),
//             notes: 'Automated system update'
//         };
//     }
//     next();
// });

// Post-save hook for actions after incident is saved
incidentSchema.post('save', function(doc) {
    if (doc.priority === 'critical') {
        console.log(`Critical incident created: ${doc.title}`);
        // Trigger notifications, etc.
    }
});

// Post-update hook for actions after an incident update
incidentSchema.post('findOneAndUpdate', async function(doc) {
    if (doc.priority === 'critical') {
        console.log(`Critical incident updated: ${doc.title}`);
        // Trigger notifications, etc.
    }
});

export default mongoose.model('Incident', incidentSchema, 'incidents');
