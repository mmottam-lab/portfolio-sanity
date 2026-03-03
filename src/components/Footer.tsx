import Link from "next/link";

export default function Footer() {
    return (
        <footer className="border-t border-white/[0.04] bg-[#0E0E13] relative overflow-hidden">
            {/* Subtle background brand text */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
                <span className="text-[20vw] font-bold tracking-tighter opacity-[0.015]" style={{ color: "rgb(255, 250, 234)" }}>
                    CENTRO
                </span>
            </div>

            <div className="relative mx-auto max-w-7xl px-6 py-16">
                <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
                    {/* Brand */}
                    <div className="lg:col-span-1">
                        <div className="flex items-center gap-2.5 mb-4">
                            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[rgb(98,246,181)]">
                                <span className="text-xs font-black text-[#0E0E13]">C</span>
                            </div>
                            <span className="text-sm font-semibold tracking-tight" style={{ color: "rgb(255, 250, 234)" }}>
                                CENTRO <span style={{ color: "rgb(98, 246, 181)" }}>IA</span>
                            </span>
                        </div>
                        <p className="text-[13px] leading-relaxed max-w-xs" style={{ color: "rgb(140, 139, 135)" }}>
                            Documentación de iniciativas, casos de uso y roadmap de inteligencia artificial en CENTRO.
                        </p>
                    </div>

                    {/* Sections */}
                    <div>
                        <h4 className="mono-label mb-4">Sections</h4>
                        <ul className="space-y-2.5">
                            {[
                                { href: "/initiatives", label: "Initiatives" },
                                { href: "/cases", label: "Cases" },
                                { href: "/roadmap", label: "Roadmap" },
                                { href: "/contact", label: "Contact" },
                            ].map((item) => (
                                <li key={item.href}>
                                    <Link
                                        href={item.href}
                                        className="text-[13px] transition-colors hover:text-[rgb(98,246,181)]"
                                        style={{ color: "rgb(140, 139, 135)" }}
                                    >
                                        {item.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Resources */}
                    <div>
                        <h4 className="mono-label mb-4">Resources</h4>
                        <ul className="space-y-2.5">
                            {[
                                { href: "/studio", label: "Sanity Studio" },
                                { href: "https://centro.edu.mx", label: "CENTRO Website" },
                            ].map((item) => (
                                <li key={item.href}>
                                    <Link
                                        href={item.href}
                                        className="text-[13px] transition-colors hover:text-[rgb(98,246,181)]"
                                        style={{ color: "rgb(140, 139, 135)" }}
                                        target={item.href.startsWith("http") ? "_blank" : undefined}
                                    >
                                        {item.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Connect */}
                    <div>
                        <h4 className="mono-label mb-4">Connect</h4>
                        <ul className="space-y-2.5">
                            <li>
                                <a
                                    href="https://github.com"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-[13px] transition-colors hover:text-[rgb(98,246,181)]"
                                    style={{ color: "rgb(140, 139, 135)" }}
                                >
                                    GitHub
                                </a>
                            </li>
                            <li>
                                <a
                                    href="https://linkedin.com"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-[13px] transition-colors hover:text-[rgb(98,246,181)]"
                                    style={{ color: "rgb(140, 139, 135)" }}
                                >
                                    LinkedIn
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="mt-12 border-t border-white/[0.04] pt-6 flex items-center justify-between">
                    <p className="text-[11px] font-[family-name:var(--font-geist-mono)]" style={{ color: "rgb(90, 89, 85)" }}>
                        © {new Date().getFullYear()} CENTRO IA. All rights reserved.
                    </p>
                    <div className="flex items-center gap-1.5">
                        <span className="h-1.5 w-1.5 rounded-full bg-[rgb(98,246,181)] animate-pulse" />
                        <span className="text-[11px] font-[family-name:var(--font-geist-mono)]" style={{ color: "rgb(140, 139, 135)" }}>
                            All systems operational
                        </span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
