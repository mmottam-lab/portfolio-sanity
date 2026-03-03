import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { getCases } from "@/sanity/queries";
import { urlFor } from "@/sanity/image";

export const metadata: Metadata = {
    title: "Cases",
    description: "Case studies showcasing AI implementation results at CENTRO.",
};

export const revalidate = 0;

export default async function CasesPage() {
    let cases: Awaited<ReturnType<typeof getCases>> = [];

    try {
        cases = await getCases();
    } catch {
        // Sanity not configured
    }

    return (
        <section className="mx-auto max-w-7xl px-6 py-24 grid-bg min-h-screen">
            <div className="mb-16">
                <span className="mono-label mb-3 block">Cases</span>
                <h1 className="text-4xl font-light tracking-tight sm:text-5xl" style={{ color: "rgb(255, 250, 234)" }}>
                    Case Studies
                </h1>
                <p className="mt-4 text-[15px] max-w-2xl leading-relaxed" style={{ color: "rgb(140, 139, 135)" }}>
                    Real-world results from AI implementations across CENTRO. Metrics, outcomes, and lessons learned.
                </p>
            </div>

            {cases.length > 0 ? (
                <div className="space-y-6">
                    {cases.map((c) => (
                        <Link
                            key={c._id}
                            href={`/cases/${c.slug.current}`}
                            className="group centro-card flex flex-col md:flex-row gap-6 p-6"
                        >
                            {/* Image */}
                            <div className="relative w-full md:w-72 aspect-video md:aspect-[4/3] shrink-0 overflow-hidden rounded-xl bg-gradient-to-br from-[rgb(98,246,181)]/5 to-transparent">
                                {c.mainImage ? (
                                    <Image
                                        src={urlFor(c.mainImage).width(400).height(300).url()}
                                        alt={c.title}
                                        fill
                                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                                    />
                                ) : (
                                    <div className="flex h-full items-center justify-center">
                                        <span className="text-2xl">📄</span>
                                    </div>
                                )}
                            </div>

                            {/* Content */}
                            <div className="flex flex-col flex-1 justify-center">
                                {c.initiative && (
                                    <span className="mono-label mb-2">
                                        {c.initiative.title}
                                    </span>
                                )}
                                <h3 className="text-xl font-semibold group-hover:text-[rgb(98,246,181)] transition-colors" style={{ color: "rgb(255, 250, 234)" }}>
                                    {c.title}
                                </h3>
                                {c.description && (
                                    <p className="mt-2 text-[14px] line-clamp-2 leading-relaxed" style={{ color: "rgb(140, 139, 135)" }}>
                                        {c.description}
                                    </p>
                                )}

                                {/* Metrics */}
                                {c.metrics && c.metrics.length > 0 && (
                                    <div className="mt-4 flex flex-wrap gap-6">
                                        {c.metrics.slice(0, 3).map((m, i) => (
                                            <div key={i}>
                                                <div className="text-xl font-bold" style={{ color: "rgb(98, 246, 181)" }}>{m.value}</div>
                                                <div className="text-[10px] uppercase tracking-wider font-medium font-[family-name:var(--font-geist-mono)]" style={{ color: "rgb(90, 89, 85)" }}>{m.label}</div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </Link>
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/[0.06] py-24 bg-white/[0.01]">
                    <div className="h-14 w-14 rounded-full bg-[rgb(98,246,181)]/10 flex items-center justify-center mb-4">
                        <span className="text-xl">📊</span>
                    </div>
                    <p className="text-[13px]" style={{ color: "rgb(140, 139, 135)" }}>
                        No case studies yet. Add from{" "}
                        <Link href="/studio" className="text-[rgb(98,246,181)] hover:underline">Studio</Link>
                    </p>
                </div>
            )}
        </section>
    );
}
