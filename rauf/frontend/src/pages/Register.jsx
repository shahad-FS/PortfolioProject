import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";

const Register = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "pet_owner",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await api.post("accounts/register/", formData);
      console.log("Success:", response.data);
      alert("User registered successfully!");
    } catch (error) {
      console.log("ERROR DATA:", error.response?.data);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <form
        onSubmit={handleSubmit}
        className="p-6 rgb(234, 224, 195) shadow-md rounded w-96"
      >
        <h2 className="text-xl mb-4">Register</h2>

        <input
          name="email"
          placeholder="Email"
          onChange={handleChange}
          className="input input-primary mb-2 w-full"
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
          className="input input-primary mb-2 w-full"
        />
        <label className="block mb-2">Select Role:</label>
        <select
          name="role"
          onChange={handleChange}
          className="border p-2 w-full mb-2 select select-primary"
        >
          <option value="pet_owner">Pet Owner</option>
          <option value="vet">Vet</option>
        </select>

        <button
          className="btn w-full text-white border-primary hover:primary "
          type="submit"
        >
          Register
        </button>
        {/* ================= LOGIN LINK ================= */}
        <p className="text-center text-sm mt-4 text-gray-500">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-blue-600 hover:underline font-medium"
          >
            Sign in instead
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Register;
