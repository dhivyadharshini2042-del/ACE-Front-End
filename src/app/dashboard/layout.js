"use client";

import { usePathname } from "next/navigation";
import Sidebar from "./components/Sidebar/Sidebar";
import styles from "./Dashboard.module.css";
import ProfileHeader from "./components/ProfileHeader/ProfileHeader";

export default function DashboardLayout({ children }) {
  const pathname = usePathname();

  // Hide ProfileHeader on space/* and profile page
  const hideProfileHeader =
    pathname.startsWith("/dashboard/space") ||
    pathname.startsWith("/dashboard/profile");

  return (
    <div className={styles.container}>
      {/* SIDEBAR */}
      <Sidebar />

      {/* MAIN */}
      <div className={styles.main}>
        {!hideProfileHeader && <ProfileHeader />}

        <div className={styles.page}>{children}</div>
      </div>
    </div>
  );
}
