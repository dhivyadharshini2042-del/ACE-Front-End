import LandingPage from "./home/LandingPage";
import { getAllEventsApi } from "../lib/api/event.api";
import { getAllOrganizationsApi } from "../lib/api/organizer.api";

export const metadata = {
  title: "All College Events | Discover Events Near You",
  description:
    "Explore college events, workshops, hackathons, concerts and more.",
};

export default async function Page({ searchParams }) {
  const eventsRes = await getAllEventsApi(false);
  const orgRes = await getAllOrganizationsApi();

  return (
    <LandingPage
      initialEvents={eventsRes?.data || []}
      initialOrganization={orgRes?.data || []}
      searchParams={searchParams}   
    />
  );
}