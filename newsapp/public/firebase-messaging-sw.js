importScripts("https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyCxrNZQ4RlY-YS3n4LhA_eEtXDTpiW9cEY",
  authDomain: "newsapp-95f89.firebaseapp.com",
  projectId: "newsapp-95f89",
  messagingSenderId: "504002267463",
  appId: "1:504002267463:web:21e707f9f3554c3f1c6462",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log("Background message:", payload);

  const notification = payload.notification;

  self.registration.showNotification(notification.title, {
    body: notification.body,
    icon: "/logo192.png",
  });
});