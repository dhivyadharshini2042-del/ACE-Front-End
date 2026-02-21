"use client";

import { useSearchParams } from "next/navigation";
import ProfileClient from "./ProfileClient";
import FollowersList from "./FollowersList";
import FollowingList from "./FollowingList";

/**
 * ProfilePageClient
 * -----------------
 * Controls tab-based rendering for the profile section.
 * The active tab is determined via the `tab` query parameter.
 *
 * Supported tabs:
 * - profile
 * - followers
 * - following
 */
export default function ProfilePageClient() {
  const searchParams = useSearchParams();

  // Default to "profile" tab if query param is not provided
  const activeTab = searchParams.get("tab") || "profile";

  return (
    <>
      {activeTab === "profile" && <ProfileClient />}
      {activeTab === "followers" && <FollowersList />}
      {activeTab === "following" && <FollowingList />}
    </>
  );
}
