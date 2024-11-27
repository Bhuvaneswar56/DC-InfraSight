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
} from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Clock, Cpu, Thermometer, Battery, Power, Wind, Zap } from 'lucide-react';
import axios from 'axios';

const AnalyticsPage = () => {
    const [metrics, setMetrics] = useState({});
    const [historicalData, setHistoricalData] = useState({});
    const [selectedTimeRange, setSelectedTimeRange] = useState('24h');
    const [selectedEquipmentType, setSelectedEquipmentType] = useState('ALL');
    const [isConnected, setIsConnected] = useState(false);
    const [equipment, setEquipment] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const ws = useRef(null);

    useEffect(() => {
        const fetchEquipment = async () => {
            try {
                setLoading(true);
                // Get token from localStorage
                const token = localStorage.getItem('accessToken');
                
                const response = await axios.get('http://localhost:3000/api/infra/equipment', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

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

    useEffect(() => {
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

                ws.current.onclose = (event) => {
                    console.log('WebSocket closed:', event);
                    setIsConnected(false);
                    setTimeout(connectWebSocket, 5000);
                };
            } catch (error) {
                console.error('Error creating WebSocket connection:', error);
            }
        };

        connectWebSocket();
        return () => {
            if (ws.current) {
                ws.current.close();
            }
        };
    }, []);

    const getMetricIcon = (metricType) => {
        switch(metricType) {
            case 'temperature': return <Thermometer sx={{ color: '#ef4444' }} />;
            case 'cpuLoad': return <Cpu sx={{ color: '#3b82f6' }} />;
            case 'powerUsage': return <Power sx={{ color: '#8b5cf6' }} />;
            case 'batteryLevel': return <Battery sx={{ color: '#22c55e' }} />;
            case 'airflow': return <Wind sx={{ color: '#06b6d4' }} />;
            case 'inputVoltage':
            case 'outputVoltage': return <Zap sx={{ color: '#eab308' }} />;
            default: return <Clock sx={{ color: '#6b7280' }} />;
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

    const renderMetricGraph = (equipmentId, metricType) => {
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
                        <YAxis domain={['auto', 'auto']} />
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
                            dataKey={metricType}
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
                <Card sx={{ 
                    height: '100%', 
                    '&:hover': { 
                        boxShadow: 6,
                        transform: 'translateY(-2px)',
                        transition: 'all 0.2s'
                    }
                }}>
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

                    <Stack direction="row" spacing={2}>
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