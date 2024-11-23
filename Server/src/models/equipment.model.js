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
            enum: ['CRAH', 'UPS', 'PDU','SERVER'],
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
        model: {
            type : String,
            required :[true, "Model is required"]
        },
        status: {
            type: String,
            enum: ['operational', 'warning', 'critical', 'maintenance', 'offline'],
            default: 'operational'
        },
        specifications: {
            powerRating: Number,  // Power consumption/capacity in Watts
            voltage: Number,      // Operating voltage in Volts
            current: Number,      // Operating current in Amperes
            maxLoad: Number ,    // Maximum load capacity in VA or Watts
            temperature : Number,
        },
        installationDate: {
            type: Date,
            default: Date.now
        },
      createdBy: {
           type: mongoose.Schema.Types.ObjectId, 
           ref: "User",
           required: [true, "Created by field is required"],
        },
        lastMaintenanceDate: Date
    },
    {
        timestamps: true
    }
);

export default mongoose.model('Equipment', equipmentSchema, 'equipments');