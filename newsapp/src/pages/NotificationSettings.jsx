import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";
import Footer from "./Footer";  
const ALL_CATEGORIES = [
  "sports",
  "business",
  "politics",
  "entertainment",
  "technology",
  "health",
  "education",
  "science",
  "world",
  "other"
];

const NotificationSettings = () => {
    const navigate = useNavigate();
  const [preferences, setPreferences] = useState({
    categories: [],
    frequency: "immediate",
    notificationsEnabled: true
  });

  const [loading, setLoading] = useState(false);

  
  useEffect(() => {
    const fetchPreferences = async () => {
      try {
        const res = await fetch(
          "http://localhost:3001/api/v1/notifications/preferences",
          {
            method: "GET",
            credentials: "include",
          }
        );

        const data = await res.json();

        if (!res.ok) throw new Error(data.message);

        setPreferences({
          categories: data.categories || [],
          frequency: data.frequency || "immediate",
          notificationsEnabled:
            data.notificationsEnabled !== undefined
              ? data.notificationsEnabled
              : true
        });

      } catch (error) {
        console.error(error);
        toast.error("Failed to load preferences");
      }
    };

    fetchPreferences();
  }, []);

 
  const handleCategoryChange = (category) => {
    setPreferences((prev) => {
      const exists = prev.categories.includes(category);

      return {
        ...prev,
        categories: exists
          ? prev.categories.filter((c) => c !== category)
          : [...prev.categories, category]
      };
    });
  };

 
  const handleSave = async () => {
    try {
      setLoading(true);

      const res = await fetch(
        "http://localhost:3001/api/v1/notifications/preferences",
        {
          method: "PUT",
          credentials: "include",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            ...preferences,
            categories: preferences.categories.map((c) => c.toLowerCase())
          })
        }
      );

      const data = await res.json();

      if (!res.ok) throw new Error(data.message);

      toast.success("Preferences saved successfully ✅");
navigate("/dashboard");

    } catch (error) {
      console.error(error);
      toast.error("Failed to save preferences ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-purple-950 via-black to-purple-900 min-h-screen text-white">
      <Navbar />

      <div className="max-w-3xl mx-auto px-4 py-10">

        <h2 className="text-2xl font-bold text-yellow-500 mb-6">
          Notification Settings
        </h2>

        <div className="mb-6">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={preferences.notificationsEnabled}
              onChange={(e) =>
                setPreferences((prev) => ({
                  ...prev,
                  notificationsEnabled: e.target.checked
                }))
              }
            />
            Enable Notifications
          </label>
        </div>

       
        <div className="mb-6">
          <h3 className="font-semibold text-yellow-500 mb-2">
            Categories
          </h3>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {ALL_CATEGORIES.map((cat) => (
              <label key={cat} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={preferences.categories.includes(cat)}
                  onChange={() => handleCategoryChange(cat)}
                />
                <span className="capitalize">{cat}</span>
              </label>
            ))}
          </div>
        </div>

       
        <div className="mb-6">
          <h3 className="font-semibold text-yellow-500 mb-2">
            Frequency
          </h3>

          <select
            value={preferences.frequency}
            onChange={(e) =>
              setPreferences((prev) => ({
                ...prev,
                frequency: e.target.value
              }))
            }
            className="text-black  py-2 text-white rounded"
          >
            <option value="immediate">Immediate</option>
            <option value="hourly">Hourly</option>
            <option value="daily">Daily</option>
          </select>
        </div>

        
        <button
          onClick={handleSave}
          disabled={loading}
          className="bg-green-500 px-6 py-2 rounded hover:bg-green-600 disabled:opacity-50"
        >
          {loading ? "Saving..." : "Save Preferences"}
        </button>

      </div>
      <Footer/>
    </div>
  );
};

export default NotificationSettings;