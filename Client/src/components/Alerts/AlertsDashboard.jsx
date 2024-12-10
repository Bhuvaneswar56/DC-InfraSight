import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js'
import { Bar, Doughnut } from 'react-chartjs-2'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
)

const AlertsDashboard = () => {
  const alerts = useSelector((state) => state.metrics.alerts)
  const [barChartData, setBarChartData] = useState({ datasets: [] })
  const [doughnutData, setDoughnutData] = useState({ datasets: [] })
  const [stats, setStats] = useState({
    total: 0,
    critical: 0,
    warning: 0,
    info: 0
  })

  useEffect(() => {
    if (!alerts || alerts.length === 0) return

    // Calculate statistics
    const criticalCount = alerts.filter(alert => alert.priority === 'critical').length
    const warningCount = alerts.filter(alert => alert.priority === 'warning').length
    const infoCount = alerts.filter(alert => alert.priority === 'info').length

    setStats({
      total: alerts.length,
      critical: criticalCount,
      warning: warningCount,
      info: infoCount
    })

    // Process alert types for bar chart
    const alertTypes = [...new Set(alerts.map(alert => alert.type))]
    const typeCounts = alertTypes.map(type => ({
      type: type.charAt(0).toUpperCase() + type.slice(1),
      count: alerts.filter(alert => alert.type === type).length,
    }))

    setBarChartData({
      labels: typeCounts.map(item => item.type),
      datasets: [
        {
          label: 'Alert Types',
          data: typeCounts.map(item => item.count),
          backgroundColor: '#8b5cf6',
          borderRadius: 8,
        }
      ]
    })

    // Process priority data for doughnut chart
    setDoughnutData({
      labels: ['Critical', 'Warning', 'Info'],
      datasets: [
        {
          data: [criticalCount, warningCount, infoCount],
          backgroundColor: ['#ef4444', '#f59e0b', '#3b82f6'],
          borderWidth: 0,
        }
      ]
    })
  }, [alerts])

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#fff',
          font: {
            size: 12,
          },
          padding: 20,
        }
      },
      tooltip: {
        backgroundColor: '#1e293b',
        titleColor: '#fff',
        bodyColor: '#fff',
        padding: 12,
        cornerRadius: 8,
        boxPadding: 6,
      }
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: '#94a3b8',
        }
      },
      y: {
        grid: {
          display: false,
        },
        ticks: {
          color: '#94a3b8',
        }
      }
    }
  }

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '75%',
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: '#fff',
          font: {
            size: 12,
          },
          padding: 20,
        }
      },
      tooltip: {
        backgroundColor: '#1e293b',
        titleColor: '#fff',
        bodyColor: '#fff',
        padding: 12,
        cornerRadius: 8,
        boxPadding: 6,
      }
    }
  }

  if (!alerts || alerts.length === 0) {
    return (
      <div className="w-full h-96 bg-slate-900 rounded-lg flex items-center justify-center">
        <div className="text-slate-400 text-center">
          <p className="text-xl font-semibold">No Alerts to Display</p>
          <p className="mt-2">Alert data will appear here when available</p>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full bg-slate-900 p-6  rounded-lg">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white text-center mb-6">Alerts Overview</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-slate-800 p-4 rounded-lg">
            <p className="text-slate-400 text-sm">Total Alerts</p>
            <p className="text-2xl font-bold text-white">{stats.total}</p>
          </div>
          <div className="bg-slate-800 p-4 rounded-lg">
            <p className="text-slate-400 text-sm">Critical</p>
            <p className="text-2xl font-bold text-red-500">{stats.critical}</p>
          </div>
          <div className="bg-slate-800 p-4 rounded-lg">
            <p className="text-slate-400 text-sm">Warning</p>
            <p className="text-2xl font-bold text-amber-500">{stats.warning}</p>
          </div>
          <div className="bg-slate-800 p-4 rounded-lg">
            <p className="text-slate-400 text-sm">Info</p>
            <p className="text-2xl font-bold text-blue-500">{stats.info}</p>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6 w-full">
        <div className="bg-slate-800 p-2 md:p-6 rounded-lg">
          <h3 className="md:text-lg font-semibold text-white mb-4">Alert Types Distribution</h3>
          <div className="h-44 md:h-52 lg:h-80">
            <Bar options={chartOptions} data={barChartData} />
          </div>
          {/* <p className="text-sm text-slate-400 mt-4">
            Distribution of alerts across different types in the system
          </p> */}
        </div>

        <div className="bg-slate-800 p-2 md:p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-white mb-4">Alerts by Priority</h3>
          <div className="h-44 md:h-52 lg:h-80 flex items-center justify-center">
            <Doughnut options={doughnutOptions} data={doughnutData} />
          </div>
          {/* <p className="text-sm text-slate-400 mt-4">
            Breakdown of alerts by priority level showing critical, warning, and info distributions
          </p> */}
        </div>
      </div>
    </div>
  )
}

export default AlertsDashboard