// models/location.model.js
import mongoose from "mongoose";

const locationSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Location name is required"],
        unique: true,
        trim: true
    },
    type: {
        type: String,
        enum: ['dataHall', 'powerRoom', 'coolingPlant'],
        required: true
    },
    floor: {
        type: String,
        required: true
    },
    building: {
        type: String,
        required: true
    },
    capacity: {
        power: {
            type: Number,
            required: true
        },
        cooling: {
            type: Number,
            required: true
        },
        totalRacks: {
            type: Number,
            required: true
        }
    },
    status: {
        type: String,
        enum: ['active', 'maintenance', 'inactive'],
        default: 'active'
    }
}, { timestamps: true });

export default mongoose.model('Location', locationSchema);