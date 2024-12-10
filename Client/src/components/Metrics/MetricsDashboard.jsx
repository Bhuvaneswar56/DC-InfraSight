import React, { useState, useMemo, useEffect } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { ArrowDownCircle, ArrowUpCircle, Activity, ThermometerSun, Zap, Battery } from 'lucide-react';
import { useSelector } from 'react-redux';

const MetricsDashboard = () => {
  const [selectedLocation, setSelectedLocation] = useState(null);
  const data = useSelector((state)=>state.metrics.data)

  // Memoize location data processing to prevent unnecessary recalculations
  const { locationData, locations } = useMemo(() => {
    const locationMap = {};
    const locationList = [];
    
    // Sort locations to ensure "Location 1" is first
    data && data?.map(item => {
      if (!locationMap[item.locationName]) {
        locationMap[item.locationName] = [];
        locationList.push(item.locationName);
      }
      locationMap[item.locationName].push(item);
    });
    
    // Sort locations to prioritize "Location 1"
    locationList.sort((a, b) => {
      if (a === 'Location 1') return -1;
      if (b === 'Location 1') return 1;
      return a.localeCompare(b);
    });
    
    return { locationData: locationMap, locations: locationList };
  }, [data]);

  // Set default location on component mount
  useEffect(() => {
    if (locations.length > 0) {
      setSelectedLocation(locations[0]);
    }
  }, [locations]);

  // Memoize equipment data processing for selected location
  const processedEquipmentData = useMemo(() => {
    if (!selectedLocation) return null;

    const equipmentMap = new Map();
    
   locationData && locationData[selectedLocation].forEach(item => {
      if (!equipmentMap.has(item.equipmentName)) {
        equipmentMap.set(item.equipmentName, {
          name: item.equipmentName,
          type: item.equipmentType,
          temperature: [],
          inputVoltage: [],
          powerUsage: [],
          outputVoltage: []
        });
      }
      
      const equipment = equipmentMap.get(item.equipmentName);
      const type = item.type?.toLowerCase();
      
      if (type === 'temperature') equipment.temperature.push(item.value);
      else if (type === 'inputvoltage') equipment.inputVoltage.push(item.value);
      else if (type === 'powerusage') equipment.powerUsage.push(item.value);
      else if (type === 'outputvoltage') equipment.outputVoltage.push(item.value);
    });

    return Array.from(equipmentMap.values()).map(equipment => ({
      name: equipment.name,
      type: equipment.type,
      temperature: average(equipment.temperature),
      inputVoltage: average(equipment.inputVoltage),
      powerUsage: average(equipment.powerUsage),
      outputVoltage: average(equipment.outputVoltage)
    }));
  }, [selectedLocation, locationData]);
  
  // Memoize location averages
  const locationAverages = useMemo(() => {
    if (!processedEquipmentData) return null;

    const totals = processedEquipmentData.reduce((acc, item) => ({
      temperature: acc.temperature + item.temperature,
      powerUsage: acc.powerUsage + item.powerUsage,
      inputVoltage: acc.inputVoltage + item.inputVoltage,
      outputVoltage: acc.outputVoltage + item.outputVoltage
    }), { temperature: 0, powerUsage: 0, inputVoltage: 0, outputVoltage: 0 });

    const count = processedEquipmentData.length;
    return {
      temperature: formatNumber(totals.temperature / count),
      powerUsage: formatNumber(totals.powerUsage / count),
      inputVoltage: formatNumber(totals.inputVoltage / count),
      outputVoltage: formatNumber(totals.outputVoltage / count)
    };
  }, [processedEquipmentData]);

  return (
    <div className=" text-gray-100 p-6">
      <div className=" space-y-6">
        <Header />
        <LocationGrid 
          locations={locations} 
          selectedLocation={selectedLocation}
          onLocationSelect={setSelectedLocation}
        />
        <MainContent 
          selectedLocation={selectedLocation}
          averages={locationAverages}
          chartData={processedEquipmentData}
        />
      </div>
    </div>
  );
};

// Utility functions
const average = arr => arr.length ? formatNumber(arr.reduce((a, b) => a + b, 0) / arr.length) : 0;
const formatNumber = num => Number(num.toFixed(2));

// Component split into smaller, focused pieces
const Header = () => (
  <div className="flex items-center justify-between">
    <h2 className="text-2xl font-bold text-gray-900">Data Center Metrics Dashboard</h2>

  </div>
);

const LocationGrid = ({ locations, selectedLocation, onLocationSelect }) => (
  <div className="grid grid-cols-3 lg:grid-cols-4 gap-4">
    {locations.map(location => (
      <LocationCard
        key={location}
        locationName={location}
        isActive={selectedLocation === location}
        onClick={() => onLocationSelect(location)}
      />
    ))}
  </div>
);

const LocationCard = ({ locationName, onClick, isActive }) => (
  <div
    onClick={onClick}
    className={`p-4 rounded-lg cursor-pointer transition-all duration-200 ${
      isActive 
        ? 'bg-blue-900 border-2 border-blue-600 shadow-lg' 
        : 'bg-gray-800 border border-gray-700 hover:bg-gray-700'
    }`}
  >
    <div className="flex items-center justify-between">
      <h3 className="lg:text-lg font-semibold text-gray-100">{locationName}</h3>
      <Activity className={`w-5 h-5 ${isActive ? 'text-blue-500' : 'text-gray-400'}`} />
    </div>
  </div>
);

const MainContent = ({ selectedLocation, averages, chartData }) => {
  if (!selectedLocation) {
    return (
      <div className="text-center py-12 bg-gray-800 rounded-lg shadow-sm">
        <Activity className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-500">Select a location to view detailed metrics</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      <MetricsGrid averages={averages} />
      <ChartSection data={chartData} />
    </div>
  );
};

const MetricsGrid = ({ averages }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
    <MetricCard 
      title="Avg Temperature" 
      value={averages.temperature} 
      icon={ThermometerSun} 
      color="text-red-500" 
      unit="°C"
    />
    <MetricCard 
      title="Avg Power Usage" 
      value={averages.powerUsage} 
      icon={Zap} 
      color="text-yellow-500" 
      unit="W"
    />
    <MetricCard 
      title="Avg Input Voltage" 
      value={averages.inputVoltage} 
      icon={ArrowDownCircle} 
      color="text-blue-500" 
      unit="V"
    />
    <MetricCard 
      title="Avg Output Voltage" 
      value={averages.outputVoltage} 
      icon={ArrowUpCircle} 
      color="text-green-500" 
      unit="V"
    />
  </div>
);

const MetricCard = ({ title, value, icon: Icon, color, unit }) => (
  <div className="bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-700">
    <div className="flex items-center justify-between mb-2">
      <span className="text-gray-400 text-sm">{title}</span>
      <Icon className={`w-5 h-5 ${color}`} />
    </div>
    <div className="flex items-baseline">
      <span className="text-2xl font-bold text-gray-100">{value}</span>
      <span className="ml-1 text-gray-500 text-sm">{unit}</span>
    </div>
  </div>
);

const ChartSection = ({ data }) => (
  <div className="bg-gray-800 p-2 lg:p-6 rounded-lg shadow-md">
    <div className="h-60 md:h-80 lg:h-96 ">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          md:margin={{ top: 20, right: 30, left: 20, bottom: 70 }}
          className='text-sm lg:text-lg'
        >
          <CartesianGrid strokeDasharray="3 3" className="opacity-30 stroke-gray-600" />
          <XAxis 
            dataKey="name"
            tick={{ fontSize: 10, lg:{fontSize:12}, fill: '#e5e7eb' }}
            interval={0}
            angle={0}
            textAnchor="end"
          />
          <YAxis tick={{ fill: '#e5e7eb' }} />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Bar dataKey="temperature" name="Temperature (°C)" fill="#f87171" radius={[4, 4, 0, 0]} />
          <Bar dataKey="powerUsage" name="Power Usage (W)" fill="#34d399" radius={[4, 4, 0, 0]} />
          <Bar dataKey="inputVoltage" name="Input Voltage (V)" fill="#60a5fa" radius={[4, 4, 0, 0]} />
          <Bar dataKey="outputVoltage" name="Output Voltage (V)" fill="#818cf8" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  </div>
);

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  
  return (
    <div className="bg-gray-700 p-4 border border-gray-600 rounded-lg shadow-lg">
      <p className="font-semibold mb-2 text-gray-100">{label}</p>
      {payload.map((entry, index) => (
        <div key={index} className="flex items-center space-x-2 text-sm">
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }} />
          <span className="text-gray-300">{entry.name}:</span>
          <span className="font-semibold text-gray-100">{entry.value}</span>
        </div>
      ))}
    </div>
  );
};

export default MetricsDashboard;