"use client";

import Footer from "../../components/global/Footer/Footer";
import LeaderboardHero from "../../components/global/Leaderboard/LeaderboardHero";
import OrganizerLeaderboardTable from "../../components/global/Leaderboard/OrganizerLeaderboardTable";
import TopThreeBoard from "../../components/global/Leaderboard/TopThreeBoard";



export default function LeaderboardPage() {
  return (
    <>
      <LeaderboardHero />
      <TopThreeBoard />
      <OrganizerLeaderboardTable />
      <Footer />
    </>
  );
}
