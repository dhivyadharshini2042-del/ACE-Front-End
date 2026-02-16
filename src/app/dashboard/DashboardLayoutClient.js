"use client";

import Sidebar from "./components/Sidebar/Sidebar";
import ProfileHeader from "./components/ProfileHeader/ProfileHeader";
import styles from "./Dashboard.module.css";
import { usePathname } from "next/navigation";

export default function DashboardLayoutClient({ children }) {
  const pathname = usePathname();

  const hideProfileHeader =
    pathname.startsWith("/dashboard/space/create");

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
