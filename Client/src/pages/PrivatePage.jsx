import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, Outlet, Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import API_INSTANCE from "../services/auth";
import { SET_AUTH } from "../redux/slices/authSlice";
import Menu from "../components/Menu";
 
function PrivatePage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isValidating, setIsValidating] = useState(true);
  const navigate = useNavigate();
  const dispatch = useDispatch();
 
  const token = useSelector((state) => state.auth.token);
 
  const validateToken = useCallback(
    async (token) => {
      if (!token) {
        setIsAuthenticated(false);
        return;
      }
      try {
        setIsValidating(true);
        const response = await API_INSTANCE.post("/user/auth/validate", {
          token,
        });
        if (response.data.data) {
          setIsAuthenticated(true);
          dispatch(SET_AUTH(response.data.data));
        }
      } catch (error) {
        setIsAuthenticated(false);
      } finally {
        setIsValidating(false);
      }
    },
    [dispatch]
  );
 
  useEffect(() => {
    if (token) {
      validateToken(token);
    } else {
      setIsValidating(false);
    }
  }, [token, validateToken]);
 
  if (isValidating) {
    return <div>Loading...</div>;
  }
 
  if (!isAuthenticated && window.location.pathname !== "/**") {
    return <Navigate to="/login" />;
  }
 
  return (
    <>
      <div className="flex h-screen">
        <div className="flex-shrink-0 md:w-20 h-16 md:h-full border ">
          <Menu />
        </div>
        <div className="flex-1 w-11/12 overflow-auto mx-4">
          <Outlet />
        </div>
      </div>
    </>
  );
}
 
export default PrivatePage;