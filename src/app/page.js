import LandingPage from "./home/LandingPage";
import { getAllOrganizationsApi } from "../lib/api/organizer.api";
import { getAllEventsApi } from "../lib/api/event.api";

export const metadata = {
  title: "All College Events | Discover Events Near You",
  description:
    "Explore college events, workshops, hackathons, concerts and more in one platform.",
};

export default async function Page() {
  const eventsRes = await getAllEventsApi();
  const orgRes = await getAllOrganizationsApi();

  return (
    <LandingPage
      events={eventsRes?.data || []}
      organization={orgRes?.data || []}
    />
  );
}
