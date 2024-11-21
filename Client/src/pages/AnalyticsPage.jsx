// src/pages/AnalyticsPage.jsx
import React, { useState, useEffect, useRef } from 'react';
import { 
    Card, 
    CardContent, 
    Typography, 
    Grid, 
    Container,
    Box,
    FormControl,
    Select,
    MenuItem,
    Paper
} from '@mui/material';
// import { 
//     Memory as CpuIcon,
//     Speed as PerformanceIcon,
//     Thermostat as TempIcon,
//     BoltOutlined as PowerIcon
// } from '@mui/icons-material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const AnalyticsPage = () => {
    const [metrics, setMetrics] = useState({});
    const [historicalData, setHistoricalData] = useState([]);
    const [timeRange, setTimeRange] = useState('24h');
    const [isConnected, setIsConnected] = useState(false);
    const ws = useRef(null);

    useEffect(() => {
        // Connect to WebSocket
        connectWebSocket();

        // Cleanup on unmount
        return () => {
            if (ws.current) {
                ws.current.close();
            }
        };
    }, []);

    const connectWebSocket = () => {
        try {
            ws.current = new WebSocket('ws://localhost:8800');

            ws.current.onopen = () => {
                console.log('WebSocket Connected');
                setIsConnected(true);
            };

            ws.current.onmessage = (event) => {
                try {
                    const data = JSON.parse(event.data);
                    console.log('Received data:', data);  // Debug log

                    if (data.type === 'metrics') {
                        setMetrics(prevMetrics => ({
                            ...prevMetrics,
                            [data.equipmentId]: data.data
                        }));

                        // Add to historical data
                        setHistoricalData(prev => {
                            const newData = [...prev, {
                                timestamp: new Date().toLocaleTimeString(),
                                ...data.data
                            }];
                            return newData.slice(-50); // Keep last 50 points
                        });
                    }
                } catch (error) {
                    console.error('Error parsing WebSocket message:', error);
                }
            };

            ws.current.onclose = () => {
                console.log('WebSocket Disconnected');
                setIsConnected(false);
                // Try to reconnect after 5 seconds
                setTimeout(connectWebSocket, 5000);
            };

            ws.current.onerror = (error) => {
                console.error('WebSocket Error:', error);
                setIsConnected(false);
            };

        } catch (error) {
            console.error('WebSocket connection error:', error);
            setIsConnected(false);
        }
    };

    // Debug display for connection status
    useEffect(() => {
        console.log('Connection status:', isConnected);
        console.log('Current metrics:', metrics);
        console.log('Historical data:', historicalData);
    }, [isConnected, metrics, historicalData]);

    return (
        <Container maxWidth="xl" sx={{ py: 4 }}>
            {/* Connection Status */}
            <Box mb={2}>
                <Typography color={isConnected ? 'success.main' : 'error.main'}>
                    {isConnected ? 'Connected to Metrics Server' : 'Disconnected from Metrics Server'}
                </Typography>
            </Box>

            {/* Header */}
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
                <Box>
                    <Typography variant="h4" component="h1" gutterBottom>
                        System Metrics
                    </Typography>
                    <Typography variant="subtitle1" color="text.secondary">
                        Real-time performance monitoring
                    </Typography>
                </Box>
                <FormControl size="small">
                    <Select
                        value={timeRange}
                        onChange={(e) => setTimeRange(e.target.value)}
                    >
                        <MenuItem value="1h">Last Hour</MenuItem>
                        <MenuItem value="24h">Last 24 Hours</MenuItem>
                        <MenuItem value="7d">Last 7 Days</MenuItem>
                    </Select>
                </FormControl>
            </Box>

            {/* Metric Cards */}
            <Grid container spacing={3} mb={4}>
                {Object.entries(metrics).map(([equipId, data]) => (
                    <React.Fragment key={equipId}>
                        <Grid item xs={12} sm={6} md={3}>
                            <Card>
                                <CardContent>
                                    <Typography color="textSecondary" gutterBottom>
                                        CPU Load
                                    </Typography>
                                    <Typography variant="h5">
                                        {data.cpuLoad || 0}%
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                        {/* Add similar cards for other metrics */}
                    </React.Fragment>
                ))}
            </Grid>

            {/* Charts */}
            {historicalData.length > 0 && (
                <Paper sx={{ p: 3, mb: 4 }}>
                    <Typography variant="h6" gutterBottom>
                        Performance Trends
                    </Typography>
                    <Box sx={{ height: 400, width: '100%' }}>
                        <ResponsiveContainer>
                            <LineChart data={historicalData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="timestamp" />
                                <YAxis />
                                <Tooltip />
                                <Line 
                                    type="monotone" 
                                    dataKey="cpuLoad" 
                                    stroke="#1976d2" 
                                    name="CPU Load" 
                                />
                                <Line 
                                    type="monotone" 
                                    dataKey="temperature" 
                                    stroke="#ed6c02" 
                                    name="Temperature" 
                                />
                                <Line 
                                    type="monotone" 
                                    dataKey="powerUsage" 
                                    stroke="#d32f2f" 
                                    name="Power Usage" 
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </Box>
                </Paper>
            )}
        </Container>
    );
};

export default AnalyticsPage;