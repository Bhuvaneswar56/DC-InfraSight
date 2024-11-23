// src/pages/alerts/AlertsPage.jsx
import React, { useState, useEffect } from 'react';
import { 
    Container, 
    Typography, 
    Box, 
    Card, 
    Grid,
    IconButton,
    Chip,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    TextField,
    InputAdornment,
    CircularProgress
} from '@mui/material';
import {
    AlertTriangle,
    Search,
    CheckCircle,
    XCircle,
    Bell,
    AlertCircle
} from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AlertsPage = () => {
    const [alerts, setAlerts] = useState([]);  // Initialize as empty array
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [statusFilter, setStatusFilter] = useState('all');
    const [priorityFilter, setPriorityFilter] = useState('all');
    const navigate = useNavigate();

    useEffect(() => {
        fetchAlerts();
    }, []);

    const fetchAlerts = async () => {
      try {
        setLoading(true);
        console.log('Fetching alerts...');
        const response = await axios.get('http://localhost:3000/api/infra/alerts'); // Make sure URL is correct
        console.log('Raw API Response:', response);
        
        if (response.data && response.data.data) {
            console.log('Alerts data:', response.data.data);
            setAlerts(response.data.data);
        } else {
            console.error('Unexpected response structure:', response.data);
            setError('Invalid response format');
        }
    } catch (error) {
        console.error('Error fetching alerts:', error);
        console.error('Error details:', error.response?.data);
        setError(error.message);
    } finally {
        setLoading(false);
    }
    };
    useEffect(() => {
      console.log('Current alerts state:', alerts);
      console.log('Loading state:', loading);
      console.log('Error state:', error);
  }, [alerts, loading, error]);

    // Calculate stats only if alerts array exists
    const alertStats = {
        total: alerts?.length || 0,
        active: alerts?.filter(alert => alert.status === 'active')?.length || 0,
        critical: alerts?.filter(alert => alert.priority === 'critical')?.length || 0,
        warning: alerts?.filter(alert => alert.priority === 'warning')?.length || 0
    };

    const getPriorityColor = (priority) => {
        return priority === 'critical' ? 'error' : 'warning';
    };

    const getStatusColor = (status) => {
        return status === 'active' ? 'error' : 'success';
    };

    // Filter alerts only if they exist
    const filteredAlerts = alerts?.filter(alert => {
        return (statusFilter === 'all' || alert.status === statusFilter) &&
               (priorityFilter === 'all' || alert.priority === priorityFilter);
    }) || [];

    // Show loading state
    if (loading) {
        return (
            <Container maxWidth="xl" sx={{ py: 4 }}>
                <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
                    <CircularProgress />
                </Box>
            </Container>
        );
    }

    // Show error state
    if (error) {
        return (
            <Container maxWidth="xl" sx={{ py: 4 }}>
                <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" minHeight="60vh">
                    <XCircle size={48} className="text-red-500 mb-2" />
                    <Typography variant="h6" color="error">Error loading alerts</Typography>
                    <Typography color="text.secondary">{error}</Typography>
                    <Button 
                        variant="outlined" 
                        onClick={fetchAlerts}
                        sx={{ mt: 2 }}
                    >
                        Retry
                    </Button>
                </Box>
            </Container>
        );
    }

    return (
        <Container maxWidth="xl" sx={{ py: 4 }}>
            {/* Header */}
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
                <Typography variant="h4" component="h1">
                    Alerts
                </Typography>
                <Box display="flex" gap={2}>
                    <Chip 
                        icon={<Bell size={16} />}
                        label={`Total: ${alertStats.total}`}
                        color="default"
                    />
                    <Chip 
                        icon={<AlertTriangle size={16} />}
                        label={`Active: ${alertStats.active}`}
                        color="error"
                    />
                    <Chip 
                        icon={<AlertCircle size={16} />}
                        label={`Critical: ${alertStats.critical}`}
                        color="error"
                    />
                </Box>
            </Box>

            {/* Filters */}
            <Box display="flex" gap={2} mb={4}>
                <TextField
                    placeholder="Search alerts..."
                    size="small"
                    sx={{ width: 300 }}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <Search size={20} />
                            </InputAdornment>
                        ),
                    }}
                />
                <FormControl size="small" sx={{ width: 150 }}>
                    <InputLabel>Status</InputLabel>
                    <Select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        label="Status"
                    >
                        <MenuItem value="all">All Status</MenuItem>
                        <MenuItem value="active">Active</MenuItem>
                        <MenuItem value="resolved">Resolved</MenuItem>
                    </Select>
                </FormControl>
                <FormControl size="small" sx={{ width: 150 }}>
                    <InputLabel>Priority</InputLabel>
                    <Select
                        value={priorityFilter}
                        onChange={(e) => setPriorityFilter(e.target.value)}
                        label="Priority"
                    >
                        <MenuItem value="all">All Priority</MenuItem>
                        <MenuItem value="critical">Critical</MenuItem>
                        <MenuItem value="warning">Warning</MenuItem>
                    </Select>
                </FormControl>
            </Box>

            {/* Alerts List */}
            <Grid container spacing={2}>
                {filteredAlerts.map((alert) => (
                    <Grid item xs={12} key={alert._id}>
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
                    </Grid>
                ))}
            </Grid>

            {/* Empty State */}
            {!loading && filteredAlerts.length === 0 && (
                <Box 
                    display="flex" 
                    flexDirection="column" 
                    alignItems="center" 
                    justifyContent="center" 
                    py={8}
                >
                    <CheckCircle size={48} className="text-green-500 mb-2" />
                    <Typography variant="h6">No alerts found</Typography>
                    <Typography color="text.secondary">
                        All systems are operating normally
                    </Typography>
                </Box>
            )}
        </Container>
    );
};

export default AlertsPage;