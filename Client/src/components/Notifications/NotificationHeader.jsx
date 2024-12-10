import React from 'react';
import { Box, Card, Grid, Typography } from '@mui/material';
import { Warning, Build, ReportProblem, Notifications } from '@mui/icons-material';

const StatsCard = ({ title, count, icon, color }) => (
  <Card sx={{ p: 2 }}>
    <Box display="flex" alignItems="center" gap={2}>
      {icon}
      <Box>
        <Typography variant="h6" color={color}>
          {count}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {title}
        </Typography>
      </Box>
    </Box>
  </Card>
);

const NotificationHeader = ({ counts = {} }) => {
  return (
    <Grid container spacing={3} mb={4}>
      <Grid item xs={12} sm={6} md={3}>
        <StatsCard
          title="Total Notifications"
          count={counts.total || 0}
          icon={<Notifications color="action" />}
          color="text.primary"
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <StatsCard
          title="Alerts"
          count={counts.Alert || 0}
          icon={<Warning color="error" />}
          color="error.main"
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <StatsCard
          title="Maintenance"
          count={counts.Maintenance || 0}
          icon={<Build color="primary" />}
          color="primary.main"
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <StatsCard
          title="Incidents"
          count={counts['Incident Management'] || 0}
          icon={<ReportProblem color="warning" />}
          color="warning.main"
        />
      </Grid>
    </Grid>
  );
};

export default NotificationHeader;