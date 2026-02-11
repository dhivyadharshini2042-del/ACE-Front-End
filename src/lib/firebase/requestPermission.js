import { getToken } from "firebase/messaging";
import { messaging } from "./firebase";

export const requestNotificationPermission = async () => {
  console.log("requestNotificationPermission called");
  console.log("messaging value:", messaging);

  const permission = await Notification.requestPermission();
  console.log("Notification permission:", permission);

  if (permission === "granted") {
    const token = await getToken(messaging, {
      vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
    });

    console.log("FCM TOKEN INSIDE FUNCTION:", token);
    return token;
  } else {
    console.log("Permission not granted");
  }
};
