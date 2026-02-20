"use client";

import { useEffect, useMemo, useState } from "react";
import Footer from "../../components/global/Footer/Footer";
import LeaderboardHero from "../../components/global/Leaderboard/LeaderboardHero";
import OrganizerLeaderboardTable from "../../components/global/Leaderboard/OrganizerLeaderboardTable";
import PaginationBar from "../events/components/PaginationBar";
import { getOrganizerRankingApi } from "../../lib/api/organizer.api";
import toast from "react-hot-toast";
import { useLoading } from "../../context/LoadingContext";
import TopThreeBoard from "../../components/global/Leaderboard/TopThreeBoard";
import { TOAST_ERROR_MSG_SOMETHING_WENT_WRONG,TOAST_ERROR_MSG_LEADERBOARD_LOAD_FAILED } from "../../const-value/config-message/page";

export default function LeaderboardPage() {
  const [rankingType, setRankingType] = useState("monthly");
  const [rankingData, setRankingData] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(null);

  const { setLoading } = useLoading();

  /* ================= LOAD RANKING ================= */
  useEffect(() => {
    loadRanking();
  }, [rankingType, page]);

  const loadRanking = async () => {
    try {
      setLoading(true);

      const res = await getOrganizerRankingApi(page);

      if (res?.success) {
        const data =
          rankingType === "monthly"
            ? res.data.monthly
            : res.data.overall;

        setRankingData(data || []);
        setPagination(res.data.pagination);
      } else {
        toast.error(TOAST_ERROR_MSG_LEADERBOARD_LOAD_FAILED);
      }
    } catch {
      toast.error(TOAST_ERROR_MSG_SOMETHING_WENT_WRONG);
    } finally {
      setLoading(false);
    }
  };

  /* ================= SEARCH FILTER ================= */
  const filteredData = useMemo(() => {
    return rankingData.filter((org) =>
      org.organizationName
        ?.toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [rankingData, search]);

  const totalPages =
    rankingType === "monthly"
      ? pagination?.totalPagesMonthly
      : pagination?.totalPagesOverall;

  return (
    <>
      <LeaderboardHero
        search={search}
        onSearchChange={setSearch}
        rankingType={rankingType}
        onRankingChange={(type) => {
          setRankingType(type);
          setPage(1);
        }}
      />

      <OrganizerLeaderboardTable data={filteredData} />

      <TopThreeBoard />

      <PaginationBar
        page={page}
        total={totalPages}
        onChange={setPage}
      />

      <Footer />
    </>
  );
}
