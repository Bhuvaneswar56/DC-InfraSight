import React from 'react';
import { Link } from 'react-router-dom';
import { Home, BarChart, Box, TicketCheck , Wrench, Bell, Settings, MessageSquareWarning  } from 'lucide-react';

function Menu() {
  const menu = [
    { label: "Home", icon: <Home />, to: "/home" },
    { label: "Analytics", icon: <BarChart />, to: "/analytics" },
    { label: "Equipments", icon: <Box />, to: "/equipments" },
    { label: "Alerts", icon: <MessageSquareWarning />, to: "/alerts" },
    { label: "Maintenance", icon: <Wrench />, to: "/maintenance" },
    { label: "Incidents", icon: <TicketCheck />, to: "/incidents" },
    { label: "Notifications", icon: <Bell />, to: "/notifications" },
    { label: "Settings", icon: <Settings />, to: "/settings" }
  ];

  return (
    <div className="space-y-2 p-4">
      {menu.map((item, index) => (
        <Link
          key={index}
          to={item.to}
          className="flex items-center space-x-2 text-gray-800 hover:text-red-500 "
        >
          {item.icon}
          <p>{item.label}</p>
        </Link>
      ))}
    </div>
  );
}

export default Menu;
