importScripts(
  "https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js"
);

firebase.initializeApp({
  apiKey: "AIzaSyBOkriwWZ1GU7voNxgecbD23lbT60pSOU4",
  authDomain: "ace---2026.firebaseapp.com",
  projectId: "ace---2026",
  storageBucket: "ace---2026.firebasestorage.app",
  messagingSenderId: "1019706788748",
  appId: "1:1019706788748:web:dcf1d4d2c3f976d4c724a9",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log("Background message:", payload);

  self.registration.showNotification(payload.notification.title, {
    body: payload.notification.body,
    icon: "/icon.png",
  });
});
