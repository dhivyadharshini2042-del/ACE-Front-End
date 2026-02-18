import LocationClient from "./LocationClient";
import { getLocationEvents } from "../../../../lib/location.api";

export async function generateMetadata(props) {
  const params = await props.params;
  const { type, identity } = params;

  let decodedIdentity = identity;

  try {
    decodedIdentity = Buffer.from(identity, "base64").toString("utf-8");
  } catch (e) {}

  const res = await getLocationEvents({
    countryId: type === "country" ? decodedIdentity : null,
    cityId: type === "city" ? decodedIdentity : null,
    page: 1,
  });

  const locationName =
    type === "country"
      ? res?.country?.name
      : res?.city?.name || "Location";

  return {
    title: `Upcoming Events in ${locationName} 2025 | ${locationName} Events | ACE`,
    description: `Looking for upcoming events in ${locationName}? Discover fests, workshops, college events and tech conferences happening in ${locationName}.`,
    openGraph: {
      title: `Upcoming Events in ${locationName}`,
      description: `Explore trending events happening in ${locationName}.`,
      type: "website",
    },
    alternates: {
      canonical: `https://yourdomain.com/location/${type}/${identity}`,
    },
  };
}

export default async function Page(props) {
  const params = await props.params;
  return <LocationClient params={params} />;
}
