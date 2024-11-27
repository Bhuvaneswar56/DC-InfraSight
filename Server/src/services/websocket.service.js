import { WebSocketServer, WebSocket } from 'ws';
import { generateMetrics } from '../utils/metricGenerator.js';
import Equipment from '../models/equipment.model.js';
import { storeMetrics } from '../controllers/metric.controller.js';
import { generateAlert } from '../utils/generateAlert.js'

let wss = null;
const clients = new Set();
let metricsInterval;

const startMetricsSimulation = async () => {
    try {
        // Create WebSocket server if not exists
        if (!wss) {
            console.log('Starting WebSocket server on port 8800...');
            wss = new WebSocketServer({ 
                port: 8800,
                clientTracking: true,
                // Add error handling for the server
                handleProtocols: (protocols, request) => {
                    console.log('Client protocols:', protocols);
                    return protocols[0];
                }
            });

            // Server event handlers
            wss.on('listening', () => {
                console.log('WebSocket server is listening on port 8800');
            });

            wss.on('error', (error) => {
                console.error('WebSocket server error:', error);
            });

            // Handle client connections
            wss.on('connection', (ws, req) => {
                console.log('New client connected from:', req.socket.remoteAddress);
                clients.add(ws);

                // Send immediate confirmation
                ws.send(JSON.stringify({ type: 'connection', status: 'connected' }));

                ws.on('error', (error) => {
                    console.error('Client connection error:', error);
                });

                ws.on('close', (code, reason) => {
                    console.log('Client disconnected. Code:', code, 'Reason:', reason);
                    clients.delete(ws);
                });
            });
        }

        // Start metrics simulation
        console.log('Starting metrics simulation...');
        metricsInterval = setInterval(async () => {
            try {
                const equipment = await Equipment.find();
                if (equipment.length === 0) {
                    console.log('No equipment found');
                    return;
                }

                console.log(`Broadcasting metrics to ${clients.size} clients`);
                for (const eq of equipment) {
                    const metrics = generateMetrics(eq.type);
                    console.log(`Generated metrics for ${eq.type}:`, metrics);

                    // Update equipment
                    await Equipment.findByIdAndUpdate(eq._id, {
                        $set: {
                            'metrics': metrics,
                            'lastUpdated': new Date()
                        }
                    });

                    const storedMetrics = await storeMetrics(eq._id, metrics);

                    // Broadcast metrics
                    const metricsData = {
                        type: 'metrics',
                        equipmentId: eq._id,
                        data: metrics
                    };
                    
                    broadcastMetrics(metricsData);

                    // Handle alerts
                    if (storedMetrics && storedMetrics.length > 0) {
                        for (const storedMetric of storedMetrics) {
                            const alert = await generateAlert(storedMetric, eq);
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
                }
            } catch (err) {
                console.error('Error in metrics simulation:', err);
            }
        }, 5000);

    } catch (error) {
        console.error('Error starting WebSocket server:', error);
        throw error;
    }
};

const broadcastMetrics = (data) => {
    const message = JSON.stringify(data);
    let successCount = 0;
    let failCount = 0;

    clients.forEach(client => {
        try {
            if (client.readyState === WebSocket.OPEN) {
                client.send(message);
                successCount++;
            } else {
                failCount++;
            }
        } catch (error) {
            console.error('Error broadcasting to client:', error);
            failCount++;
        }
    });

    console.log(`Broadcast results - Success: ${successCount}, Failed: ${failCount}`);
};

const stopMetricsSimulation = () => {
    console.log('Stopping metrics simulation...');
    if (metricsInterval) {
        clearInterval(metricsInterval);
        console.log('Metrics interval cleared');
    }

    if (clients.size > 0) {
        console.log(`Closing ${clients.size} client connections...`);
        clients.forEach(client => {
            try {
                if (client.readyState === WebSocket.OPEN) {
                    client.close();
                }
            } catch (error) {
                console.error('Error closing client connection:', error);
            }
        });
        clients.clear();
    }

    if (wss) {
        wss.close(() => {
            console.log('WebSocket server closed');
            wss = null;
        });
    }
};

export { startMetricsSimulation, stopMetricsSimulation };