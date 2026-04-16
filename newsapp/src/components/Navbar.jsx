import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router";
import { toast } from "react-toastify";
import { clearUser, setUser } from "../redux/authSlice";
import { logoutUser } from "../services/authServices";
import { useRef, useState, useEffect } from "react";
import logo from "../assets/anc.jpeg";

const Navbar = () => {
    const { isAuthenticated, user } = useSelector(state => state.auth);
    const fileInputRef = useRef(null);
    const [menuOpen, setMenuOpen] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await logoutUser();
            localStorage.removeItem("token"); // 🔥 remove token
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
                "https://news-backend-17sl.onrender.com/api/v1/auth/upload/profile-picture",
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`, // 🔥 FIX
                    },
                    body: formData,
                }
            );

            const data = await response.json();

            if (!response.ok) throw new Error(data.message);

            toast.success("Profile picture updated");
            dispatch(setUser(data.user));
            e.target.value = null;

        } catch (error) {
            toast.error(error.message || "Upload failed");
        }
    };

    // 🔥 Close dropdown on outside click
    useEffect(() => {
        const handleClickOutside = () => setDropdownOpen(false);
        document.addEventListener("click", handleClickOutside);
        return () => document.removeEventListener("click", handleClickOutside);
    }, []);

    return (
        <nav className="bg-gradient-to-r from-yellow-300 via-yellow-400 to-yellow-500 shadow sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-0">
                <div className="flex justify-between h-16 items-center">

                    {/* LOGO */}
                    <Link
                        to="/"
                        onClick={() => setMenuOpen(false)}
                        className="flex items-center space-x-2"
                    >
                        <img
                            src={logo}
                            alt="Logo"
                            className="w-10 h-10 rounded-lg"
                        />
                        <span className="text-xl font-bold text-purple-950 hidden sm:block">
                            Aura News Center
                        </span>
                    </Link>

                    {/* DESKTOP MENU */}
                    <div className="hidden sm:flex items-center space-x-6">

                        <Link to="/" className="text-purple-950 font-medium">
                            Home
                        </Link>

                        {!isAuthenticated ? (
                            <>
                                <Link to="/login" className="text-purple-950">
                                    Login
                                </Link>

                                <Link
                                    to="/register"
                                    className="px-4 py-2 rounded-lg text-white bg-purple-950"
                                >
                                    Register
                                </Link>
                            </>
                        ) : (
                            <div
                                className="relative flex items-center space-x-4"
                                onClick={(e) => e.stopPropagation()} // 🔥 prevent close
                            >
                                {/* PROFILE CLICK */}
                                <div
                                    onClick={() => setDropdownOpen(!dropdownOpen)}
                                    className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-purple-50 cursor-pointer"
                                >
                                    <span className="w-8 h-8 bg-purple-950 text-white rounded-full flex items-center justify-center overflow-hidden">
                                        {user?.profilePicture ? (
                                            <img
                                                src={`https://news-backend-17sl.onrender.com${user.profilePicture}`}
                                                alt="profile"
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            user?.name?.charAt(0).toUpperCase()
                                        )}
                                    </span>

                                    <div>
                                        <p className="text-sm font-medium">{user?.name}</p>
                                        <p className="text-xs">{user?.role}</p>
                                    </div>
                                </div>

                                {/* DROPDOWN */}
                                {dropdownOpen && (
                                    <div className="absolute right-0 top-12 w-48 bg-white border rounded-lg shadow-lg">

                                        <Link
                                            to={
                                                user?.role === "admin"
                                                    ? "/admin/dashboard"
                                                    : user?.role === "journalist"
                                                        ? "/journalist/dashboard"
                                                        : "/dashboard"
                                            }
                                            onClick={() => setDropdownOpen(false)}
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
                                            ref={fileInputRef}
                                            onChange={handleUpload}
                                            className="hidden"
                                        />
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* MOBILE MENU BUTTON */}
                    <button
                        onClick={() => setMenuOpen(!menuOpen)}
                        className="sm:hidden text-purple-950 text-2xl"
                    >
                        ☰
                    </button>
                </div>
            </div>

            {/* MOBILE MENU */}
            {menuOpen && (
                <div className="sm:hidden bg-yellow-500 px-4 pb-4 space-y-3">

                    <Link to="/" onClick={() => setMenuOpen(false)}>
                        Home
                    </Link>

                    {!isAuthenticated ? (
                        <>
                            <Link to="/login">Login</Link>
                            <Link to="/register">Register</Link>
                        </>
                    ) : (
                        <>
                            <Link to="/dashboard">Dashboard</Link>
                            <button onClick={handleLogout}>Logout</button>
                        </>
                    )}
                </div>
            )}
        </nav>
    );
};

export default Navbar;