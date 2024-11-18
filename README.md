# DC InfraSight - Intelligent Data Center Infrastructure Management

<div align="center">
  <h3>Monitor • Analyze • Optimize</h3>
  <p>A next-generation DCIM solution for modern data centers</p>
</div>

## Overview
DC InfraSight is an advanced Data Center Infrastructure Management platform that provides comprehensive monitoring, real-time analytics, and intelligent management capabilities for modern data center operations. Built with the MERN stack, it offers an intuitive interface for managing critical infrastructure components while ensuring optimal performance and reliability.

## 🚀 Key Features
- **Real-time Monitoring**
  - Live equipment status tracking
  - Environmental metrics monitoring
  - Power consumption analysis
  - Network performance tracking

- **Intelligent Alerting**
  - Predictive issue detection
  - Customizable alert thresholds
  - Automated incident creation
  - Escalation management

- **Infrastructure Management**
  - Equipment lifecycle tracking
  - Maintenance scheduling
  - Resource optimization
  - Capacity planning

- **Analytics & Reporting**
  - Interactive dashboards
  - Custom report generation
  - Trend analysis
  - Performance metrics

- **Team Collaboration**
  - Real-time communication
  - Task assignment
  - Document sharing
  - Activity tracking

## 💻 Tech Stack

### Frontend
- React.js 18
- Redux Toolkit for state management
- Tailwind CSS for styling
- Recharts for data visualization
- Socket.io-client for real-time updates

### Backend
- Node.js & Express.js
- MongoDB with Mongoose
- WebSocket for real-time communication
- JWT Authentication
- RESTful API architecture

## 🛠️ Installation

### Prerequisites
- Node.js >= 14.0.0
- MongoDB >= 4.0.0
- npm or yarn

### Quick Start

1. Clone the repository
```bash
git clone https://github.com/your-username/dc-infrasight.git
cd dc-infrasight
```

2. Setup Backend
```bash
cd server
npm install
cp .env.example .env
# Update .env with your configurations
npm run dev
```

3. Setup Frontend
```bash
cd client
npm install
cp .env.example .env
npm start
```

## 📁 Project Structure
```
dc-infrasight/
├── client/                      # Frontend application
│   ├── public/
│   └── src/
│       ├── components/          # Reusable UI components
│       ├── pages/              # Page components
│       ├── features/           # Redux features/slices
│       ├── services/           # API services
│       ├── hooks/             # Custom hooks
│       ├── utils/             # Utility functions
│       └── styles/            # Global styles
│
└── server/                     # Backend application
    ├── src/
    │   ├── controllers/       # Route controllers
    │   ├── models/           # Database models
    │   ├── routes/           # API routes
    │   ├── middleware/       # Custom middleware
    │   ├── services/         # Business logic
    │   └── utils/           # Helper functions
    └── tests/                # Test suites
```

## 🌟 Core Modules

### 1. Dashboard
- Real-time metrics overview
- Critical alerts display
- System health monitoring
- Quick action controls

### 2. Equipment Monitoring
- Real-time status tracking
- Performance metrics
- Historical data analysis
- Maintenance records

### 3. Alert Management
- Real-time alert detection
- Incident management
- Alert history tracking
- Response automation

### 4. Analytics
- Custom report generation
- Trend analysis
- Capacity planning
- Performance optimization

## 🚀 Roadmap
- [x] Core monitoring functionality
- [x] Real-time alerting system
- [ ] Predictive analytics
- [ ] Mobile application
- [ ] AI-powered insights
- [ ] Integration with external systems

## 👥 Team
- [Team Member 1] - Frontend Development
- [Team Member 2] - Backend Development
- [Team Member 3] - Full Stack Development

## 📄 License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Contact
For any queries regarding DC InfraSight:
- Email: your.email@example.com
- GitHub Issues: [Create an issue](https://github.com/your-username/dc-infrasight/issues)

---

<div align="center">
  <i>Built with ❤️ for modern data centers</i>
</div>

**PROJECT STRUCTURE:**

src/
├── components/
│   ├── layout/
│   │   ├── Sidebar.jsx                // Main navigation sidebar
│   │   ├── Header.jsx                 // Top header with notifications
│   │   └── MainLayout.jsx             // Layout wrapper
│   │
│   ├── dashboard/
│   │   ├── StatusCard.jsx             // Equipment status overview card
│   │   ├── MetricsChart.jsx           // Charts for metrics
│   │   ├── AlertsList.jsx             // Recent alerts component
│   │   └── LocationMap.jsx            // Interactive location map
│   │
│   ├── equipment/
│   │   ├── EquipmentCard.jsx          // Equipment info card
│   │   ├── EquipmentMetrics.jsx       // Equipment metrics display
│   │   ├── EquipmentStatus.jsx        // Status indicator
│   │   └── RackVisualization.jsx      // Rack view component
│   │
│   ├── alerts/
│   │   ├── AlertCard.jsx              // Alert display card
│   │   ├── AlertForm.jsx              // Alert creation/edit form
│   │   └── AlertPriority.jsx          // Priority indicator
│   │
│   ├── incidents/
│   │   ├── IncidentCard.jsx           // Incident display card
│   │   ├── IncidentForm.jsx           // Incident creation form
│   │   └── IncidentTimeline.jsx       // Incident history timeline
│   │
│   ├── maintenance/
│   │   ├── MaintenanceCard.jsx        // Maintenance task card
│   │   ├── MaintenanceForm.jsx        // Schedule maintenance form
│   │   └── MaintenanceCalendar.jsx    // Calendar view
│   │
│   └── shared/
│       ├── LoadingSpinner.jsx
│       ├── ErrorBoundary.jsx
│       └── Notifications.jsx

├── pages/
│   ├── auth/
│   │   ├── LoginPage.jsx
│   │   └── RegisterPage.jsx
│   │
│   ├── dashboard/
│   │   ├── DashboardPage.jsx          // Main dashboard
│   │   └── AnalyticsPage.jsx          // Detailed analytics
│   │
│   ├── equipment/
│   │   ├── EquipmentListPage.jsx      // All equipment
│   │   ├── EquipmentDetailsPage.jsx   // Single equipment view
│   │   └── AddEquipmentPage.jsx       // Add new equipment
│   │
│   ├── locations/
│   │   ├── LocationsPage.jsx          // All locations
│   │   ├── LocationDetailsPage.jsx    // Single location view
│   │   └── AddLocationPage.jsx        // Add new location
│   │
│   ├── incidents/
│   │   ├── IncidentsPage.jsx          // All incidents
│   │   ├── IncidentDetailsPage.jsx    // Single incident view
│   │   └── CreateIncidentPage.jsx     // Create new incident
│   │
│   ├── maintenance/
│   │   ├── MaintenancePage.jsx        // Maintenance schedule
│   │   ├── MaintenanceDetailsPage.jsx // Single maintenance view
│   │   └── ScheduleMaintenancePage.jsx// Schedule new maintenance
│   │
│   ├── alerts/
│   │   ├── AlertsPage.jsx             // All alerts
│   │   └── AlertDetailsPage.jsx       // Single alert view
│   │
│   ├── reports/
│   │   ├── ReportsPage.jsx            // Reports dashboard
│   │   └── GenerateReportPage.jsx     // Create custom report
│   │
│   ├── settings/
│   │   ├── SettingsPage.jsx           // Main settings
│   │   ├── ProfileSettings.jsx        // User profile settings
│   │   ├── SystemSettings.jsx         // System configuration
│   │   └── NotificationSettings.jsx   // Alert preferences
│   │
│   └── ErrorPage.jsx                  // Error handling page

└── features/               // Redux slices
    ├── auth/
    ├── equipment/
    ├── incidents/
    ├── maintenance/
    ├── alerts/
    └── settings/
