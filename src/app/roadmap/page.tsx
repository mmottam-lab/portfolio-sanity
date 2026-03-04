import type { Metadata } from "next";
import Link from "next/link";
import { getRoadmap } from "@/sanity/queries";
import type { RoadmapItem } from "@/sanity/queries";
import GanttBar from "@/components/GanttBar";

export const metadata: Metadata = {
    title: "Roadmap",
    description: "Gantt chart of AI projects at CENTRO.",
};

export const revalidate = 0;

/* ─── Helpers (server-side only) ─────────────────────────────── */

const statusColors: Record<string, string> = {
    completed: "#62F6B5",
    "in-progress": "#F5B232",
    planned: "#A855F7",
    "on-hold": "#8C8B87",
};

function toDate(s: string) {
    return new Date(s + "T00:00:00");
}

function diffDays(a: string, b: string) {
    return Math.max(1, Math.round((toDate(b).getTime() - toDate(a).getTime()) / 86_400_000));
}

function getMonthsBetween(start: Date, end: Date) {
    const months: { label: string; start: Date; end: Date }[] = [];
    const cur = new Date(start.getFullYear(), start.getMonth(), 1);
    while (cur <= end) {
        const monthEnd = new Date(cur.getFullYear(), cur.getMonth() + 1, 0);
        months.push({
            label: cur.toLocaleDateString("en-US", { month: "short", year: "2-digit" }),
            start: new Date(cur),
            end: monthEnd,
        });
        cur.setMonth(cur.getMonth() + 1);
    }
    return months;
}

/* ─── Main Page ─────────────────────────────────────────────────── */

export default async function RoadmapPage() {
    let items: RoadmapItem[] = [];

    try {
        items = await getRoadmap();
    } catch {
        // Sanity not configured
    }

    // Compute timeline bounds
    const allDates = items.flatMap((i) => [i.startDate, i.endDate]).filter(Boolean);
    const earliestDate = allDates.length > 0 ? allDates.sort()[0] : new Date().toISOString().slice(0, 10);
    const latestDate = allDates.length > 0 ? allDates.sort().pop()! : new Date().toISOString().slice(0, 10);

    // Add some padding
    const padStart = new Date(toDate(earliestDate));
    padStart.setDate(padStart.getDate() - 15);
    const padEnd = new Date(toDate(latestDate));
    padEnd.setDate(padEnd.getDate() + 15);

    const timelineStart = padStart.toISOString().slice(0, 10);
    const timelineEnd = padEnd.toISOString().slice(0, 10);
    const totalDays = diffDays(timelineStart, timelineEnd);
    const months = getMonthsBetween(padStart, padEnd);

    // Today marker
    const today = new Date().toISOString().slice(0, 10);
    const todayPct = (diffDays(timelineStart, today) / totalDays) * 100;

    // Legend items
    const legendItems = [
        { label: "Completed", color: statusColors.completed },
        { label: "In Progress", color: statusColors["in-progress"] },
        { label: "Planned", color: statusColors.planned },
        { label: "On Hold", color: statusColors["on-hold"] },
    ];

    return (
        <section className="mx-auto max-w-7xl px-6 py-24 min-h-screen">
            {/* Header */}
            <div className="mb-12">
                <span className="mono-label mb-3 block">Timeline</span>
                <h1 className="text-4xl font-light tracking-tight sm:text-5xl" style={{ color: "rgb(255, 250, 234)" }}>
                    Roadmap
                </h1>
                <p className="mt-4 text-[15px] max-w-2xl leading-relaxed" style={{ color: "rgb(140, 139, 135)" }}>
                    Gantt chart overview of AI projects at CENTRO — track progress, timelines, and milestones.
                </p>

                {/* Legend */}
                <div className="mt-6 flex flex-wrap gap-4">
                    {legendItems.map((l) => (
                        <div key={l.label} className="flex items-center gap-1.5">
                            <span className="h-2.5 w-2.5 rounded-sm" style={{ background: l.color }} />
                            <span className="text-[11px] font-[family-name:var(--font-geist-mono)]" style={{ color: "rgb(140, 139, 135)" }}>
                                {l.label}
                            </span>
                        </div>
                    ))}
                    <div className="flex items-center gap-1.5 ml-4">
                        <span className="h-4 w-px bg-red-400/60" />
                        <span className="text-[11px] font-[family-name:var(--font-geist-mono)]" style={{ color: "rgb(140, 139, 135)" }}>
                            Today
                        </span>
                    </div>
                </div>
            </div>

            {items.length > 0 ? (
                <div className="centro-card overflow-hidden">
                    {/* Scrollable container */}
                    <div className="overflow-x-auto">
                        <div style={{ minWidth: `${Math.max(800, months.length * 120)}px` }}>

                            {/* Month headers */}
                            <div className="flex border-b border-white/[0.06] bg-white/[0.02] sticky top-0 z-10">
                                {/* Label column */}
                                <div className="shrink-0 w-56 border-r border-white/[0.06] px-4 py-3 flex items-center">
                                    <span className="text-[11px] font-semibold uppercase tracking-wider font-[family-name:var(--font-geist-mono)]" style={{ color: "rgb(90, 89, 85)" }}>
                                        Project
                                    </span>
                                </div>

                                {/* Month columns */}
                                <div className="flex-1 relative flex">
                                    {months.map((m, i) => {
                                        const mStartMs = Math.max(m.start.getTime(), padStart.getTime());
                                        const mEndMs = Math.min(m.end.getTime(), padEnd.getTime());
                                        const widthPct = ((mEndMs - mStartMs) / (padEnd.getTime() - padStart.getTime())) * 100;
                                        return (
                                            <div
                                                key={i}
                                                className="border-r border-white/[0.04] px-3 py-3 text-center"
                                                style={{ width: `${widthPct}%` }}
                                            >
                                                <span className="text-[10px] font-medium font-[family-name:var(--font-geist-mono)] uppercase tracking-wider" style={{ color: "rgb(90, 89, 85)" }}>
                                                    {m.label}
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Rows — grouped by category */}
                            {(() => {
                                // Group items by category
                                const groups: Record<string, RoadmapItem[]> = {};
                                for (const item of items) {
                                    const cat = item.category || "Uncategorized";
                                    if (!groups[cat]) groups[cat] = [];
                                    groups[cat].push(item);
                                }
                                const categoryOrder = ["Workshops", "Platforms", "Research", "Infrastructure", "Other", "Uncategorized"];
                                const sortedCategories = Object.keys(groups).sort(
                                    (a, b) => (categoryOrder.indexOf(a) === -1 ? 99 : categoryOrder.indexOf(a)) - (categoryOrder.indexOf(b) === -1 ? 99 : categoryOrder.indexOf(b))
                                );

                                return sortedCategories.map((cat) => (
                                    <div key={cat}>
                                        {/* Category header */}
                                        <div className="flex border-b border-white/[0.06] bg-white/[0.03]">
                                            <div className="shrink-0 w-56 border-r border-white/[0.06] px-4 py-2 flex items-center gap-2">
                                                <span className="h-2 w-2 rounded-full" style={{ background: "rgb(98, 246, 181)" }} />
                                                <span className="text-[11px] font-bold uppercase tracking-wider" style={{ color: "rgb(216, 215, 212)" }}>
                                                    {cat}
                                                </span>
                                                <span className="text-[9px] font-[family-name:var(--font-geist-mono)] ml-1" style={{ color: "rgb(90, 89, 85)" }}>
                                                    ({groups[cat].length})
                                                </span>
                                            </div>
                                            <div className="flex-1 relative">
                                                {/* Grid lines in header */}
                                                <div className="absolute inset-0 flex pointer-events-none">
                                                    {months.map((m, i) => {
                                                        const mStartMs = Math.max(m.start.getTime(), padStart.getTime());
                                                        const mEndMs = Math.min(m.end.getTime(), padEnd.getTime());
                                                        const widthPct = ((mEndMs - mStartMs) / (padEnd.getTime() - padStart.getTime())) * 100;
                                                        return (
                                                            <div
                                                                key={i}
                                                                className="border-r border-white/[0.04] h-full"
                                                                style={{ width: `${widthPct}%` }}
                                                            />
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Items in this category */}
                                        {groups[cat].map((item) => (
                                            <div key={item._id} className="flex">
                                                {/* Label */}
                                                <div className="shrink-0 w-56 border-r border-white/[0.06] px-4 flex items-center h-14 border-b border-white/[0.03]">
                                                    <div className="min-w-0 pl-3">
                                                        <div className="text-[12px] font-semibold truncate" style={{ color: "rgb(255, 250, 234)" }}>
                                                            {item.title}
                                                        </div>
                                                        {item.initiative && (
                                                            <div className="text-[9px] font-[family-name:var(--font-geist-mono)] truncate" style={{ color: "rgb(90, 89, 85)" }}>
                                                                {item.initiative.title}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Gantt area */}
                                                <div className="flex-1 relative">
                                                    {/* Month grid lines */}
                                                    <div className="absolute inset-0 flex pointer-events-none">
                                                        {months.map((m, i) => {
                                                            const mStartMs = Math.max(m.start.getTime(), padStart.getTime());
                                                            const mEndMs = Math.min(m.end.getTime(), padEnd.getTime());
                                                            const widthPct = ((mEndMs - mStartMs) / (padEnd.getTime() - padStart.getTime())) * 100;
                                                            return (
                                                                <div
                                                                    key={i}
                                                                    className="border-r border-white/[0.04] h-full"
                                                                    style={{ width: `${widthPct}%` }}
                                                                />
                                                            );
                                                        })}
                                                    </div>

                                                    {/* Today line */}
                                                    {todayPct >= 0 && todayPct <= 100 && (
                                                        <div
                                                            className="absolute top-0 bottom-0 w-px bg-red-400/40 z-10"
                                                            style={{ left: `${todayPct}%` }}
                                                        />
                                                    )}

                                                    <GanttBar
                                                        item={item}
                                                        timelineStart={timelineStart}
                                                        totalDays={totalDays}
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ));
                            })()}
                        </div>
                    </div>
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/[0.06] py-24 bg-white/[0.01]">
                    <div className="h-14 w-14 rounded-full bg-[rgb(98,246,181)]/10 flex items-center justify-center mb-4">
                        <span className="text-xl">📊</span>
                    </div>
                    <p className="text-[13px]" style={{ color: "rgb(140, 139, 135)" }}>
                        No roadmap items yet. Add from{" "}
                        <Link href="/studio" className="text-[rgb(98,246,181)] hover:underline">
                            Studio
                        </Link>
                    </p>
                </div>
            )}

            {/* Summary cards (below chart) */}
            {items.length > 0 && (
                <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {[
                        { label: "Total", count: items.length, color: "rgb(255, 250, 234)" },
                        { label: "In Progress", count: items.filter(i => i.status === "in-progress").length, color: statusColors["in-progress"] },
                        { label: "Completed", count: items.filter(i => i.status === "completed").length, color: statusColors.completed },
                        { label: "Planned", count: items.filter(i => i.status === "planned").length, color: statusColors.planned },
                    ].map((s) => (
                        <div key={s.label} className="centro-card p-4 text-center">
                            <div className="text-2xl font-light" style={{ color: s.color }}>{s.count}</div>
                            <div className="text-[10px] font-[family-name:var(--font-geist-mono)] uppercase tracking-wider mt-1" style={{ color: "rgb(90, 89, 85)" }}>
                                {s.label}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </section>
    );
}
