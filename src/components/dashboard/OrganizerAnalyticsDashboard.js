import React, { useState } from 'react';
import styles from './OrganizerAnalyticsDashboard.module.css';

// ─── Donut Chart ────────────────────────────────────────────────────────────
const DonutChart = ({ data, centerText }) => {
    if (!data || data.length === 0) return null;

    // Normalise so percentages sum to 100
    const total = data.reduce((s, d) => s + (d.value || 0), 0) || 1;
    let cumulative = 0;
    const CIRC = 2 * Math.PI * 15.915494309189533; // ≈ 100

    return (
        <div className={styles.chartView}>
            <svg
                width="100%"
                height="100%"
                viewBox="0 0 42 42"
                style={{ transform: 'rotate(-90deg)', overflow: 'visible' }}
            >
                {/* Track */}
                <circle cx="21" cy="21" r="15.915494309189533" fill="transparent" stroke="#F1F2F6" strokeWidth="4" />

                {data.map((slice, i) => {
                    if (!slice.value) return null;
                    const pct = (slice.value / total) * 100;
                    const dasharray = `${pct} ${100 - pct}`;
                    const offset = -cumulative;
                    cumulative += pct;
                    return (
                        <circle
                            key={i}
                            cx="21"
                            cy="21"
                            r="15.915494309189533"
                            fill="transparent"
                            stroke={slice.color}
                            strokeWidth="6"
                            strokeDasharray={dasharray}
                            strokeDashoffset={offset}
                        />
                    );
                })}
            </svg>
            {centerText && <div className={styles.chartCenterText}>{centerText}</div>}
        </div>
    );
};

// ─── Bar Chart ────────
const BarChart = ({ data, color = '#A29BFE' }) => {
    const [hovered, setHovered] = useState(null);
    if (!data || data.length === 0) return <div className={styles.emptyChart}>No data</div>;
    const maxVal = Math.max(...data.map(d => d.value), 1);
    return (
        <div className={styles.barChartWrapper}>
            {data.map((d, i) => (
                <div
                    key={i}
                    className={styles.barGroup}
                    onMouseEnter={() => setHovered(i)}
                    onMouseLeave={() => setHovered(null)}
                >
                    {hovered === i && (
                        <div className={styles.barTooltip}>
                            <strong>{d.label}</strong><br />
                            {d.value.toLocaleString()} views
                        </div>
                    )}
                    <div className={styles.barTrack}>
                        <div
                            className={styles.barFill}
                            style={{
                                height: `${Math.max((d.value / maxVal) * 100, 2)}%`,
                                background: hovered === i
                                    ? `linear-gradient(180deg, #6C5CE7, ${color})`
                                    : `linear-gradient(180deg, ${color}99, ${color})`,
                            }}
                        />
                    </div>
                    <span className={styles.barLabel}>{d.label}</span>
                </div>
            ))}
        </div>
    );
};

// ─── Line / Area Chart ───────────────────────────────────────────────────────
const TimelineChart = ({ data }) => {
    if (!data || data.length < 2) return (
        <div className={styles.emptyChart}>Not enough data for timeline</div>
    );
    const maxVal = Math.max(...data.map(d => d.value), 1);
    const W = 600, H = 220, padX = 36, padY = 20;
    const getX = i => padX + (i / (data.length - 1)) * (W - padX * 2);
    const getY = val => H - padY - ((val / maxVal) * (H - padY * 2));
    const points = data.map((d, i) => `${getX(i)},${getY(d.value)}`).join(' ');
    const area = `${getX(0)},${H - padY} ${points} ${getX(data.length - 1)},${H - padY}`;
    const yTicks = [0, 0.25, 0.5, 0.75, 1].map(p => Math.round(p * maxVal));

    return (
        <div className={styles.chartContainer}>
            <svg width="100%" height="100%" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none">
                <defs>
                    <linearGradient id="timelineGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#A29BFE" stopOpacity="0.35" />
                        <stop offset="100%" stopColor="#A29BFE" stopOpacity="0" />
                    </linearGradient>
                </defs>
                {yTicks.map(val => {
                    const y = getY(val);
                    return (
                        <g key={val}>
                            <text x="0" y={y + 4} fontSize="11" fill="#B2BEC3">{val.toLocaleString()}</text>
                            <line x1={padX} y1={y} x2={W} y2={y} stroke="#F1F2F6" strokeDasharray="4 4" />
                        </g>
                    );
                })}
                <polygon points={area} fill="url(#timelineGrad)" />
                <polyline points={points} fill="none" stroke="#A29BFE" strokeWidth="2.5" />
                {data.map((d, i) => (
                    <g key={i}>
                        <circle cx={getX(i)} cy={getY(d.value)} r="4" fill="#fff" stroke="#A29BFE" strokeWidth="2" />
                        <text x={getX(i)} y={H} fontSize="11" fill="#B2BEC3" textAnchor="middle">{d.label}</text>
                    </g>
                ))}
            </svg>
        </div>
    );
};

// ─── Helpers ─────────────────────────────────────────────────────────────────
const defaultColors = ['#88D6A4', '#A29BFE', '#74B9FF', '#FFA8D1', '#48DBFB', '#B2BEC3'];

const modeColorMap = {
    Free: '#88D6A4',
    Paid: '#FFA8D1',
    Online: '#48DBFB',
    Offline: '#A29BFE',
    ONLINE: '#48DBFB',
    OFFLINE: '#A29BFE',
    FREE: '#88D6A4',
    PAID: '#FFA8D1',
};

const processCategories = (categories) => {
    if (!categories || categories.length === 0) return [];
    const fixed = categories.map(c => ({
        ...c,
        label: typeof c.label === 'object' ? (c.label?.name || JSON.stringify(c.label)) : (c.label || 'Uncategorized'),
    }));
    const sorted = [...fixed].sort((a, b) => b.value - a.value);
    if (sorted.length <= 5) return sorted.map((c, i) => ({ ...c, color: c.color || defaultColors[i % defaultColors.length] }));
    const top4 = sorted.slice(0, 4).map((c, i) => ({ ...c, color: defaultColors[i] }));
    const others = sorted.slice(4).reduce((acc, cur) => ({
        label: 'Others',
        value: acc.value + cur.value,
        percentage: acc.percentage + (cur.percentage || 0),
        color: '#B2BEC3',
    }), { label: 'Others', value: 0, percentage: 0 });
    return [...top4, others];
};

const processModes = (modes) => {
    if (!modes || modes.length === 0) return [];
    return modes.map((m, i) => ({
        ...m,
        label: typeof m.label === 'object' ? (m.label?.name || String(m.label)) : (m.label || 'Unknown'),
        color: m.color || modeColorMap[m.label] || modeColorMap[String(m.label).toUpperCase()] || defaultColors[i % defaultColors.length],
    }));
};

// ─── Main Dashboard ───────────────────────────────────────────────────────────
export default function OrganizerAnalyticsDashboard({
    analyticsData,
    organizerName = 'Alex Johnson',
    avatarUrl = 'https://i.pravatar.cc/150?u=alex',
    onViewCategories,
    onViewEvents,
}) {
    const [activeTab, setActiveTab] = useState('overview');

    // Loading
    if (analyticsData === undefined) {
        return (
            <div className={styles.stateWrapper}>
                <div className={styles.spinner} />
                <p className={styles.stateText}>Loading Analytics…</p>
            </div>
        );
    }

    // Empty
    if (!analyticsData || Object.keys(analyticsData).length === 0) {
        return (
            <div className={styles.stateWrapper}>
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#B2BEC3" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 3h18v18H3z" /><line x1="3" y1="9" x2="21" y2="9" /><line x1="9" y1="21" x2="9" y2="9" />
                </svg>
                <p className={styles.stateText}>No analytics data available yet</p>
                <p className={styles.stateSubText}>Create and publish events to see your analytics here.</p>
            </div>
        );
    }

    const topCategories = processCategories(analyticsData.categories);
    const modes = processModes(analyticsData.modes || []);
    const stats = analyticsData.stats || null;
    const topEvents = analyticsData.topEvents || [];
    const timeline = analyticsData.followersTimeline || [];

    // Bar chart data from top events (view counts)
    const barData = topEvents.map(e => ({
        label: e.name?.length > 10 ? e.name.slice(0, 10) + '…' : e.name,
        value: e.value || 0,
    }));

    const totalCatPct = topCategories[0]?.percentage || 0;
    const totalModePct = modes[0]?.percentage || 0;

    return (
        <div className={styles.dashboard}>
            {/* ── Header ── */}
            <header className={styles.header}>
                <div className={styles.profileSection}>
                    <img src={avatarUrl} alt={organizerName} className={styles.avatar} onError={e => { e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(organizerName)}&background=A29BFE&color=fff`; }} />
                    <div>
                        <h1 className={styles.organizerName}>{organizerName}</h1>
                        <span className={styles.organizerBadge}>Organizer</span>
                    </div>
                </div>
                <div className={styles.headerRight}>
                    <div className={styles.tabGroup}>
                        {['overview', 'events', 'timeline'].map(tab => (
                            <button
                                key={tab}
                                className={`${styles.tabBtn} ${activeTab === tab ? styles.tabBtnActive : ''}`}
                                onClick={() => setActiveTab(tab)}
                            >
                                {tab.charAt(0).toUpperCase() + tab.slice(1)}
                            </button>
                        ))}
                    </div>
                </div>
            </header>

            {/* ── Overview Tab ── */}
            {activeTab === 'overview' && (
                <>
                    {/* Stats Grid */}
                    {stats && (
                        <div className={styles.statsGrid}>
                            <StatCard
                                icon={<LayersIcon />}
                                iconClass={styles.iconBlue}
                                value={stats.events?.value ?? 0}
                                growth={stats.events?.growth}
                                label="Total Events"
                            />
                            <StatCard
                                icon={<UserIcon />}
                                iconClass={styles.iconPurple}
                                value={stats.followers?.value ?? 0}
                                growth={stats.followers?.growth}
                                label="Total Followers"
                            />
                            <StatCard
                                icon={<HeartIcon />}
                                iconClass={styles.iconPink}
                                value={stats.likes?.value ?? 0}
                                growth={stats.likes?.growth}
                                label="Total Likes"
                            />
                            <StatCard
                                icon={<ShareIcon />}
                                iconClass={styles.iconTeal}
                                value={stats.shares?.value ?? 0}
                                growth={stats.shares?.growth}
                                label={stats.shares?.label || "Total Shares"}
                            />
                        </div>
                    )}

                    {/* Donut Charts Row */}
                    <div className={styles.gridTop}>
                        {/* Category Distribution */}
                        <div className={styles.card}>
                            <h2 className={styles.cardTitle}>Events by Category</h2>
                            <div className={styles.donutContainer}>
                                <div className={styles.legendList}>
                                    {topCategories.map((item, i) => (
                                        <div key={i} className={styles.legendItem}>
                                            <div className={styles.legendDot} style={{ backgroundColor: item.color }} />
                                            <span className={styles.legendLabel}>{item.label}</span>
                                            <span className={styles.legendValue}>{item.value} Events</span>
                                            <span className={styles.legendPercent}>{item.percentage}%</span>
                                        </div>
                                    ))}
                                </div>
                                <DonutChart
                                    data={topCategories}
                                    centerText={topCategories.length > 0 ? `${totalCatPct}%` : '0%'}
                                />
                            </div>
                            <button
                                className={styles.outlineBtn}
                                onClick={() => {
                                    if (onViewCategories) onViewCategories();
                                    else setActiveTab('events');
                                }}
                            >
                                View All Categories →
                            </button>
                        </div>

                        {/* Mode Distribution */}
                        <div className={styles.card}>
                            <h2 className={styles.cardTitle}>Event Mode Distribution</h2>
                            <div className={styles.donutContainer}>
                                <div className={styles.legendList}>
                                    {modes.map((item, i) => (
                                        <div key={i} className={styles.legendItem}>
                                            <div className={styles.legendDot} style={{ backgroundColor: item.color }} />
                                            <span className={styles.legendLabel}>{item.label}</span>
                                            <span className={styles.legendValue}>{item.value} Events</span>
                                            <span className={styles.legendPercent}>{item.percentage}%</span>
                                        </div>
                                    ))}
                                </div>
                                <DonutChart
                                    data={modes}
                                    centerText={modes.length > 0 ? `${totalModePct}%` : '0%'}
                                />
                            </div>
                        </div>
                    </div>
                </>
            )}

            {/* ── Events Tab ── */}
            {activeTab === 'events' && (
                <div className={styles.gridTop} style={{ gridTemplateColumns: '1fr 1fr' }}>
                    {/* Top Events List */}
                    <div className={styles.card}>
                        <h2 className={styles.cardTitle}>Top Events by Views</h2>
                        {topEvents.length === 0 ? (
                            <p className={styles.stateSubText}>No events found.</p>
                        ) : (
                            <div className={styles.eventsList}>
                                {topEvents.map((event, i) => (
                                    <div key={i} className={styles.eventItem}>
                                        <span className={styles.eventRank}>{event.rank || i + 1}</span>
                                        <span className={styles.eventName} title={event.name}>{event.name}</span>
                                        <div className={styles.progressWrapper}>
                                            <div
                                                className={styles.progressFill}
                                                style={{
                                                    width: `${event.max > 0 ? Math.round((event.value / event.max) * 100) : 0}%`,
                                                    backgroundColor: '#A29BFE',
                                                }}
                                            />
                                        </div>
                                        <span className={styles.eventValue}>{event.value.toLocaleString()}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                        <button
                            className={styles.outlineBtn}
                            onClick={() => { if (onViewEvents) onViewEvents(); }}
                        >
                            View All Events →
                        </button>
                    </div>

                    {/* Bar Chart */}
                    <div className={styles.card}>
                        <h2 className={styles.cardTitle}>Views per Event</h2>
                        <BarChart data={barData} />
                    </div>
                </div>
            )}

            {/* ── Timeline Tab ── */}
            {activeTab === 'timeline' && (
                <div className={styles.card} style={{ marginTop: 0 }}>
                    <div className={styles.timelineHeader}>
                        <h2 className={styles.cardTitle} style={{ marginBottom: 0 }}>Followers / Views Over Time</h2>
                        <select className={styles.dateSelect}>
                            <option>Last 7 Days</option>
                            <option>Last 30 Days</option>
                        </select>
                    </div>
                    <TimelineChart data={timeline} />
                    <div className={styles.timelineLegend}>
                        <div className={styles.legendItem}>
                            <div className={styles.legendDot} style={{ backgroundColor: '#A29BFE' }} />
                            <span className={styles.legendLabel} style={{ fontSize: 12 }}>Cumulative Views</span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

// ─── Mini Stat Card ───────────────────────────────────────────────────────────
function StatCard({ icon, iconClass, value, growth, label }) {
    return (
        <div className={styles.statCard}>
            <div className={`${styles.statIcon} ${iconClass}`}>{icon}</div>
            <div className={styles.statContent}>
                <div className={styles.statHeader}>
                    <span className={styles.statValue}>{(value ?? 0).toLocaleString()}</span>
                    {growth ? <span className={styles.statGrowth}>{growth}</span> : null}
                </div>
                <div className={styles.statLabel}>{label}</div>
            </div>
        </div>
    );
}

// ─── Icons ────────────────────────────────────────────────────────────────────
const LayersIcon = () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 2 7 12 12 22 7 12 2" /><polyline points="2 17 12 22 22 17" /><polyline points="2 12 12 17 22 12" />
    </svg>
);
const UserIcon = () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
    </svg>
);
const HeartIcon = () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
);
const ShareIcon = () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" />
        <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" /><line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
    </svg>
);