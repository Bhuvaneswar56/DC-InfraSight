import express from "express";
import cookieParser from 'cookie-parser'
import cors from 'cors'
import morganMiddleware from './src/middlewares/morgan.middleware.js'

import authRoutes from './src/routes/auth.route.js';
import locationRoutes from './src/routes/location.route.js';
import equipmentRoutes from './src/routes/equipment.route.js';
import globalErrorMiddleware from './src/middlewares/error.middleware.js';

const app = express();


var corsOptions = {
    origin: '*', // Allow all origins temporarily
};

// body parser middleware
app.use(express.json())

// cors setup
 app.use(cors(corsOptions))

// cookier parser middleware
app.use(cookieParser())

// logger middleware
app.use(morganMiddleware)

app.use('/api/infra/auth', authRoutes);
app.use('/api/infra/locations', locationRoutes);
app.use('/api/infra/equipment', equipmentRoutes);


// global Error Middleware
app.use(globalErrorMiddleware)

export { app };