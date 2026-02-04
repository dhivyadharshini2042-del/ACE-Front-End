"use client";

import { useEffect, useMemo, useState } from "react";
import Footer from "../../components/global/Footer/Footer";
import LeaderboardHero from "../../components/global/Leaderboard/LeaderboardHero";
import OrganizerLeaderboardTable from "../../components/global/Leaderboard/OrganizerLeaderboardTable";
import PaginationBar from "../events/components/PaginationBar";
import { getAllOrganizationsApi } from "../../lib/api/organizer.api";
import toast from "react-hot-toast";
import { useLoading } from "../../context/LoadingContext";
import TopThreeBoard from "../../components/global/Leaderboard/TopThreeBoard";

const PAGE_SIZE = 10;

export default function LeaderboardPage() {
  const [organizations, setOrganizations] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [rankingType, setRankingType] = useState("monthly");
  const { setLoading } = useLoading();

  useEffect(() => {
    setLoading(false);
  }, []);

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

  const filtered = useMemo(() => {
    return organizations.filter((org) =>
      org.organizationName?.toLowerCase().includes(search.toLowerCase()),
    );
  }, [organizations, search]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);

  const paginatedData = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [filtered, page]);

  return (
    <>
      <LeaderboardHero
        search={search}
        onSearchChange={setSearch}
        rankingType={rankingType}
        onRankingChange={setRankingType}
      />
      <OrganizerLeaderboardTable data={paginatedData} />
      <TopThreeBoard />

      <PaginationBar page={page} total={totalPages} onChange={setPage} />

      <Footer />
    </>
  );
}
