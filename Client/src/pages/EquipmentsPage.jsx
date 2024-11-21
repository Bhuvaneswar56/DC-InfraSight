import React from 'react';
import EquipmentDetails from '../components/EquipmentDetails';
import EquipmentList from '../components/EquipmentList';

const PreviewTabs = ({ activeTab, setActiveTab }) => (
  <div className="flex gap-4 mb-6">
    <button onClick={() => setActiveTab('list')}
      className={`px-4 py-2 rounded-lg ${activeTab === 'list' ? 'bg-blue-500 text-white' : 'border'}`}>
      Equipment List
    </button>
    <button onClick={() => setActiveTab('details')}
      className={`px-4 py-2 rounded-lg ${activeTab === 'details' ? 'bg-blue-500 text-white' : 'border'}`}>
      Equipment Details
    </button>
  </div>
);

// Main preview component with useState

const EquipmentPage = () => {

  const [activeTab, setActiveTab] = useState('list');
  const [equipmentList, setEquipmentList] = useState([]);
  const [equipmentDetails, setEquipmentDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Mock API calls (replace these with actual API functions)
  const getAllEquipments = async () => {
    return [
      { id: 1, name: 'Excavator' },
      { id: 2, name: 'Bulldozer' }
    ]; // Replace with actual API call
  };

  const getEquipmentDetails = async () => {
    return {
      id: 1,
      name: 'Excavator',
      details: 'Heavy equipment used in construction.'
    }; // Replace with actual API call
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        if (activeTab === 'list') {
          const data = await getAllEquipments();
          setEquipmentList(data);
        } else if (activeTab === 'details') {
          const data = await getEquipmentDetails();
          setEquipmentDetails(data);
        }
      } catch (err) {
        setError('Failed to fetch data.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [activeTab]);

  return (

    <div className="min-h-screen bg-gray-50">
      <PreviewTabs activeTab={activeTab} setActiveTab={setActiveTab} />

      {loading ? (
        <div className="text-center text-gray-500">Loading...</div>
      ) : error ? (
        <div className="text-center text-red-500">{error}</div>
      ) : activeTab === 'list' ? (
        <EquipmentList equipmentList={equipmentList} />
      ) : (
        <EquipmentDetails equipmentDetails={equipmentDetails} />
      )}
    </div>
  );
};

export default EquipmentPage;