/**
 * Email Settings Page (Server Component)
 * --------------------------------------
 * Forces dynamic rendering and wraps the client-side
 * email settings component within a Suspense boundary.
 */

export const dynamic = "force-dynamic";

import { Suspense } from "react";
import EmailSettingsClient from "./EmailSettingsClient";

/**
 * App Router page entry.
 * Suspense provides a fallback UI while the
 * client component initializes.
 */
export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <EmailSettingsClient />
    </Suspense>
  );
}
