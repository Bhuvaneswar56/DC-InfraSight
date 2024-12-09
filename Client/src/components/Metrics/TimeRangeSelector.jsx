import React from 'react';
import { FormControl, Select, MenuItem } from '@mui/material';

const TimeRangeSelector = ({ value, onChange }) => (
    <FormControl size="small">
        <Select
            value={value}
            onChange={(e) => onChange(e.target.value)}
        >
            <MenuItem value="1h">Last Hour</MenuItem>
            <MenuItem value="6h">Last 6 Hours</MenuItem>
            <MenuItem value="24h">Last 24 Hours</MenuItem>
            <MenuItem value="7d">Last 7 Days</MenuItem>
        </Select>
    </FormControl>
);

export default TimeRangeSelector;