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
    const incidents = await incidentModel.find()
    if (incidents.length <= 0) {
        throw new ApiError(404, "No Incidents found");
    }

    res
        .status(200)
        .json(new ApiResponse(200, "All Incindets", incidents));
})

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
