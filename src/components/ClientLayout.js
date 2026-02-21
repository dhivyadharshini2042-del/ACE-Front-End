"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import Navbar from "./global/Navbar/Navbar";
import { listenForegroundMessage } from "../lib/firebase/foregroundMessage";
import { requestPermission } from "../lib/firebase/requestPermission";

export default function ClientLayout({ children }) {
  const pathname = usePathname();

  const hideNavbar =
    pathname.startsWith("/auth") ||
    pathname.startsWith("/login") ||
    pathname.startsWith("/signup");

  useEffect(() => {
    // Permission + token
    requestPermission();
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
