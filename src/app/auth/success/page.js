/**
 * Success Page Route
 * Enables dynamic rendering and delegates UI handling
 * to the SuccessClient component.
 */
export const dynamic = "force-dynamic";

import SuccessClient from "./SuccessClient";

/**
 * Page wrapper component
 * Renders the SuccessClient.
 */
export default function Page() {
  return <SuccessClient />;
}
