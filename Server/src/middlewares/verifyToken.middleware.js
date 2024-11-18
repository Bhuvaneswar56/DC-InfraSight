import jwt from 'jsonwebtoken';
import CONFIG from '../config/config.js';
import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import userModel from '../models/user.model.js';

const verifyToken = asyncHandler(async (req, res) => {
    let token = req.headers.authorization.split(" ")[1];

    if (!token) {
        token = req.cookies.token;
    }

    var decoded = jwt.verify(token, CONFIG.JWT_SECRET_KEY);
    req.payload = decoded;

    let userFound = await userModel.findById(req.payload.userId);

    if (!userFound) {
        throw new ApiError(401, "User not found");
    }

    req.user = userFound;
});

const authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.payload.role)) {
            return next(new ApiError(403, `Role '${req.payload.role}' is not authorized to access this route`));
        }
        next();
    };
};


export { verifyToken, authorize };