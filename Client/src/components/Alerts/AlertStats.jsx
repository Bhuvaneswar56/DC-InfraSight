import React from 'react';
import {
    Box,
    Chip
} from '@mui/material';
import { Bell, AlertTriangle, AlertCircle } from 'lucide-react';

const AlertStats = ({ totalAlerts, activeAlerts, criticalAlerts }) => {
    return (
        <Box display="flex" gap={2}>
            <Chip 
                icon={<Bell size={16} />}
                label={`Total: ${totalAlerts}`}
                color="default"
            />
            <Chip 
                icon={<AlertTriangle size={16} />}
                label={`Active: ${activeAlerts}`}
                color="error"
            />
            <Chip 
                icon={<AlertCircle size={16} />}
                label={`Critical: ${criticalAlerts}`}
                color="error"
            />
        </Box>
    );
};

export default AlertStats;