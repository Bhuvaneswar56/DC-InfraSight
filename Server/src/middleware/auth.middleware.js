// middleware/auth.middleware.js
import jwt from 'jsonwebtoken';
import { createError } from '../utils/error.js';
import User from '../models/user.model.js';
import dotenv from 'dotenv';

dotenv.config();

export const protect = async (req, res, next) => {
    try {
        let token;

        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }

        if (!token) {
            return next(createError(401, 'Not authorized to access this route'));
        }

        try {
            // Verify token
            const decoded = jwt.verify(token, process.env.DEV_JWT_SECRET_KEY);

            // Add user to req object
            req.user = await User.findById(decoded.id);
            next();
        } catch (err) {
            return next(createError(401, 'Not authorized to access this route'));
        }
    } catch (error) {
        next(error);
    }
};

export const authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(createError(403, `Role ${req.user.role} is not authorized to access this route`));
        }
        next();
    };
};