// models/equipment.model.js
import mongoose from "mongoose";

const equipmentSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Equipment name is required"],
            trim: true
        },
        serialNumber: {
            type: String,
            required: [true, "Serial number is required"],
            unique: true,
            trim: true
        },
        type: {
            type: String,
            enum: ['CRAH', 'UPS', 'PDU', 'Generator', 'Chiller', 'Server'],
            required: true
        },
        locationId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Location',
            required: true
        },
        manufacturer: {
            type: String,
            required: true
        },
        model: String,
        status: {
            type: String,
            enum: ['operational', 'warning', 'critical', 'maintenance', 'offline'],
            default: 'operational'
        },
        specifications: {
            powerRating: Number,
            coolingCapacity: Number,
            voltage: Number,
            current: Number
        },
        metrics: {
            temperature: Number,
            cpuLoad: Number,
            memoryUsage: Number,
            powerUsage: Number,
            networkIn: Number,
            networkOut: Number,
            fanSpeed: Number,
            humidity: Number,
            airflow: Number,
            coolingOutput: Number,
            lastUpdated: Date
        },
        installationDate: {
            type: Date,
            default: Date.now
        },
        lastMaintenanceDate: Date,
        nextMaintenanceDate: Date
    },
    {
        timestamps: true
    }
);

export default mongoose.model('Equipment', equipmentSchema, 'equipment');