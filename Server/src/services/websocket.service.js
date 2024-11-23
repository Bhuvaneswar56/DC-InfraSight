import { WebSocketServer ,WebSocket } from 'ws';
import { generateMetrics } from '../utils/metricGenerator.js';
import Equipment from '../models/equipment.model.js';
import { storeMetrics } from '../controllers/metric.controller.js';
import { generateAlert } from '../utils/generateAlert.js'

const wss = new WebSocketServer({ port: 8800 });

const clients = new Set();
let metricsInterval;

// Handle client connections
wss.on('connection', (ws) => {
    console.log('New Client Connected')
    clients.add(ws);

    ws.on('close', () => {
        console.log('Client disconnected')
        clients.delete(ws)
    });
})

// Broadcast metrics to all connected clients

const broadcastMetrics = (data) => {
    clients.forEach(client => {
        if (client.readyState == WebSocket.OPEN) {
            client.send(JSON.stringify(data))
        }
    })
}


const startMetricsSimulation = async () => {
    metricsInterval = setInterval(async () => {
        try {

            const equipment = await Equipment.find()
            if (equipment.length === 0) {
                console.log('No equipment found');
                return;
            }

            for (const eq of equipment) {

                const metrics = generateMetrics(eq.type);

                // Update equipment
                await Equipment.findByIdAndUpdate(eq._id, {
                    $set: {
                        'metrics': metrics,
                        'lastUpdated': new Date()
                    }
                });

                const storedMetrics = await storeMetrics(eq._id, metrics);

                if (storedMetrics && storedMetrics.length > 0) {
                    // Process each stored metric
                    for (const storedMetric of storedMetrics) {
                        const alert = await generateAlert(storedMetric, eq );

                        if (alert) {
                            console.log('Alert generated:', alert);
                            broadcastMetrics({
                                type: 'alert',
                                equipmentId: eq._id,
                                alertId: alert._id,
                                data: alert
                            });
                        }
                    }
                }

                broadcastMetrics({
                    type: 'metrics',
                    equipmentId: eq._id,
                    data: metrics
                });
            }
        }
        catch (err) {
            console.error('Error updating metrics:', err);
        }
    }, 5000)

}

const stopMetricsSimulation = () => {
    if (metricsInterval) {
        clearInterval(metricsInterval);
        console.log('Metrics simulation stopped');
    }

    // Close all client connections
    clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.close();
        }
    });

    // Clear clients set
    clients.clear();

    // Close WebSocket server
    wss.close(() => {
        console.log('WebSocket server closed');
    });
};

export { startMetricsSimulation, stopMetricsSimulation };
