import { useEffect, useState } from "react";

const NotificationBell = () => {
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);

  const fetchNotifications = async () => {
    const res = await fetch("http://localhost:3001/api/v1/notifications", {
      credentials: "include",
    });

    const data = await res.json();
    setNotifications(Array.isArray(data) ? data : []);
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const markAsRead = async (id) => {
    await fetch(`http://localhost:3001/api/v1/notifications/${id}/read`, {
      method: "PUT",
      credentials: "include",
    });

    setNotifications(prev =>
      prev.map(n =>
        n._id === id ? { ...n, isRead: true } : n
      )
    );
  };

  return (
    <div className="relative">
      <button onClick={() => setOpen(!open)}>
        🔔 {unreadCount > 0 && <span className="text-white">{unreadCount}</span>}
      </button>

      {open && (
        <div className="absolute right-0 bg-white shadow w-80">
          {notifications.map(n => (
            <div key={n._id} onClick={() => markAsRead(n._id)}>
              <b>{n.title}</b>
              <p>{n.body}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NotificationBell;