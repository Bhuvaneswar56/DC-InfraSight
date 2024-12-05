import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import {
    Container,
    Box,
    Card,
    CardHeader,
    CardContent,
    Typography,
    Chip,
    Button,
    CircularProgress,
    
} from '@mui/material';
import { CheckCircle, XCircle, AlertCircle , AlertTriangle } from 'lucide-react';
console.log("test")

const AlertDetailsPage = () => {
    const { id } = useParams();
    const [alert, setAlert] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchAlertDetails();
    }, [id]);

    const fetchAlertDetails = async () => {
        try {
            const response = await axios.get(`http://localhost:3000/api/infra/alerts/${id}`);
            setAlert(response.data.data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleAcknowledge = async () => {
        try {
            await axios.put(`http://localhost:3000/api/infra/alerts/${id}/status`, { status: 'acknowledged' });
            fetchAlertDetails();
        } catch (err) {
            setError(err.message);
        }
    };

    const handleResolve = async () => {
        try {
            await axios.put(`http://localhost:3000/api/infra/alerts/${id}/status`, { status: 'resolved' });
            fetchAlertDetails();
        } catch (err) {
            setError(err.message);
        }
    };

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
                    <Typography variant="h6" color="error">Error loading alert</Typography>
                    <Typography color="text.secondary">{error}</Typography>
                    <Button variant="outlined" onClick={fetchAlertDetails} sx={{ mt: 2 }}>Retry</Button>
                </Box>
            </Container>
        );
    }

    if (!alert) {
        return (
            <Container maxWidth="xl" sx={{ py: 4 }}>
                <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" minHeight="60vh">
                    <CheckCircle size={48} className="text-green-500 mb-2" />
                    <Typography variant="h6">Alert not found</Typography>
                </Box>
            </Container>
        );
    }

    return (
        <Container maxWidth="xl" sx={{ py: 4 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
                <Typography variant="h4" component="h1">Alert Details</Typography>
                <Box display="flex" gap={2}>
                    <Button variant="contained" color="primary" onClick={handleAcknowledge}>
                        Acknowledge
                    </Button>
                    <Button variant="contained" color="success" onClick={handleResolve}>
                        Resolve
                    </Button>
                </Box>
            </Box>

            <Card>
                <CardHeader
                    title={alert.title}
                    subheader={new Date(alert.createdAt).toLocaleString()}
                />
                <CardContent>
                    <Box display="flex" alignItems="center" gap={2} mb={2}>
                        {alert.priority === 'critical' ? (
                            <AlertCircle className="text-red-500" />
                        ) : (
                            <AlertTriangle className="text-orange-500" />
                        )}
                        <Chip label={alert.priority} color={alert.priority === 'critical' ? 'error' : 'warning'} />
                        <Chip label={alert.status} color={alert.status === 'active' ? 'error' : 'success'} />
                    </Box>
                    <Typography variant="body1">{alert.description}</Typography>
                    <Box display="flex" alignItems="center" gap={2} mt={2}>
                        <Chip label={alert.equipment_id.name} color="primary" />
                        <Chip label={alert.metrics_id.type} color="primary" />
                    </Box>
                </CardContent>
            </Card>
        </Container>
    );
};

export default AlertDetailsPage;