import { agenda } from '../utils/Agenda.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import equipmentModel from '../models/equipment.model.js';
import maintenanceModel from '../models/maintenance.model.js';

// Create Maintenance Controller Function
const createMaintenance = asyncHandler(async (req, res) => {
    let { userId } = req.payload;
    let { equip_id, title, description, type, status, scheduled, completed } = req.body;

    let equipFound = await equipmentModel.findById(equip_id);

    if (!equipFound) {
        throw new ApiError(401, "Equipment not found");
    }

    const newMaintenance = {
        user_id : userId,
        equip_id,
        title,
        description,
        type,
        status,
        scheduled,
        completed
    };

    let savedMaintenance = new maintenanceModel(newMaintenance);
    await savedMaintenance.save();

    // Schedule an Agenda job
    await agenda.schedule(savedMaintenance.scheduled, 'send maintenance notification', { maintenanceId: savedMaintenance._id });

    res.status(201).json(new ApiResponse(200, 'Maintenance scheduled and job created', savedMaintenance));
});


// Cancel Maintenance Controller Function
const cancelMaintenance = asyncHandler(async (req, res) => {
    let { userId } = req.payload;
    let { equip_id, title, description, type, status, scheduled, completed } = req.body;

    let equipFound = await equipmentModel.findById(equip_id);

    if (!equipFound) {
        throw new ApiError(401, "Equipment not found");
    }

    // Schedule an Agenda job
    await agenda.schedule(savedMaintenance.scheduled, 'send maintenance notification', { maintenanceId: savedMaintenance._id });

    res.status(201).json(new ApiResponse(200, 'Maintenance scheduled and job created', savedMaintenance));
});

// Reschedule Maintenance Controller Function
const rescheduleMaintenance = asyncHandler(async (req, res) => {
    let { userId } = req.payload;
    let { equip_id, title, description, type, status, scheduled, completed } = req.body;

    let equipFound = await equipmentModel.findById(equip_id);

    if (!equipFound) {
        throw new ApiError(401, "Equipment not found");
    }

    // Schedule an Agenda job
    await agenda.schedule(savedMaintenance.scheduled, 'send maintenance notification', { maintenanceId: savedMaintenance._id });

    res.status(201).json(new ApiResponse(200, 'Maintenance scheduled and job created', savedMaintenance));
});

export {
    createMaintenance,
    cancelMaintenance,
    rescheduleMaintenance
}