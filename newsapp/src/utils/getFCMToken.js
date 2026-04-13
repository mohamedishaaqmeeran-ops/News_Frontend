
import { getToken } from "firebase/messaging";
import { getMessagingInstance } from "../firebase";

export const getFCMToken = async () => {
  const messaging = await getMessagingInstance();
  if (!messaging) return;

  const permission = await Notification.requestPermission();

  if (permission !== "granted") {
    console.log("Permission denied");
    return;
  }

  const token = await getToken(messaging, {
    vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY,
  });

  console.log("FCM Token:", token);

  await fetch("http://localhost:3001/api/v1/auth/save-token", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ token }),
  });
};