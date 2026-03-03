import Link from "next/link";

export default function Hero() {
    return (
        <section className="relative overflow-hidden grid-bg">
            {/* Blue vignette glow at top */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-[radial-gradient(ellipse_at_center,rgba(80,120,255,0.08)_0%,transparent_70%)]" />
                <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[400px] h-[400px] bg-[radial-gradient(circle,rgba(98,246,181,0.05)_0%,transparent_60%)]" />
            </div>

            <div className="relative mx-auto max-w-5xl px-6 py-32 sm:py-40 text-center">
                {/* Tag */}
                <div className="animate-fade-in-up inline-flex items-center gap-2 rounded-full border border-white/[0.06] bg-white/[0.03] px-4 py-1.5 mb-8">
                    <span className="h-1.5 w-1.5 rounded-full bg-[rgb(98,246,181)] animate-pulse" />
                    <span className="text-[11px] font-medium tracking-wider uppercase text-[rgb(216,215,212)] font-[family-name:var(--font-geist-mono)]">
                        AI for Creativity
                    </span>
                </div>

                {/* Main heading */}
                <h1 className="animate-fade-in-up-delay-1 text-5xl sm:text-6xl lg:text-7xl font-light tracking-tight leading-[1.05]" style={{ color: "rgb(255, 250, 234)" }}>
                    Building the future of{" "}
                    <span className="relative">
                        <span style={{ color: "rgb(98, 246, 181)" }}>AI in creative education</span>
                        <span className="absolute -bottom-1 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[rgb(98,246,181)]/30 to-transparent" />
                    </span>
                </h1>

                {/* Subtitle */}
                <p className="animate-fade-in-up-delay-2 mt-6 text-lg sm:text-xl leading-relaxed max-w-2xl mx-auto" style={{ color: "rgb(140, 139, 135)" }}>
                    Documenting AI initiatives, case studies, and our roadmap
                    for CENTRO&apos;s educational ecosystem.
                </p>

                {/* CTAs — capsule buttons */}
                <div className="animate-fade-in-up-delay-3 mt-10 flex items-center justify-center gap-4">
                    <Link href="/initiatives" className="btn-primary">
                        Explore Initiatives
                    </Link>
                    <Link href="/roadmap" className="btn-secondary">
                        View Roadmap
                    </Link>
                </div>

                {/* Stats bar */}
                <div className="animate-fade-in-up-delay-3 mt-20 grid grid-cols-3 gap-px rounded-2xl border border-white/[0.04] bg-white/[0.04] overflow-hidden max-w-lg mx-auto">
                    {[
                        { value: "AI", label: "Powered" },
                        { value: "5+", label: "Years" },
                        { value: "∞", label: "Possibilities" },
                    ].map((stat) => (
                        <div key={stat.label} className="bg-[#0E0E13] px-6 py-5 text-center">
                            <div className="text-2xl font-semibold" style={{ color: "rgb(98, 246, 181)" }}>{stat.value}</div>
                            <div className="mt-1 text-[10px] font-medium tracking-wider uppercase font-[family-name:var(--font-geist-mono)]" style={{ color: "rgb(140, 139, 135)" }}>
                                {stat.label}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
