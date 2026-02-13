"use client";

import Sidebar from "./components/Sidebar/Sidebar";
import styles from "./Dashboard.module.css";
import ProfileHeader from "./components/ProfileHeader/ProfileHeader";
import { usePathname } from "next/navigation";

export default function DashboardLayout({ children }) {
  const pathname = usePathname();

  // Hide ProfileHeader on space/* and profile page
  const hideProfileHeader =
    pathname.startsWith("/dashboard/space/create") 
  return (
    <div className={styles.container}>
      <Sidebar />

      <div className={styles.main}>
        {!hideProfileHeader && <ProfileHeader />}

        <div className={styles.page}>{children}</div>
      </div>
    </div>
  );
}
