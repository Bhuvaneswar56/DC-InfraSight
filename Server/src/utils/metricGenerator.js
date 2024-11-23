const randomBetween = (min, max) => {
    return Math.random() * (max - min) + min;
}


export const generateMetrics = (equipmentType) => {
    switch (equipmentType) {
        case 'Server':
            return {
                temperature: randomBetween(10, 75),
                cpuLoad: randomBetween(20, 90),
                memoryUsage: randomBetween(30, 85),
                powerUsage: randomBetween(300, 800),
                lastUpdated: new Date()
            }
        case 'CRAH':
            return {
                temperature: randomBetween(18, 27),
                airflow: randomBetween(1000, 2000),
                powerUsage: randomBetween(5000, 10000),
                lastUpdated: new Date()
            }
        case 'UPS':
            return {
                batteryLevel: randomBetween(85, 100),
                inputVoltage: randomBetween(380, 420),
                outputVoltage: randomBetween(220, 240),
                lastUpdated: new Date()
            }
        case 'PDU':
            return {
                inputVoltage: randomBetween(220, 240),
                outputVoltage: randomBetween(220, 240),
                powerUsage: randomBetween(2000, 10000),
                temperature: randomBetween(20, 35),
                lastUpdated: new Date()
            };
    }
}