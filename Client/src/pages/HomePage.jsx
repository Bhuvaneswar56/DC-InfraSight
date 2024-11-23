import React from 'react'
import MetricsDashboard from '../components/MetricsDashboard'
import {useState, useEffect} from 'react'
import API_INSTANCE from '../services/auth'

function HomePage() {

  const [data,setData] = useState([])

  async function getMetrics(){
      try{
  
          let res= await API_INSTANCE.get('/websocket/metrics')
          console.log(res.data.data)
      

      // const rawData = res.data.message;

      // // Filter data for the last 24 hours
      // const last24Hours = new Date();
      // last24Hours.setHours(last24Hours.getHours() - 24);

      // const filteredData = rawData.filter(
      //   (item) => new Date(item.timestamp) > last24Hours
      // );

      setData(res.data.message);
  
      }
      catch(error){
          console.log(error)
      }
  }
  
  useEffect(()=>{
      getMetrics()
  },[])


  return (
    <div>
      <MetricsDashboard metricsData={data} />
    </div>
  )
}

export default HomePage
