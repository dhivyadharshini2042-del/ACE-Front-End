import { Suspense } from "react";
import EmailVerifyClient from "./EmailVerifyClient";

// Client component responsible for handling email verification logic.
// and is wrapped in Suspense to display a loading state while verification resolves.

export default function Page() {
  return (
    <Suspense fallback={<div>Verifying...</div>}>
      <EmailVerifyClient />
    </Suspense>
  );
}
