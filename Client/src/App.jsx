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
import MaintenancePage1 from './pages/MaintenancePage1'
import IncidentsPage from './pages/IncidentsPage'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Privatepage/>}>
          <Route path="/home" element={<Homepage />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
          <Route path="/equipments" element={<EquipmentsPage />} />
          <Route path="/alerts" element={<AlertsPage />} />
          <Route path="/maintenance" element={<MaintenancePage1 />} />
          <Route path="/incidents" element={<IncidentsPage/>} />
          <Route path="/notifications" element={<NotificationsPage />} />
          <Route path="/settings" element={<SettingsPage />} />
      </Route>

    </Routes>
  )
}

export default App
