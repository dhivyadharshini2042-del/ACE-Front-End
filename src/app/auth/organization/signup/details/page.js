/**
 * Enables dynamic rendering for this route.
 * Prevents static optimization and ensures request-time rendering.
 */
export const dynamic = "force-dynamic";

import SignupDetailsClient from "./SignupDetailsClient";

/**
 * Page Component
 * Renders the client-side SignupDetailsClient component.
 */
export default function Page() {
  return <SignupDetailsClient />;
}
