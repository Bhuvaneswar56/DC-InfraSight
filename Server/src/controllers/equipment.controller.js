import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import equipmentModel from "../models/equipment.model.js";


const createEquipment = asyncHandler(async (req, res) => {
    let { name, serialNumber, type, locationId, manufacturer, model, specifications, metrics, lastMaintenanceDate, nextMaintenanceDate } = req.body;
    let { userId } = req.payload;

    let userFound = await userModel
        .findById(userId)
        .select("_id role");

    if (!userFound) {
        throw new ApiError(401, "User not found");
    }

    // Check if the user is an admin
    if (userFound.role !== 'admin') {
        return res.status(403).json({ message: "Forbidden ! Access denied. Admins only." });
    }

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


export {
    createEquipment
}