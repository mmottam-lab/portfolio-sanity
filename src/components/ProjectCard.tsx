import Image from "next/image";
import Link from "next/link";
import { urlFor } from "@/sanity/image";
import type { Initiative } from "@/sanity/queries";

interface Props {
    initiative: Initiative;
}

const statusColors: Record<string, string> = {
    active: "bg-[rgb(98,246,181)]",
    completed: "bg-[rgb(120,160,255)]",
    planned: "bg-[#a855f7]",
};

const statusLabels: Record<string, string> = {
    active: "Active",
    completed: "Done",
    planned: "Planned",
};

export default function ProjectCard({ initiative }: Props) {
    return (
        <Link
            href={`/initiatives/${initiative.slug.current}`}
            className="group centro-card overflow-hidden flex flex-col"
        >
            {/* Image */}
            <div className="relative aspect-video overflow-hidden bg-gradient-to-br from-[rgb(98,246,181)]/5 to-transparent">
                {initiative.mainImage ? (
                    <Image
                        src={urlFor(initiative.mainImage).width(600).height(340).url()}
                        alt={initiative.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                ) : (
                    <div className="flex h-full items-center justify-center">
                        <div className="h-12 w-12 rounded-full bg-[rgb(98,246,181)]/10 flex items-center justify-center">
                            <span className="text-lg">🚀</span>
                        </div>
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="flex flex-col flex-1 p-5">
                {/* Status + category */}
                <div className="flex items-center gap-2 mb-3">
                    {initiative.status && (
                        <div className="flex items-center gap-1.5">
                            <span className={`h-1.5 w-1.5 rounded-full ${statusColors[initiative.status] || statusColors.planned}`} />
                            <span className="text-[10px] font-medium tracking-wider uppercase font-[family-name:var(--font-geist-mono)]" style={{ color: "rgb(140, 139, 135)" }}>
                                {statusLabels[initiative.status] || initiative.status}
                            </span>
                        </div>
                    )}
                    {initiative.category && (
                        <>
                            <span className="text-[rgb(90,89,85)]">·</span>
                            <span className="text-[10px] font-medium tracking-wider uppercase font-[family-name:var(--font-geist-mono)]" style={{ color: "rgb(140, 139, 135)" }}>
                                {initiative.category.title}
                            </span>
                        </>
                    )}
                </div>

                {/* Title */}
                <h3 className="text-[16px] font-semibold tracking-tight group-hover:text-[rgb(98,246,181)] transition-colors" style={{ color: "rgb(255, 250, 234)" }}>
                    {initiative.title}
                </h3>

                {initiative.description && (
                    <p className="mt-2 text-[13px] leading-relaxed line-clamp-2" style={{ color: "rgb(140, 139, 135)" }}>
                        {initiative.description}
                    </p>
                )}

                {/* Technologies */}
                {initiative.technologies && initiative.technologies.length > 0 && (
                    <div className="mt-auto pt-4 flex flex-wrap gap-1.5">
                        {initiative.technologies.slice(0, 3).map((tech) => (
                            <span
                                key={tech}
                                className="rounded-full bg-white/[0.04] border border-white/[0.06] px-2.5 py-0.5 text-[10px] font-medium tracking-wide font-[family-name:var(--font-geist-mono)]"
                                style={{ color: "rgb(140, 139, 135)" }}
                            >
                                {tech}
                            </span>
                        ))}
                        {initiative.technologies.length > 3 && (
                            <span className="text-[10px] self-center" style={{ color: "rgb(90, 89, 85)" }}>
                                +{initiative.technologies.length - 3}
                            </span>
                        )}
                    </div>
                )}
            </div>
        </Link>
    );
}
