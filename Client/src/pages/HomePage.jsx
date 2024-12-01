import React from 'react'
import MetricsDashboard from '../components/MetricsDashboard'
import {useState, useEffect} from 'react'
import API_INSTANCE from '../services/auth'
import {useDispatch } from 'react-redux'
import { SET_METRICS } from '../redux/slices/metricSlice'
import IncidentDashboard from '../components/IncidentDashboard'

function HomePage() {

  const [data,setData] = useState([])
  const [inc, setInc] = useState([])
  const dispatch =useDispatch();

  async function getMetrics(){
      try{
  
          let res= await API_INSTANCE.get('/websocket/metrics')
          let res1= await API_INSTANCE.get('/incident')
          setInc(res1.data.data)
           setData(res.data.data);
           dispatch(SET_METRICS(res.data.data))
  
      }
      catch(error){
          console.log(error)
      }
  }
  
  useEffect(()=>{
      getMetrics()
  },[])

// console.log(inc)
  return (
    <div>
      <MetricsDashboard  />
      <IncidentDashboard incidents={inc}/>
    </div>
  )
}

export default HomePage
