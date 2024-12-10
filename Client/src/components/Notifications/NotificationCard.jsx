import React from 'react';
import { Card, CardContent, Typography, Box, Chip, IconButton } from '@mui/material';
import { NotificationsActive, Warning, Build, Report } from '@mui/icons-material';
import { formatDistanceToNow } from 'date-fns';

const getNotificationIcon = (type) => {
  switch (type) {
    case 'Alert':
      return <Warning color="error" />;
    case 'Maintenance':
      return <Build color="primary" />;
    case 'Incident Management':
        return <Report color="warning" />;
    default:
      return <NotificationsActive />;
  }
};

const getNotificationColor = (type) => {
  switch (type) {
    case 'Alert':
      return 'error';
    case 'Maintenance':
      return 'primary';
    case 'Incident Management':
      return 'warning';
    default:
      return 'default';
  }
};

const NotificationCard = ({ notification }) => {
  const { type, title, content, equipment, createdAt } = notification;

  return (
    <Card sx={{ mb: 2, '&:hover': { boxShadow: 3 } }}>
      <CardContent>
        <Box display="flex" alignItems="center" justifyContent="space-between" mb={1}>
          <Box display="flex" alignItems="center" gap={1}>
            <IconButton size="small">
              {getNotificationIcon(type)}
            </IconButton>
            <Chip 
              label={type} 
              size="small" 
              color={getNotificationColor(type)}
              variant="outlined" 
            />
          </Box>
          <Typography variant="caption" color="text.secondary">
            {formatDistanceToNow(new Date(createdAt), { addSuffix: true })}
          </Typography>
        </Box>
        
        <Typography variant="h6" component="div" gutterBottom>
          {title}
        </Typography>
        
        <Typography variant="body2" color="text.secondary" gutterBottom>
          {content}
        </Typography>
        
        {equipment && (
          <Box mt={1}>
            <Typography variant="caption" color="text.secondary">
              Equipment: {equipment.name} ({equipment.serialNumber})
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default NotificationCard;