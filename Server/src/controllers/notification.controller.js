import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import notificationModel from "../models/notification.model.js";

const getAllNotifications = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const notifications = await notificationModel.find()
        .populate('equip_id', 'name type serialNumber')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit));

    const total = await notificationModel.countDocuments();

    res.status(200).json(
        new ApiResponse(200, "Notifications fetched successfully", {
            docs: notifications,
            totalPages: Math.ceil(total / limit),
            page: parseInt(page),
            limit: parseInt(limit),
            total
        })
    );
});
const getNotificationCounts = asyncHandler(async (req, res) => {
    const counts = await notificationModel.aggregate([
        {
            $group: {
                _id: "$type",
                count: { $sum: 1 }
            }
        }
    ]);

    const countsByType = {
        total: 0,
        Maintenance: 0,
        Alert: 0,
        "Incident Management": 0
    };

    counts.forEach(({ _id, count }) => {
        countsByType[_id] = count;
        countsByType.total += count;
    });

    return res.status(200).json(
        new ApiResponse(
            200,
            "Notification counts fetched successfully",
            countsByType
        )
    );
});

export { getAllNotifications, getNotificationCounts };