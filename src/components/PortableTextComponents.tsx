import { PortableText as PortableTextComponent, PortableTextReactComponents } from "@portabletext/react";
import Image from "next/image";
import { urlFor } from "@/sanity/image";

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
