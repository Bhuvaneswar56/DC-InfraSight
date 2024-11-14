import Metric from '../models/metric.model.js';
import Equipment from '../models/equipment.model.js';


// Store new metrics
export const storeMetrics = async (equipmentId, metrics) => {
    try {
        const metricPromises = Object.entries(metrics).map(([type, value]) => {
            if (type !== 'lastUpdated') {  // Skip lastUpdated field
                return Metric.create({
                    equipmentId,
                    type,
                    value
                });
            }
        });

        await Promise.all(metricPromises);
    } catch (error) {
        console.error('Error storing metrics:', error);
    }
};