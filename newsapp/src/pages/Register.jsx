import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { toast } from "react-toastify";
import { registerUser } from "../services/authServices";
import register from "../assets/register.png";
const Register = () => {

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: ''
    });
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();

        if (formData.password.length < 6) {
            toast.error("Password must be at least 6 characters long");
            return;
        }

        try {
            const userData = {
                name: formData.name,
                email: formData.email,
                password: formData.password
            };

            const response = await registerUser(userData);
            toast.success(response.message);

            
            navigate("/login");

        } catch (error) {
            const errorMessage = error.response?.data?.message || "Registration failed. Please try again...";
            toast.error(errorMessage);
        }
    }

   return (
  <div className="min-h-screen flex items-center justify-center bg-yellow-500 p-4">
    
    <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 bg-white rounded-lg shadow-[0_0_50px_rgba(147,51,234,0.6)] overflow-hidden">

      <div className="hidden md:flex items-center justify-center bg-purple-950 ">
        <img
          src={register}
          alt="Signup"
          className="max-w-full h-115 object-contain rounded-lg shadow-lg"
        />
      </div>

      <div className="p-8">
     
        <div className="text-center mb-6">
          <Link to="/" className="flex items-center justify-center space-x-2">
            <div className="w-14 h-12 bg-purple-950 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-2xl">ANC</span>
            </div>
          </Link>

          <h2 className="mt-4 text-3xl font-extrabold text-purple-950">
          Sign Up for an Account
          </h2>

          <p className="mt-2 text-sm text-purple-950">
            Or{' '}
            <Link to="/login" className="font-medium text-green-700 hover:text-green-900">
              sign in to your account
            </Link>
          </p>
        </div>

     
        <form className="space-y-6" onSubmit={handleRegister}>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Full Name
            </label>
            <input
              type="text"
              required
              className="mt-1 block w-full px-3 py-2 border rounded-md focus:ring-purple-500 focus:border-purple-500"
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email address
            </label>
            <input
              type="email"
              required
              className="mt-1 block w-full px-3 py-2 border rounded-md focus:ring-purple-500 focus:border-purple-500"
              value={formData.email}
              onChange={e => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              required
              className="mt-1 block w-full px-3 py-2 border rounded-md focus:ring-purple-500 focus:border-purple-500"
              value={formData.password}
              onChange={e => setFormData({ ...formData, password: e.target.value })}
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 px-4 rounded-md text-white bg-purple-950 hover:bg-purple-800 transition"
          >
            Register
          </button>
        </form>

        
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            By signing up, you agree to our Terms and Privacy Policy.
          </p>
        </div>

        <div className="mt-6 text-center">
          <Link to="/" className="text-sm italic font-bold text-green-700 underline">
            Back to Home
          </Link>
        </div>

      </div>
    </div>
  </div>
);
}

export default Register;