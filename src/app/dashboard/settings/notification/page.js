/**
 * Notification Page (Server Component)
 * -------------------------------------
 * Enables dynamic rendering and wraps the
 * client-side notification component inside Suspense.
 */

import { Suspense } from "react";
import NotificationPageClient from "./NotificationPageClient";

export const dynamic = "force-dynamic";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <NotificationPageClient />
    </Suspense>
  );
}
