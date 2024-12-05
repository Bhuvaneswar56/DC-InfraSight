import React from 'react';
import { Box, Card, CardContent, Typography } from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const MetricsTimelineChart = ({ title, data, metricKey, unit }) => {
    if (!data || data.length === 0) return null;

    return (
        <Card sx={{ height: '100%', minHeight: 400 }}>
            <CardContent>
                <Typography variant="h6" gutterBottom>{title}</Typography>
                <Box sx={{ height: 350 }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis 
                                dataKey="timestamp"
                                tickFormatter={(timestamp) => {
                                    const date = new Date(timestamp);
                                    return `${date.getHours()}:${date.getMinutes()}`;
                                }}
                            />
                            <YAxis />
                            <Tooltip 
                                contentStyle={{
                                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                                    border: 'none',
                                    borderRadius: '4px',
                                    boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
                                }}
                                formatter={(value) => [`${value}${unit}`, title]}
                            />
                            <Line 
                                type="monotone"
                                dataKey={metricKey}
                                stroke="#8884d8"
                                dot={false}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </Box>
            </CardContent>
        </Card>
    );
};

export default MetricsTimelineChart;