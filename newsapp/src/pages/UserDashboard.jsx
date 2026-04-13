import { Navigate, useLoaderData, useSearchParams, Link, useNavigate } from 'react-router';
import Navbar from "../components/Navbar";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import {
  getAllNews,
  getBreakingNews,
  getNewsByChannel
} from "../services/newServices";
import Footer from "./Footer";
import NotificationBell from "../components/NotificationBell";

const UserDashboard = () => {
  const userData = useLoaderData();
  const user = userData.user;
  const navigate = useNavigate();

  const [searchParams, setSearchParams] = useSearchParams();

  if (user.role !== 'user') {
    toast.error('Access denied');
    return <Navigate to="/login" replace />;
  }

  const [news, setNews] = useState([]);
  const [breakingNews, setBreakingNews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeChannel, setActiveChannel] = useState(null);

  const [page, setPage] = useState(1); 

  const [filters, setFilters] = useState({
    search: '',
    newsCategory: '',
    newsType: '',
    date: ''
  });

 
  useEffect(() => {
    const params = Object.fromEntries([...searchParams]);

    const initialFilters = {
      search: params.search || '',
      newsCategory: params.newsCategory || '',
      newsType: params.newsType || '',
      date: params.date || ''
    };

    setFilters(initialFilters);

    fetchNews(initialFilters, 1);
    fetchBreaking();
  }, []);

 
  const fetchNews = async (customFilters = filters, pageNumber = page) => {
    try {
      setLoading(true);

      const res = await getAllNews({
        ...customFilters,
        page: pageNumber,
        limit: 10
      });

      setNews(res.news || []);
    } catch (err) {
      toast.error("Failed to load news");
    } finally {
      setLoading(false);
    }
  };


  const fetchBreaking = async () => {
    try {
      const res = await getBreakingNews();
      setBreakingNews(res.news || []);
    } catch (err) {
      console.log(err);
    }
  };

  
  const handleChannelClick = async (channelId) => {
    try {
      setActiveChannel(channelId);
      const res = await getNewsByChannel(channelId);
      setNews(res.news || []);
    } catch (err) {
      toast.error("Channel fetch failed");
    }
  };

  const handleReset = () => {
    const resetFilters = {
      search: '',
      newsCategory: '',
      newsType: '',
      date: ''
    };

    setFilters(resetFilters);
    setActiveChannel(null);
    setSearchParams({});
    setPage(1);

    fetchNews(resetFilters, 1);
  };


  const handleSearch = (e) => {
    e.preventDefault();

    setPage(1);
    setSearchParams(filters);

    fetchNews(filters, 1);
  };

 
  const uniqueNews = [
    ...new Map(news.map(n => [n._id, n])).values()
  ];


  const channels = [
    ...new Map(
      news.map(n => [n.channel?._id, n.channel])
    ).values()
  ].filter(Boolean);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-950 via-black to-purple-900">
      <Navbar />

      <div className="container mx-auto px-4 py-6">

        <div className="flex justify-end items-center gap-4 mb-4">
          <NotificationBell />

          <Link
            to="/settings/notifications"
            className="text-white text-xl hover:text-yellow-400"
            title="Notification Settings"
          >
            ⚙️
          </Link>
        </div>

     
        <h1 className="text-2xl text-white font-bold mb-4">
          Happy to see you, <span className='text-yellow-500'>{user.name}</span><br />
          <p className='italic text-sm text-green-500'>
            ! Here's the latest news for you:
          </p>
        </h1>

       
        <p className='text-red-600 font-bold text-md'>
          Breaking <span className='text-yellow-500'>News !</span>
        </p>

        <div className="bg-red-600 text-white p-3 rounded mb-6 overflow-hidden">
          <marquee>
            {breakingNews.map(n =>
              `${n.channel?.name || "Unknown"} - ${n.title}`
            ).join(" 🔥 ")}
          </marquee>
        </div>

        
        <form
          onSubmit={handleSearch}
          className="bg-white p-4 rounded shadow mb-6 grid grid-cols-1 md:grid-cols-6 gap-4"
        >
          <input
            type="text"
            placeholder="Search..."
            value={filters.search}
            className="border p-2 rounded"
            onChange={(e) =>
              setFilters({ ...filters, search: e.target.value })
            }
          />

          <select
            value={filters.newsCategory}
            className="border p-2 rounded"
            onChange={(e) =>
              setFilters({ ...filters, newsCategory: e.target.value })
            }
          >
            <option value="">Category</option>
            <option>Sports</option>
            <option>Business</option>
            <option>Politics</option>
            <option>Technology</option>
            <option>Entertainment</option>
            <option>Health</option>
            <option>Science</option>
            <option>World</option>
            <option>Other</option>
          </select>

          <select
            value={filters.newsType}
            className="border p-2 rounded"
            onChange={(e) =>
              setFilters({ ...filters, newsType: e.target.value })
            }
          >
            <option value="">Type</option>
            <option value="National">National</option>
            <option value="International">International</option>
          </select>

          <input
            type="date"
            value={filters.date}
            className="border p-2 rounded"
            onChange={(e) =>
              setFilters({ ...filters, date: e.target.value })
            }
          />

          <button className="bg-purple-950 text-white rounded px-4 py-1 cursor-pointer">
            Search
          </button>

          <button
            type="button"
            onClick={handleReset}
            className="bg-red-500 text-white rounded px-4 py-1 cursor-pointer"
          >
            Reset
          </button>
        </form>

      
        <div className="flex gap-3 mb-6 flex-wrap">
          <button
            onClick={() => {
              setActiveChannel(null);
              fetchNews();
            }}
            className="bg-green-500 text-white px-3 py-1 rounded"
          >
            All
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
          <p className='text-white'>Loading...</p>
        ) : uniqueNews.length === 0 ? (
          <p className="text-center text-white text-lg">
            ❌ No news found
          </p>
        ) : (
          <div className="grid gap-6">
            {uniqueNews.map((n) => (
              <div key={n._id} className="bg-white p-4 rounded shadow">

                <div className="flex justify-between items-start mb-2">
                  <h2 className="text-lg font-bold">{n.title}</h2>

                  <div className="flex items-center gap-2">
                    {n.channel?.logo && (
                      <img
                        src={`https://news-backend-17sl.onrender.com/${n.channel.logo}`}
                        className="w-8 h-8 rounded-full"
                      />
                    )}
                    <span className="text-sm">{n.channel?.name}</span>
                  </div>
                </div>

                <p className="text-sm text-gray-600 mb-2">
                  {n.description.substring(0, 80)}...
                </p>

                <button
                  onClick={() => navigate(`/news/${n._id}`)}
                  className="bg-purple-950 text-white px-3 py-1 rounded cursor-pointer"
                >
                  View
                </button>
              </div>
            ))}
          </div>
        )}

     
        <div className="flex justify-center gap-4 mt-6">
          <button
            disabled={page === 1}
            onClick={() => {
              const newPage = page - 1;
              setPage(newPage);
              fetchNews(filters, newPage);
            }}
            className="bg-gray-500 text-white px-4 py-1 rounded disabled:opacity-50 cursor-pointer"
          >
            Prev
          </button>

          <span className="text-white font-bold">Page {page}</span>

          <button
            onClick={() => {
              const newPage = page + 1;
              setPage(newPage);
              fetchNews(filters, newPage);
            }}
            className="bg-purple-700 text-white px-4 py-1 rounded cursor-pointer"
          >
            Next
          </button>
        </div>

      </div>
      <Footer/>
    </div>
  );
};

export default UserDashboard;