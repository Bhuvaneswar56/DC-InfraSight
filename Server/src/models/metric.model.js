import mongoose from "mongoose";
 
const metricSchema = new mongoose.Schema({
    equipmentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Equipment',
        required: true
    },
    type: {
        type: String,
        required: true,
        enum: ['temperature', 'cpuLoad', 'memoryUsage', 'powerUsage', 'airflow','inputVoltage','outputVoltage','batteryLevel',]
    },
    value: {
        type: Number,
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });
 
// Index for quick queries
metricSchema.index({ equipmentId: 1, type: 1, timestamp: -1 });
 
export default mongoose.model('Metric', metricSchema, 'metrics');