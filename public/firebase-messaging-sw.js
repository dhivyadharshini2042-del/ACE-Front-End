// load firebase app compatibility library for service worker
importScripts(
  "https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js"
);
// load firebase messaging compatibility library
importScripts(
  "https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js"
);

// initialize firebase app with project-specific configuration
firebase.initializeApp({
  apiKey: "AIzaSyBOkriwWZ1GU7voNxgecbD23lbT60pSOU4",
  authDomain: "ace---2026.firebaseapp.com",
  projectId: "ace---2026",
  storageBucket: "ace---2026.firebasestorage.app",
  messagingSenderId: "1019706788748",
  appId: "1:1019706788748:web:dcf1d4d2c3f976d4c724a9",
});

// obtain messaging instance for handling push notifications
const messaging = firebase.messaging();

// handle incoming messages while app is in background
messaging.onBackgroundMessage((payload) => {
  self.registration.showNotification(payload.notification.title, {
    body: payload.notification.body,
    icon: "/icon.png",
  });
});
