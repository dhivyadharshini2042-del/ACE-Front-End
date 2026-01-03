"use client";

import { useState } from "react";
import styles from "./CreateEvent.module.css";

import Stepper from "./components/Stepper";
import OrganizerDetails from "./steps/OrganizerDetails";
import EventDetails from "./steps/EventDetails";
import MediaTickets from "./steps/MediaTickets";
import toast from "react-hot-toast";

import {
  createEventStep1Schema,
  createEventStep2Schema,
  createEventStep3Schema,
} from "../../../../components/validation";

import { createEventApi } from "../../../../lib/api/event.api";
import { getUserData } from "../../../../lib/auth";

/* ================= INITIAL STATE ================= */

const INITIAL_FORM_DATA = {
  organizer: {
    organizations: [
      {
        hostBy: "",
        orgName: "",
        location: "",
        organizerName: "",
        organizerNumber: "",
        department: "",
      },
    ],
  },
  event: {
    title: "",
    category: "",
    eventType: "003dee95-0d44-4f67-aa04-2d0e6b00b015",
    tags: [],
    about: "",
    mode: "online",
    calendar: [],
    country: "",
    state: "",
    city: "",
    mapLink: "",
  },
  media: {
    bannerImages: [],
    perks: [],
    certification: [],
    accommodation: [],
    tickets: [],
    paymentLink: "",
    whatsapp: "",
    instagram: "",
    linkedin: "",
    website: "",
  },
};

export default function CreateEvent() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState(INITIAL_FORM_DATA);

  //RESET SIGNAL
  const [resetSignal, setResetSignal] = useState(0);

  /* ================= STEP 1 ================= */
  const handleStep1Next = async () => {
    try {
      await createEventStep1Schema.validate(formData.organizer, {
        abortEarly: false,
      });
      setStep(2);
    } catch (err) {
      toast.error(err?.errors?.[0] || "Fill organizer details");
    }
  };

  /* ================= STEP 2 ================= */
  const handleStep2Next = async () => {
    try {
      await createEventStep2Schema.validate(formData.event, {
        abortEarly: false,
      });
      setStep(3);
    } catch (err) {
      toast.error(err?.errors?.[0] || "Fill event details");
    }
  };

  /* ================= FINAL SUBMIT ================= */
  const handleFinalSubmit = async () => {
    try {
      await createEventStep3Schema.validate(formData.media, {
        abortEarly: false,
      });

      const user = getUserData();
      const orgId = user?.identity;

      if (!orgId) {
        toast.error("Organization not found");
        return;
      }

      const organizer = formData.organizer.organizations[0];
      const event = formData.event;
      const media = formData.media;

      const fd = new FormData();

      fd.append("title", event.title);
      fd.append("description", event.about);
      fd.append("mode", event.mode.toUpperCase());
      fd.append("categoryIdentity", event.category);
      fd.append("eventTypeIdentity", event.eventType);

      if (media.certification) {
        fd.append("certIdentity", media.certification);
      }

      fd.append(
        "eligibleDeptIdentities",
        JSON.stringify(organizer.department ? [organizer.department] : [])
      );

      fd.append("tags", JSON.stringify(event.tags || []));

      fd.append(
        "collaborators",
        JSON.stringify([
          {
            hostIdentity: organizer.hostBy,
            organizationName: organizer.orgName,
            organizerNumber: organizer.organizerNumber,
            orgDept: organizer.department,
            organizerName: organizer.organizerName,
            location: organizer.location,
          },
        ])
      );

      fd.append(
        "calendars",
        JSON.stringify(
          (event.calendar || []).map((c) => ({
            timeZone: c.timeZone || "Asia/Kolkata",
            startDate: c.startDate,
            endDate: c.endDate,
            startTime: c.startTime,
            endTime: c.endTime,
          }))
        )
      );

      fd.append(
        "tickets",
        JSON.stringify(
          (media.tickets || []).map((t) => ({
            name: t.name,
            description: t.description,
            sellingFrom: t.from,
            sellingTo: t.to,
            isPaid: t.type === "PAID",
            price: t.type === "PAID" ? Number(t.amount) : 0,
            totalQuantity: Number(t.total),
          }))
        )
      );

      fd.append("perkIdentities", JSON.stringify(media.perks || []));

      if (media.accommodation) {
        fd.append(
          "accommodationIdentities",
          JSON.stringify([media.accommodation])
        );
      }

      if (event.mode !== "online") {
        fd.append(
          "location",
          JSON.stringify({
            country: event.country,
            state: event.state,
            city: event.city,
            mapLink: event.mapLink,
          })
        );
      }

      if (media.website) fd.append("eventLink", media.website);
      if (media.paymentLink) fd.append("paymentLink", media.paymentLink);

      fd.append(
        "socialLinks",
        JSON.stringify({
          whatsapp: media.whatsapp,
          instagram: media.instagram,
          linkedin: media.linkedin,
        })
      );

      if (media.bannerImages?.length) {
        media.bannerImages.forEach((file) => {
          fd.append("bannerImages", file);
        });
      }

      console.log("FINAL FORMDATA PAYLOAD ↓↓↓");
      for (let pair of fd.entries()) {
        console.log(pair[0], "=>", pair[1]);
      }

      const res = await createEventApi(orgId, fd);

      if (res?.success) {
        toast.success("Event created successfully");

        //FULL NORMAL RESET
        setFormData(INITIAL_FORM_DATA);
        setStep(1);
        setResetSignal((s) => s + 1);
      } else {
        toast.error(res?.message || "Event creation failed");
      }
    } catch (err) {
      toast.error(err?.errors?.[0] || err?.message || "Invalid data");
    }
  };

  return (
    <div className={styles.wrapper}>
      <Stepper step={step} />

      {step === 1 && (
        <OrganizerDetails
          data={formData.organizer}
          resetSignal={resetSignal}
          setData={(d) => setFormData({ ...formData, organizer: d })}
          onNext={handleStep1Next}
        />
      )}

      {step === 2 && (
        <EventDetails
          data={formData.event}
          resetSignal={resetSignal}
          setData={(d) => setFormData({ ...formData, event: d })}
          onBack={() => setStep(1)}
          onNext={handleStep2Next}
        />
      )}

      {step === 3 && (
        <MediaTickets
          data={formData.media}
          resetSignal={resetSignal}
          setData={(d) => setFormData({ ...formData, media: d })}
          onBack={() => setStep(2)}
          onSubmit={handleFinalSubmit}
        />
      )}
    </div>
  );
}
