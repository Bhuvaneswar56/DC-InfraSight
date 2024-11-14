import jwt from 'jsonwebtoken'
import CONFIG from '../config/config.js'
import { ApiError } from '../utils/ApiError.js';
import userModel from '../models/user.model.js';

async function verifyToken(req, res, next) {
    try {
        let token = req.headers.authorization.split(" ")[1];

        // get the token from the cookies if it doesn't exist in headers
        if (!token) {
            token = req.cookies.token
        }

        var decoded = jwt.verify(token, CONFIG.JWT_SECRET_KEY);
        req.payload = decoded;

        // user exists or not
        let userFound = await userModel
            .findById(req.payload.userId);

        if (!userFound) {
            throw new ApiError(401, "User not found");
        }

        req.user = userFound;

        next();

    } catch (error) {
        console.log(error);
        return res.status(401).json(new ApiError(401, "Token Invalid"));
    }
}

const authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.payload.role)) {
            return next(new ApiError(403, `Role '${req.payload.role}' is not authorized to access this route`));
        }
        next();
    };
};


export { verifyToken, authorize };