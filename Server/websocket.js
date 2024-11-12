// server/websocket.js
import { startMetricsSimulation } from './src/services/websocket.service.js';

const startWebSocketServer = () => {
    try {
        startMetricsSimulation();
        console.log('WebSocket server started on port 8080');
    } catch (error) {
        console.error('Error starting WebSocket server:', error);
    }
};

export default startWebSocketServer;