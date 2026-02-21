"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import Navbar from "./global/Navbar/Navbar";
import { requestNotificationPermission } from "../lib/firebase/requestPermission";
import { listenForegroundMessage } from "../lib/firebase/foregroundMessage";

export default function ClientLayout({ children }) {
  const pathname = usePathname();

  const hideNavbar =
    pathname.startsWith("/auth") ||
    pathname.startsWith("/login") ||
    pathname.startsWith("/signup");

  useEffect(() => {
    // Permission + token
    requestNotificationPermission();
    listenForegroundMessage(); 

    // FOREGROUND notification (APP OPEN)
    listenForegroundMessage((payload) => {
      // SIMPLE TEST (later UI improve pannalaam)
      alert(
        `${payload.notification?.title}\n${payload.notification?.body}`
      );
    });
  }, []);

  return (
    <>
      {!hideNavbar && <Navbar />}
      {children}
    </>
  );
}
