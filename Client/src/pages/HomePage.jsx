import React from 'react'
import MetricsDashboard from '../components/MetricsDashboard'
import {useState, useEffect} from 'react'
import API_INSTANCE from '../services/auth'
import {useDispatch } from 'react-redux'
import { SET_METRICS, SET_INCIDENTS } from '../redux/slices/metricSlice'
import IncidentDashboard from '../components/IncidentDashboard'
import AlertsDashboard from '../components/AlertsDashboard'

function HomePage() {

  const [data,setData] = useState([])
  const [inc, setInc] = useState([])
  const dispatch =useDispatch();

  async function getMetrics(){
      try{
  
          let res= await API_INSTANCE.get('/websocket/metrics')
          let res1= await API_INSTANCE.get('/incident')
          console.log(res1.data.data)
          setInc(res1.data.data)
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
    <div>
      <MetricsDashboard  />
      <div className='flex flex-col gap-8 mx-auto max-w-7xl '>
      <IncidentDashboard incidents={inc}/>
      <AlertsDashboard />
      </div>
    </div>
  )
}

export default HomePage
