// MetricsSummary.jsx
import React from 'react';
import { Grid, Card, CardContent, Typography } from '@mui/material';

const MetricsSummary = ({ metrics }) => {
    if (!metrics || Object.keys(metrics).length === 0) return null;

    const calculateStats = (metricType) => {
        const metricData = metrics[metricType];
        if (!metricData || !Array.isArray(metricData) || metricData.length === 0) return null;

        const values = metricData.map(m => m.value);
        return {
            max: Math.max(...values),
            min: Math.min(...values),
            avg: values.reduce((a, b) => a + b, 0) / values.length
        };
    };

    const metricTypes = Object.keys(metrics);

    return (
        <Grid container spacing={2} sx={{ mb: 4 }}>
            {metricTypes.map(metricType => {
                const stats = calculateStats(metricType);
                if (!stats) return null;

                return (
                    <Grid item xs={12} md={4} key={metricType}>
                        <Card>
                            <CardContent>
                                <Typography variant="subtitle2" gutterBottom sx={{ textTransform: 'capitalize' }}>
                                    {metricType.replace(/([A-Z])/g, ' $1').trim()}
                                </Typography>
                                <Grid container spacing={2}>
                                    <Grid item xs={4}>
                                        <Typography variant="caption" display="block">Min</Typography>
                                        <Typography variant="body1">{stats.min.toFixed(1)}</Typography>
                                    </Grid>
                                    <Grid item xs={4}>
                                        <Typography variant="caption" display="block">Avg</Typography>
                                        <Typography variant="body1">{stats.avg.toFixed(1)}</Typography>
                                    </Grid>
                                    <Grid item xs={4}>
                                        <Typography variant="caption" display="block">Max</Typography>
                                        <Typography variant="body1">{stats.max.toFixed(1)}</Typography>
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Card>
                    </Grid>
                );
            })}
        </Grid>
    );
};

export default MetricsSummary;