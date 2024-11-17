import Metric from '../models/metric.model.js';
import Equipment from '../models/equipment.model.js';


// Store new metrics
export const storeMetrics = async (equipmentId, metricsData) => {
    try {
        console.log('Storing metrics for equipment:', equipmentId);
        console.log('Metrics data:', metricsData);

        const storedMetrics = [];

        // Process each metric type
        for (const [type, value] of Object.entries(metricsData)) {
            if (type === 'lastUpdated') continue;

            const metricData = {
                equipmentId: equipmentId,
                type: type,
                value: value,
                unit: type === 'cpuLoad' ? '%' : 
                      type === 'powerUsage' ? 'W' : 
                      '°C',
                timestamp: new Date()
            };

            console.log('Creating metric:', metricData);
            const metric = await Metric.create(metricData);
            console.log('Stored metric:', metric);
            storedMetrics.push(metric);
        }

        return storedMetrics;
    } catch (error) {
        console.error('Error storing metrics:', error);
        return null;
    }
};