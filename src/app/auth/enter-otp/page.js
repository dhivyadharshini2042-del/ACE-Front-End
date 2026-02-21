/**
 * OTP Page
 * --------
 * Server component that wraps the OTP client component
 * with a Suspense boundary.
 *
 * All verification logic and API interactions
 * are handled inside `EnterOtpClient`.
 */

import { Suspense } from "react";
import EnterOtpClient from "./EnterOtpClient";

/**
 * App Router page component.
 * Provides a loading fallback while the
 * client-side OTP logic initializes.
 */
export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <EnterOtpClient />
    </Suspense>
  );
}
