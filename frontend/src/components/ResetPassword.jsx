import { useForm } from "react-hook-form";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const ResetPassword = () => {
  const { token } = useParams();
  const { register, handleSubmit } = useForm();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      await axios.post(`/api/v1/reset-password/${token}`, data);
      alert("Password reset successful! Please login.");
      navigate("/login");
    } catch (err) {
      alert(err.response?.data?.message || "Reset failed");
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 space-y-4">
      <h2 className="text-2xl font-bold">Reset Password</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
        <input
          {...register("password")}
          type="password"
          placeholder="New Password"
          required
          className="w-full border p-2"
        />
        <input
          {...register("confirmPassword")}
          type="password"
          placeholder="Confirm Password"
          required
          className="w-full border p-2"
        />
        <button className="bg-blue-600 text-white px-4 py-2 rounded w-full">
          Reset Password
        </button>
      </form>
    </div>
  );
};

export default ResetPassword;
