import { useForm } from "react-hook-form";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";
import { useState } from "react";

const Login = () => {
  const { register, handleSubmit } = useForm();
  const { login } = useAuth();
  const navigate = useNavigate();
  const [showReset, setShowReset] = useState(false);
  const { register: registerReset, handleSubmit: handleReset } = useForm();

  const onSubmit = async (data) => {
    try {
      const res = await axios.post("/api/v1/login", data, {
        withCredentials: true,
      });
      login(res.data.user || { email: data.email });
      navigate("/welcome");
    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    }
  };

  const onReset = async (data) => {
    try {
      await axios.post("/api/v1/forgot-password", data);
      alert("Password reset link sent to your email.");
      setShowReset(false);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to send reset link.");
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 space-y-4">
      <h2 className="text-2xl font-bold">Login</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
        <input
          {...register("email")}
          type="email"
          placeholder="Email"
          required
          className="w-full border p-2"
        />
        <input
          {...register("password")}
          type="password"
          placeholder="Password"
          required
          className="w-full border p-2"
        />
        <button className="bg-green-600 text-white px-4 py-2 rounded w-full">
          Login
        </button>
      </form>

      <button
        onClick={() => setShowReset(true)}
        className="text-blue-600 underline text-sm"
      >
        Forgot Password?
      </button>

      {showReset && (
        <form
          onSubmit={handleReset(onReset)}
          className="space-y-3 mt-4 bg-gray-100 p-4 rounded"
        >
          <input
            {...registerReset("email")}
            type="email"
            placeholder="Enter your email"
            required
            className="w-full border p-2"
          />
          <button className="bg-blue-500 text-white px-4 py-2 rounded w-full">
            Send Reset Link
          </button>
        </form>
      )}
    </div>
  );
};

export default Login;
