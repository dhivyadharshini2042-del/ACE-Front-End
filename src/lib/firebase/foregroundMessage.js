import { onMessage } from "firebase/messaging";
import { messaging } from "./firebase";

export const listenForegroundMessage = () => {
  if (!messaging) return;

  onMessage(messaging, (payload) => {

    window.dispatchEvent(
      new CustomEvent("ace-notification", {
        detail: payload,
      })
    );
  });
};
