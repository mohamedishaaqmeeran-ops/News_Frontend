import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router";
import { toast } from "react-toastify";
import { clearUser, setUser } from "../redux/authSlice";
import { logoutUser } from "../services/authServices";
import { useRef, useState } from "react";


const Navbar = () => {
    const { isAuthenticated, user } = useSelector(state => state.auth);
    const fileInputRef = useRef(null);
    const [menuOpen, setMenuOpen] = useState(false);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await logoutUser();
            dispatch(clearUser());
            toast.success("Logged out successfully");
            navigate("/login", { replace: true });
        } catch (error) {
            toast.error("Error logging out");
            dispatch(clearUser());
            navigate("/login", { replace: true });
        }
    };

    const handleUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append("profilePicture", file);

        try {
            const response = await fetch(
                "http://localhost:3001/api/v1/auth/upload/profile-picture",
                {
                    method: "POST",
                    credentials: "include",
                    body: formData,
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message);
            }

            toast.success("Profile picture updated");
            dispatch(setUser(data.user));
            e.target.value = null;

        } catch (error) {
            toast.error(error.message || "Upload failed");
        }
    };

    return (
        <nav className="bg-gradient-to-r from-yellow-300 via-yellow-400 to-yellow-500 shadow-[0_0_20px_rgba(147,51,234,0.3)] sticky top-0 z-1000">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-0">
                <div className="flex justify-between h-16 items-center">

                    
                    <Link
                        to="/"
                        onClick={() => setMenuOpen(false)}
                        className="flex items-center space-x-2"
                    >
                        <div className="w-10 h-10 bg-purple-950 rounded-lg flex items-center justify-center shadow-md">
                            <span className="text-white font-bold text-lg">ANC</span>
                        </div>
                        <span className="text-xl font-bold text-purple-950 hidden sm:block">
                            Aura News Center
                        </span>
                    </Link>

                    
                    <div className="hidden sm:flex items-center space-x-6">

                        <Link to="/" className="hover:underline text-purple-950 font-medium">
                            Home
                        </Link>

                        {!isAuthenticated ? (
                            <>
                                <Link to="/login" className="text-purple-950 font-medium">
                                    Login
                                </Link>

                                <Link
                                    to="/register"
                                    className="px-4 py-2 rounded-lg text-white bg-purple-950 hover:bg-purple-800"
                                >
                                    Register
                                </Link>
                            </>
                        ) : (
                           <div className="relative group flex items-center space-x-4">

   
    <div className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-purple-50 cursor-pointer">

        
        <span className="w-8 h-8 bg-purple-950 text-white rounded-full flex items-center justify-center overflow-hidden">
            {user?.profilePicture ? (
                <img
                    src={`http://localhost:3001${user.profilePicture}`}
                    alt="profile"
                    className="w-full h-full object-cover"
                />
            ) : (
                user?.name?.charAt(0).toUpperCase() || "U"
            )}
        </span>

   
        <div className="flex flex-col leading-tight">
            <span className="font-medium text-purple-950">
                {user?.name || "User"}
            </span>
            <span className="text-xs text-purple-950">
                {user?.role}
            </span>
        </div>

    </div>

    
    <div className="absolute right-0 top-12 w-48 bg-white border rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition z-1000">

        <Link
            to={
                user?.role === "admin"
                    ? "/admin/dashboard"
                    : user?.role === "journalist"
                        ? "/journalist/dashboard"
                        : "/dashboard"
            }
            className="block px-4 py-2 hover:bg-purple-100"
        >
            Dashboard
        </Link>

        <button
            onClick={() => fileInputRef.current.click()}
            className="w-full text-left px-4 py-2 hover:bg-purple-100"
        >
            Update Profile Picture
        </button>

        <button
            onClick={handleLogout}
            className="w-full text-left px-4 py-2 hover:bg-purple-100"
        >
            Logout
        </button>

        <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleUpload}
            className="hidden"
        />
    </div>
</div>
                        )}
                    </div>

                    
                    <button
                        onClick={() => setMenuOpen(!menuOpen)}
                        className="sm:hidden text-purple-950 text-2xl"
                    >
                        ☰
                    </button>
                </div>
            </div>

          
            {menuOpen && (
                <div className="sm:hidden bg-yellow-500 px-4 pb-4 space-y-3 shadow-md">

                    <Link
                        to="/"
                        onClick={() => setMenuOpen(false)}
                        className="block text-purple-950"
                    >
                        Home
                    </Link>

                    {!isAuthenticated ? (
                        <>
                            <Link
                                to="/login"
                                onClick={() => setMenuOpen(false)}
                                className="block text-purple-950"
                            >
                                Login
                            </Link>

                            <Link
                                to="/register"
                                onClick={() => setMenuOpen(false)}
                                className="block bg-purple-950 text-white px-3 py-2 rounded"
                            >
                                Register
                            </Link>
                        </>
                    ) : (
                        <>
                            <Link
                                to={
                                    user?.role === "admin"
                                        ? "/admin/dashboard"
                                        : user?.role === "journalist"
                                            ? "/journalist/dashboard"
                                            : "/dashboard"
                                }
                                onClick={() => setMenuOpen(false)}
                                className="block text-purple-950"
                            >
                                Dashboard
                            </Link>

                            <button
                                onClick={() => {
                                    fileInputRef.current.click();
                                    setMenuOpen(false);
                                }}
                                className="block w-full text-left text-purple-950"
                            >
                                Update Profile Picture
                            </button>

                            <button
                                onClick={handleLogout}
                                className="block w-full text-left text-purple-950"
                            >
                                Logout
                            </button>
                        </>
                    )}
                </div>
            )}
        </nav>
    );
};

export default Navbar;