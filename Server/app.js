import express from "express";
import authRoutes from './src/routes/auth.route.js';
import locationRoutes from './src/routes/location.route.js';
import equipmentRoutes from './src/routes/equipment.route.js';

const app = express();


// body parser middleware
app.use(express.json())

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/locations', locationRoutes);
app.use('/api/v1/equipment', equipmentRoutes);

export { app };