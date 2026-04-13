import { Navigate, useLoaderData } from "react-router";
import Navbar from "../components/Navbar";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
    createChannel,
    deleteChannel,
    getAllChannel,
    updateChannel,
    createJournalists,
    getAllJournalists,
    deleteJournalist,
    updateJournalist
} from "../services/adminServices";

const AdminDashboard = () => {
    const userData = useLoaderData();
    const [user] = useState(userData.user);

    const [channels, setChannels] = useState([]);
    const [journalists, setJournalists] = useState([]);

    const [activeTab, setActiveTab] = useState('channels');
    const [loading, setLoading] = useState(false);

    const [viewChannel, setViewChannel] = useState(null);

   
    const [showChannelForm, setShowChannelForm] = useState(false);
    const [editingChannel, setEditingChannel] = useState(null);

    const [channelData, setChannelData] = useState({
        name: '',
        description: '',
        website: '',
        logo: null
    });

  
    const [showJournalistForm, setShowJournalistForm] = useState(false);
    const [editingJournalist, setEditingJournalist] = useState(null);
    const [showEditJournalistForm, setShowEditJournalistForm] = useState(false);

    const [journalistData, setJournalistData] = useState({
        name: '',
        email: '',
        password: '',
        channelId: ''
    });
    if (user.role !== 'admin') {
        toast.error('Unauthorized access.');
        if (user.role === 'journalist') {
            return <Navigate to="/journalist-dashboard" replace />;
        }
        return <Navigate to="/login" replace />;
    }

    
    const fetchData = async () => {
        try {
            setLoading(true);
            const [channelsRes, journalistsRes] = await Promise.all([
                getAllChannel(),
                getAllJournalists()
            ]);
            setChannels(channelsRes.channels || []);
            setJournalists(journalistsRes.journalists || []);
        } catch {
            toast.error("Failed to fetch data");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    
    const handleChannelSubmit = async (e) => {
        e.preventDefault();

        try {
            const formData = new FormData();
            formData.append("name", channelData.name);
            formData.append("description", channelData.description);
            formData.append("website", channelData.website);

            if (channelData.logo) {
                formData.append("channelLogo", channelData.logo);
            }

            if (editingChannel) {
                await updateChannel(editingChannel._id, formData);
                toast.success("Channel updated");
            } else {
                await createChannel(formData);
                toast.success("Channel created");
            }

            setShowChannelForm(false);
            setEditingChannel(null);
            setChannelData({ name: '', description: '', website: '', logo: null });
            fetchData();

        } catch (error) {
            toast.error(error.response?.data?.message || "Error");
        }
    };

    const handleDeleteChannel = async (id) => {
        if (window.confirm("Delete this channel?")) {
            await deleteChannel(id);
            toast.success("Deleted");
            fetchData();
        }
    };

    const handleCreateJournalist = async (e) => {
        e.preventDefault();
        try {
            await createJournalists(journalistData);
            toast.success("Journalist created");
            setShowJournalistForm(false);
            setJournalistData({ name: '', email: '', password: '', channelId: '' });
            fetchData();
        } catch (error) {
            toast.error(error.response?.data?.message || "Error");
        }
    };

    const handleDeleteJournalist = async (id) => {
        if (window.confirm("Delete this journalist?")) {
            await deleteJournalist(id);
            toast.success("Deleted");
            fetchData();
        }
    };

    const handleUpdateJournalist = async (e) => {
        e.preventDefault();

        try {
            const updateData = {
                name: journalistData.name,
                email: journalistData.email,
                channelId: journalistData.channelId
            };

            if (journalistData.password?.trim()) {
                updateData.password = journalistData.password;
            }

            await updateJournalist(editingJournalist._id, updateData);

            toast.success("Updated");
            setShowEditJournalistForm(false);
            setEditingJournalist(null);
            setJournalistData({ name: '', email: '', password: '', channelId: '' });

            fetchData();
        } catch (error) {
            toast.error(error.response?.data?.message || "Error updating");
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-950 via-black to-purple-900">
            <Navbar />

            <div className="container mx-auto px-4 py-8">
                <h1 className="text-2xl text-white font-bold mb-4"> Happy to see you, <span className='text-yellow-500'>{user.name}</span><br /> <p className='italic text-sm text-green-500'> ! Here you can create channels and assign journalists to them: </p> </h1>

                
                <div className="flex space-x-6 mb-6 border-b border-gray-700">
                    <button
                        onClick={() => setActiveTab('channels')}
                        className={`pb-2 px-2 text-white ${
                            activeTab === 'channels'
                                ? 'border-b-2 border-yellow-500 text-yellow-400'
                                : ''
                        }`}
                    >
                        Channels
                    </button>

                    <button
                        onClick={() => setActiveTab('journalists')}
                        className={`pb-2 px-2 text-white ${
                            activeTab === 'journalists'
                                ? 'border-b-2 border-yellow-500 text-yellow-400'
                                : ''
                        }`}
                    >
                        Journalists
                    </button>
                </div>

                
                {activeTab === 'channels' && (
                    <div>
                        <button
                            onClick={() => setShowChannelForm(!showChannelForm)}
                            className="mb-4 bg-yellow-500 px-4 py-2 text-white rounded"
                        >
                            {showChannelForm ? "Cancel" : "Add Channel"}
                        </button>

                        {showChannelForm && (
                            <form onSubmit={handleChannelSubmit} className="bg-white p-4 rounded mb-4 space-y-3">
                                <input placeholder="Name" value={channelData.name}
                                    onChange={e => setChannelData({ ...channelData, name: e.target.value })}
                                    className="border p-2 w-full" />

                                <textarea placeholder="Description" value={channelData.description}
                                    onChange={e => setChannelData({ ...channelData, description: e.target.value })}
                                    className="border p-2 w-full" />

                                <input type="url" placeholder="Website" value={channelData.website}
                                    onChange={e => setChannelData({ ...channelData, website: e.target.value })}
                                    className="border p-2 w-full" />

                                <input type="file"
                                    onChange={e => setChannelData({ ...channelData, logo: e.target.files[0] })}
                                />

                                <button className="bg-green-600 px-4 py-2 text-white rounded">
                                    {editingChannel ? "Update" : "Create"}
                                </button>
                            </form>
                        )}

                        {channels.map(ch => (
                            <div key={ch._id} className="bg-white p-4 mb-3 rounded shadow">
                                <h3 className="font-bold">{ch.name}</h3>

                                <div className="flex gap-2 mt-2">
                                    <button onClick={() => setViewChannel(ch)}
                                        className="bg-blue-500 px-3 py-1 text-white rounded">View</button>

                                    <button onClick={() => {
                                        setEditingChannel(ch);
                                        setChannelData({
                                            name: ch.name,
                                            description: ch.description,
                                            website: ch.website,
                                            logo: null
                                        });
                                        setShowChannelForm(true);
                                    }}
                                        className="bg-yellow-500 px-3 py-1 text-white rounded">Edit</button>

                                    <button onClick={() => handleDeleteChannel(ch._id)}
                                        className="bg-red-500 px-3 py-1 text-white rounded">Delete</button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                
                {activeTab === 'journalists' && (
                    <div>
                        <button onClick={() => setShowJournalistForm(!showJournalistForm)}
                            className="mb-4 bg-yellow-500 px-4 py-2 text-white rounded">
                            {showJournalistForm ? "Cancel" : "Add Journalist"}
                        </button>

                        {showJournalistForm && (
                            <form onSubmit={handleCreateJournalist} className="bg-white p-4 rounded mb-4 space-y-3">
                                <input placeholder="Name" value={journalistData.name}
                                    onChange={e => setJournalistData({ ...journalistData, name: e.target.value })}
                                    className="border p-2 w-full" />

                                <input placeholder="Email" value={journalistData.email}
                                    onChange={e => setJournalistData({ ...journalistData, email: e.target.value })}
                                    className="border p-2 w-full" />

                                <input type="password" placeholder="Password"
                                    value={journalistData.password}
                                    onChange={e => setJournalistData({ ...journalistData, password: e.target.value })}
                                    className="border p-2 w-full" />

                                <select value={journalistData.channelId}
                                    onChange={e => setJournalistData({ ...journalistData, channelId: e.target.value })}
                                    className="border p-2 w-full">
                                    <option value="">Select Channel</option>
                                    {channels.map(ch => (
                                        <option key={ch._id} value={ch._id}>{ch.name}</option>
                                    ))}
                                </select>

                                <button className="bg-green-600 px-4 py-2 text-white rounded">
                                    Create
                                </button>
                            </form>
                        )}

        <div className="bg-white rounded shadow overflow-x-auto">
    <table className="min-w-full text-sm md:text-base">
        
        <thead className="bg-gray-100">
            <tr>
                <th className="px-2 py-2 md:px-6 md:py-3 text-left font-semibold text-gray-700">
                    Name
                </th>
                <th className="px-2 py-2 md:px-6 md:py-3 text-left font-semibold text-gray-700">
                    Email
                </th>
                <th className="px-2 py-2 md:px-6 md:py-3 text-left font-semibold text-gray-700">
                    Channel
                </th>
                <th className="px-2 py-2 md:px-6 md:py-3 text-center font-semibold text-gray-700">
                    Actions
                </th>
            </tr>
        </thead>

        <tbody className="divide-y divide-gray-200">
            {journalists.map(j => (
                <tr key={j._id} className="hover:bg-gray-50 transition">

                    <td className="px-2 py-2 md:px-6 md:py-4 text-gray-800 truncate max-w-[120px]">
                        {j.name}
                    </td>

                    <td className="px-2 py-2 md:px-6 md:py-4 text-gray-600 truncate max-w-[150px]">
                        {j.email}
                    </td>

                    <td className="px-2 py-2 md:px-6 md:py-4 text-gray-600 truncate max-w-[120px]">
                        {j.assignedChannel?.name || "No Channel"}
                    </td>

                    <td className="px-2 py-2 md:px-6 md:py-4">
                        <div className="flex justify-center gap-1 md:gap-2 flex-wrap">

                            <button
                                onClick={() => {
                                    setEditingJournalist(j);
                                    setJournalistData({
                                        name: j.name,
                                        email: j.email,
                                        password: '',
                                        channelId: j.assignedChannel?._id || ''
                                    });
                                    setShowEditJournalistForm(true);
                                }}
                                className="bg-yellow-500 px-2 py-1 text-xs md:text-sm text-white rounded"
                            >
                                Edit
                            </button>

                            <button
                                onClick={() => handleDeleteJournalist(j._id)}
                                className="bg-red-500 px-2 py-1 text-xs md:text-sm text-white rounded"
                            >
                                Delete
                            </button>

                        </div>
                    </td>

                </tr>
            ))}
        </tbody>
    </table>
</div>
                    </div>
                )}

                
                {viewChannel && (
                    <div className="fixed inset-0 bg-purple-950 flex justify-center items-center">
                        <div className="bg-white p-6 rounded w-[400px]">
                            <h2 className="font-bold text-lg mb-2">Channel Details</h2>
                            <p><b>Name:</b> {viewChannel.name}</p>
                            <p><b>Description:</b> {viewChannel.description}</p>
                            <p><b>Website:</b> {viewChannel.website}</p>

                            {viewChannel.logo && (
                                <img
                                    src={`http://localhost:3001/${viewChannel.logo}`}
                                    className="w-20 h-20 mt-2"
                                />
                            )}

                            <button
                                onClick={() => setViewChannel(null)}
                                className="mt-4 bg-red-500 text-white px-4 py-2 rounded w-full"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;