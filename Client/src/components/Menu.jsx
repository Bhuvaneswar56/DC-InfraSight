import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Home, BarChart, Box, TicketCheck, Wrench, Bell, Settings, MessageSquareWarning ,X,MenuIcon} from 'lucide-react';

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

  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <div>
    <div className=" hidden md:block w-20 hover:w-48 group bg-white shadow-md h-full fixed left-0 top-0 transition-all duration-300 ease-in-out overflow-hidden z-50">
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

    <div className="md:hidden fixed top-4 left-4 z-50">
      {/* Hamburger Button */}
      <button
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className="bg-white p-2 rounded shadow-md hover:bg-gray-100 transition duration-200"
      >
        {isMenuOpen ? null : <MenuIcon size={24} />}
      </button>

      {/* Slide-out Menu */}
      <div
        className={`
          fixed 
          top-0 
          left-0 
          h-full 
          w-34 
          bg-white 
          shadow-md 
          z-50 
          transition-transform 
          duration-300 
          ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {/* Close Button */}
        <button
          onClick={() => setIsMenuOpen(false)}
          className="absolute top-4 right-4 text-gray-700 hover:text-red-600 transition duration-200"
        >
          <X size={24} />
        </button>

        {/* Menu Items */}
        <div className="p-8 space-y-4">
          {menu.map((item, index) => (
            <div key={index} className="relative">
              <Link
                to={item.to}
                onClick={() => setIsMenuOpen(false)} // Close menu on navigation
                className="
                  flex 
                  items-center 
                  space-x-4 
                  text-gray-700 
                  hover:text-blue-600 
                  px-2 
                  py-2 
                  rounded 
                  transition-all 
                  duration-300
                "
              >
                <span className="w-6 h-6">{item.icon}</span>
                <span className="whitespace-nowrap">{item.label}</span>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
    </div>
  );
}

export default Menu;