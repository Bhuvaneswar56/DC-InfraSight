import React, { useState, useEffect } from 'react';
import { 
    Container,
    Box,
    Typography,
    Button,
    Grid,
    CircularProgress
} from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import AlertCard from '../components/AlertCard.jsx'
import AlertFilters from '../components/AlertFilters';
import AlertStats from '../components/AlertStats';

const AlertsPage = () => {
    const [alerts, setAlerts] = useState([]);
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
            const response = await axios.get('http://localhost:3000/api/infra/alerts');
            setAlerts(response.data.data);
        } catch (error) {
            console.error('Error fetching alert:', error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const alertStats = {
        total: alerts.length,
        active: alerts.filter(alert => alert.status === 'active').length,
        critical: alerts.filter(alert => alert.priority === 'critical').length,
        warning: alerts.filter(alert => alert.priority === 'warning').length
    };

    const filteredAlerts = alerts.filter(alert => {
        return (statusFilter === 'all' || alert.status === statusFilter) &&
               (priorityFilter === 'all' || alert.priority === priorityFilter);
    });

    if (loading) {
        return (
            <Container maxWidth="xl" sx={{ py: 4 }}>
                <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
                    <CircularProgress />
                </Box>
            </Container>
        );
    }

    if (error) {
        return (
            <Container maxWidth="xl" sx={{ py: 4 }}>
                <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" minHeight="60vh">
                    <XCircle size={48} className="text-red-500 mb-2" />
                    <Typography variant="h6" color="error">Error loading alerts</Typography>
                    <Typography color="text.secondary">{error}</Typography>
                    <Button variant="outlined" onClick={fetchAlerts} sx={{ mt: 2 }}>Retry</Button>
                </Box>
            </Container>
        );
    }

    return (
        <Container maxWidth="xl" sx={{ py: 4 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
                <Typography variant="h4" component="h1">Alerts</Typography>
                <AlertStats 
                    totalAlerts={alertStats.total}
                    activeAlerts={alertStats.active}
                    criticalAlerts={alertStats.critical}
                />
            </Box>

            <AlertFilters 
                statusFilter={statusFilter}
                priorityFilter={priorityFilter}
                setStatusFilter={setStatusFilter}
                setPriorityFilter={setPriorityFilter}
            />

            <Grid container spacing={2}>
                {filteredAlerts.map((alert) => (
                    <Grid item xs={12} key={alert._id}>
                        <AlertCard alert={alert} />
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
};

export default AlertsPage;