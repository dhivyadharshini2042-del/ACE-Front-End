/**
 * Signup Account Page
 * -------------------
 * Server component that wraps the account signup client flow
 * within a React Suspense boundary.
 *
 * All form handling, validation, and API interactions
 * are implemented inside `SignupAccountClient`.
 */

import { Suspense } from "react";
import SignupAccountClient from "./SignupAccountClient";

/**
 * App Router page component.
 */
export default function Page() {
  return (
    <Suspense fallback={null}>
      <SignupAccountClient />
    </Suspense>
  );
}
