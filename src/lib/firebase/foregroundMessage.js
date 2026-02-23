import { onMessage } from "firebase/messaging";
import { messaging } from "./firebase";

export const listenForegroundMessage = (callback) => {
  if (!messaging) {
    return;
  }

  return onMessage(messaging, (payload) => {
    if (callback) callback(payload);
  });
};