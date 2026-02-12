import { getOrganizationByEventsApi } from "../../../lib/api/organizer.api";
import OrganizationClient from "./OrganizationClient";

/* ================= SEO ================= */
export async function generateMetadata({ params }) {
  //  MUST await params
  const { slug } = await params;

  try {
    const res = await getOrganizationByEventsApi(slug);
    const events = res?.data || [];

    if (!events.length) {
      return {
        title: "Organization Not Found | AllCollegeEvent",
        description: "Organization details not available",
      };
    }

    const org = events[0].org;

    const title = `${org.organizationName}`;
    const description = `Explore ${events.length} events organized by ${org.organizationName} in ${org.city}, ${org.state}.`;

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        images: [
          {
            url: org.logoUrl || "/images/event.png",
            width: 1200,
            height: 630,
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: [org.logoUrl || "/images/event.png"],
      },
    };
  } catch {
    return {
      title: "Organization | AllCollegeEvent",
      description: "Browse organization events",
    };
  }
}

/* ================= PAGE ================= */
export default async function Page({ params }) {
  // MUST await params here also
  const { slug } = await params;

  return <OrganizationClient slug={slug} />;
}
