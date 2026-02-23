import { onMessage } from "firebase/messaging";
import { messaging } from "./firebase";

export const listenForegroundMessage = (callback) => {
  if (!messaging) return;

  onMessage(messaging, (payload) => {
    console.log("Foreground message:", payload);

    // 🔥 Custom event for Navbar
    window.dispatchEvent(
      new CustomEvent("ace-notification", {
        detail: payload,
      })
    );

    // 🔥 Optional direct callback
    if (callback) {
      callback(payload);
    }
  });
};