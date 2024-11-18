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
            type: String,
            enum: ['Maintenance','Alert','Incident Management'],
            required: true
        },
        title: {
            type: String,
            required: true
        }
    },
    {
        timestamps: true
    }
);

notificationSchema.post('save', (doc, next) => {
    console.log("-----------Running after saving to db(notification)")
    console.log(doc)
    console.log("------------------------------");
    next()
})

export default mongoose.model('Notification', notificationSchema, 'notifications');
