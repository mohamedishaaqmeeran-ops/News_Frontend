import { useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";
import { createNews } from "../services/newServices";

const CreateNews = () => {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        title: "",
        description: "",
        newsCategory: "",
        newsType: "",
        isBreaking: false,
        breakingPriority: "",
        breakingExpiresAt: ""
    });

    const [image, setImage] = useState(null);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        setForm(prev => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const formData = new FormData();

            formData.append("title", form.title);
            formData.append("description", form.description);
            formData.append("newsCategory", form.newsCategory);
            formData.append("newsType", form.newsType);
            formData.append("isBreaking", form.isBreaking);

            
            if (form.isBreaking) {
                if (form.breakingPriority) {
                    formData.append("breakingPriority", form.breakingPriority);
                }

                if (form.breakingExpiresAt) {
                    formData.append(
                        "breakingExpiresAt",
                        new Date(form.breakingExpiresAt).toISOString()
                    );
                }
            }

            
            if (image) {
                formData.append("newsImage", image);
            }

            await createNews(formData);

            toast.success("News created successfully");
            navigate("/journalist/dashboard");

        } catch (err) {
            console.error(err);
            toast.error(err.response?.data?.message || "Error creating news");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-950 via-black to-purple-900">
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow w-full max-w-xl">

                <h2 className="text-2xl text-yellow-500 font-bold mb-4">Create News</h2>

                <input
                    type="text"
                    name="title"
                    placeholder="Title"
                    value={form.title}
                    onChange={handleChange}
                    className="w-full mb-3 p-2 border rounded"
                    required
                />

                <textarea
                    name="description"
                    placeholder="Description"
                    value={form.description}
                    onChange={handleChange}
                    className="w-full mb-3 p-2 border rounded"
                    required
                />

                
                <select
                    name="newsCategory"
                    value={form.newsCategory}
                    onChange={handleChange}
                    className="w-full mb-3 p-2 border rounded"
                    required
                >
                    <option value="">Select Category</option>
                    <option>Sports</option>
                    <option>Business</option>
                    <option>Politics</option>
                    <option>Entertainment</option>
                    <option>Technology</option>
                    <option>Health</option>
                    <option>Education</option>
                    <option>Science</option>
                    <option>World</option>
                    <option>Other</option>
                </select>

                
                <select
                    name="newsType"
                    value={form.newsType}
                    onChange={handleChange}
                    className="w-full mb-3 p-2 border rounded"
                    required
                >
                    <option value="">Select Type</option>
                    <option value="National">National</option>
                    <option value="International">International</option>
                </select>

                
                <label className="flex gap-2 mb-3">
                    <input
                        type="checkbox"
                        name="isBreaking"
                        checked={form.isBreaking}
                        onChange={handleChange}
                    />
                    Breaking News
                </label>

                {form.isBreaking && (
                    <>
                        <input
                            type="number"
                            name="breakingPriority"
                            placeholder="Priority"
                            value={form.breakingPriority}
                            onChange={handleChange}
                            className="w-full mb-3 p-2 border rounded"
                        />

                        <input
                            type="datetime-local"
                            name="breakingExpiresAt"
                            value={form.breakingExpiresAt}
                            onChange={handleChange}
                            className="w-full mb-3 p-2 border rounded"
                        />
                    </>
                )}

                <input
                    type="file"
                    onChange={(e) => setImage(e.target.files[0])}
                    className="mb-4"
                />

                <button className="w-full bg-green-600 text-white py-2 rounded cursor-pointer">
                    Create News
                </button>
            </form>
        </div>
    );
};

export default CreateNews;