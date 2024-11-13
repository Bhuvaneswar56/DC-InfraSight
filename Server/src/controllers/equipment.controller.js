import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import equipmentModel from "../models/equipment.model.js";


const createEquipment = asyncHandler(async (req, res) => {
    let {
        name,
        serialNumber,
        type,
        locationId,
        manufacturer,
        model,
        specifications,
        metrics,
        lastMaintenanceDate,
        nextMaintenanceDate
    } = req.body;

    const newEquipmentData = {
        name,
        serialNumber,
        type,
        locationId,
        manufacturer,
        model,
        specifications,
        metrics,
        lastMaintenanceDate,
        nextMaintenanceDate
    };

    let savedEquipment = new equipmentModel(newEquipmentData);
    await savedEquipment.save();

    res.status(200).json(new ApiResponse(200, "Equipment created successfull", newEquipmentData));
});


const getEquipmentById = asyncHandler(async (req, res) => {
    let { equipmentId } = req.params;

    const equipment = await equipmentModel.findById(equipmentId);

    if (!equipment) {
        return res.status(404).json(new ApiResponse(404, { message: "Equipment not found" }));
    }

    res.status(200).json(new ApiResponse(200, "Equipment fetch successfull", equipment));
});


const getEquipmentsByLocation = asyncHandler(async (req, res) => {
    let { locationId } = req.params;

    const equipmentList = await equipmentModel.find({ locationId });

    if (!equipmentList || equipmentList.length === 0) {
        return res.status(404).json(new ApiResponse(404, { message: "No equipment found for this location" }));
    }

    res.status(200).json(new ApiResponse(200, "Equipment fetch successfull", equipmentList));
});


const getAllEquipments = asyncHandler(async (req, res) => {

    const equipmentList = await equipmentModel.find({});

    if (!equipmentList || equipmentList.length === 0) {
        return res.status(404).json(new ApiResponse(404, { message: "No equipment found" }));
    }

    res.status(200).json(new ApiResponse(200, "Equipment fetch successfull", equipmentList));
});


const deleteEquipment = asyncHandler(async (req, res) => {
    let { equipmentId } = req.params;

    const equipment = await equipmentModel.findById(equipmentId);
    if (!equipment) {
        return res.status(404).json(new ApiResponse(404, { message: "Equipment not found" }));
    }

    await equipmentModel.findByIdAndDelete(equipmentId);

    res.status(200).json(new ApiResponse(200, "Equipment deleted successfully"));
});


const updateEquipmentStatus = asyncHandler(async (req, res) => {
    let { equipmentId } = req.params;
    let { status } = req.body;

    const equipment = await equipmentModel.findById(equipmentId);
    if (!equipment) {
        return res.status(404).json(new ApiResponse(404, { message: "Equipment not found" }));
    }

    //  ['operational', 'warning', 'critical', 'maintenance', 'offline'],
    const equipmentNew = await equipmentModel.findByIdAndUpdate(equipmentId, { status }, { new: true });

    res.status(200).json(new ApiResponse(200, "Equipment status updated successfully", equipmentNew));
});


export {
    createEquipment,
    getAllEquipments,
    getEquipmentsByLocation,
    getEquipmentById,
    deleteEquipment,
    updateEquipmentStatus
}