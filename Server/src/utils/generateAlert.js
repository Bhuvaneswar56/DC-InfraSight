// utils/alertGenerator.js
import Alert from '../models/alert.model.js';

const thresholds = {
    temperature: {
        warning: { min: 20, max: 50 },
        critical: { min: 15, max: 70 }
    },
    cpuLoad: {
        warning: 60,    
        critical: 90    
    },
    powerUsage: {
        warning: 3000,  
        critical: 8000  
    },
    airflow: {        
        warning: 1000,
        critical: 1500
    },
    humidity: {       
        warning: { min: 40, max: 60 },
        critical: { min: 35, max: 65 }
    }
};

const checkThresholds = (metric) => {
    let alertInfo = null;

    console.log('Checking thresholds for metric:', {
        type: metric.type,
        value: metric.value,
        thresholds: thresholds[metric.type]
    });


    switch(metric.type) {
        case 'temperature':
        case 'humidity':
            if (metric.value > thresholds[metric.type].critical.max || 
                metric.value < thresholds[metric.type].critical.min) {
                alertInfo = {
                    priority: 'critical',
                    title: `Critical ${metric.type} Alert: ${metric.value}${metric.unit}`,
                    type: metric.type
                };
            } else if (metric.value > thresholds[metric.type].warning.max || 
                      metric.value < thresholds[metric.type].warning.min) {
                alertInfo = {
                    priority: 'warning',
                    title: `${metric.type} Warning: ${metric.value}${metric.unit}`,
                    type: metric.type
                };
            }
            break;

            case 'cpuLoad':
            case 'powerUsage':
            case 'airflow':
                    if (metric.value >= thresholds[metric.type].critical) {
                        alertInfo = {
                            priority: 'critical',
                            title: `Critical ${metric.type} Alert: ${metric.value}${metric.unit}`,
                            type: metric.type === 'cpuLoad' ? 'performance' : metric.type
                        };
                    } else if (metric.value >= thresholds[metric.type].warning) {
                        alertInfo = {
                            priority: 'warning',
                            title: `High ${metric.type} Warning: ${metric.value}${metric.unit}`,
                            type: metric.type === 'cpuLoad' ? 'performance' : metric.type
                        };
                    }
            break;
    }

    console.log('Generated alertInfo:', alertInfo);

    // Add description based on priority
    if (alertInfo) {
        switch(alertInfo.priority) {
            case 'critical':
                alertInfo.description = `${alertInfo.type === 'performance' ? 'CPU Load' : 
                                       alertInfo.type === 'power' ? 'Power Usage' : 
                                       'Temperature'} has reached critical levels. Immediate action required.`;
                break;
            case 'warning':
                alertInfo.description = `${alertInfo.type === 'performance' ? 'CPU Load' : 
                                       alertInfo.type === 'power' ? 'Power Usage' : 
                                       'Temperature'} is approaching critical levels. Please monitor closely.`;
                break;
        }
    }

    return alertInfo;
};

export const generateAlert = async (metric) => {

    console.log('Generating alert for metric:', metric);

    const alertInfo = checkThresholds(metric);
    
    if (alertInfo) {
        try {
            // Check if there's already an active alert for this metric and type
            const existingAlert = await Alert.findOne({
                metrics_id: metric._id,
                type: alertInfo.type,
                status: 'active'
            });

            // If alert already exists, don't create a new one
            if (existingAlert) {
                // Optionally update existing alert if priority changed
                if (existingAlert.priority !== alertInfo.priority) {
                    existingAlert.priority = alertInfo.priority;
                    existingAlert.title = alertInfo.title;
                    await existingAlert.save();
                }
                return existingAlert;
            }

            // Create new alert
            const alert = await Alert.create({
                metrics_id: metric._id,
                type: alertInfo.type,
                priority: alertInfo.priority,
                title: alertInfo.title,
                description: alertInfo.description,
                status: 'active'
            });

            // Create notification for this alert
            // await createNotification({
            //     euip_id: metric.equi_id,
            //     type: 'alert',
            //     title: alert._id,
            //     content: `${alertInfo.title} - ${alertInfo.description}`
            // });

            return alert;
        } catch (error) {
            console.error('Error generating alert:', error);
            throw error;
        }
    }
    return null;
};

