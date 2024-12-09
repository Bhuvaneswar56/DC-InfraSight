import { agenda } from '../utils/Agenda.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import equipmentModel from '../models/equipment.model.js';
import maintenanceModel from '../models/maintenance.model.js';
import { priority } from 'agenda/dist/job/priority.js';


const createMaintenance = asyncHandler(async (req, res) => {
    let { userId } = req.payload;
    let { equip_id, title, description, type, priority, status, scheduled, completed } = req.body;

    let equipFound = await equipmentModel.findById(equip_id);

    if (!equipFound) {
        throw new ApiError(401, "Equipment not found");
    }

    const scheduledObject = new Date(scheduled);
    const scheduledISO = scheduledObject.toISOString();
    const completedObject = new Date(completed);
    const completedISO = completedObject.toISOString();

    const newMaintenance = {
        user_id: userId,
        equip_id : equipFound._id,
        title,
        description,
        type,
        priority,
        status,
        scheduled: scheduledISO,
        completed: completedISO
    };

    let savedMaintenance = new maintenanceModel(newMaintenance);
    await savedMaintenance.save();

    // Schedule an Agenda job
    await agenda.schedule(savedMaintenance.scheduled,
        'send maintenance notification',
        { maintenanceId: savedMaintenance._id }
    );

    res.status(201).json(new ApiResponse(
        201,
        'Maintenance scheduled and job created',
        savedMaintenance
    ));
});

const cancelMaintenance = asyncHandler(async (req, res) => {
    const { maintenanceId } = req.params;

    const maintenance = await maintenanceModel.findById(maintenanceId);
    if (!maintenance) {
        return res.status(404).json(new ApiResponse(404, "Maintenance not found"));
    }

    const jobCancel = await agenda.cancel({ name: 'send maintenance notification', 'data.maintenanceId': maintenanceId });

    if (jobCancel > 0) {
        console.log(`Agenda job for maintenance ${maintenanceId} canceled successfully.`);
    } else {
        console.log(`No Agenda job found for maintenance ${maintenanceId}.`);
    }

    await maintenanceModel.findByIdAndDelete(maintenanceId);

    res.status(201).json(new ApiResponse(
        201,
        "Maintenance schedule canceled.",
        maintenance
    ));
});


const rescheduleMaintenance = asyncHandler(async (req, res) => {
    const { maintenanceId } = req.params;
    const { newScheduledDate } = req.body;

    const maintenance = await maintenanceModel.findById(maintenanceId);
    if (!maintenance) {
        return res.status(404).json(new ApiResponse(404, "Maintenance not found"));
    }

    const jobCancel = await agenda.cancel({ name: 'send maintenance notification', 'data.maintenanceId': maintenanceId });
    if (jobCancel > 0) {
        console.log(`Agenda job for maintenance ${maintenanceId} canceled successfully.`);
    } else {
        console.log(`No Agenda job found for maintenance ${maintenanceId}.`);
    }

    const scheduledObject = new Date(newScheduledDate);
    const scheduledISO = scheduledObject.toISOString();

    maintenance.scheduled = scheduledISO;
    await maintenance.save();

    await agenda.schedule(
        newScheduledDate,
        'send maintenance notification',
        { maintenanceId: maintenance._id }
    );

    res.status(200).json(new ApiResponse(
        200,
        "Maintenance rescheduled successfully.",
        maintenance
    ));
});


const updateMaintenanceStatus = asyncHandler(async (req, res) => {
    const { maintenanceId } = req.params;
    const { status } = req.body;

    if (!status) {
        throw new ApiError(404, "Status is required.");
    }

    const updatedMaintenance = await maintenanceModel.findByIdAndUpdate(
        maintenanceId,
        { status },
        { new: true }
    );

    if (!updatedMaintenance) {
        return res.status(404).json(new ApiResponse(404, "Maintenance not found."));
    }

    res.status(200).json(new ApiResponse(
        200,
        "Maintenance status updated successfully.",
        updatedMaintenance,
    ));
});


const updateMaintenanceTask = asyncHandler(async (req, res) => {
    const { maintenanceId } = req.params;
    let { userId } = req.payload;
    const { tasks } = req.body;

    if (!tasks) {
        throw new ApiError(404, "tasks is required.");
    }

    const updatedMaintenance = await maintenanceModel.findByIdAndUpdate(
        maintenanceId,
        { tasks, tasksLastUpdatedBy: userId, tasksLastUpdatedAt: new Date() },
        { new: true }
    );

    if (!updatedMaintenance) {
        return res.status(404).json(new ApiResponse(404, "Maintenance not found."));
    }

    res.status(200).json(new ApiResponse(
        200,
        "Maintenance task updated successfully.",
        updatedMaintenance,
    ));
});


const updateMaintenanceNotes = asyncHandler(async (req, res) => {
    console.log("inside updateMaintenanceNotes : ");
    const { maintenanceId } = req.params;
    let { userId } = req.payload;
    const { newNote } = req.body;

    console.log("newNote  : ", newNote);

    if (!newNote) {
        throw new ApiError(404, "note is required.");
    }

    const noteObject = {
        remark: newNote,
        user_id: userId,
        time: new Date()
    }

    const updatedMaintenance = await maintenanceModel.findByIdAndUpdate(
        maintenanceId,
        {
            $push: { notes: noteObject }, // Use $push to add the new note to the array
            notesLastUpdatedBy: userId,
            notesLastUpdatedAt: new Date(),
        },
        { new: true }
    );

    if (!updatedMaintenance) {
        return res.status(404).json(new ApiResponse(404, "Maintenance not found."));
    }

    res.status(200).json(new ApiResponse(
        200,
        "Maintenance notes updated successfully.",
        updatedMaintenance,
    ));
});


const getMaintenanceByEquipId = asyncHandler(async (req, res) => {
    const { equipId } = req.params;

    const maintenanceRecords = await maintenanceModel.find({ equip_id: equipId });

    if (!maintenanceRecords || maintenanceRecords.length === 0) {
        return res.status(404).json(new ApiResponse(404, "No maintenance records found for the given equipment ID."));
    }

    res.status(200).json(new ApiResponse(
        200,
        "Maintenance records retrieved successfully.",
        maintenanceRecords
    ));
});


const getMaintenanceById = asyncHandler(async (req, res) => {
    const { maintenanceId } = req.params;

    const maintenanceRecord = await maintenanceModel.findById(maintenanceId)
        .populate([
            {
                path: "equip_id",
                select: "name serialNumber type manufacturer locationId model status lastMaintenanceDate",
                populate: {
                    path: "locationId",
                    select: "name"
                }
            },
            {
                path: "user_id",
                select: "username" // Replace "username" with the actual field you want from the user schema
            },
            {
                path: "notes", // Populate username in the notes array
                populate: {
                    path: "user",
                    select: 'username'
                }
            },
            {
                path: "notesLastUpdatedBy",
                select: "username" // Replace "username" with the actual field from the User schema
            },
            {
                path: "tasksLastUpdatedBy",
                select: "username" // Replace "username" with the actual field from the User schema
            }
        ])

    console.log("maintenanceRecord : ", maintenanceRecord);

    if (!maintenanceRecord) {
        return res.status(404).json(new ApiResponse(404, "Maintenance record not found."));
    }

    res.status(200).json(new ApiResponse(
        200,
        "Maintenance record retrieved successfully.",
        maintenanceRecord,
    ));
});


const getAllMaintenance = asyncHandler(async (req, res) => {

    const maintenanceRecords = await maintenanceModel.find()
        .populate([
            {
                path: "equip_id",
                select: "name serialNumber type manufacturer locationId model status lastMaintenanceDate",
                populate: {
                    path: "locationId",
                    select: "name"
                }
            },
            {
                path: "user_id",
                select: "username" // Replace "username" with the actual field you want from the user schema
            },
            {
                path: "notesLastUpdatedBy",
                select: "username" // Replace "username" with the actual field from the User schema
            },
            {
                path: "tasksLastUpdatedBy",
                select: "username" // Replace "username" with the actual field from the User schema
            }
        ])


    if (!maintenanceRecords || maintenanceRecords.length === 0) {
        return res.status(404).json(new ApiResponse(404, "No maintenance records found."));
    }

    res.status(200).json(new ApiResponse(
        200,
        "All maintenance records retrieved successfully.",
        maintenanceRecords
    ));
});



export {
    createMaintenance,
    cancelMaintenance,
    rescheduleMaintenance,
    updateMaintenanceStatus,
    updateMaintenanceTask,
    updateMaintenanceNotes,
    getMaintenanceByEquipId,
    getMaintenanceById,
    getAllMaintenance
}