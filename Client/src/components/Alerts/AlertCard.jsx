import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Card,
    Box,
    Typography,
    Chip,
} from '@mui/material';
import { AlertTriangle, AlertCircle } from 'lucide-react';

const AlertCard = ({ alert }) => {
    const navigate = useNavigate();

    const getPriorityColor = (priority) => (priority === 'critical' ? 'error' : 'warning');
    const getStatusColor = (status) => (status === 'active' ? 'error' : 'success');

    return (
        <Card
            sx={{
                p: 2,
                cursor: 'pointer',
                '&:hover': { boxShadow: 3 },
                display: 'flex',
                flexDirection: 'column', // Adjusts for mobile view
                gap: 2,
                maxWidth: '100%', // Ensures it fits within parent container
            }}
            onClick={() => navigate(`/alerts/${alert._id}`)}
        >
            <Box
                display="flex"
                flexDirection={{ xs: 'column', sm: 'row' }} // Stack on small screens
                justifyContent="space-between"
                alignItems={{ xs: 'flex-start', sm: 'center' }} // Adjust alignment for small screens
                gap={2} // Add space between items for smaller screens
            >
                <Box display="flex" gap={2} alignItems="center" flexWrap="wrap">
                    {alert.priority === 'critical' ? (
                        <AlertTriangle className="text-red-500" />
                    ) : (
                        <AlertCircle className="text-orange-500" />
                    )}
                    <Box>
                        <Typography
                            variant="subtitle1"
                            fontWeight="medium"
                            sx={{ wordWrap: 'break-word' }} // Handles long text
                        >
                            {alert.title}
                        </Typography>
                        <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ wordWrap: 'break-word' }} // Ensures the description wraps
                        >
                            {alert.description}
                        </Typography>
                        <Chip
                            label={alert.equipment_id.name}
                            color="primary"
                            size="small"
                            sx={{ maxWidth: '100%', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} // Responsive chip
                        />
                    </Box>
                </Box>
                <Box
                    display="flex"
                    paddingLeft={{md:10, lg:0}}
                    flexWrap="wrap" // Wraps items for smaller screens
                    alignItems="center"
                    justifyContent="flex-start" // Aligns to the left on smaller screens
                    gap={2} // Adds space between elements
                >
                    <Chip
                        label={alert.priority}
                        color={getPriorityColor(alert.priority)}
                        size="small"
                        sx={{ flexShrink: 0 }} // Prevents shrinking
                    />
                    <Chip
                        label={alert.status}
                        color={getStatusColor(alert.status)}
                        size="small"
                        sx={{ flexShrink: 0 }} // Prevents shrinking
                    />
                    <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ wordWrap: 'break-word' }} // Handles long date strings
                    >
                        {new Date(alert.createdAt).toLocaleString()}
                    </Typography>
                </Box>
            </Box>
        </Card>
    );
};

export default AlertCard;
