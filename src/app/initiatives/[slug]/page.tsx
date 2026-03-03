import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getInitiativeWithHierarchy, getInitiatives } from "@/sanity/queries";
import { urlFor } from "@/sanity/image";
import PortableText from "@/components/PortableTextComponents";
import type { Subcategory, Project } from "@/sanity/queries";

interface Props {
    params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    try {
        const { initiative } = await getInitiativeWithHierarchy(slug);
        if (!initiative) return { title: "Not Found" };
        return { title: initiative.title, description: initiative.description };
    } catch {
        return { title: "Initiative" };
    }
}

export async function generateStaticParams() {
    try {
        const items = await getInitiatives();
        return items.map((i) => ({ slug: i.slug.current }));
    } catch {
        return [];
    }
}

export const revalidate = 0;

const statusMap: Record<string, string> = {
    active: "status-active",
    completed: "status-completed",
    planned: "status-planned",
};

const statusLabels: Record<string, string> = {
    active: "Active",
    completed: "Completed",
    planned: "Planned",
};

const projectStatusColors: Record<string, string> = {
    active: "bg-[rgb(98,246,181)]",
    completed: "bg-[rgb(120,160,255)]",
    paused: "bg-amber-400",
    planned: "bg-[#a855f7]",
};

const projectStatusLabels: Record<string, string> = {
    active: "Activo",
    completed: "Completado",
    paused: "En pausa",
    planned: "Planeado",
};

/* ─── Project Card ──────────────────────────────────────────────── */
function ProjectItem({ project }: { project: Project }) {
    return (
        <div className="group/proj relative rounded-xl border border-white/[0.04] bg-white/[0.015] p-5 transition-all duration-300 hover:border-white/[0.08] hover:bg-white/[0.03]">
            {/* Status dot + label */}
            <div className="flex items-center gap-2 mb-3">
                <span className={`h-1.5 w-1.5 rounded-full ${projectStatusColors[project.status] || projectStatusColors.planned}`} />
                <span className="text-[10px] font-medium tracking-wider uppercase font-[family-name:var(--font-geist-mono)]" style={{ color: "rgb(140, 139, 135)" }}>
                    {projectStatusLabels[project.status] || project.status}
                </span>
            </div>

            {/* Image */}
            {project.mainImage && (
                <div className="relative mb-4 aspect-video overflow-hidden rounded-lg border border-white/[0.04]">
                    <Image
                        src={urlFor(project.mainImage).width(480).height(270).url()}
                        alt={project.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover/proj:scale-105"
                    />
                </div>
            )}

            {/* Title */}
            <h4 className="text-[15px] font-semibold tracking-tight" style={{ color: "rgb(255, 250, 234)" }}>
                {project.url ? (
                    <a href={project.url} target="_blank" rel="noopener noreferrer" className="hover:text-[rgb(98,246,181)] transition-colors inline-flex items-center gap-1.5">
                        {project.title}
                        <svg className="w-3.5 h-3.5 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                    </a>
                ) : (
                    project.title
                )}
            </h4>

            {/* Description */}
            {project.description && (
                <p className="mt-2 text-[13px] leading-relaxed" style={{ color: "rgb(140, 139, 135)" }}>
                    {project.description}
                </p>
            )}

            {/* Technologies */}
            {project.technologies && project.technologies.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1.5">
                    {project.technologies.map((tech) => (
                        <span
                            key={tech}
                            className="rounded-full bg-white/[0.04] border border-white/[0.06] px-2 py-0.5 text-[10px] font-medium tracking-wide font-[family-name:var(--font-geist-mono)]"
                            style={{ color: "rgb(110, 109, 105)" }}
                        >
                            {tech}
                        </span>
                    ))}
                </div>
            )}
        </div>
    );
}

/* ─── Subcategory Section ───────────────────────────────────────── */
function SubcategorySection({ subcategory }: { subcategory: Subcategory }) {
    return (
        <div className="mb-10">
            {/* Subcategory header */}
            <div className="flex items-center gap-3 mb-2">
                {subcategory.icon && (
                    <span className="text-xl">{subcategory.icon}</span>
                )}
                <h3 className="text-xl font-semibold tracking-tight" style={{ color: "rgb(255, 250, 234)" }}>
                    {subcategory.title}
                </h3>
                <span className="text-[11px] font-[family-name:var(--font-geist-mono)]" style={{ color: "rgb(90, 89, 85)" }}>
                    {subcategory.projects?.length || 0} {subcategory.projects?.length === 1 ? "proyecto" : "proyectos"}
                </span>
            </div>

            {/* Subcategory description */}
            {subcategory.description && (
                <p className="text-[14px] leading-relaxed mb-6 max-w-3xl pl-9" style={{ color: "rgb(140, 139, 135)" }}>
                    {subcategory.description}
                </p>
            )}

            {/* Projects */}
            {subcategory.projects && subcategory.projects.length > 0 ? (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 pl-9">
                    {subcategory.projects.map((project) => (
                        <ProjectItem key={project._id} project={project} />
                    ))}
                </div>
            ) : (
                <div className="rounded-lg border border-dashed border-white/[0.06] py-8 text-center bg-white/[0.01] ml-9">
                    <p className="text-[12px]" style={{ color: "rgb(90, 89, 85)" }}>
                        No hay proyectos aún en esta subcategoría.
                    </p>
                </div>
            )}
        </div>
    );
}

/* ─── Main Page ─────────────────────────────────────────────────── */
export default async function InitiativeDetailPage({ params }: Props) {
    const { slug } = await params;
    let initiative;
    let subcategories: Subcategory[] = [];

    try {
        const result = await getInitiativeWithHierarchy(slug);
        initiative = result.initiative;
        subcategories = result.subcategories;
    } catch {
        notFound();
    }
    if (!initiative) notFound();

    return (
        <article className="mx-auto max-w-5xl px-6 py-24">
            {/* Back */}
            <Link
                href="/initiatives"
                className="mb-10 inline-flex items-center gap-2 text-[12px] font-medium tracking-wider uppercase font-[family-name:var(--font-geist-mono)] transition-colors group hover:text-[rgb(98,246,181)]"
                style={{ color: "rgb(140, 139, 135)" }}
            >
                <svg className="w-4 h-4 transition-transform group-hover:-translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
                </svg>
                Back to Initiatives
            </Link>

            {/* Header */}
            <header className="mb-12">
                <div className="flex items-center gap-3 mb-4">
                    {initiative.status && (
                        <span className={`rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-wider font-[family-name:var(--font-geist-mono)] ${statusMap[initiative.status] || ""}`}>
                            {statusLabels[initiative.status] || initiative.status}
                        </span>
                    )}
                    {initiative.category && (
                        <span className="text-[11px] font-medium uppercase tracking-wider font-[family-name:var(--font-geist-mono)]" style={{ color: "rgb(140, 139, 135)" }}>
                            {initiative.category.title}
                        </span>
                    )}
                </div>

                <h1 className="text-4xl font-light tracking-tight sm:text-5xl" style={{ color: "rgb(255, 250, 234)" }}>
                    {initiative.title}
                </h1>

                {initiative.description && (
                    <p className="mt-4 text-lg leading-relaxed max-w-2xl" style={{ color: "rgb(140, 139, 135)" }}>
                        {initiative.description}
                    </p>
                )}

                {/* Technologies */}
                {initiative.technologies?.length > 0 && (
                    <div className="mt-6 flex flex-wrap gap-2">
                        {initiative.technologies.map((tech) => (
                            <span key={tech} className="rounded-full bg-white/[0.04] border border-white/[0.06] px-3 py-1 text-[11px] font-medium font-[family-name:var(--font-geist-mono)]" style={{ color: "rgb(140, 139, 135)" }}>
                                {tech}
                            </span>
                        ))}
                    </div>
                )}

                {/* Objectives */}
                {initiative.objectives?.length > 0 && (
                    <div className="mt-8 centro-card p-6">
                        <h3 className="mono-label mb-4">Objectives</h3>
                        <ul className="space-y-2">
                            {initiative.objectives.map((obj, i) => (
                                <li key={i} className="flex items-start gap-2.5 text-[14px]" style={{ color: "rgb(216, 215, 212)" }}>
                                    <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-[rgb(98,246,181)] shrink-0" />
                                    {obj}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </header>

            {/* Main Image */}
            {initiative.mainImage && (
                <div className="relative mb-12 aspect-video overflow-hidden rounded-2xl border border-white/[0.04]">
                    <Image
                        src={urlFor(initiative.mainImage).width(1200).height(680).url()}
                        alt={initiative.title}
                        fill
                        className="object-cover"
                        priority
                    />
                </div>
            )}

            {/* ─── Subcategories & Projects Hierarchy ────────────── */}
            {subcategories.length > 0 && (
                <section className="mb-16">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="h-px flex-1 bg-gradient-to-r from-white/[0.06] to-transparent" />
                        <h2 className="mono-label">Categories & Projects</h2>
                        <div className="h-px flex-1 bg-gradient-to-l from-white/[0.06] to-transparent" />
                    </div>

                    {subcategories.map((sub) => (
                        <SubcategorySection key={sub._id} subcategory={sub} />
                    ))}
                </section>
            )}

            {/* Body */}
            {initiative.body && <PortableText value={initiative.body} />}
        </article>
    );
}
