import Metric from '../models/metric.model.js';
import Equipment from '../models/equipment.model.js';
import {asyncHandler} from '../utils/asyncHandler.js'


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


export const getEquipmentMetrics = asyncHandler(async (req, res) => {
    const { equipmentId } = req.params;
    const { duration = '24h' } = req.query; // Default to last 24 hours

    // Calculate the start time based on duration
    const startTime = new Date();
    switch (duration) {
        case '1h':
            startTime.setHours(startTime.getHours() - 1);
            break;
        case '6h':
            startTime.setHours(startTime.getHours() - 6);
            break;
        case '24h':
            startTime.setHours(startTime.getHours() - 24);
            break;
        case '7d':
            startTime.setDate(startTime.getDate() - 7);
            break;
        default:
            startTime.setHours(startTime.getHours() - 24);
    }

    const metrics = await Metric.find({
        equipmentId,
        timestamp: { $gte: startTime }
    }).sort({ timestamp: 1 });

    return res.status(200).json(
        new ApiResponse(200, metrics, "Metrics retrieved successfully")
    );
});

export const getAggregateMetrics = asyncHandler(async (req, res) => {
    const { duration = '24h' } = req.query;

    const startTime = new Date();
    switch (duration) {
        case '1h':
            startTime.setHours(startTime.getHours() - 1);
            break;
        case '24h':
            startTime.setHours(startTime.getHours() - 24);
            break;
        case '7d':
            startTime.setDate(startTime.getDate() - 7);
            break;
        default:
            startTime.setHours(startTime.getHours() - 24);
    }

    const aggregateMetrics = await Metric.aggregate([
        {
            $match: {
                timestamp: { $gte: startTime }
            }
        },
        {
            $group: {
                _id: {
                    equipmentId: "$equipmentId",
                    type: "$type"
                },
                avgValue: { $avg: "$value" },
                maxValue: { $max: "$value" },
                minValue: { $min: "$value" }
            }
        }
    ]);

    return res.status(200).json(
        new ApiResponse(200, aggregateMetrics, "Aggregate metrics retrieved successfully")
    );
});
