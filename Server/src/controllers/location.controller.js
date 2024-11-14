import locationModel from "../models/location.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import userModel from "../models/user.model.js";

const createLocation = asyncHandler(async(req,res)=>{
    const {
        name,
        type,
        floor,
        building,
        capacity:{power, cooling, totalRacks},
        status,
    } = req.body;
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

    const existingLocation = await locationModel.findOne({ name, type, floor });

    if(existingLocation){
        throw new ApiError(400, "Location already exists with the same name, type, and floor.");
    }

    // if (!power || !cooling || !totalRacks) {
    //     throw new ApiError(400, "Capacity must include power, cooling, and racks subfields.");
    // }

    let locationData={
        name,
        type,
        floor,
        building,
        capacity:{power, cooling, totalRacks},
        status
    }

    const location = await locationModel.create(locationData);

    res
        .status(200)
        .json(new ApiResponse(200, "Location Created", location));

})


const getAllLocations = asyncHandler(async(req,res)=>{
    let{userId}=req.payload

    let userFound = await userModel
        .findById(userId)
        .select("_id role");

    if (!userFound) {
        throw new ApiError(401, "User not found");
    }

    let allLocations = await locationModel.find()
    res
        .status(200)
        .json(new ApiResponse(200, "Location Created", allLocations));


})

const getLocationById = asyncHandler(async(req,res)=>{
    const {id} = req.params
    let{userId}=req.payload
    
    let userFound = await userModel
        .findById(userId)
        .select("_id role");

    if (!userFound) {
        throw new ApiError(401, "User not found");
    }

    let locationById = await locationModel.findById(id)
    res
        .status(200)
        .json(new ApiResponse(200, "Location Created", locationById));


})

const updateLocation = asyncHandler(async (req, res) => {
    const { id } = req.params; 
    const {
        name,
        type,
        floor,
        building,
        capacity: { power, cooling, totalRacks },
        status,
    } = req.body; 
    let { userId } = req.payload; 

    let userFound = await userModel.findById(userId).select("_id role");
    if (!userFound) {
        throw new ApiError(401, "User not found");
    }
    if (userFound.role !== "admin") {
        return res.status(403).json({ message: "Forbidden! Access denied. Admins only." });
    }

    const existingLocation = await locationModel.findById(id);
    if (!existingLocation) {
        throw new ApiError(404, "Location not found");
    }

    const updatedLocation = await locationModel.findByIdAndUpdate(
        id,
        { name, type, floor, building, capacity: { power, cooling, totalRacks }, status },
        {new:true}
    );

    res
    .status(200)
    .json(new ApiResponse(200, "Location Updated", updatedLocation));
});

const deleteLocation = asyncHandler(async (req, res) => {
    const { id } = req.params; 
    let { userId } = req.payload; 

    let userFound = await userModel.findById(userId).select("_id role");
    if (!userFound) {
        throw new ApiError(401, "User not found");
    }
    if (userFound.role !== "admin") {
        return res.status(403).json({ message: "Forbidden! Access denied. Admins only." });
    }

    const existingLocation = await locationModel.findById(id);
    if (!existingLocation) {
        throw new ApiError(404, "Location not found");
    }

    await locationModel.findByIdAndDelete(id);

    res
    .status(200)
    .json(new ApiResponse(200, "Location Deleted", { id }));
});

export { createLocation, getAllLocations, getLocationById,updateLocation, deleteLocation };
