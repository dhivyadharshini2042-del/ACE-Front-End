"use client";

import "./explore-categories.css";
import { useRouter } from "next/navigation";

export const EVENT_CATEGORIES = [
  {
    id: 1,
    text: "Hackathon",
    image: "/images/hackathonCategories.png",
    color: "#E3F2FD",
  },
  {
    id: 2,
    text: "Conferences",
    image: "/images/conferenceCategories.png",
    color: "#FFF3E0",
  },
  {
    id: 3,
    text: "Athletics",
    image: "/images/athleticsCategories.png",
    color: "#FCE4EC",
  },
  {
    id: 4,
    text: "Webinars",
    image: "/images/webinarsCategories.jpeg",
    color: "#EDE7F6",
  },

  {
    id: 5,
    text: "Concerts",
    image: "/images/concertsCategories.png",
    color: "#E8F5E9",
  },
  {
    id: 6,
    text: "Tournaments",
    image: "/images/tournamentsCategories.png",
    color: "#FFFDE7",
  },
  {
    id: 7,
    text: "Job Fairs",
    image: "/images/jobFairCategories.jpeg",
    color: "#E1F5FE",
  },
  {
    id: 8,
    text: "Art Gallery",
    image: "/images/artgalleryCategories.png",
    color: "#F3E5F5",
  },

  {
    id: 9,
    text: "Magic Shows",
    image: "/images/magicshowsCategories.png",
    color: "#FFF3E0",
  },
  {
    id: 10,
    text: "Workshops",
    image: "/images/workshopsCategories.png",
    color: "#E8F5E9",
  },
  {
    id: 11,
    text: "Comedy Shows",
    image: "/images/comdeyshowsCategories.png",
    color: "#FCE4EC",
  },
  {
    id: 12,
    text: "Stage Plays",
    image: "/images/stagePlaysCategories.png",
    color: "#EDE7F6",
  },

  {
    id: 13,
    text: "Fashion Show",
    image: "/images/fashionShowCategories.jpeg",
    color: "#FFF0F5",
  },
  {
    id: 14,
    text: "Music Festival",
    image: "/images/musicFestivalCategories.jpeg",
    color: "#E1F5FE",
  },
  {
    id: 15,
    text: "Cultural Events",
    image: "/images/culturaleventsCategories.png",
    color: "#FFFDE7",
  },
  {
    id: 16,
    text: "Dance Competitions",
    image: "/images/danceCompetitionCategories.png",
    color: "#E8F5E9",
  },

  {
    id: 17,
    text: "Fitness Challenge",
    image: "/images/fitnessChallengeCategories.png",
    color: "#F3E5F5",
  },
  {
    id: 18,
    text: "Marathon",
    image: "/images/marathonCategories.png",
    color: "#E3F2FD",
  },
  {
    id: 19,
    text: "Guest Lectures",
    image: "/images/guestLecturesCategories.png",
    color: "#FFF3E0",
  },
  {
    id: 20,
    text: "Video Games",
    image: "/images/videoGamesCategories.png",
    color: "#EDE7F6",
  },

  {
    id: 21,
    text: "Alumni Meets",
    image: "/images/alumniMeetsCategories.png",
    color: "#E1F5FE",
  },
  {
    id: 22,
    text: "Startup Events",
    image: "/images/startUpEventsCategories.png",
    color: "#FFFDE7",
  },
  {
    id: 23,
    text: "Training Programs",
    image: "/images/trainingProgramsCategories.png",
    color: "#E8F5E9",
  },
  {
    id: 24,
    text: "Expo & Tradeshows",
    image: "/images/expo&TradeshowsCategories.png",
    color: "#FFF3E0",
  },

  {
    id: 25,
    text: "Meet Ups",
    image: "/images/meetUpsCategories.png",
    color: "#E3F2FD",
  },
  {
    id: 26,
    text: "Civic Festivals",
    image: "/images/civicFestivalsCategories.png",
    color: "#EDE7F6",
  },
  {
    id: 27,
    text: "Seminars",
    image: "/images/seminarsCategories.png",
    color: "#FCE4EC",
  },
  {
    id: 28,
    text: "Food Festival",
    image: "/images/foodFestivalCategories.png",
    color: "#FFFDE7",
  },

  {
    id: 29,
    text: "Awareness Program",
    image: "/images/awarenessProgramCategories.png",
    color: "#E8F5E9",
  },
  {
    id: 30,
    text: "Technical Events",
    image: "/images/technicalEventsCategories.png",
    color: "#E1F5FE",
  },
  {
    id: 31,
    text: "Blood Donation Camps",
    image: "/images/bloodDonationCampsCategories.png",
    color: "#F3E5F5",
  },
  {
    id: 32,
    text: "Symposiums",
    image: "/images/symposiumsCategories.png",
    color: "#F5F5F5",
  },

  {
    id: 33,
    text: "Mental Wellness",
    image: "/images/mentalWellnessCategories.png",
    color: "#E8F5E9",
  },
  {
    id: 34,
    text: "Prayer Meeting",
    image: "/images/prayerMeetingCategories.png",
    color: "#E1F5FE",
  },
  {
    id: 35,
    text: "Painting",
    image: "/images/paintingCategories.png",
    color: "#F3E5F5",
  },
  {
    id: 36,
    text: "others",
    image: "/images/othersCategories.png",
    color: "#F5F5F5",
  },
];

export default function ExploreCategoriesPage() {
  const router = useRouter();

  const handelNavigation = () => {
    router.push("/");
  };

  const handleCardClick = () => {
    router.push("/events");
  };

  return (
    <div className="explore-page">
      <div className="text-start m-4" style={{ cursor: "pointer" }}>
        <p onClick={handelNavigation}> 🔙 Back</p>
      </div>
      {/* HEADER */}
      <div className="explore-header mt-5">
        <h2>Choose Your Event Type</h2>
      </div>

      {/* GRID */}
      <div className="explore-grid">
        {EVENT_CATEGORIES.map((item) => (
          <div
            key={item.id}
            className="explore-card"
            style={{ "--card-color": item.color }}
            onClick={handleCardClick}
          >
            <div className="icon-box">
              <img src={item.image} alt={item.text} />
            </div>
            <p>{item.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
