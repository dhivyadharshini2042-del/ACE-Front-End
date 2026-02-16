export const dynamic = "force-dynamic";

import { Suspense } from "react";
import EmailSettingsClient from "./EmailSettingsClient";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <EmailSettingsClient />
    </Suspense>
  );
}
