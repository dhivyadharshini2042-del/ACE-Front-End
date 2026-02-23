/**
 * Reset Password Page Route
 * Enables dynamic rendering and renders the ResetPasswordClient component.
 */
export const dynamic = "force-dynamic";

import ResetPasswordClient from "./ResetPasswordClient";

export default function Page() {
  return <ResetPasswordClient />;
}
