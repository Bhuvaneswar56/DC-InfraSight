import React from 'react';
import Menu from '../components/Menu';
import { Outlet } from 'react-router-dom';

function Privatepage() {
  return (
    <div className="flex h-screen">
      <div className="flex-shrink-0 md:w-48  h-16 md:h-full border border-black">
        <Menu />
      </div>
      <div className="flex-1 p-4 bg-white overflow-auto">
        <Outlet />
      </div>
    </div>
  );
}

export default Privatepage;
