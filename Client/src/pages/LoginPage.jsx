import React, { useState, useCallback } from "react";
import { useDispatch } from "react-redux";
import API_INSTANCE from "../services/auth.js";
import { SET_AUTH } from "../redux/slices/authSlice";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function LoginPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [formdata, setFormData] = useState({
    email:" ",
    password:" ",
  });

  const handleChange = (e) => {
    console.log("Event Target:", e);
    const { name, value } = e.target;
    setFormData((previousFormData) => ({
      ...previousFormData,
      [name]: value,
    }));
  
  };
  const handlesubmit = useCallback(async (e) => {
    e.preventDefault();
    const { email, password } = formdata;
    try {
      let info = await API_INSTANCE.post("/user/login", {
        email,
        password,
      });
      const token = info.data.data.token;
      localStorage.setItem("token", token);
      dispatch(SET_AUTH(info.data.data));
      navigate("/home");
    } catch (error) {
      console.log(error);
      toast.error("Invalid details. Please login.");
    }
  },[navigate, formdata, dispatch]);

  return (
    <div className="w-full min-h-screen bg-gray-50 flex flex-col sm:justify-center items-center pt-6 sm:pt-0">
      <div className="w-full sm:max-w-md p-5 mx-auto">
        <h2 className="mb-12 text-center text-5xl font-extrabold">Welcome.</h2>
        <form onSubmit={handlesubmit}>
          <div className="mb-4">
            <label className="block mb-1" for="email">
              Email-Address
            </label>
            <input
              onChange={handleChange}
              id="email"
              type="text"
              name="email"
              value={formdata.email}
              className="py-2 px-3 border border-gray-300 focus:border-red-300 focus:outline-none focus:ring focus:ring-red-200 focus:ring-opacity-50 rounded-md shadow-sm disabled:bg-gray-100 mt-1 block w-full"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1" for="password">
              Password
            </label>
            <input
              onChange={handleChange}
              id="password"
              type="password"
              name="password"
             value={formdata.password}
              className="py-2 px-3 border border-gray-300 focus:border-red-300 focus:outline-none focus:ring focus:ring-red-200 focus:ring-opacity-50 rounded-md shadow-sm disabled:bg-gray-100 mt-1 block w-full"
            />
          </div>
          <div className="mt-6 flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember_me"
                type="checkbox"
                className="border border-gray-300 text-red-600 shadow-sm focus:border-red-300 focus:ring focus:ring-red-200 focus:ring-opacity-50"
              />
              <label
                for="remember_me"
                className="ml-2 block text-sm leading-5 text-gray-900"
              >
                {" "}
                Remember me{" "}
              </label>
            </div>
            <a href="#" className="text-sm">
              {" "}
              Forgot your password?{" "}
            </a>
          </div>
          <div className="mt-6">
            <button
              type="submit"
              className="w-full inline-flex items-center justify-center px-4 py-2 bg-black border border-transparent rounded-md font-semibold capitalize text-white hover:bg-red-700 active:bg- focus:bg-black outline-none focus:border-red-700 focus:ring focus:ring-red-200 disabled:opacity-25 transition"
            >
              Sign In
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
