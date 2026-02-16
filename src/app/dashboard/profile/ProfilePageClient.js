"use client";

import { useSearchParams } from "next/navigation";
import ProfileClient from "./ProfileClient";
import FollowersList from "./FollowersList";
import FollowingList from "./FollowingList";
import ProfileHeader from "../components/ProfileHeader/ProfileHeader";

export default function ProfilePageClient() {
  const searchParams = useSearchParams();
  const activeTab = searchParams.get("tab") || "profile";

  return (
    <>

      {activeTab === "profile" && <ProfileClient />}
      {activeTab === "followers" && <FollowersList />}
      {activeTab === "following" && <FollowingList />}
    </>
  );
}
