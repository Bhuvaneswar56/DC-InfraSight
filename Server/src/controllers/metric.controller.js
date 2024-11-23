import mongoose from 'mongoose';
import metricsModel from '../models/metric.model.js';
import Equipment from '../models/equipment.model.js';
import {asyncHandler} from '../utils/asyncHandler.js'
import { ApiResponse } from '../utils/ApiResponse.js';


// Store new metrics
export const storeMetrics = async (equipmentId, metricsData) => {
    try {
        // Validate if metricsData is valid
        if (!metricsData || typeof metricsData !== 'object') {
            throw new Error('Invalid metrics data: metricsData must be an object');
        }

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

            const metric = await metricsModel.create(metricData);
            storedMetrics.push(metric);
        }

        return storedMetrics;
    } catch (error) {
        console.error('Error storing metrics:', error.message);
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

    const metrics = await metricsModel.find({
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

    const aggregateMetrics = await metricsModel.aggregate([
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


const getMetricsData= asyncHandler(async(req,res)=>{
    let metrics = await metricsModel.find()

    let aggMetrics = await metricsModel.aggregate(
        [
            {
              $lookup: {
                from: 'equipments', 
                localField: 'equipmentId', 
                foreignField: '_id', 
                as: 'equipmentDetails'
              }
            }, {
              $unwind: {
                path: '$equipmentDetails'
              }
            }, {
              $lookup: {
                from: 'locations', 
                localField: 'equipmentDetails.locationId', 
                foreignField: '_id', 
                as: 'locationsDetails'
              }
            }, {
              $unwind: {
                path: '$locationsDetails'
              }
            }, {
              $project: {
                _id: 1, 
                equipmentId: 1, 
                type: 1, 
                value: 1, 
                timestamp: 1, 
                equipmentName: '$equipmentDetails.name', 
                euipmentSerialNumber: '$equipmentDetails.serialNumber', 
                euipmentType: '$equipmentDetails.type', 
                euipmentModel: '$equipmentDetails.model', 
                euipmentStatus: '$equipmentDetails.status', 
                locationName: '$locationsDetails.name', 
                locationType: '$locationsDetails.type', 
                createdAt: 1, 
                updatedAt: 1
              }
            }, {
              $sort: {
                createdAt: -1
              }
            }
          ]
    )
    res
        .status(200)
        .json(new ApiResponse(200, "Metrics fetched successfull", aggMetrics));
})


const getMetricsByEqId = asyncHandler(async (req, res) => {
    const { id } = req.params; // Get equipmentId from query parameters

    if (!id) {
        return res.status(400).json(new ApiResponse(400, "equipmentId is required"));
    }

    let aggMetrics = await metricsModel.aggregate([
        {
            $match: {
                equipmentId: new mongoose.Types.ObjectId(id) // Filter by equipmentId
            }
        },
        {
            $lookup: {
                from: 'equipments',
                localField: 'equipmentId',
                foreignField: '_id',
                as: 'equipmentDetails'
            }
        },
        {
            $unwind: {
                path: '$equipmentDetails'
            }
        },
        {
            $lookup: {
                from: 'locations',
                localField: 'equipmentDetails.locationId',
                foreignField: '_id',
                as: 'locationsDetails'
            }
        },
        {
            $unwind: {
                path: '$locationsDetails'
            }
        },
        {
            $project: {
                _id: 1,
                equipmentId: 1,
                type: 1,
                value: 1,
                timestamp: 1,
                equipmentName: '$equipmentDetails.name',
                equipmentSerialNumber: '$equipmentDetails.serialNumber',
                equipmentType: '$equipmentDetails.type',
                equipmentModel: '$equipmentDetails.model',
                equipmentStatus: '$equipmentDetails.status',
                locationName: '$locationsDetails.name',
                locationType: '$locationsDetails.type',
                createdAt: 1,
                updatedAt: 1
            }
        },
        {
            $sort: {
                createdAt: -1
            }
        }
    ]);

    res
        .status(200)
        .json(new ApiResponse(200, "Metrics fetched successfully", aggMetrics));
});



export {getMetricsData,getMetricsByEqId}