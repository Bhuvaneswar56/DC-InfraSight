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
    Stack,
    FormControlLabel,
    Switch
} from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Clock, Cpu, Thermometer, Battery, Power, Wind, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../services/auth.js';
import { useWebSocket } from '../contexts/WebSocketContext';

const AnalyticsPage = () => {
    const navigate = useNavigate();
    const [metrics, setMetrics] = useState({});
    const [historicalData, setHistoricalData] = useState({});
    const [selectedTimeRange, setSelectedTimeRange] = useState('24h');
    const [selectedEquipmentType, setSelectedEquipmentType] = useState('ALL');
    const [equipment, setEquipment] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const ws = useRef(null);

    // Using WebSocket Context instead of local state
    const { isServerRunning, setIsServerRunning, isConnected, setIsConnected } = useWebSocket();

    useEffect(() => {
        const fetchEquipment = async () => {
            try {
                setLoading(true);
                const response = await axiosInstance.get('/equipment');
                if (response.data.success) {
                    setEquipment(response.data.data);
                }
                setLoading(false);
            } catch (error) {
                console.error('Error fetching equipment:', error);
                setError('Failed to fetch equipment data');
                setLoading(false);
            }
        };

        fetchEquipment();
    }, []);

    const handleServerToggle = async (event) => {
        const action = event.target.checked ? 'start' : 'stop';
        try {
            const response = await axiosInstance.post(`/websocket/${action}`);
            if (response.data.message) {
                setIsServerRunning(action === 'start');
                if (action === 'start') {
                    connectWebSocket();
                } else {
                    if (ws.current) {
                        ws.current.close();
                    }
                    setMetrics({});
                    setHistoricalData({});
                }
            }
        } catch (error) {
            console.error(`Failed to ${action} server:`, error);
        }
    };

    const connectWebSocket = () => {
        console.log('Attempting to connect to WebSocket...');
        try {
            ws.current = new WebSocket('ws://localhost:8800');

            ws.current.onopen = () => {
                console.log('WebSocket connected successfully');
                setIsConnected(true);
            };

            ws.current.onmessage = (event) => {
                try {
                    const data = JSON.parse(event.data);
                    if (data.type === 'metrics') {
                        setMetrics(prevMetrics => ({
                            ...prevMetrics,
                            [data.equipmentId]: data.data
                        }));

                        setHistoricalData(prev => {
                            const newHistory = prev[data.equipmentId] || [];
                            return {
                                ...prev,
                                [data.equipmentId]: [
                                    ...newHistory,
                                    { timestamp: new Date(), ...data.data }
                                ].slice(-20)
                            };
                        });
                    }
                } catch (error) {
                    console.error('Error parsing WebSocket message:', error);
                }
            };

            ws.current.onerror = (error) => {
                console.error('WebSocket error:', error);
                setIsConnected(false);
            };

            ws.current.onclose = () => {
                console.log('WebSocket disconnected');
                setIsConnected(false);
                if (isServerRunning) {
                    setTimeout(connectWebSocket, 5000);
                }
            };
        } catch (error) {
            console.error('Error creating WebSocket connection:', error);
        }
    };

    // Effect to connect WebSocket when server is running
    useEffect(() => {
        if (isServerRunning) {
            connectWebSocket();
        }
        return () => {
            if (ws.current) {
                ws.current.close();
            }
        };
    }, [isServerRunning]);

    const getMetricIcon = (metricType) => {
        switch(metricType) {
            case 'temperature': return <Thermometer style={{ color: '#ef4444' }} />;
            case 'cpuLoad': return <Cpu style={{ color: '#3b82f6' }} />;
            case 'powerUsage': return <Power style={{ color: '#8b5cf6' }} />;
            case 'batteryLevel': return <Battery style={{ color: '#22c55e' }} />;
            case 'airflow': return <Wind style={{ color: '#06b6d4' }} />;
            case 'inputVoltage':
            case 'outputVoltage': return <Zap style={{ color: '#eab308' }} />;
            default: return <Clock style={{ color: '#6b7280' }} />;
        }
    };

    const getMetricUnit = (metricType) => {
        switch(metricType) {
            case 'temperature': return '°C';
            case 'cpuLoad':
            case 'memoryUsage':
            case 'batteryLevel': return '%';
            case 'powerUsage': return 'W';
            case 'airflow': return 'CFM';
            case 'inputVoltage':
            case 'outputVoltage': return 'V';
            default: return '';
        }
    };

    const renderMetricGraph = (equipmentId, metricKey) => {
        const data = historicalData[equipmentId] || [];
        
        return (
            <Box sx={{ height: 150 }}>
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis 
                            dataKey="timestamp"
                            tick={false}
                        />
                        <YAxis />
                        <Tooltip 
                            contentStyle={{
                                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                                border: 'none',
                                borderRadius: '4px',
                                boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
                            }}
                        />
                        <Line 
                            type="monotone"
                            dataKey={metricKey}
                            stroke="#8884d8"
                            dot={false}
                            isAnimationActive={false}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </Box>
        );
    };

    const renderEquipmentCard = (equip) => {
        const data = metrics[equip._id];
        if (!data) return null;

        return (
            <Grid item xs={12} md={6} lg={4} key={equip._id}>
                <Card 
                    onClick={() => navigate(`/analytics/${equip._id}`)}
                    sx={{ 
                        height: '100%', 
                        cursor: 'pointer',
                        '&:hover': { 
                            boxShadow: 6,
                            transform: 'translateY(-2px)',
                            transition: 'all 0.2s'
                        }
                    }}
                >
                    <CardContent>
                        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                            <Box>
                                <Typography variant="h6">{equip.name}</Typography>
                                <Typography color="textSecondary" variant="body2">
                                    {equip.manufacturer} - {equip.model}
                                </Typography>
                            </Box>
                            <Box 
                                sx={{ 
                                    width: 10, 
                                    height: 10, 
                                    borderRadius: '50%', 
                                    bgcolor: isConnected ? 'success.main' : 'error.main' 
                                }} 
                            />
                        </Box>

                        <Grid container spacing={2}>
                            {Object.entries(data)
                                .filter(([key]) => key !== 'lastUpdated')
                                .map(([key, value]) => (
                                    <Grid item xs={12} key={key}>
                                        <Box sx={{ 
                                            bgcolor: 'grey.50', 
                                            p: 2, 
                                            borderRadius: 1,
                                            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                                        }}>
                                            <Box display="flex" justifyContent="space-between" mb={1}>
                                                <Box display="flex" alignItems="center" gap={1}>
                                                    {getMetricIcon(key)}
                                                    <Typography variant="body2" sx={{ textTransform: 'capitalize' }}>
                                                        {key.replace(/([A-Z])/g, ' $1').trim()}
                                                    </Typography>
                                                </Box>
                                                <Typography variant="body2" fontWeight="medium">
                                                    {typeof value === 'number' ? value.toFixed(1) : value}
                                                    {getMetricUnit(key)}
                                                </Typography>
                                            </Box>
                                            {historicalData[equip._id] && 
                                                renderMetricGraph(equip._id, key)
                                            }
                                        </Box>
                                    </Grid>
                                ))}
                        </Grid>
                    </CardContent>
                </Card>
            </Grid>
        );
    };

    const filteredEquipment = equipment.filter(eq => 
        selectedEquipmentType === 'ALL' || eq.type === selectedEquipmentType
    );

    if (loading) {
        return (
            <Container maxWidth="xl" sx={{ py: 4 }}>
                <Typography>Loading equipment data...</Typography>
            </Container>
        );
    }

    if (error) {
        return (
            <Container maxWidth="xl" sx={{ py: 4 }}>
                <Typography color="error">{error}</Typography>
            </Container>
        );
    }

    return (
        <Container maxWidth="xl" sx={{ py: 4 }}>
            <Box sx={{ mb: 4 }}>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                    <Box>
                        <Typography variant="h4" gutterBottom>
                            Analytics Dashboard
                        </Typography>
                        <Typography variant="body1" color="textSecondary">
                            Real-time equipment monitoring
                        </Typography>
                    </Box>

                    <Stack direction="row" spacing={3} alignItems="center">
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={isServerRunning}
                                    onChange={handleServerToggle}
                                    color="primary"
                                />
                            }
                            label={isServerRunning ? "Stop Server" : "Start Server"}
                        />
                        <FormControl size="small">
                            <Select
                                value={selectedTimeRange}
                                onChange={(e) => setSelectedTimeRange(e.target.value)}
                            >
                                <MenuItem value="1h">Last Hour</MenuItem>
                                <MenuItem value="6h">Last 6 Hours</MenuItem>
                                <MenuItem value="24h">Last 24 Hours</MenuItem>
                                <MenuItem value="7d">Last 7 Days</MenuItem>
                            </Select>
                        </FormControl>

                        <FormControl size="small">
                            <Select
                                value={selectedEquipmentType}
                                onChange={(e) => setSelectedEquipmentType(e.target.value)}
                            >
                                <MenuItem value="ALL">All Equipment</MenuItem>
                                <MenuItem value="SERVER">Servers</MenuItem>
                                <MenuItem value="CRAH">CRAH Units</MenuItem>
                                <MenuItem value="UPS">UPS Units</MenuItem>
                                <MenuItem value="PDU">PDU Units</MenuItem>
                            </Select>
                        </FormControl>
                    </Stack>
                </Box>

                <Typography 
                    variant="body2" 
                    sx={{ color: isConnected ? 'success.main' : 'error.main' }}
                >
                    {isConnected ? 'Connected to Metrics Server' : 'Disconnected from Metrics Server'}
                </Typography>
            </Box>

            <Grid container spacing={3}>
                {filteredEquipment.map(renderEquipmentCard)}
            </Grid>
        </Container>
    );
};

export default AnalyticsPage;