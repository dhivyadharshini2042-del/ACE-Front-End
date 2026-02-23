import { getToken } from "firebase/messaging";
import { messaging } from "./firebase";
import { registerFcmTokenApi } from "../api";
import { isUserLoggedIn, getAuthToken } from "../auth";

export const requestPermission = async () => {
  try {
    if (typeof window === "undefined") return;
    if (!messaging) return;

    // 🔥 wait small delay to ensure cookie synced
    await new Promise((resolve) => setTimeout(resolve, 300));

    const authToken = getAuthToken();
    if (!authToken || !isUserLoggedIn()) {
      return;
    }

    const permission = await Notification.requestPermission();
    if (permission !== "granted") return;

    const token = await getToken(messaging, {
      vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
    });

    if (!token) return;

    await registerFcmTokenApi({
      token,
      deviceInfo: navigator.userAgent,
    });


  } catch (error) {
    console.error("FCM Error:", error);
  }
};