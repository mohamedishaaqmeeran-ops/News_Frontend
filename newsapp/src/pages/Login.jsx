import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { toast } from "react-toastify";
import { loginUser } from "../services/authServices";
import { useDispatch } from "react-redux";
import { setUser } from '../redux/authSlice';
import login from "../assets/login.png";
import { getFCMToken } from "../utils/getFCMToken";
const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const response = await loginUser(formData);

localStorage.setItem("token", response.token); // 🔥 STORE TOKEN
dispatch(setUser(response.user));
            toast.success(response.message);
           await getFCMToken();
            if (response.user.role === 'admin') {
                navigate('/admin/dashboard');
            } else if (response.user.role === 'journalist') {
                navigate('/journalist/dashboard');
            } else {
                navigate('/dashboard');
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || error.message || "Login failed";
            toast.error(errorMessage);
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-yellow-500 p-4">

            <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 bg-white rounded-lg shadow-[0_0_50px_rgba(147,51,234,0.6)] overflow-hidden">

              
                <div className="p-8 flex flex-col justify-center">

                   
                    <div className="text-center mb-6">
                        <Link to="/" className="flex items-center justify-center space-x-2">
                            <div className="w-14 h-12 bg-purple-950 rounded-lg flex items-center justify-center">
                                <span className="text-white font-bold text-2xl">ANC</span>
                            </div>
                        </Link>

                        <h2 className="mt-4 text-3xl font-extrabold text-purple-950">
                            Sign in to your account
                        </h2>

                        <p className="mt-2 text-sm text-purple-950">
                            Or{' '}
                            <Link to="/register" className="font-medium text-green-700 hover:text-green-900">
                                create a new account
                            </Link>
                        </p>
                    </div>

                 
                    <form className="space-y-6" onSubmit={handleLogin}>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Email address
                            </label>
                            <input
                                type="email"
                                required
                                className="mt-1 block w-full px-3 py-2 border rounded-md focus:ring-purple-500 focus:border-purple-500"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
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
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            />
                        </div>

                        <div className="flex justify-end text-sm">
                            <Link to="" className="text-green-700 hover:text-green-900">
                                Forgot password?
                            </Link>
                        </div>

                        <button
                            type="submit"
                            className="w-full py-2 px-4 rounded-md text-white bg-purple-950 hover:bg-purple-800 transition cursor-pointer"
                        >
                            Sign in
                        </button>

                    </form>

                   
                </div>

             
                <div className="hidden md:flex items-center justify-center bg-purple-950 p-6">
                    <img
                        src={login}
                        alt="Login Illustration"
                        className="max-w-85 h-144 object-contain"
                    />
                </div>

            </div>
        </div>
    )
}

export default Login;