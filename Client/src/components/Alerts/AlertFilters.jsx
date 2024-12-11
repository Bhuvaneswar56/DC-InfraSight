import React from 'react';
import {
    Box,
    FormControl,
    InputLabel,
    Select,
    MenuItem
} from '@mui/material';

const AlertFilters = ({ statusFilter, priorityFilter, setStatusFilter, setPriorityFilter }) => {
    return (
        <Box className='flex justify-center md:justify-normal ' gap={2} mb={4}>
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
    );
};

export default AlertFilters;