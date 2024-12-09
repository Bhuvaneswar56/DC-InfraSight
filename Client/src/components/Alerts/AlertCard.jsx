import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Card,
    Box,
    Typography,
    Chip
} from '@mui/material';
import { AlertTriangle, AlertCircle } from 'lucide-react';

const AlertCard = ({ alert }) => {
    const navigate = useNavigate();

    const getPriorityColor = (priority) => priority === 'critical' ? 'error' : 'warning';
    const getStatusColor = (status) => status === 'active' ? 'error' : 'success';

    return (
        <Card 
            sx={{ 
                p: 2, 
                cursor: 'pointer',
                '&:hover': { boxShadow: 3 }
            }}
            onClick={() => navigate(`/alerts/${alert._id}`)}
        >
            <Box display="flex" justifyContent="space-between" alignItems="center">
                <Box display="flex" gap={2} alignItems="center">
                    {alert.priority === 'critical' ? (
                        <AlertTriangle className="text-red-500" />
                    ) : (
                        <AlertCircle className="text-orange-500" />
                    )}
                    <div>
                        <Typography variant="subtitle1" fontWeight="medium">
                            {alert.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            {alert.description}
                        </Typography>
                        <Chip label={alert.equipment_id.name} color="primary" size="small" />
                    </div>
                </Box>
                <Box display="flex" alignItems="center" gap={2}>
                    <Chip 
                        label={alert.priority}
                        color={getPriorityColor(alert.priority)}
                        size="small"
                    />
                    <Chip 
                        label={alert.status}
                        color={getStatusColor(alert.status)}
                        size="small"
                    />
                    <Typography variant="caption" color="text.secondary">
                        {new Date(alert.createdAt).toLocaleString()}
                    </Typography>
                </Box>
            </Box>
        </Card>
    );
};

export default AlertCard;