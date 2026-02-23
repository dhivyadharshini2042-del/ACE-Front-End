"use client";

import { useState, useEffect } from "react";
import styles from "./CreateEvent.module.css";
import toast from "react-hot-toast";

import Stepper from "./components/Stepper";
import OrganizerDetails from "./steps/OrganizerDetails";
import EventDetails from "./steps/EventDetails";
import MediaTickets from "./steps/MediaTickets";

import {
  createEventStep1Schema,
  createEventStep2Schema,
  createEventStep3Schema,
} from "../../../../components/validation/yupSchemas";

import { createEventApi } from "../../../../lib/api/event.api";
import { useLoading } from "../../../../context/LoadingContext";

import { TOAST_SUCCESS_EVENT_CREATED,
  TOAST_ERROR_MSG_FILL_ORGANIZER_DETAILS, 
  TOAST_ERROR_MSG_ONLY_ORGANIZERS_CAN_CREATE_EVENTS,
  TOAST_ERROR_MSG_ORGANIZATION_NOT_FOUND,
  TOAST_ERROR_MSG_EVENT_CREATION_FAILED ,
  TOAST_ERROR_MSG_INVALID_DATA,
  TOAST_ERROR_MSG_FILL_EVENT_DETAILS } from "../../../../const-value/config-message/page";

// 🔐 SESSION AUTH
import { getAuthFromSession, isUserLoggedIn } from "../../../../lib/auth";

/* ================= INITIAL STATE ================= */

const INITIAL_FORM_DATA = {
  organizer: {
    organizations: [
      {
        hostBy: "",
        orgName: "",
        location: "",
        department: "",
      },
    ],
    contacts: [
      {
        name: "",
        number: "",
        email: "",
      },
    ],
  },
  event: {
    title: "",
    category: "",
    eventType: "",
    tags: [],
    about: "",
    mode: "online",
    calendar: [],
    country: "",
    state: "",
    city: "",
    offers: "",
    mapLink: "",
    venue: "",
  },
  media: {
    bannerImages: [],
    perks: [],
    certification: "",
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
  const { setLoading } = useLoading();

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState(INITIAL_FORM_DATA);
  const [resetSignal, setResetSignal] = useState(0);

  // SESSION STATE
  const [auth, setAuth] = useState(null);
  const [loggedIn, setLoggedIn] = useState(false);

  const getTicketDateRange = () => {
    const calendar = formData.event.calendar;

    if (!calendar || calendar.length === 0) return {};

    // today
    const today = new Date().toISOString().split("T")[0];

    // last event end date
    const endDates = calendar
      .map((c) => c.endDate)
      .filter(Boolean)
      .sort();

    return {
      ticketMinDate: today,
      ticketMaxDate: endDates[endDates.length - 1],
    };
  };

  const { ticketMinDate, ticketMaxDate } = getTicketDateRange();

  /* ================= INIT AUTH ================= */
  useEffect(() => {
    const ok = isUserLoggedIn();
    setLoggedIn(ok);

    if (ok) {
      setAuth(getAuthFromSession());
    }
  }, []);

  /* ================= STEP 1 ================= */
  const handleStep1Next = async () => {
    try {
      setLoading(true);
      await createEventStep1Schema.validate(formData.organizer, {
        abortEarly: false,
      });
      setStep(2);
    } catch (err) {
      toast.error(err?.errors?.[0] || TOAST_ERROR_MSG_FILL_ORGANIZER_DETAILS);
    } finally {
      setLoading(false);
    }
  };

  /* ================= STEP 2 ================= */
  const handleStep2Next = async () => {
    try {
      setLoading(true);
      await createEventStep2Schema.validate(formData.event, {
        abortEarly: false,
      });
      setStep(3);
    } catch (err) {
      toast.error(err?.errors?.[0] || TOAST_ERROR_MSG_FILL_EVENT_DETAILS);
    } finally {
      setLoading(false);
    }
  };

  /* ================= FINAL SUBMIT ================= */
  const handleFinalSubmit = async () => {
    try {
      if (!loggedIn || auth?.type !== "org") {
        toast.error(TOAST_ERROR_MSG_ONLY_ORGANIZERS_CAN_CREATE_EVENTS);
        return;
      }

      setLoading(true);
      await createEventStep3Schema.validate(formData.media, {
        abortEarly: false,
      });

      const orgId = auth.identity.identity;

      if (!orgId) {
        toast.error(TOAST_ERROR_MSG_ORGANIZATION_NOT_FOUND);
        return;
      }

      const collaboratorsPayload = (formData.organizer.organizations || []).map(
        (org) => ({
          hostIdentity: org.hostBy,
          organizationName: org.orgName,
          orgDept: org.department || "",
          location: org.location,
        }),
      );

      const contactsPayload = (formData.organizer.contacts || []).map((c) => ({
        name: c.name,
        phone: c.number,
        email: c.email,
      }));

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

      const deptList = formData.organizer.organizations
        .map((o) => o.department)
        .filter(Boolean);

      fd.append("eligibleDeptIdentities", JSON.stringify(deptList));
      fd.append("tags", JSON.stringify(event.tags || []));
      fd.append("collaborators", JSON.stringify(collaboratorsPayload));

      fd.append("contacts", JSON.stringify(contactsPayload));

      fd.append(
        "calendars",
        JSON.stringify(
          (event.calendar || []).map((c) => ({
            timeZone: c.timeZone || "Asia/Kolkata",
            startDate: c.startDate,
            endDate: c.endDate,
            startTime: c.startTime,
            endTime: c.endTime,
          })),
        ),
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
          })),
        ),
      );

      fd.append("perkIdentities", JSON.stringify(media.perks || []));

      if (media.accommodation) {
        fd.append(
          "accommodationIdentities",
          JSON.stringify(media.accommodation || []),
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
            offers: event.offers,
            venue: event.venue,
          }),
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
        }),
      );

      if (media.bannerImages?.length) {
        media.bannerImages.forEach((file) => {
          fd.append("bannerImages", file);
        });
      }

      

      const res = await createEventApi(orgId, fd);

      if (res?.status) {
        toast.success(TOAST_SUCCESS_EVENT_CREATED);

        setFormData(INITIAL_FORM_DATA);
        setStep(1);
        setResetSignal((s) => s + 1);
      } else {
        toast.error(res?.message || TOAST_ERROR_MSG_EVENT_CREATION_FAILED );
      }
    } catch (err) {
      toast.error(err?.errors?.[0] || err?.message || TOAST_ERROR_MSG_INVALID_DATA);
    } finally {
      setLoading(false);
    }
  };

  /* ================= UI (UNCHANGED) ================= */
  return (
    <div className={styles.wrapper}>
      <Stepper step={step} />

      {step === 1 && (
        <OrganizerDetails
          data={formData.organizer}
          resetSignal={resetSignal}
          // setData={(d) => setFormData({ ...formData, organizer: d })}
          setData={(d) => setFormData((prev) => ({ ...prev, organizer: d }))}
          onNext={handleStep1Next}
        />
      )}

      {step === 2 && (
        <EventDetails
          data={formData.event}
          resetSignal={resetSignal}
          // setData={(d) => setFormData({ ...formData, event: d })}
          setData={(d) => setFormData((prev) => ({ ...prev, event: d }))}
          onBack={() => setStep(1)}
          onNext={handleStep2Next}
        />
      )}

      {/* {step === 3 && (
        <MediaTickets
          data={formData.media}
          resetSignal={resetSignal}
          setData={(d) => setFormData({ ...formData, media: d })}
          onBack={() => setStep(2)}
          onSubmit={handleFinalSubmit}
          ticketMinDate={ticketMinDate}
          ticketMaxDate={ticketMaxDate}
        />
      )} */}
      {step === 3 && (
  <MediaTickets
    data={formData.media}
    resetSignal={resetSignal}
    // setData={(d) =>
    //   setFormData((prev) => ({
    //     ...prev,
    //     media: typeof d === "function" ? d(prev.media) : d,
    //   }))
    // }
    setData={(d) =>
  setFormData((prev) => ({
    ...prev,
    media: typeof d === "function" ? d(prev.media) : d,
  }))
}
    onBack={() => setStep(2)}
    onSubmit={handleFinalSubmit}
    ticketMinDate={ticketMinDate}
    ticketMaxDate={ticketMaxDate}
  />
)}
    </div>
  );
}
