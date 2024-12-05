import { useState, useEffect } from 'react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'
import { Line } from 'react-chartjs-2'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

const IncidentDashboard = ({ incidents = [] }) => {
  const [chartData, setChartData] = useState({ datasets: [] })
  const [chartOptions, setChartOptions] = useState({})

  useEffect(() => {
    const processData = () => {
      const monthlyStats = Array(12).fill().map(() => ({
        open: 0,
        inProgress: 0,
        resolved: 0
      }))

      incidents.forEach(incident => {
        const date = new Date(incident.createdAt)
        const monthIndex = date.getMonth()
        
        switch (incident.status.toLowerCase()) {
          case 'open':
            monthlyStats[monthIndex].open += 1
            break
          case 'in-progress':
            monthlyStats[monthIndex].inProgress += 1
            break
          case 'resolved':
            monthlyStats[monthIndex].resolved += 1
            break
        }
      })

      const labels = ["JAN",
        "FEB",
        "MAR",
        "APR",
        "MAY",
        "JUN",
        "JUL",
        "AUG",
        "SEP",
        "OCT",
        "NOV",
        "DEC",]
      
      setChartData({
        labels,
        datasets: [
          {
            label: 'Total',
            data: monthlyStats.map(stat => stat.open + stat.inProgress + stat.resolved),
            borderColor: '#8b5cf6',
            backgroundColor: '#8b5cf6',
            tension: 0.4,
            pointRadius: 4,
            pointHoverRadius: 6,
            pointBackgroundColor: '#8b5cf6',
            pointBorderColor: '#fff',
            pointBorderWidth: 2,
          },
          {
            label: 'Resolved',
            data: monthlyStats.map(stat => stat.resolved),
            borderColor: '#10b981',
            backgroundColor: '#10b981',
            tension: 0.4,
            pointRadius: 4,
            pointHoverRadius: 6,
            pointBackgroundColor: '#10b981',
            pointBorderColor: '#fff',
            pointBorderWidth: 2,
          },
          {
            label: 'In Progress',
            data: monthlyStats.map(stat => stat.inProgress),
            borderColor: '#3b82f6',
            backgroundColor: '#3b82f6',
            tension: 0.4,
            pointRadius: 4,
            pointHoverRadius: 6,
            pointBackgroundColor: '#3b82f6',
            pointBorderColor: '#fff',
            pointBorderWidth: 2,
          },
          {
            label: 'Open',
            data: monthlyStats.map(stat => stat.open),
            borderColor: '#f59e0b',
            backgroundColor: '#f59e0b',
            tension: 0.4,
            pointRadius: 4,
            pointHoverRadius: 6,
            pointBackgroundColor: '#f59e0b',
            pointBorderColor: '#fff',
            pointBorderWidth: 2,
          }
        ]
      })

      setChartOptions({
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top',
            labels: {
              color: '#fff',
              usePointStyle: true,
              pointStyle: 'circle',
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
            border: {
              display: false,
            },
            ticks: {
              color: '#94a3b8',
              padding: 8,
            }
          },
          y: {
            grid: {
              display: false,
            },
            border: {
              display: false,
            },
            ticks: {
              color: '#94a3b8',
              padding: 8,
            }
          }
        }
      })
    }

    processData()
  }, [incidents])

  return (
    <div className=" w-full bg-slate-900 rounded-lg p-6 ">
      <h2 className="text-2xl font-bold text-white text-center mb-6">
        Incident Reports
      </h2>
      <div className="h-96 w-full">
        <Line options={chartOptions} data={chartData} />
      </div>
    </div>
  )
}

export default IncidentDashboard