"use client";

import Sidebar from "./components/Sidebar/Sidebar";
import ProfileHeader from "./components/ProfileHeader/ProfileHeader";
import styles from "./Dashboard.module.css";
import { usePathname, useSearchParams } from "next/navigation";

export default function DashboardLayoutClient({ children }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const hideProfileHeader =
    pathname.startsWith("/dashboard/space/create");

  const activeTab = searchParams.get("tab") || "profile";

  return (
    <div className={styles.container}>
      <Sidebar />

      <div className={styles.main}>
        {!hideProfileHeader && (
          <ProfileHeader activeTab={activeTab} />
        )}
        <div className={styles.page}>{children}</div>
      </div>
    </div>
  );
}
