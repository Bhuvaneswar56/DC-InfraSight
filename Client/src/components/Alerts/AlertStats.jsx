import React from 'react';
import {
    Box,
    Chip
} from '@mui/material';
import { Bell, AlertTriangle, AlertCircle } from 'lucide-react';

const AlertStats = ({ totalAlerts, activeAlerts, criticalAlerts }) => {
    return (
        <Box
    display="flex"
    flexWrap="wrap" // Allows items to wrap on smaller screens
    alignItems="center"
    justifyContent={{ xs: 'center', md: 'flex-start' }} // Center on small screens, align left on medium+
    gap={2} // Adds space between chips
>
    <Chip
        sx={{
            position: { xs:'absolute', sm:'static' }, // 'absolute' for xs, normal flow for md+
            top: { xs: '2rem', md:'auto'}, // Only applies when position is 'absolute'
            right: { xs: '2.5rem', md:'auto' }, // Only applies when position is 'absolute'
            
        }}
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