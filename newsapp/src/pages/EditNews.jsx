import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { toast } from "react-toastify";

import { getNewsById, updateNews } from "../services/newServices";

const EditNews = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [form, setForm] = useState({
        title: "",
        description: "",
        newsCategory: "",
        newsType: ""
    });

    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(null);

   
    const categories = ["Politics", "Sports", "Technology", "Entertainment", "Business","World","Health","Education","Science","Other"];
    const types = ["National", "International"];

    useEffect(() => {
        fetchNews();
    }, []);

    const fetchNews = async () => {
        try {
            const res = await getNewsById(id);
            const data = res.news;

            setForm({
                title: data.title,
                description: data.description,
                newsCategory: data.newsCategory,
                newsType: data.newsType
            });

            setPreview(data.image); 
        } catch (err) {
            toast.error("Failed to load news");
        }
    };

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };



    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const formData = new FormData();

            formData.append("title", form.title);
            formData.append("description", form.description);
            formData.append("newsCategory", form.newsCategory);
            formData.append("newsType", form.newsType);

            if (image) {
                formData.append("newsImage", image);
            }

            await updateNews(id, formData);

            toast.success("News updated successfully");
            navigate("/journalist/dashboard");
        } catch (err) {
            toast.error("Update failed");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-950 via-black to-purple-900">
            <form
                onSubmit={handleSubmit}
                className="bg-white p-6 rounded shadow w-full max-w-lg"
            >
                <h2 className="text-xl font-bold mb-4">Edit News</h2>

               
                <input
                    type="text"
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    placeholder="Title"
                    className="w-full border p-2 mb-3 rounded"
                />

               
                <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    placeholder="Description"
                    className="w-full border p-2 mb-3 rounded"
                />

                
                <select
                    name="newsCategory"
                    value={form.newsCategory}
                    onChange={handleChange}
                    className="w-full border p-2 mb-3 rounded"
                >
                    <option value="">Select Category</option>
                    {categories.map((c, i) => (
                        <option key={i} value={c}>{c}</option>
                    ))}
                </select>

                <select
                    name="newsType"
                    value={form.newsType}
                    onChange={handleChange}
                    className="w-full border p-2 mb-3 rounded"
                >
                    <option value="">Select Type</option>
                    {types.map((t, i) => (
                        <option key={i} value={t}>{t}</option>
                    ))}
                </select>

            

              
                <button
                    type="submit"
                    className="bg-yellow-500 text-white px-4 py-2 rounded w-full cursor-pointer"
                >
                    Update News
                </button>
            </form>
        </div>
    );
};

export default EditNews;