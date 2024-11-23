import React, { useState, useEffect } from 'react';
import { useNavigate, Outlet, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {  toast } from 'react-toastify';
import API_INSTANCE from '../services/auth';
import { SET_AUTH } from '../redux/slices/authSlice';
import Menu from '../components/Menu';

function Privatepage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const token = useSelector((state) => state.auth.token);

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isValidating, setIsValidating] = useState(true); 

  async function checkToken() {
    try {
      const response = await API_INSTANCE.post('/user/auth/validate', { token });
      dispatch(SET_AUTH(response.data.data));
      setIsAuthenticated(true);
      // toast.success('Login successful!');
    } catch (error) {
      setIsAuthenticated(false);
      navigate('/login');
    } finally {
      setIsValidating(false); 
    }
  }

  useEffect(() => {
    if (token) {
      checkToken();
    } else {
      setIsAuthenticated(false);
      toast.error('Please login.'); // Toast for missing token
      navigate('/login');
    }
  }, [token]);

  if (isValidating) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return (
    <>
      <div className="flex h-screen">
        <div className="flex-shrink-0 md:w-48 h-16 md:h-full border border-black">
          <Menu />
        </div>
        <div className="flex-1 p-4 bg-white overflow-auto">
          <Outlet />
        </div>
      </div>
    </>
  );
}

export default Privatepage;
