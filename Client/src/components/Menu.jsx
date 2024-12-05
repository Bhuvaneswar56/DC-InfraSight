import React from 'react';
import { Link } from 'react-router-dom';
import { Home, BarChart, Box, TicketCheck, Wrench, Bell, Settings, MessageSquareWarning } from 'lucide-react';

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
    <div className="w-20 hover:w-48 group bg-white shadow-md h-full fixed left-0 top-0 transition-all duration-300 ease-in-out overflow-hidden">
      <div className="space-y-2 p-4">
        {menu.map((item, index) => (
          <div 
            key={index} 
            className="relative"
          >
            <Link
              to={item.to}
              className="
                flex 
                items-center 
                space-x-4 
                text-gray-700 
                hover:text-blue-600 
                px-2 
                py-2 
                rounded 
                group-hover:w-full 
                transition-all 
                duration-300
              "
            >
              <span className="w-6 h-6">{item.icon}</span>
              <span className="
                opacity-0 
                group-hover:opacity-100 
                whitespace-nowrap 
                transition-opacity 
                duration-300 
                ease-in-out
              ">
                {item.label}
              </span>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Menu;