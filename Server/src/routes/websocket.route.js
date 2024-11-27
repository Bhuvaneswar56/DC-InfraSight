// routes/admin.route.js
import express from 'express';
import { getAggregateMetrics, getMetricsByEqId, getMetricsData } from '../controllers/metric.controller.js';
import { startWebSocketServer , stopWebSocketServer } from '../../websocket.js';
const router = express.Router();

router.post('/stop', async (req, res) => {
    try {
        stopWebSocketServer();
        res.json({ message: 'WebSocket server stopped' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to stop WebSocket server' });
    }
});

router.post('/start', async (req, res) => {
    try {
        startWebSocketServer();
        res.json({ message: 'WebSocket server started' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to start WebSocket server' });
    }
});

router.get('/aggregatedmetrics',getAggregateMetrics)
router.get('/metrics',getMetricsData)
router.get('/:id', getMetricsByEqId)

export default router;