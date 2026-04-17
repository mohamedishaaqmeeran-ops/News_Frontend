import { useParams, useLoaderData } from "react-router";
import { useEffect, useState } from "react";
import { getNewsById } from "../services/newServices";
import Navbar from "../components/Navbar";
import { toast } from "react-toastify";
import { Link } from "react-router";
import Footer from "./Footer";

const NewsDetails = () => {
    const { id } = useParams();
    const [news, setNews] = useState(null);
    const data = useLoaderData();
    const user = data?.user;

    useEffect(() => {
        fetchNews();
    }, []);

    const fetchNews = async () => {
        try {
            const res = await getNewsById(id);
            console.log("NEWS DATA:", res.news); // 🔥 DEBUG
            setNews(res.news);
        } catch (err) {
            toast.error("Failed to load news");
        }
    };

    // 🔥 FIXED IMAGE URL HANDLER
    const getImageUrl = (imagePath) => {
        if (!imagePath) {
            return "https://via.placeholder.com/600x300";
        }

        // convert backslashes → forward slashes
        let cleanPath = imagePath.replace(/\\/g, "/");

        // remove starting slash if exists
        cleanPath = cleanPath.replace(/^\/+/, "");

        // if only filename → add uploads/news
        if (!cleanPath.startsWith("uploads")) {
            cleanPath = `uploads/news/${cleanPath}`;
        }

        return `https://news-backend-17sl.onrender.com/${cleanPath}`;
    };

    if (!news) return <p className="text-center mt-10">Loading...</p>;

    return (
        <div className="min-h-screen bg-gray-100">
            <Navbar />

            <div className="max-w-3xl mx-auto bg-white p-6 mt-6 rounded shadow">

                <h1 className="text-2xl font-bold mb-4">
                    {news.title}
                </h1>

                {/* ✅ IMAGE FIXED */}
                <img
                    src={getImageUrl(news.image)}
                    alt={news.title}
                    className="w-full h-64 object-cover rounded mb-4"
                />

                <p className="text-gray-700 mb-4">
                    {news.description}
                </p>

                <div className="text-sm text-gray-500 space-y-1">
                    <p>📺 Channel: {news.channel?.name}</p>
                    <p>📂 Category: {news.newsCategory}</p>
                    <p>🌍 Type: {news.newsType}</p>
                    <p>👤 Posted By: {news.postedBy?.name}</p>
                    <p>📅 {new Date(news.createdAt).toLocaleDateString('en-GB')}</p>
                </div>

            </div>

            <div className="mt-6 text-center">
                <Link
                    to={user?.role === "journalist" ? "/journalist/dashboard" : "/dashboard"}
                    className="text-sm italic font-bold text-green-700 underline"
                >
                    Back to Dashboard
                </Link>
            </div>

            <Footer />
        </div>
    );
};

export default NewsDetails;