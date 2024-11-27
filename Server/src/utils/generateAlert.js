import Alert from '../models/alert.model.js';
 
const thresholds = {
    // Server thresholds
    temperature: {
        warning: { min: 45, max: 65 },
        critical: { min: 65, max: 70 }
    },
    cpuLoad: {
        warning: 85,
        critical: 90
    },
    memoryUsage: {
        warning: 85,
        critical: 90
    },
    powerUsage: {
        server: {
            warning: 750,
            critical: 800
        },
        crah: {
            warning: 9200,
            critical: 9500
        },
        pdu: {
            warning: 9200,
            critical: 9500
        }
    },
    // CRAH specific thresholds
    airflow: {
        warning: 1600,
        critical: 1800
    },
    // UPS specific thresholds
    batteryLevel: {
        warning: 88,
        critical: 85
    },
    inputVoltage: {
        warning: { min: 395, max: 410 },
        critical: { min: 390, max: 415 }
    },
    outputVoltage: {
        warning: { min: 225, max: 235 },
        critical: { min: 220, max: 240 }
    }
};
 
const getMetricDisplayName = (type) => {
    const displayNames = {
        temperature: 'Temperature',
        cpuLoad: 'CPU Load',
        memoryUsage: 'Memory Usage',
        powerUsage: 'Power Usage',
        airflow: 'Airflow',
        batteryLevel: 'Battery Level',
        inputVoltage: 'Input Voltage',
        outputVoltage: 'Output Voltage'
    };
    return displayNames[type] || type;
};
 
const getMetricUnit = (type) => {
    const units = {
        temperature: '°C',
        cpuLoad: '%',
        memoryUsage: '%',
        powerUsage: 'W',
        airflow: 'CFM',
        batteryLevel: '%',
        inputVoltage: 'V',
        outputVoltage: 'V'
    };
    return units[type] || '';
};
 
const checkThresholds = (metric, equipment) => {
    let alertInfo = null;
    const metricType = metric.type;
    const value = metric.value;
    console.log('Checking thresholds for metric:', {
        type: metricType,
        value: value,
        equipment: equipment.type
    });
 
    // Helper function to check range-based thresholds
    const checkRange = (value, thresholdConfig) => {
        if (value > thresholdConfig.critical.max || value < thresholdConfig.critical.min) {
            return 'critical';
        } else if (value > thresholdConfig.warning.max || value < thresholdConfig.warning.min) {
            return 'warning';
        }
        return null;
    };
 
    // Helper function to check single-value thresholds
    const checkValue = (value, thresholdConfig) => {
        if (value >= thresholdConfig.critical) {
            return 'critical';
        } else if (value >= thresholdConfig.warning) {
            return 'warning';
        }
        return null;
    };
 
    let priority = null;
 
    // Check thresholds based on metric type
    switch (metricType) {
        case 'temperature':
        case 'inputVoltage':
        case 'outputVoltage':
            priority = checkRange(value, thresholds[metricType]);
            break;
 
        case 'cpuLoad':
        case 'memoryUsage':
        case 'airflow':
        case 'batteryLevel':
            priority = checkValue(value, thresholds[metricType]);
            break;
 
        case 'powerUsage':
            const powerThresholds = thresholds.powerUsage[equipment.type.toLowerCase()];
            if (powerThresholds) {
                priority = checkValue(value, powerThresholds);
            }
            break;
    }
 
    if (priority) {
        const displayName = getMetricDisplayName(metricType);
        const unit = getMetricUnit(metricType);
        alertInfo = {
            priority,
            type: metricType,
            title: `${priority === 'critical' ? 'Critical' : 'Warning'}: ${displayName} ${value}${unit}`,
            description: generateAlertDescription(metricType, value, unit, priority, equipment.type)
        };
    }
 
    return alertInfo;
};
 
const generateAlertDescription = (metricType, value, unit, priority, equipmentType) => {
    const displayName = getMetricDisplayName(metricType);
    const severity = priority === 'critical' ? 'critical' : 'warning';
    return `${equipmentType} ${displayName} has reached ${severity} levels at ${value}${unit}. ${
        priority === 'critical' ? 'Immediate action required.' : 'Please monitor closely.'
    }`;
};
 
export const generateAlert = async (metric, equipment) => {
    console.log('Generating alert for metric:', metric);
 
    const alertInfo = checkThresholds(metric, equipment);
    if (alertInfo) {
        try {
            // Check for existing active alert
            const existingAlert = await Alert.findOne({
                metrics_id: metric._id,
                type: alertInfo.type,
                status: 'active'
            });
 
            if (existingAlert) {
                // Update existing alert if priority changed
                if (existingAlert.priority !== alertInfo.priority) {
                    existingAlert.priority = alertInfo.priority;
                    existingAlert.title = alertInfo.title;
                    existingAlert.description = alertInfo.description;
                    await existingAlert.save();
                }
                return existingAlert;
            }
 
            // Create new alert
            const alert = await Alert.create({
                metrics_id: metric._id,
                equipment_id: equipment._id,
                type: alertInfo.type,
                priority: alertInfo.priority,
                title: alertInfo.title,
                description: alertInfo.description,
                status: 'active'
            });
 
            return alert;
        } catch (error) {
            console.error('Error generating alert:', error);
            throw error;
        }
    }
    return null;
};