import incidentModel from "../models/incident.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";


const createIncident = asyncHandler(async (req, res) => {
    const {
        title,
        relatedAlert,
        equipment,
        priority,
        status,
        timeline,
        comments
    } = req.body;

    if (!title || !priority) {
        throw new ApiError(400, "Title and Priority are required fields.");
    }

    const incidents = {
        title,
        relatedAlert,
        equipment,
        priority,
        status,
        timeline,
        comments
    };

    let savedIncident = await incidentModel.create(incidents)
    res
        .status(201)
        .json(new ApiResponse(200, "Incident created successfully", savedIncident));
});

const updateIncident = asyncHandler(async (req, res) => {
    const { id } = req.params
    const {
        priority,
        status,
        comments
    } = req.body

    let existingIncident = await incidentModel.findById(id)

    if (!existingIncident) {
        throw new ApiError(404, "Incident not found");
    }

    let updateInc = await incidentModel.findByIdAndUpdate(id, { priority, status, comments }, { new: true })

    res
        .status(200)
        .json(new ApiResponse(200, "incident Updated", updateInc));
})

const getAllIncidents = asyncHandler(async (req, res) => {

    let aggIncidents = await incidentModel.aggregate(
        [
            {
              $lookup: {
                from: "alerts",
                localField: "relatedAlert",
                foreignField: "_id",
                as: "alertsDetails",
                pipeline: [
                  {
                    $project: {
                      type: 1,
                      priority: 1,
                      title: 1,
                      description: 1,
                      status: 1
                    }
                  }
                ]
              }
            },
            {
              $unwind: {
                path: "$alertsDetails"
              }
            },
            {
              $lookup: {
                from: "equipments",
                localField: "equipment",
                foreignField: "_id",
                as: "equipmentDetails",
                pipeline: [
                  {
                    $project: {
                      name: 1,
                      serialNumber: 1,
                      type: 1,
                      model: 1,
                      status: 1
                    }
                  }
                ]
              }
            },
            {
              $unwind: {
                path: "$equipmentDetails"
              }
            },
            {
              $lookup: {
                from: "users",
                localField: "timeline.performedBy",
                foreignField: "_id",
                as: "userPerf",
                pipeline: [
                  {
                    $project: {
                      username: 1,
                      email: 1
                    }
                  }
                ]
              }
            },
            {
              $unwind: {
                path: "$userPerf"
              }
            },
            {
              $unwind: {
                path: "$timeline"
              }
            },
            {
              $project: {
                _id: 1,
                incidentNumber: 1,
                title: 1,
                description: 1,
                priority: 1,
                status: 1,
                alertsDetails: 1,
                equipmentDetails: 1,
                performedBy: "$userPerf.username",
                performedEmail: "$userPerf.email",
                timeline: 1,
                comments: 1,
                createdAt: 1,
                updatedAt: 1
              }
            },
            {
              $sort: {
                createdAt: -1
              }
            }
          ])
          
  
    if (aggIncidents.length <= 0) {
      throw new ApiError(404, "No Incidents found");
    }
  
    res.status(200).json(new ApiResponse(200, "All Incidents", aggIncidents));
  });
  

const getIncidentById = asyncHandler(async (req, res) => {
    const { id } = req.params
    const incidents = await incidentModel.findById(id)
    if (!incidents) {
        throw new ApiError(404, "No Incident found");
    }
    res
        .status(200)
        .json(new ApiResponse(200, "Incindet", incidents));
})


export {
    createIncident,
    updateIncident,
    getAllIncidents,
    getIncidentById
};
