"use client";

import { useEffect, useState, useCallback } from "react";
import styles from "./OrgAnalyticsPanel.module.css";
import OrganizerAnalyticsDashboard from "./OrganizerAnalyticsDashboard";
import { getOrganizerEventsApi } from "../../lib/api/event.api";
import { getOrganizationProfileApi } from "../../lib/api/organizer.api";

function resolveCategoryName(event) {
    if (event.categoryName && typeof event.categoryName === "string") return event.categoryName;

    if (event.category) {
        if (typeof event.category === "string") return event.category;
        if (typeof event.category === "object") {
            return event.category.name || event.category.title || event.category.categoryName || "Uncategorized";
        }
    }
    if (event.category_name && typeof event.category_name === "string") return event.category_name;

    return "Uncategorized";
}

function resolveMode(event) {
    const raw = event.mode || event.eventMode || event.type || null;
    if (!raw) return "Offline";
    const s = String(raw);
    return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
}

function resolveTitle(event) {
    return event.title || event.name || event.eventTitle || `Event #${event.id ?? "?"}`;
}

// ─────────────────────────────────────────────────────────────────────────────

export default function OrgAnalyticsPanel({
    isOpen,
    onClose,
    orgId,
    orgName,
    avatarUrl,
    onViewEvents,
    onViewCategories,
}) {
    const [analyticsData, setAnalyticsData] = useState(undefined);

    const buildAnalytics = useCallback(async () => {
        if (!orgId) return;
        setAnalyticsData(undefined);

        try {
            const [eventsRes, profileRes] = await Promise.all([
                getOrganizerEventsApi(orgId),
                getOrganizationProfileApi(orgId),
            ]);

            const events = eventsRes?.data || [];
            const profile = profileRes?.data || {};

            if (!events.length && !Object.keys(profile).length) {
                setAnalyticsData({});
                return;
            }

            // ── STATS ─────────────────────────────────────────────────────

            const totalLikes = events.reduce((s, e) => s + (e.likeCount ?? e.likes ?? e.likesCount ?? 0), 0);
            const totalShares = events.reduce((s, e) => s + (e.shareCount ?? e.shares ?? e.sharesCount ?? 0), 0);
            const totalViews = events.reduce((s, e) => s + (e.viewCount ?? e.views ?? e.viewsCount ?? 0), 0);

            // Follower count: prefer the org-profile field
            const totalFollowers =
                profile.followersCount ??
                profile.followerCount ??
                profile.followers ??
                events.reduce((s, e) => s + (e.followersCount ?? e.followerCount ?? 0), 0);

            const sharesOrViews = totalShares > 0 ? totalShares : totalViews;
            const sharesCardLabel = totalShares > 0 ? "Total Shares" : "Total Views";

            // ── CATEGORY DISTRIBUTION ─────────────────────────────────────
            const categoryMap = {};
            events.forEach((e) => {
                const cat = resolveCategoryName(e);
                categoryMap[cat] = (categoryMap[cat] || 0) + 1;
            });
            const categoryTotal = Object.values(categoryMap).reduce((a, b) => a + b, 0) || 1;
            const categories = Object.entries(categoryMap).map(([label, count]) => ({
                label,
                value: count,
                percentage: Math.round((count / categoryTotal) * 100),
            }));

            // ── MODE DISTRIBUTION ─────────────────────────────────────────
            const modeColorMap = {
                Free: "#88D6A4",
                Paid: "#FFA8D1",
                Online: "#48DBFB",
                Offline: "#A29BFE",
                Hybrid: "#FD79A8",
            };
            const modeMap = {};
            events.forEach((e) => {
                const mode = resolveMode(e);
                modeMap[mode] = (modeMap[mode] || 0) + 1;
            });
            const modeTotal = Object.values(modeMap).reduce((a, b) => a + b, 0) || 1;
            const modes = Object.entries(modeMap).map(([label, count]) => ({
                label,
                value: count,
                percentage: Math.round((count / modeTotal) * 100),
                color: modeColorMap[label] || "#B2BEC3",
            }));

            // ── TOP EVENTS by viewCount (fallback → 0) ───────────────────
            const sorted = [...events].sort((a, b) =>
                (b.viewCount ?? b.views ?? b.registrationCount ?? 0) -
                (a.viewCount ?? a.views ?? a.registrationCount ?? 0)
            );
            const top5 = sorted.slice(0, 5);
            const maxVal = Math.max(top5[0]?.viewCount ?? top5[0]?.views ?? 0, 1);
            const topEvents = top5.map((e, i) => ({
                rank: i + 1,
                name: resolveTitle(e),
                value: e.viewCount ?? e.views ?? e.registrationCount ?? 0,
                max: maxVal,
            }));

            // ── TIMELINE: cumulative views by month of createdAt ──────────
            const MONTH_ORDER = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
            const monthMap = {};
            [...events]
                .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
                .forEach((e) => {
                    if (!e.createdAt) return;
                    const label = new Date(e.createdAt).toLocaleString("en-IN", { month: "short" });
                    monthMap[label] = (monthMap[label] || 0) + (e.viewCount ?? e.views ?? 1);
                });

            const sortedMonths = Object.keys(monthMap).sort(
                (a, b) => MONTH_ORDER.indexOf(a) - MONTH_ORDER.indexOf(b)
            );
            let cum = 0;
            const followersTimeline = sortedMonths.map((label) => {
                cum += monthMap[label];
                return { label, value: cum };
            });

            // ── COMMIT ────────────────────────────────────────────────────
            setAnalyticsData({
                categories,
                modes,
                stats: {
                    events: { value: events.length, growth: "" },
                    followers: { value: totalFollowers, growth: "" },
                    likes: { value: totalLikes, growth: "" },
                    shares: { value: sharesOrViews, growth: "", label: sharesCardLabel },
                },
                topEvents,
                followersTimeline: followersTimeline.length ? followersTimeline : [],
            });

        } catch (err) {
            console.error("[Analytics] aggregation error:", err);
            setAnalyticsData({});
        }
    }, [orgId]);

    useEffect(() => {
        if (isOpen) buildAnalytics();
    }, [isOpen, buildAnalytics]);

    useEffect(() => {
        if (!isOpen) return;
        const handler = (e) => { if (e.key === "Escape") onClose(); };
        window.addEventListener("keydown", handler);
        return () => window.removeEventListener("keydown", handler);
    }, [isOpen, onClose]);

    useEffect(() => {
        document.body.style.overflow = isOpen ? "hidden" : "";
        return () => { document.body.style.overflow = ""; };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <>
            <div className={styles.overlay} onClick={onClose} aria-hidden="true" />

            <aside className={styles.panel} role="dialog" aria-label="Organizer Analytics" aria-modal="true">
                <div className={styles.panelHeader}>
                    <h2 className={styles.panelTitle}>
                        <span className={styles.panelTitleIcon}>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="18" y1="20" x2="18" y2="10" />
                                <line x1="12" y1="20" x2="12" y2="4" />
                                <line x1="6" y1="20" x2="6" y2="14" />
                            </svg>
                        </span>
                        Organizer Analytics
                    </h2>
                    <button className={styles.closeBtn} onClick={onClose} aria-label="Close">✕</button>
                </div>

                <div className={styles.panelContent}>
                    <OrganizerAnalyticsDashboard
                        analyticsData={analyticsData}
                        organizerName={orgName}
                        avatarUrl={avatarUrl}
                        onViewEvents={onViewEvents}
                        onViewCategories={onViewCategories}
                    />
                </div>
            </aside>
        </>
    );
}