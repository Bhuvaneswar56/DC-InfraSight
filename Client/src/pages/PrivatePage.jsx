import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, Outlet, Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import API_INSTANCE from "../services/auth";
import { SET_AUTH } from "../redux/slices/authSlice";
import Menu from "../components/Menu";

function Privatepage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isValidating, setIsValidating] = useState(true);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const token = useSelector((state) => state.auth.token);
  console.log("token", token);

  const validateToken = useCallback(async (token) => {
    if (!token) {
      setIsAuthenticated(false);
      toast.error("Please login");
      navigate("/login");
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
        toast.success("Login Sucessfull");
      }
    } catch (error) {
      setIsAuthenticated(false);
      toast.error(error.message || "check credentials");
      navigate("/login");
    } finally {
      setIsValidating(false);
    }
  }, [navigate]);

  useEffect(() => {
    if (token) {
      validateToken(token);
    }
  }, [token]);

  if (isValidating) {
    return <div>It's Loading...</div>;
  }

  if (!isAuthenticated) {
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

export default Privatepage;
