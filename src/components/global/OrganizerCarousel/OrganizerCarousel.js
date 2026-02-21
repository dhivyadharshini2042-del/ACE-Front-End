"use client";

import styles from "./OrganizerCarousel.module.css";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import ConfirmModal from "../../ui/Modal/ConfirmModal";
import { followOrganizerApi } from "../../../lib/api/organizer.api";
import { isUserLoggedIn } from "../../../lib/auth";
import { useEffect, useState } from "react";
import { TOAST_ERROR_FOLLOW, TOAST_SUCCESS_FOLLOW } from "../../../const-value/config-message/page";

export default function OrganizersCarousel({ data = [] }) {
  const [loggedIn, setLoggedIn] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [pendingOrg, setPendingOrg] = useState(null);

  const router = useRouter();

  useEffect(() => {
    setLoggedIn(isUserLoggedIn());
  }, []);

  // const handleFollow = async (e, orgIdentity) => {
  //   e.stopPropagation(); // prevent card click

  //   if (!loggedIn) {
  //     setPendingOrg(orgIdentity);
  //     setShowLoginModal(true);
  //     return;
  //   }

  //   const res = await followOrganizerApi(orgIdentity);

  //   if (res?.status) {
  //     toast.success(TOAST_SUCCESS_FOLLOW);
  //   } else {
  //     toast.error(res?.message || TOAST_ERROR_FOLLOW);
  //   }
  // };

  if (!Array.isArray(data) || data.length === 0) return null;

  const handleOrgClick = (slug) => {
    if (!slug) return;
    router.push(`/organization-details/${slug}`);
  };

  const handleLeaderboardClick = () => {
    router.push("/leaderboard");
  };

  return (
    <section className={styles.root}>
      {/* HEADER */}
      <div className={styles.header}>
        <div>
          <h2 className={styles.title}>Our Top Organizers</h2>
          <p className={styles.sub}>
            Find the Organizations you're looking for quickly.
            <span className={styles.more} onClick={handleLeaderboardClick}>
              {" "}
              You can see more.
            </span>
          </p>
        </div>

        <button className={styles.seeAllBtn} onClick={handleLeaderboardClick}>
          See all
        </button>
      </div>

      {/* CARD GRID */}
      <div className={styles.list}>
        {data.slice(0, 5).map((org, index) => (
          <div
            key={org.identity || index}
            className={styles.card}
            onClick={() => {
              document.cookie = `orgIdentity=${org.identity}; path=/`;
              handleOrgClick(org.slug);
            }}
          >
            {/* RANK BADGE */}
            {index < 3 && (
              <div className={styles.rankBadge}>
                <img
                  src={
                    index === 0
                      ? "/images/FirstOr.png"
                      : index === 1
                        ? "/images/SecondOr.png"
                        : "/images/ThreedOr.png"
                  }
                  className={styles.rankImg}
                />
              </div>
            )}
            <div className={styles.cardContent}>
              <div className={styles.avatarWrap}>
                {org.profileImage ? (
                  <img
                    src={org.profileImage}
                    alt={org.organizationName}
                    className={styles.avatar}
                  />
                ) : (
                  <div className={styles.avatarFallback}>
                    {org.organizationName?.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>

              <div className={styles.name}>{org.organizationName}</div>

              <div className={styles.events}>
                {org._count?.events || 0} Events
              </div>
            </div>
            {/* <div style={{ textAlign: "center" }}>
              <button
                className={styles.followBtn}
                onClick={(e) => handleFollow(e, org.identity)}
              >
                Follow
              </button>
            </div> */}
          </div>
        ))}
      </div>
      <ConfirmModal
        open={showLoginModal}
        image="/images/logo.png"
        title="Login Required"
        description="You need to login to follow this organization."
        onCancel={() => {
          setShowLoginModal(false);
          setPendingOrg(null);
        }}
        onConfirm={() => {
          setShowLoginModal(false);
          setPendingOrg(null);
          router.push("/auth/user/login");
        }}
      />
    </section>
  );
}
