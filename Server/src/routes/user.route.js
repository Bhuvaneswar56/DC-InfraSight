// routes/auth.route.js
import express from 'express';
import { registerInitialAdmin, registerUser, login, validateToken } from '../controllers/user.controller.js';
import { verifyToken, authorize } from '../middlewares/verifyToken.middleware.js';

const router = express.Router();

// Public routes (no token needed)
router.post('/register-admin', registerInitialAdmin);  // Only works once

router.post('/login', login);

// Protected routes (token needed)
router.post('/register-user',
    verifyToken,
    authorize('admin'),
    registerUser
);

router.post("/auth/validate", validateToken)


export default router;