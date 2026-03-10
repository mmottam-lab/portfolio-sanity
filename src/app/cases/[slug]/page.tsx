import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getCase, getCases } from "@/sanity/queries";
import { urlFor } from "@/sanity/image";
import { sanityConfig } from "@/sanity/config";
import PortableText from "@/components/PortableTextComponents";

// Build a URL for a Sanity file asset from its _ref
function fileUrl(ref: string): string {
    const [, id, ext] = ref.split("-");
    return `https://cdn.sanity.io/files/${sanityConfig.projectId}/${sanityConfig.dataset}/${id}.${ext}`;
}

// Convert a YouTube/Vimeo URL to an embeddable URL
function getEmbedUrl(url: string): string | null {
    const ytMatch = url.match(
        /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
    );
    if (ytMatch) return `https://www.youtube.com/embed/${ytMatch[1]}`;
    const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
    if (vimeoMatch) return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
    return null;
}

interface Props {
    params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    try {
        const item = await getCase(slug);
        if (!item) return { title: "Not Found" };
        return { title: item.title, description: item.description };
    } catch {
        return { title: "Case Study" };
    }
}

export async function generateStaticParams() {
    try {
        const items = await getCases();
        return items.map((c) => ({ slug: c.slug.current }));
    } catch {
        return [];
    }
}

export const revalidate = 0;

export default async function CaseDetailPage({ params }: Props) {
    const { slug } = await params;
    let caseStudy;
    try {
        caseStudy = await getCase(slug);
    } catch {
        notFound();
    }
    if (!caseStudy) notFound();

    return (
        <article className="mx-auto max-w-4xl px-6 py-24">
            <Link
                href="/cases"
                className="mb-10 inline-flex items-center gap-2 text-[12px] font-medium tracking-wider uppercase font-[family-name:var(--font-geist-mono)] transition-colors group hover:text-[rgb(98,246,181)]"
                style={{ color: "rgb(140, 139, 135)" }}
            >
                <svg className="w-4 h-4 transition-transform group-hover:-translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
                </svg>
                Back to Cases
            </Link>

            <header className="mb-12">
                {caseStudy.initiative && (
                    <Link
                        href={`/initiatives/${caseStudy.initiative.slug.current}`}
                        className="mono-label mb-3 inline-block hover:underline"
                    >
                        {caseStudy.initiative.title}
                    </Link>
                )}

                <h1 className="text-4xl font-light tracking-tight sm:text-5xl" style={{ color: "rgb(255, 250, 234)" }}>
                    {caseStudy.title}
                </h1>

                {caseStudy.description && (
                    <p className="mt-4 text-lg leading-relaxed max-w-2xl" style={{ color: "rgb(140, 139, 135)" }}>
                        {caseStudy.description}
                    </p>
                )}

                {/* Metrics */}
                {caseStudy.metrics?.length > 0 && (
                    <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-px rounded-2xl border border-white/[0.04] bg-white/[0.04] overflow-hidden">
                        {caseStudy.metrics.map((m, i) => (
                            <div key={i} className="bg-[#0E0E13] p-6 text-center">
                                <div className="text-2xl font-bold" style={{ color: "rgb(98, 246, 181)" }}>{m.value}</div>
                                <div className="mt-1 text-[10px] uppercase tracking-wider font-medium font-[family-name:var(--font-geist-mono)]" style={{ color: "rgb(90, 89, 85)" }}>{m.label}</div>
                            </div>
                        ))}
                    </div>
                )}
            </header>

            {caseStudy.mainImage && (
                <div className="relative mb-12 aspect-video overflow-hidden rounded-2xl border border-white/[0.04]">
                    <Image
                        src={urlFor(caseStudy.mainImage).width(1200).height(680).url()}
                        alt={caseStudy.title}
                        fill
                        className="object-cover"
                        priority
                    />
                </div>
            )}

            {/* Featured Video */}
            {caseStudy.video?.asset?._ref && (
                <div className="mb-12 overflow-hidden rounded-2xl border border-white/[0.04]">
                    <video
                        src={fileUrl(caseStudy.video.asset._ref)}
                        controls
                        playsInline
                        preload="metadata"
                        className="w-full"
                        style={{ maxHeight: "680px" }}
                    />
                </div>
            )}
            {!caseStudy.video?.asset?._ref && caseStudy.videoUrl && (() => {
                const embedUrl = getEmbedUrl(caseStudy.videoUrl);
                if (!embedUrl) return null;
                return (
                    <div className="relative mb-12 aspect-video overflow-hidden rounded-2xl border border-white/[0.04]">
                        <iframe
                            src={embedUrl}
                            title={caseStudy.title}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            className="absolute inset-0 h-full w-full"
                            style={{ border: "none" }}
                        />
                    </div>
                );
            })()}

            {caseStudy.body && <PortableText value={caseStudy.body} />}

            {caseStudy.results && (
                <div className="mt-12 rounded-2xl border border-[rgb(98,246,181)]/20 bg-[rgb(98,246,181)]/[0.04] p-6">
                    <h3 className="mono-label mb-3">Results</h3>
                    <p className="text-[14px] leading-relaxed" style={{ color: "rgb(216, 215, 212)" }}>{caseStudy.results}</p>
                </div>
            )}
        </article>
    );
}
