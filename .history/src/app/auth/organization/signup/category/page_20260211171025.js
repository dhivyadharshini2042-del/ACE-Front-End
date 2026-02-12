"use client";

import "../../auth-common.css";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

import {
  UNIVERSITYICONS,
  TRAININGICON,
  INDIVIDUALICON,
  EVENTMANAGEMENTICON,
  TECHONEICON,
  SPORTSICON,
  CORPORATEICON,
  GOVERMENTICON,
  NGOICON,
  PAGEMOVEICON,
} from "../../../../../const-value/config-icons/page";

import {
  TITLE_ORG_ACCOUNT_CREATION,
  LABEL_ORG_STEP_CATEGORY,
  LABEL_ORG_STEP_DETAILS,
  LABEL_ORG_STEP_ACCOUNT,
  BTN_CONTINUE,
  MSG_ERR_CATEGORY_MISSING,
  TEXT_NO_ACCOUNT,
  TEXT_SIGNIN,
  TEXT_ALREADY_HAVE_ACCOUNT
} from "../../../../../const-value/config-message/page";

import { useLoading } from "../../../../../context/LoadingContext";

const CATEGORIES = [
  { id: "college", title: "College / University", icon: UNIVERSITYICONS },
  { id: "training", title: "Training Institute", icon: TRAININGICON },
  { id: "individual", title: "Individual / Freelancer", icon: INDIVIDUALICON },
  { id: "event", title: "Event Management Company", icon: EVENTMANAGEMENTICON },
  { id: "tech", title: "Tech Community", icon: TECHONEICON },
  { id: "sports", title: "Sports Club", icon: SPORTSICON },
  { id: "corporate", title: "Corporate Company", icon: CORPORATEICON },
  { id: "gov", title: "Government Organization", icon: GOVERMENTICON },
  { id: "ngo", title: "NGO / Non-Profit", icon: NGOICON },
];

export default function Page() {
  const router = useRouter();
  const { setLoading } = useLoading();
  const [selected, setSelected] = useState("");

  const onContinue = () => {
    if (!selected) return toast.error(MSG_ERR_CATEGORY_MISSING);

    try {
      setLoading(true);
      router.push(`/auth/organization/signup/details?cat=${selected}`);
    } catch (err) {
      console.error("Navigation error", err);
    } finally {
      setLoading(false);
    }
  };

  const handleUserLogin = () => {
    try {
      setLoading(true);
      router.push("/auth/user/signup");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5">
      <div className="organization-sections mt-4">
        <div className="Switch-to-Organizer" onClick={handleUserLogin}>
          Switch to User Sign Up
        </div>
        <div>{PAGEMOVEICON}</div>
      </div>

      {/* STEPPER */}
      <div className="org-stepper">
        <div className="org-step active">
          <div className="dot">1</div>
          <small>{LABEL_ORG_STEP_CATEGORY}</small>
        </div>

        <div className="line active"></div>

        <div className="org-step">
          <div className="dot">2</div>
          <small>{LABEL_ORG_STEP_DETAILS}</small>
        </div>

        <div className="line"></div>

        <div className="org-step">
          <div className="dot">3</div>
          <small>{LABEL_ORG_STEP_ACCOUNT}</small>
        </div>
      </div>

      {/* TITLE */}
      <h2 className="text-center fw-bold">
        {TITLE_ORG_ACCOUNT_CREATION}
      </h2>

      {/* CATEGORY GRID */}
      <div className="row g-3">
        {CATEGORIES.map((c) => (
          <div key={c.id} className="col-md-4 col-sm-6 col-12">
            <div
              className={`card p-3 text-center ${selected === c.id ? "border-primary" : "border-light"
                }`}
              role="button"
              onClick={() => setSelected(c.id)}
            >
              <div className="mb-2">
                <div className="cat-icons">{c.icon}</div>
              </div>
              <h6 className="fw-semibold">{c.title}</h6>
            </div>
          </div>
        ))}
      </div>

      {/* CONTINUE */}
      <div className="mt-4 text-center btn-container">
        <button className="btn continue-btn" onClick={onContinue}>
          {BTN_CONTINUE}
        </button>
      </div>

      {/* FOOTER */}
      <div className="text-center mt-3">
        <small>
          {TEXT_ALREADY_HAVE_ACCOUNT}{" "}
          <a href="/auth/organization/login" className="text-primary fw-bold">
            {TEXT_SIGNIN}
          </a>
        </small>
      </div>
    </div>
  );
}
