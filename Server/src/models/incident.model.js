import mongoose from 'mongoose';
import notificationModel from './notification.model.js'

// Function to generate random incident number
function generateIncidentNumber() {
    const randomNum = Math.floor(100000 + Math.random() * 900000); // Generates a 6-digit random number
    return `INC${randomNum}`;
}

const incidentSchema = new mongoose.Schema({
    incidentNumber: { 
        type: String, 
        unique: true, 
        default: generateIncidentNumber 
    }, // Unique incident number
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
}, { timestamps: true });

// Pre-save hook to ensure unique `incidentNumber`
incidentSchema.pre('save', async function(next) {
    if (!this.incidentNumber) {
        let unique = false;
        while (!unique) {
            const newIncidentNumber = generateIncidentNumber();
            const existing = await mongoose.models.Incident.findOne({ incidentNumber: newIncidentNumber });
            if (!existing) {
                this.incidentNumber = newIncidentNumber;
                unique = true;
            }
        }
    }
    next();
});

incidentSchema.post('save', async (doc, next) => {
    try {
        await notificationModel.create({
            equip_id: doc.equipment_id,
            type: 'Incident Management',
            title: `New Incident: ${doc.title}`,
            content: doc.description
        });
    } catch (error) {
        console.error("Error creating incident notification:", error);
    }
    next();
});

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
