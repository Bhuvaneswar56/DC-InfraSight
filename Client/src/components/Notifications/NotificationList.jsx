import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';
import NotificationCard from './NotificationCard';

const NotificationList = ({ notifications, loading }) => {
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" p={3}>
        <CircularProgress />
      </Box>
    );
  }

  if (!notifications?.length) {
    return (
      <Box textAlign="center" p={3}>
        <Typography color="text.secondary">
          No notifications found
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      {notifications.map((notification) => (
        <NotificationCard 
          key={notification._id} 
          notification={notification} 
        />
      ))}
    </Box>
  );
};

export default NotificationList;