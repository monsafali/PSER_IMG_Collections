import { useForm } from "react-hook-form";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";

const Signup = () => {
  const { register, handleSubmit } = useForm();
  const { login } = useAuth();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      const res = await axios.post("/api/v1/signup", data, {
        withCredentials: true,
      });
      login(res.data.user || { name: data.name, email: data.email }); // mock
      navigate("/welcome");
    } catch (err) {
      alert(err.response?.data?.message || "Signup failed");
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-md mx-auto p-6 space-y-4"
    >
      <h2 className="text-2xl font-bold">Signup</h2>
      <input
        {...register("name")}
        placeholder="Name"
        required
        className="w-full border p-2"
      />
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
      <button className="bg-blue-500 text-white px-4 py-2 rounded">
        Signup
      </button>
    </form>
  );
};

export default Signup;
