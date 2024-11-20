import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Homepage from './pages/HomePage'
import Privatepage from './pages/PrivatePage'
import AnalyticsPage from './pages/AnalyticsPage'
import EquipmentsPage from './pages/EquipmentsPage'
import AlertsPage from './pages/AlertsPage'
import NotificationsPage from './pages/NotificationsPage'
import SettingsPage from './pages/SettingsPage'
import MaintenancePage from './pages/MaintenancePage'
import IncidentsPage from './pages/IncidentsPage'
import LoginPage from './pages/LoginPage'
import {ToastContainer} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <>
    <Routes>
      <Route path="/login" element={<LoginPage/>}/>
      <Route path="/" element={<Privatepage/>}>
          <Route path="/home" element={<Homepage />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
          <Route path="/equipments" element={<EquipmentsPage />} />
          <Route path="/alerts" element={<AlertsPage />} />
          <Route path="/maintenance" element={<MaintenancePage />} />
          <Route path="/incidents" element={<IncidentsPage/>} />
          <Route path="/notifications" element={<NotificationsPage />} />
          <Route path="/settings" element={<SettingsPage />} />
      </Route>

    </Routes>

    <ToastContainer
        position="bottom-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </>
  )
}

export default App
