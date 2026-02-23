/**
 * Profile Page (Server Component)
 * --------------------------------
 * Forces dynamic rendering and wraps the client-side
 * profile implementation within a Suspense boundary.
 */

import { Suspense } from "react";
import ProfilePageClient from "./ProfilePageClient";

// Ensures the page is rendered dynamically on each request
export const dynamic = "force-dynamic";

/**
 * App Router page entry.
 * Suspense enables graceful loading while the client
 * component initializes.
 */
export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ProfilePageClient />
    </Suspense>
  );
}
