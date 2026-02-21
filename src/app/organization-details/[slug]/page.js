import { getOrganizationDetailsApi } from "../../../lib/api/organizer.api";
import OrganizationClient from "./OrganizationClient";

/* ================= SEO ================= */
export async function generateMetadata({ params }) {
  const { slug } = await params;

  try {
    const res = await getOrganizationDetailsApi(slug);

    if (!res?.status || !res?.data) {
      return {
        title: "Organization Not Found | AllCollegeEvent",
        description: "Organization details not available",
      };
    }

    const org = res.data;

    return {
      title: `${org.organizationName} | AllCollegeEvent`,
      description: `Explore events organized by ${org.organizationName}`,
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
  const { slug } = await params;  

  return <OrganizationClient slug={slug} />;
}
