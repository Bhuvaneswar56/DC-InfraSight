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
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((previousFormData) => ({
      ...previousFormData,
      [name]: value,
    }));
  };

  const handleSubmit = useCallback(
    async (e) => {
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
    },
    [navigate, formdata, dispatch]
  );

  // LoginPage.jsx
const handleGuestAccess = () => {
  localStorage.setItem('guestMode', 'true');
  // Dispatch a guest user state to Redux
  dispatch(SET_AUTH({
    isGuest: true,
    // Add any default guest user data you want to maintain
    name: 'Guest User',
    email: 'guest@example.com'
  }));
  navigate("/home");
};
  return (
    <div className="w-full min-h-screen bg-gray-50 flex flex-col sm:justify-center items-center pt-6 sm:pt-0">
      <div className="w-full sm:max-w-md p-5 mx-auto">
      <h2 
  className="mb-12 text-center flex justify-center items-center text-5xl font-extrabold bg-gradient-to-r from-blue-500 via-gray-900 to-green-500 text-transparent bg-clip-text whitespace-nowrap"
>
  Welcome !
</h2>


        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-1" htmlFor="email">
              Email-Address
            </label>
            <input
              onChange={handleChange}
              id="email"
              type="text"
              name="email"
              placeholder="your email"
              value={formdata.email}
              className="py-2 px-3 border border-gray-300 focus:border-blue-500 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-50 rounded-md shadow-sm disabled:bg-gray-100 mt-1 block w-full"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1" htmlFor="password">
              Password
            </label>
            <input
              onChange={handleChange}
              id="password"
              type="password"
              name="password"
              placeholder="your password"
              value={formdata.password}
              className="py-2 px-3 border border-gray-300 focus:border-blue-500 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-50 rounded-md shadow-sm disabled:bg-gray-100 mt-1 block w-full"
            />
          </div>
          <div className="mt-6 flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember_me"
                type="checkbox"
                className="border border-gray-300 text-red-600 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-300 focus:ring-opacity-50"
              />
              <label
                htmlFor="remember_me"
                className="ml-2 block text-sm leading-5 text-gray-900"
              >
                Remember me
              </label>
            </div>
            {/* <a href="#" className="text-sm">
              Forgot your password?
            </a> */}
          </div>
          <div className="mt-6">
            <button
              type="submit"
              className="w-full inline-flex items-center justify-center px-4 py-2 bg-black border border-transparent rounded-md font-semibold capitalize text-white hover:bg-blue-500 focus:bg-black outline-none focus:border-blue-400 focus:ring focus:ring-blue-300 disabled:opacity-25 transition"
            >
              Sign In
            </button>
          </div>
        </form>
        <div className="mt-4">
          <button
            onClick={handleGuestAccess}
            className="w-full inline-flex items-center justify-center px-4 py-2 bg-gray-200 border border-transparent rounded-md font-semibold capitalize text-gray-700 hover:bg-gray-300 focus:bg-gray-300 outline-none focus:border-gray-300 focus:ring focus:ring-gray-300 disabled:opacity-25 transition"
          >
            Continue as Guest
          </button>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
