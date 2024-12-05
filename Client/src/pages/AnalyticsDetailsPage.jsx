import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
    Container, 
    Box, 
    Typography, 
    Grid,
    IconButton 
} from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import TimeRangeSelector from '../components/TimeRangeSelector';
import MetricsTimelineChart from '../components/MetricsTimelineChart';
import MetricsSummary from '../components/MetricsSummary';
import axiosInstance from '../services/auth.js'

const AnalyticsDetailsPage = () => {
    const { equipmentId } = useParams();
    const navigate = useNavigate();
    const [equipment, setEquipment] = useState(null);
    const [metrics, setMetrics] = useState([]);
    const [selectedTimeRange, setSelectedTimeRange] = useState('24h');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [equipmentResponse, metricsResponse] = await Promise.all([
                    axiosInstance.get(`/equipment/${equipmentId}`),
                    axiosInstance.get(`/websocket/${equipmentId}`, {
                        params: { duration: selectedTimeRange }
                    })
                ]);

                console.log('Equipment Response:', equipmentResponse.data);
                console.log('Metrics Response:', metricsResponse.data);

                if (equipmentResponse.data.success) {
                    setEquipment(equipmentResponse.data.data);
                }

                if (metricsResponse.data.success) {
                    const formattedMetrics = metricsResponse.data.data.reduce((acc, metric) => {
                        if (!acc[metric.type]) {
                            acc[metric.type] = [];
                        }
                        acc[metric.type].push({
                            timestamp: new Date(metric.timestamp),
                            value: metric.value
                        });
                        return acc;
                    }, {});
                    setMetrics(formattedMetrics);
                }
                setLoading(false);
            } catch (error) {
                console.error('Error fetching data:', error);
                setError('Failed to fetch equipment data');
                setLoading(false);
            }
        };

        fetchData();
    }, [equipmentId, selectedTimeRange]);

    const renderMetricCharts = () => {
        const chartConfig = {
            'SERVER': [
                { title: "CPU Load", metricKey: "cpuLoad", unit: "%" },
                { title: "Memory Usage", metricKey: "memoryUsage", unit: "%" },
                { title: "Temperature", metricKey: "temperature", unit: "°C" },
                { title: "Power Usage", metricKey: "powerUsage", unit: "W" }
            ],
            'CRAH': [
                { title: "Temperature", metricKey: "temperature", unit: "°C" },
                { title: "Airflow", metricKey: "airflow", unit: "CFM" },
                { title: "Power Usage", metricKey: "powerUsage", unit: "W" }
            ],
            'UPS': [
                { title: "Battery Level", metricKey: "batteryLevel", unit: "%" },
                { title: "Input Voltage", metricKey: "inputVoltage", unit: "V" },
                { title: "Output Voltage", metricKey: "outputVoltage", unit: "V" }
            ],
            'PDU': [
                { title: "Input Voltage", metricKey: "inputVoltage", unit: "V" },
                { title: "Output Voltage", metricKey: "outputVoltage", unit: "V" },
                { title: "Power Usage", metricKey: "powerUsage", unit: "W" },
                { title: "Temperature", metricKey: "temperature", unit: "°C" }
            ]
        };

        const equipmentCharts = chartConfig[equipment?.type] || [];

        return (
            <Grid container spacing={3}>
                {equipmentCharts.map(({ title, metricKey, unit }) => (
                    <Grid item xs={12} md={6} key={metricKey}>
                        <MetricsTimelineChart 
                            title={title}
                            data={metrics[metricKey] || []}
                            metricKey="value"
                            unit={unit}
                        />
                    </Grid>
                ))}
            </Grid>
        );
    };

    if (loading) {
        return (
            <Container maxWidth="xl" sx={{ py: 4 }}>
                <Typography>Loading...</Typography>
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
            <Box display="flex" alignItems="center" mb={4}>
                <IconButton 
                    onClick={() => navigate('/analytics')} 
                    sx={{ mr: 2 }}
                >
                    <ArrowBack />
                </IconButton>
                <Box>
                    <Typography variant="h4">
                        {equipment?.name || 'Equipment Details'}
                    </Typography>
                    <Typography color="textSecondary">
                        {equipment?.manufacturer} - {equipment?.model}
                    </Typography>
                </Box>
                <Box ml="auto">
                    <TimeRangeSelector 
                        value={selectedTimeRange} 
                        onChange={setSelectedTimeRange}
                    />
                </Box>
            </Box>

            <MetricsSummary metrics={metrics} />
            {renderMetricCharts()}
        </Container>
    );
};

export default AnalyticsDetailsPage;