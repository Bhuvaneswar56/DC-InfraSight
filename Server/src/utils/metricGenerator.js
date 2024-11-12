// utils/metricGenerator.js

// Generate random number between min and max
const randomBetween = (min, max) => {
    return Math.random() * (max - min) + min;
};

// Generate metrics based on equipment type
export const generateMetrics = (equipmentType) => {
    switch(equipmentType) {
        case 'Server':
            return {
                temperature: randomBetween(35, 75),        // CPU temperature (°C)
                cpuLoad: randomBetween(20, 90),           // CPU load (%)
                memoryUsage: randomBetween(30, 85),       // Memory usage (%)
                powerUsage: randomBetween(300, 800),      // Power consumption (W)
                networkIn: randomBetween(100, 1000),      // Network in (Mbps)
                networkOut: randomBetween(100, 1000),     // Network out (Mbps)
                fanSpeed: randomBetween(2000, 4000),      // Fan speed (RPM)
                lastUpdated: new Date()
            };
        case 'CRAH':
            return {
                temperature: randomBetween(18, 27),       // Air temperature (°C)
                humidity: randomBetween(45, 55),          // Relative humidity (%)
                airflow: randomBetween(1000, 2000),       // Airflow (CFM)
                powerUsage: randomBetween(5000, 8000),    // Power consumption (W)
                fanSpeed: randomBetween(3000, 5000),      // Fan speed (RPM)
                coolingOutput: randomBetween(20, 30),     // Cooling output (kW)
                lastUpdated: new Date()
            };
        default:
            return {
                temperature: randomBetween(20, 30),
                humidity: randomBetween(40, 60),
                powerUsage: randomBetween(1000, 2000),
                lastUpdated: new Date()
            };
    }
};