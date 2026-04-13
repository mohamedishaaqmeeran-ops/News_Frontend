import { onMessage } from "firebase/messaging";

export const listenForMessages = (messaging) => {
  if (!messaging) {
    console.log("❌ Messaging instance is null");
    return;
  }

  console.log("🔥 Listener attached");

  onMessage(messaging, (payload) => {
    console.log("Foreground message:", payload);

    if (!payload.notification) {
      console.log("⚠️ No notification payload received");
      return;
    }

    const { title, body } = payload.notification;

    if (Notification.permission === "granted") {
      new Notification(title, {
        body: body || "",
      });
    }
  });
};