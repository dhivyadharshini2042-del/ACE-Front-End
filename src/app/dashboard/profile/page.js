import { Suspense } from "react";
import ProfilePageClient from "./ProfilePageClient";

export const dynamic = "force-dynamic";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ProfilePageClient />
    </Suspense>
  );
}
