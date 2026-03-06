import { PortableText as PortableTextComponent, PortableTextReactComponents } from "@portabletext/react";
import Image from "next/image";
import { urlFor } from "@/sanity/image";
import { sanityConfig } from "@/sanity/config";

// Build a URL for a Sanity file asset from its _ref
function fileUrl(ref: string): string {
    // ref format: file-<id>-<extension>
    const [, id, ext] = ref.split("-");
    return `https://cdn.sanity.io/files/${sanityConfig.projectId}/${sanityConfig.dataset}/${id}.${ext}`;
}

const components: Partial<PortableTextReactComponents> = {
    types: {
        image: ({ value }) => {
            if (!value?.asset?._ref) return null;
            return (
                <figure className="my-8">
                    <div className="relative aspect-video overflow-hidden rounded-xl border border-white/[0.04]">
                        <Image src={urlFor(value).width(1200).url()} alt={value.alt || ""} fill className="object-cover" />
                    </div>
                    {value.caption && (
                        <figcaption className="mt-2 text-center text-[12px]" style={{ color: "rgb(140, 139, 135)" }}>{value.caption}</figcaption>
                    )}
                </figure>
            );
        },
        code: ({ value }) => (
            <pre className="my-6 overflow-x-auto rounded-xl border border-white/[0.04] bg-[rgb(25,26,35)] p-5">
                {value.filename && <div className="mb-3 -mt-1 text-[11px] font-[family-name:var(--font-geist-mono)]" style={{ color: "rgb(90, 89, 85)" }}>{value.filename}</div>}
                <code className="text-[13px] font-[family-name:var(--font-geist-mono)] leading-relaxed" style={{ color: "rgb(216, 215, 212)" }}>{value.code}</code>
            </pre>
        ),
        file: ({ value }) => {
            if (!value?.asset?._ref) return null;
            const url = fileUrl(value.asset._ref);
            const description = value.description || "Documento PDF";
            return (
                <figure className="my-8">
                    <div className="overflow-hidden rounded-xl border border-white/[0.04] bg-[rgb(25,26,35)]">
                        <div className="flex items-center gap-3 border-b border-white/[0.04] px-5 py-3">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgb(98,246,181)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                                <polyline points="14 2 14 8 20 8" />
                                <line x1="16" y1="13" x2="8" y2="13" />
                                <line x1="16" y1="17" x2="8" y2="17" />
                                <polyline points="10 9 9 9 8 9" />
                            </svg>
                            <span className="text-sm font-medium" style={{ color: "rgb(216, 215, 212)" }}>{description}</span>
                            <a
                                href={url}
                                target="_blank"
                                rel="noopener noreferrer"
                                download
                                className="ml-auto flex items-center gap-1.5 rounded-lg border border-white/[0.08] bg-white/[0.04] px-3 py-1.5 text-xs font-medium transition-all hover:bg-white/[0.08] hover:border-[rgb(98,246,181)]/30"
                                style={{ color: "rgb(98,246,181)" }}
                            >
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                    <polyline points="7 10 12 15 17 10" />
                                    <line x1="12" y1="15" x2="12" y2="3" />
                                </svg>
                                Descargar
                            </a>
                        </div>
                        <object
                            data={url}
                            type="application/pdf"
                            className="w-full"
                            style={{ height: "600px" }}
                        >
                            <div className="flex flex-col items-center justify-center gap-3 py-12" style={{ color: "rgb(140, 139, 135)" }}>
                                <p className="text-sm">Tu navegador no puede mostrar este PDF.</p>
                                <a
                                    href={url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="rounded-lg bg-[rgb(98,246,181)] px-4 py-2 text-sm font-medium text-[rgb(10,10,10)] transition-all hover:brightness-110"
                                >
                                    Abrir PDF
                                </a>
                            </div>
                        </object>
                    </div>
                    {value.description && (
                        <figcaption className="mt-2 text-center text-[12px]" style={{ color: "rgb(140, 139, 135)" }}>{value.description}</figcaption>
                    )}
                </figure>
            );
        },
    },
    block: {
        h2: ({ children }) => <h2 className="mt-12 mb-4 text-2xl font-semibold tracking-tight" style={{ color: "rgb(255, 250, 234)" }}>{children}</h2>,
        h3: ({ children }) => <h3 className="mt-8 mb-3 text-xl font-semibold" style={{ color: "rgb(255, 250, 234)" }}>{children}</h3>,
        h4: ({ children }) => <h4 className="mt-6 mb-2 text-lg font-semibold" style={{ color: "rgb(216, 215, 212)" }}>{children}</h4>,
        normal: ({ children }) => <p className="mb-4 leading-relaxed" style={{ color: "rgb(216, 215, 212)" }}>{children}</p>,
        blockquote: ({ children }) => (
            <blockquote className="my-6 border-l-2 border-[rgb(98,246,181)]/50 pl-4 italic" style={{ color: "rgb(140, 139, 135)" }}>{children}</blockquote>
        ),
    },
    marks: {
        strong: ({ children }) => <strong className="font-semibold" style={{ color: "rgb(255, 250, 234)" }}>{children}</strong>,
        em: ({ children }) => <em className="italic" style={{ color: "rgb(216, 215, 212)" }}>{children}</em>,
        code: ({ children }) => (
            <code className="rounded-md bg-white/[0.06] px-1.5 py-0.5 text-[13px] font-[family-name:var(--font-geist-mono)] text-[rgb(98,246,181)]">{children}</code>
        ),
        link: ({ children, value }) => (
            <a href={value.href} target="_blank" rel="noopener noreferrer" className="text-[rgb(98,246,181)] underline underline-offset-2 hover:brightness-125 transition-all">
                {children}
            </a>
        ),
    },
    list: {
        bullet: ({ children }) => <ul className="mb-4 ml-4 list-disc space-y-1 marker:text-[rgb(98,246,181)]" style={{ color: "rgb(216, 215, 212)" }}>{children}</ul>,
        number: ({ children }) => <ol className="mb-4 ml-4 list-decimal space-y-1 marker:text-[rgb(98,246,181)]" style={{ color: "rgb(216, 215, 212)" }}>{children}</ol>,
    },
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function PortableText({ value }: { value: any }) {
    return <PortableTextComponent value={value} components={components} />;
}
