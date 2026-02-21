// Enables client-side rendering for this page
"use client";

// About page section components
import JourneyNumbers from "../../components/global/About/JourneyNumbers/JourneyNumbers";
import StandFor from "../../components/global/About/StandFor/StandFor";
import StoryBehindFest from "../../components/global/About/StoryBehindFest/StoryBehindFest";
import VoiceOfTrust from "../../components/global/About/VoiceOfTrust/VoiceOfTrust";
import Footer from "../../components/global/Footer/Footer";
import WhyChoose from "../../components/global/WhyChoose/WhyChoose";


// Main About page component
export default function AboutPage() {
  return (
    <>
      {/* Brand story section */}
      <StoryBehindFest />

      {/* Company values section */}
      <StandFor />

      {/* Key milestones and achievements */}
      <JourneyNumbers />

      {/* Testimonials and trust section */}
      <VoiceOfTrust />

      {/* Why choose us section */}
      <WhyChoose />

      {/* Global footer */}
      <Footer/>
    </>
  );
}