export const dynamic = "force-dynamic";

import DashboardLayoutClient from "./DashboardLayoutClient";

export default function DashboardLayout({ children }) {
  return <DashboardLayoutClient>{children}</DashboardLayoutClient>;
}
