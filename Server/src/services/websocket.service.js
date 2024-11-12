// services/websocket.service.js
import { WebSocketServer } from 'ws';
import { generateMetrics } from '../utils/metricGenerator.js';
import Equipment from '../models/equipment.model.js';

const wss = new WebSocketServer({ port: 8080 });

// Store connected clients
const clients = new Set();

// Handle client connections
wss.on('connection', (ws) => {
    console.log('New client connected');
    clients.add(ws);

    ws.on('close', () => {
        console.log('Client disconnected');
        clients.delete(ws);
    });
});

// Broadcast metrics to all connected clients
const broadcastMetrics = (data) => {
    clients.forEach(client => {
        if (client.readyState === ws.OPEN) {
            client.send(JSON.stringify(data));
        }
    });
};

// Update and broadcast metrics every 5 seconds
const startMetricsSimulation = async () => {
    setInterval(async () => {
        try {
            const equipment = await Equipment.find();
            
            for (const eq of equipment) {
                const metrics = generateMetrics(eq.type);
                
                // Update equipment metrics in database
                await Equipment.findByIdAndUpdate(eq._id, {
                    $set: {
                        'metrics': metrics,
                        'lastUpdated': new Date()
                    }
                });

                // Broadcast update
                broadcastMetrics({
                    type: 'metrics',
                    equipmentId: eq._id,
                    data: metrics
                });
            }
        } catch (error) {
            console.error('Error updating metrics:', error);
        }
    }, 5000); // Every 5 seconds
};



export { startMetricsSimulation };