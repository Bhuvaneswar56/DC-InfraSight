
const randomBetween = (min,max) =>{
    return Math.random() * (max-min) + min;
}


export const generateMetrics = (equipmentType) =>{
      switch(equipmentType){
        case 'Server':
            return {
                temperature: randomBetween(35, 75),        
                cpuLoad: randomBetween(20, 90),           
                memoryUsage: randomBetween(30, 85),       
                powerUsage: randomBetween(300, 800),
                fanSpeed: randomBetween(2000, 4000),    
                lastUpdated: new Date()  
            }
        case 'CRAH':
            return {
                temperature: randomBetween(18, 27),       
                humidity: randomBetween(45, 55),          
                airflow: randomBetween(1000, 2000),       
                powerUsage: randomBetween(5000, 8000),   
                fanSpeed: randomBetween(3000, 5000),
                lastUpdated: new Date()
            }
        case 'UPS':
            return {
                batteryLevel: randomBetween(85, 100),     
                inputVoltage: randomBetween(380, 420),    
                outputVoltage: randomBetween(220, 240),   
                loadPercentage: randomBetween(40, 80), 
                efficiency: randomBetween(92, 98),
                lastUpdated: new Date()
            }
        case 'PDU':
            return {
                    inputVoltage: randomBetween(220, 240),    
                    outputVoltage: randomBetween(220, 240),   
                    currentDraw: randomBetween(10, 30),       
                    powerUsage: randomBetween(2000, 6000),    
                    temperature: randomBetween(20, 35),       
                    loadPercentage: randomBetween(30, 70),  
                    lastUpdated: new Date()
                };
      }
}
