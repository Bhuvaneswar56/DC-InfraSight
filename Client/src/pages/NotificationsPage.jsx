import React, { useEffect, useState } from 'react';
import { Container, Typography, Box, Pagination } from '@mui/material';
import NotificationHeader from '../components/Notifications/NotificationHeader';
import NotificationList from '../components/Notifications/NotificationList';
import API_INSTANCE from '../services/auth';

function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [counts, setCounts] = useState({});
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchNotifications = async () => {
    try {
      const response = await API_INSTANCE.get(`/notifications?page=${page}&limit=10`);
      setNotifications(response.data.data.docs);
      setTotalPages(response.data.data.totalPages);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const fetchCounts = async () => {
    try {
      const response = await API_INSTANCE.get('/notifications/counts');
      setCounts(response.data.data);
    } catch (error) {
      console.error('Error fetching counts:', error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await Promise.all([fetchNotifications(), fetchCounts()]);
      setLoading(false);
    };
    fetchData();
  }, [page]);

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  return (
    <Container maxWidth="lg">
      <Box py={4}>
        <Typography variant="h4" gutterBottom>
          Notifications
        </Typography>
        
        <NotificationHeader counts={counts} />
        
        <NotificationList 
          notifications={notifications} 
          loading={loading} 
        />

        <Box display="flex" justifyContent="center" mt={4}>
          <Pagination 
            count={totalPages} 
            page={page} 
            onChange={handlePageChange} 
            color="primary" 
          />
        </Box>
      </Box>
    </Container>
  );
}

export default NotificationsPage;