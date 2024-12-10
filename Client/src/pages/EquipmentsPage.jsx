import React from 'react';
import { useState, useEffect } from 'react';
import EquipmentList from '../components/Equipments/EquipmentList.jsx';
import API_INSTANCE from '../services/auth.js';


const EquipmentPage = () => {

	const [equipmentList, setEquipmentList] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const [isError, setIsError] = useState(null);

	useEffect(() => {
		const fetchData = async () => {
			setIsLoading(true);
			setIsError(null);

			try {
				const res = await API_INSTANCE.get('/equipment');
				setEquipmentList(res.data.data);
			} catch (err) {
				setIsError('Failed to fetch data.');
			} finally {
				setIsLoading(false);
			}
		};
		fetchData();
	}, []);


	if (isLoading) {
		return <div className="text-center text-gray-500">Loading...</div>;
	}

	if (isError) {
		return <div className="text-center text-red-500">{isError}</div>;
	}

	if (!equipmentList || !Array.isArray(equipmentList) || equipmentList.length === 0) {
		return <p className="text-center">No equipment available.</p>;
	}


	return (
		<div className="min-h-screen ">
			{isLoading ? (<div className="text-center text-gray-500">Loading...</div>)
				: isError ? (<div className="text-center text-red-500">{isError}</div>)
					: <EquipmentList equipmentList={equipmentList} setEquipmentList={setEquipmentList} />
			}
		</div>
	);
};

export default EquipmentPage;