"use client";

import { useState, useRef, useCallback, useEffect } from "react";

interface RoadmapItemData {
    _id: string;
    title: string;
    description: string;
    startDate: string;
    endDate: string;
    status: "planned" | "in-progress" | "completed" | "on-hold";
    progress: number;
    color: string | null;
    initiative: { _id: string; title: string } | null;
}

const statusColors: Record<string, string> = {
    completed: "#62F6B5",
    "in-progress": "#F5B232",
    planned: "#A855F7",
    "on-hold": "#8C8B87",
};

const statusLabels: Record<string, string> = {
    completed: "Completed",
    "in-progress": "In Progress",
    planned: "Planned",
    "on-hold": "On Hold",
};

const statusBadge: Record<string, string> = {
    completed: "status-completed",
    "in-progress": "status-in-progress",
    planned: "status-planned",
    "on-hold": "status-on-hold",
};

function toDate(s: string) {
    return new Date(s + "T00:00:00");
}

function formatFullDate(s: string) {
    return toDate(s).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function diffDays(a: string, b: string) {
    return Math.max(1, Math.round((toDate(b).getTime() - toDate(a).getTime()) / 86_400_000));
}

const TOOLTIP_TIMEOUT = 3000; // ms before auto-hide

export default function GanttBar({ item, timelineStart, totalDays }: {
    item: RoadmapItemData;
    timelineStart: string;
    totalDays: number;
}) {
    const [mouse, setMouse] = useState({ x: 0, y: 0 });
    const [hovered, setHovered] = useState(false);
    const [visible, setVisible] = useState(false);
    const rowRef = useRef<HTMLDivElement>(null);
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const resetTimer = useCallback(() => {
        setVisible(true);
        if (timerRef.current) clearTimeout(timerRef.current);
        timerRef.current = setTimeout(() => setVisible(false), TOOLTIP_TIMEOUT);
    }, []);

    // Clean up timer on unmount
    useEffect(() => {
        return () => {
            if (timerRef.current) clearTimeout(timerRef.current);
        };
    }, []);

    const offsetDays = diffDays(timelineStart, item.startDate);
    const durationDays = diffDays(item.startDate, item.endDate);
    const leftPct = (offsetDays / totalDays) * 100;
    const widthPct = (durationDays / totalDays) * 100;

    let customColor: string | null = null;
    if (item.color && item.color.trim().length > 0) {
        const c = item.color.trim();
        customColor = c.startsWith("#") ? c : `#${c}`;
    }
    const barColor = customColor || statusColors[item.status] || statusColors.planned;
    const progress = item.progress || 0;

    const clampedLeft = Math.max(0, leftPct);
    const clampedWidth = Math.max(0, Math.min(widthPct, 100 - clampedLeft));

    function handleMouseMove(e: React.MouseEvent) {
        if (!rowRef.current) return;
        const rect = rowRef.current.getBoundingClientRect();
        setMouse({ x: e.clientX - rect.left, y: e.clientY - rect.top });
        resetTimer();
    }

    function handleMouseEnter() {
        setHovered(true);
        resetTimer();
    }

    function handleMouseLeave() {
        setHovered(false);
        setVisible(false);
        if (timerRef.current) clearTimeout(timerRef.current);
    }

    const showTooltip = hovered && visible;

    return (
        <div
            ref={rowRef}
            className="relative flex items-center h-14 border-b border-white/[0.03]"
        >
            {/* Bar — tooltip only triggers on this element */}
            <div className="absolute inset-0">
                <div
                    className="absolute top-2.5 h-9 rounded-md transition-all duration-300 overflow-hidden cursor-pointer"
                    style={{
                        left: `${clampedLeft}%`,
                        width: `${clampedWidth}%`,
                        minWidth: "60px",
                        background: barColor,
                        filter: hovered ? "brightness(1.2)" : undefined,
                        boxShadow: hovered ? "0 4px 20px rgba(0,0,0,0.3)" : undefined,
                    }}
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                    onMouseMove={handleMouseMove}
                >
                    {/* Progress overlay */}
                    {progress > 0 && progress < 100 && (
                        <div
                            className="absolute inset-y-0 left-0 pointer-events-none"
                            style={{ width: `${progress}%`, background: "rgba(0,0,0,0.2)" }}
                        />
                    )}
                    {progress > 0 && progress < 100 && (
                        <div
                            className="absolute inset-y-0 right-0 pointer-events-none"
                            style={{ width: `${100 - progress}%`, background: "rgba(0,0,0,0.35)" }}
                        />
                    )}

                    {/* Label */}
                    <div className="absolute inset-0 flex items-center px-3 overflow-hidden z-10 pointer-events-none">
                        <span className="text-[11px] font-bold truncate text-[#0E0E13] drop-shadow-[0_1px_1px_rgba(255,255,255,0.15)]">
                            {item.title}
                        </span>
                    </div>
                </div>
            </div>

            {/* Tooltip — only on bar hover, with fade-in */}
            <div
                className="pointer-events-none absolute z-50 rounded-lg border border-white/[0.08] bg-[#1a1b24] p-3 shadow-2xl whitespace-nowrap transition-opacity duration-200"
                style={{
                    left: `${mouse.x + 12}px`,
                    top: `${mouse.y - 10}px`,
                    transform: "translateY(-100%)",
                    opacity: showTooltip ? 1 : 0,
                }}
            >
                <div className="text-[13px] font-semibold mb-1" style={{ color: "rgb(255, 250, 234)" }}>
                    {item.title}
                </div>
                {item.initiative && (
                    <div className="text-[10px] font-[family-name:var(--font-geist-mono)] mb-1.5" style={{ color: "rgb(140, 139, 135)" }}>
                        {item.initiative.title}
                    </div>
                )}
                <div className="text-[10px] font-[family-name:var(--font-geist-mono)]" style={{ color: "rgb(90, 89, 85)" }}>
                    {formatFullDate(item.startDate)} → {formatFullDate(item.endDate)}
                </div>
                <div className="flex items-center gap-2 mt-1.5">
                    <span className={`rounded-full px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider font-[family-name:var(--font-geist-mono)] ${statusBadge[item.status] || ""}`}>
                        {statusLabels[item.status] || item.status}
                    </span>
                    {progress > 0 && (
                        <span className="text-[10px] font-[family-name:var(--font-geist-mono)]" style={{ color: barColor }}>
                            {progress}%
                        </span>
                    )}
                </div>
                {item.description && (
                    <p className="mt-1.5 text-[11px] max-w-[260px] whitespace-normal leading-relaxed" style={{ color: "rgb(140, 139, 135)" }}>
                        {item.description}
                    </p>
                )}
            </div>
        </div>
    );
}
