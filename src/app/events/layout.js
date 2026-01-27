export const metadata = {
  title: "All Events | ACE",
  description:
    "description: Explore all college events with filters like category, mode, perks, certifications and more.",
  alternates: {
    canonical: "/events",
  },
  openGraph: {
    title: "All College Events",
    description:
      "Description: Find upcoming, trending and popular college events in one place.",
    url: "/events",
    siteName: "ACE – All College Events",
    images: [
      {
        url: "/images/test-events-og.png",
        width: 1200,
        height: 630,
        alt: "All College Events",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Twitter – Events Listing",
    description:
      "Twitter Description: Browse and filter college events easily.",
    images: ["/images/test-events-og.png"],
  },
};

export default function EventsLayout({ children }) {
  return <>{children}</>; // MUST wrap in JSX
}
