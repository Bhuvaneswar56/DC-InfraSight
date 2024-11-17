import express from "express";
import cookieParser from 'cookie-parser'
import cors from 'cors'
import morganMiddleware from './src/middlewares/morgan.middleware.js'

import globalErrorMiddleware from './src/middlewares/error.middleware.js';
import router from '../Server/src/routes/index.js'


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

app.use('/api/infra', router);


// global Error Middleware
app.use(globalErrorMiddleware)

export { app };