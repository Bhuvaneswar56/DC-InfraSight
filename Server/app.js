import express from "express";
import cookieParser from 'cookie-parser'
import cors from 'cors'
import morganMiddleware from './src/middlewares/morgan.middleware.js'

import userRoutes from './src/routes/user.route.js';
import locationRoutes from './src/routes/location.route.js';
import equipmentRoutes from './src/routes/equipment.route.js';
import maintenanceRoutes from './src/routes/maintenance.route.js';
import globalErrorMiddleware from './src/middlewares/error.middleware.js';
import websocketRoutes from './src/routes/websocket.route.js'
import alertRoutes from './src/routes/alert.route.js'
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

app.use('/api/infra/websocket',websocketRoutes)
app.use('/api/infra/user', userRoutes);
app.use('/api/infra/location', locationRoutes);
app.use('/api/infra/equipment', equipmentRoutes);
app.use('/api/infra/maintenance', maintenanceRoutes);

// global Error Middleware
app.use(globalErrorMiddleware)

export { app };