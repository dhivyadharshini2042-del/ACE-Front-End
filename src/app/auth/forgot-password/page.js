/**
 * Forgot Password Page
 * ---------------------
 * Server component that provides a Suspense boundary
 * for the forgot password client flow.
 *
 * All validation, API calls, and redirect logic
 * are implemented inside `ForgotPasswordClient`.
 */

import { Suspense } from "react";
import ForgotPasswordClient from "./ForgotPasswordClient";

/**
 * App Router page component.
 * Renders a loading fallback while the
 * client-side forgot password logic initializes.
 */
export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ForgotPasswordClient />
    </Suspense>
  );
}
