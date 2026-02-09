import { onMessage } from "firebase/messaging";
import { messaging } from "./firebase";

export const listenForegroundMessage = () => {
  if (!messaging) return;

  onMessage(messaging, (payload) => {
    console.log("Foreground message:", payload);

    // 🔔 Custom event dispatch pannrom
    window.dispatchEvent(
      new CustomEvent("ace-notification", {
        detail: payload,
      })
    );
  });
};
