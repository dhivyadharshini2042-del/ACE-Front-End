"use client";

import { useEffect, useState } from "react";
import Footer from "../../components/global/Footer/Footer";
import LeaderboardHero from "../../components/global/Leaderboard/LeaderboardHero";
import OrganizerLeaderboardTable from "../../components/global/Leaderboard/OrganizerLeaderboardTable";
import TopThreeBoard from "../../components/global/Leaderboard/TopThreeBoard";
import { getAllOrganizationsApi } from "../../lib/api/organizer.api";
import toast from "react-hot-toast";
import { useLoading } from "../../context/LoadingContext";

export default function LeaderboardPage() {
  const [organizations, setOrganizations] = useState([]);
  const [search, setSearch] = useState("");
  const { setLoading } = useLoading();

    useEffect(() => {
    setLoading(false);
  }, []);

  /* ================= FETCH DATA ================= */
  useEffect(() => {
    const loadLeaderboard = async () => {
      try {
        const res = await getAllOrganizationsApi();

        if (res?.status) {
          setOrganizations(res.data || []);
        } else {
          toast.error("Failed to load leaderboard");
        }
      } catch {
        toast.error("Something went wrong");
      }
    };

    loadLeaderboard();
  }, []);

  /* ================= FILTER ================= */
  const filteredOrganizations = organizations.filter((org) =>
    org.organizationName
      ?.toLowerCase()
      .includes(search.toLowerCase())
  );

  /* ================= TOP 3 ================= */
  const topThree = [...organizations]
    .sort((a, b) => a.rank - b.rank)
    .slice(0, 3);

  return (
    <>
      <LeaderboardHero
        search={search}
        onSearchChange={setSearch}
      />

      <TopThreeBoard data={topThree} />

      <OrganizerLeaderboardTable data={filteredOrganizations} />

      <Footer />
    </>
  );
}
