import React from 'react'
import MetricsDashboard from '../components/Metrics/MetricsDashboard'
import {useState, useEffect} from 'react'
import API_INSTANCE from '../services/auth'
import {useDispatch } from 'react-redux'
import { SET_METRICS, SET_INCIDENTS } from '../redux/slices/metricSlice'
import IncidentDashboard from '../components/Incidents/IncidentDashboard'
import AlertsDashboard from '../components/Alerts/AlertsDashboard'
import { SET_ALERTS } from '../redux/slices/metricSlice'

function HomePage() {

  const [data,setData] = useState([])
  const [inc, setInc] = useState([])
  const dispatch =useDispatch();

  async function getMetrics(){
      try{
  
          let res= await API_INSTANCE.get('/websocket/metrics')
          let res1= await API_INSTANCE.get('/incident')
          let res2= await API_INSTANCE.get('/alerts')
          console.log(res1.data.data)
          setInc(res1.data.data)
          dispatch(SET_ALERTS(res2.data.data))
          dispatch(SET_INCIDENTS(res1.data.data))
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

  return (
    <>
      <MetricsDashboard  />
      <div className='flex flex-col gap-8 mx-auto max-w-7xl '>
      <IncidentDashboard incidents={inc}/>
      <AlertsDashboard />
      </div>
    </>
  )
}

export default HomePage
