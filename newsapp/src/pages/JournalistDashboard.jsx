import { useLoaderData, Navigate } from "react-router";
import Navbar from "../components/Navbar";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";
import Footer from "./Footer";
import {
    getMyNews,
    getBreakingNews,
    getNewsByChannel,
    deleteNews,
    getJournalistBreakingNews
} from "../services/newServices";

const JournalistDashboard = () => {
    const userData = useLoaderData();
    const user = userData.user;
    const navigate = useNavigate();


    if (user.role !== 'journalist') {
        toast.error('Access denied. Journalist only.');

        if (user.role === 'admin') return <Navigate to="/admin/dashboard" replace />;
        if (user.role === 'user') return <Navigate to="/dashboard" replace />;

        return <Navigate to="/login" replace />;
    }

    const [news, setNews] = useState([]);
    const [filteredNews, setFilteredNews] = useState([]);
    const [breakingNews, setBreakingNews] = useState([]);
    const [loading, setLoading] = useState(false);
    const [activeChannel, setActiveChannel] = useState(null);

    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("");
    const [type, setType] = useState("");
    const [date, setDate] = useState("");

    useEffect(() => {
        fetchNews();
        fetchBreaking();
    }, []);

 
    const fetchNews = async () => {
        try {
            setLoading(true);
            const res = await getMyNews();
            const data = res.news || [];
            setNews(data);
            setFilteredNews(data);
        } catch (err) {
            toast.error("Failed to fetch news");
        } finally {
            setLoading(false);
        }
    };

  
    const fetchBreaking = async () => {
        try {
            const res = await getJournalistBreakingNews();
            setBreakingNews(res.news || []);
        } catch (err) {
            console.log(err);
        }
    };

 
    const handleChannelClick = async (channelId) => {
        try {
            setActiveChannel(channelId);
            const res = await getNewsByChannel(channelId);
            const data = res.news || [];
            setNews(data);
            setFilteredNews(data);
        } catch (err) {
            toast.error("Failed to fetch channel news");
        }
    };

    const handleSearch = () => {
        let result = [...news];

        if (search) {
            result = result.filter(n =>
                n.title.toLowerCase().includes(search.toLowerCase())
            );
        }

        if (category) {
            result = result.filter(n => n.newsCategory === category);
        }

        if (type) {
            result = result.filter(n => n.newsType === type);
        }

        if (date) {
            result = result.filter(n =>
                new Date(n.createdAt).toLocaleDateString("en-GB") ===
                new Date(date).toLocaleDateString("en-GB")
            );
        }

        setFilteredNews(result);
    };


    const resetFilters = () => {
        setSearch("");
        setCategory("");
        setType("");
        setDate("");
        setFilteredNews(news);
    };

  
    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this news?")) {
            try {
                await deleteNews(id);
                toast.success("News deleted successfully");
                fetchNews();
            } catch (err) {
                toast.error("Delete failed");
            }
        }
    };

   
    const channels = [
        ...new Map(news.map(n => [n.channel?._id, n.channel])).values()
    ].filter(Boolean);

 
    const categories = [...new Set(news.map(n => n.newsCategory))];
    const types = [...new Set(news.map(n => n.newsType))];

    return (
        
        <div className="min-h-screen bg-gradient-to-br from-purple-950 via-black to-purple-900">
            <Navbar />

            <div className="container mx-auto px-4 py-6">

                      <h1 className="text-2xl text-white font-bold mb-4">
                    Happy to see you, <span className='text-yellow-500'>{user.name}</span><br />
                    <p className='italic text-sm text-green-500'>
                        ! Here you can post your latest news:
                    </p>
                </h1>

              
                <p className='text-red-600 font-bold text-md'>
                    Breaking <span className='text-yellow-500'>News !</span>
                </p>

               
<div className="bg-red-600 text-white p-3 rounded mb-6 overflow-hidden">
    <marquee>
        {breakingNews?.length > 0
            ? breakingNews.map(n =>
                `${n.channel?.name || "Unknown"} - ${n.title}`
              ).join(" 🔥 ")
            : "No breaking news found"
        }
    </marquee>
</div>

             
                <div className="flex justify-end mb-4">
                    <button
                        onClick={() => navigate('/journalist/createnews')}
                        className="bg-green-500 text-white px-4 py-2 rounded cursor-pointer"
                    >
                        + Post News
                    </button>
                </div>

              
                <div className="bg-white p-4 rounded shadow mb-6 grid md:grid-cols-6 gap-3">

                    <input
                        type="text"
                        placeholder="Search title..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="border p-2 rounded"
                    />

                 <select
    value={category}
    onChange={(e) => setCategory(e.target.value)}
    className="border p-2 rounded"
>
    <option value="">All Categories</option>
    <option value="Politics">Politics</option>
    <option value="Sports">Sports</option>
    <option value="Technology">Technology</option>
    <option value="Business">Business</option>
    <option value="Entertainment">Entertainment</option>
    <option value="Health">Health</option>
    <option value="Education">Education</option>
    <option value="Science">Science</option>
    <option value="World">World</option>
    <option value="Other">Other</option>
</select><select
    value={type}
    onChange={(e) => setType(e.target.value)}
    className="border p-2 rounded"
>
    <option value="">All Types</option>
    <option value="National">National</option>
    <option value="International">International</option>
    
</select>

                    <input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="border p-2 rounded"
                    />

                  
                    <button
                        onClick={handleSearch}
                        className="bg-purple-950 text-white px-3 py-2 rounded cursor-pointer"
                    >
                        Search
                    </button>

                   
                    <button
                        onClick={resetFilters}
                        className="bg-red-600 text-white px-3 py-2 rounded cursor-pointer"
                    >
                        Reset
                    </button>

                </div>

            
                <div className="flex gap-3 mb-6 flex-wrap">
                    <button
                        onClick={() => {
                            setActiveChannel(null);
                            fetchNews();
                        }}
                        className="bg-green-500 text-white px-3 py-1 rounded cursor-pointer"
                    >
                        All Channels
                    </button>

                    {channels.map(channel => (
                        <button
                            key={channel._id}
                            onClick={() => handleChannelClick(channel._id)}
                            className={`px-3 py-1 rounded cursor-pointer ${
                                activeChannel === channel._id
                                    ? "bg-yellow-500 text-white"
                                    : "bg-yellow-500 text-white hover:bg-green-500"
                            }`}
                        >
                            {channel.name} 
                        </button>
                    ))}
                </div>

                {loading ? (
                    <p>Loading...</p>
                ) : filteredNews.length === 0 ? (
                    <p className="text-center text-white">No news found</p>
                ) : (
                    <div className="grid md:grid-cols-2 gap-6">
    {filteredNews.map(n => (
        <div key={n._id} className="bg-white p-4 rounded shadow">

        
            <div className="flex justify-between items-start mb-2">

             
                <h2 className="text-lg font-bold">
                    {n.title}
                </h2>

                <div className="flex items-center gap-2">
                    {n.channel?.logo && (
                        <img
                            src={
                                n.channel.logo.startsWith("http")
                                    ? n.channel.logo
                                    : `https://news-backend-17sl.onrender.com/${n.channel.logo.replace(/\\/g, "/")}`
                            }
                            alt="logo"
                            className="w-8 h-8 rounded-full object-cover"
                        />
                    )}

                    <span className="text-sm font-semibold text-gray-700">
                        {n.channel?.name}
                    </span>
                </div>

            </div>

          
            <p className="text-sm text-gray-600 mb-2">
                {n.description.substring(0, 100)}...
            </p>

        
            <div className="text-xs text-gray-500 mb-3">
                <p>📂 {n.newsCategory}</p>
                <p>🌍 {n.newsType}</p>
                <p>📅 {new Date(n.createdAt).toLocaleDateString("en-GB")}</p>
            </div>

        
            <div className="flex gap-2 flex-wrap">
                <button
                    onClick={() => navigate(`/news/${n._id}`)}
                    className="bg-green-500 text-white px-3 py-1 rounded cursor-pointer"
                >
                    View News
                </button>

                <button
                    onClick={() => navigate(`/journalist/editnews/${n._id}`)}
                    className="bg-yellow-500 text-white px-3 py-1 rounded cursor-pointer"
                >
                    Edit
                </button>

                <button
                    onClick={() => handleDelete(n._id)}
                    className="bg-red-600 text-white px-3 py-1 rounded cursor-pointer"
                >
                    Delete
                </button>
            </div>

        </div>
    ))}
</div>
                )}
            </div>
            <Footer/>
        </div>
    );
};

export default JournalistDashboard;