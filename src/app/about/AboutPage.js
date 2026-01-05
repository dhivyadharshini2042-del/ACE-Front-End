"use client";

import JourneyNumbers from "../../components/global/About/JourneyNumbers/JourneyNumbers";
import StandFor from "../../components/global/About/StandFor/StandFor";
import StoryBehindFest from "../../components/global/About/StoryBehindFest/StoryBehindFest";
import VoiceOfTrust from "../../components/global/About/VoiceOfTrust/VoiceOfTrust";
import WhyChoose from "../../components/global/WhyChoose/WhyChoose";



export default function AboutPage() {
  return (
    <>
      <StoryBehindFest />
      <StandFor />
      <JourneyNumbers />
      <VoiceOfTrust />
      <WhyChoose />
    </>
  );
}
