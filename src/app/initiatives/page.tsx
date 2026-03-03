import type { Metadata } from "next";
import { getInitiatives } from "@/sanity/queries";
import InitiativeCard from "@/components/ProjectCard";
import Link from "next/link";

export const metadata: Metadata = {
    title: "Initiatives",
    description: "AI initiatives at CENTRO — explore all active, planned, and completed projects.",
};

export const revalidate = 0;

export default async function InitiativesPage() {
    let initiatives: Awaited<ReturnType<typeof getInitiatives>> = [];

    try {
        initiatives = await getInitiatives();
    } catch {
        // Sanity not configured
    }

    const active = initiatives.filter((i) => i.status === "active");
    const completed = initiatives.filter((i) => i.status === "completed");
    const planned = initiatives.filter((i) => i.status === "planned");

    const sections = [
        { items: active, label: "Active", dot: "bg-[rgb(98,246,181)]" },
        { items: planned, label: "Planned", dot: "bg-[#a855f7]" },
        { items: completed, label: "Completed", dot: "bg-[rgb(120,160,255)]" },
    ];

    return (
        <section className="mx-auto max-w-7xl px-6 py-24 grid-bg min-h-screen">
            {/* Header */}
            <div className="mb-16">
                <span className="mono-label mb-3 block">Initiatives</span>
                <h1 className="text-4xl font-light tracking-tight sm:text-5xl" style={{ color: "rgb(255, 250, 234)" }}>
                    AI Initiatives
                </h1>
                <p className="mt-4 text-[15px] max-w-2xl leading-relaxed" style={{ color: "rgb(140, 139, 135)" }}>
                    All AI-powered projects at CENTRO. From research and development to full deployment across the educational ecosystem.
                </p>
            </div>

            {sections.map(({ items, label, dot }) =>
                items.length > 0 ? (
                    <div key={label} className="mb-16">
                        <div className="flex items-center gap-2 mb-6">
                            <span className={`h-2 w-2 rounded-full ${dot}`} />
                            <h2 className="text-lg font-semibold" style={{ color: "rgb(255, 250, 234)" }}>{label}</h2>
                            <span className="text-[12px] font-[family-name:var(--font-geist-mono)] ml-1" style={{ color: "rgb(90, 89, 85)" }}>
                                ({items.length})
                            </span>
                        </div>
                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            {items.map((i) => <InitiativeCard key={i._id} initiative={i} />)}
                        </div>
                    </div>
                ) : null
            )}

            {/* Empty state */}
            {initiatives.length === 0 && (
                <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/[0.06] py-24 bg-white/[0.01]">
                    <div className="h-14 w-14 rounded-full bg-[rgb(98,246,181)]/10 flex items-center justify-center mb-4">
                        <svg className="w-6 h-6 text-[rgb(98,246,181)]/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                    </div>
                    <p className="text-[13px]" style={{ color: "rgb(140, 139, 135)" }}>
                        No initiatives yet. Add from{" "}
                        <Link href="/studio" className="text-[rgb(98,246,181)] hover:underline">Studio</Link>
                    </p>
                </div>
            )}
        </section>
    );
}
