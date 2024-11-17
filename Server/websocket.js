

import {startMetricsSimulation,stopMetricsSimulation}  from './src/services/websocket.service.js';


const startWebSocketServer = ()=>{
    try{
        startMetricsSimulation()
        console.log('WebSocket server started on port 8080')
    }
    catch (error) {
        console.error('Error starting WebSocket server:', error);
    }
}

const stopWebSocketServer = () => {
    try {
        stopMetricsSimulation();
        console.log('WebSocket server stopped');
    } catch (error) {
        console.error('Error stopping WebSocket server:', error);
    }
};


export {startWebSocketServer,stopWebSocketServer}