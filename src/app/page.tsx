import Hero from "@/components/Hero";
import InitiativeCard from "@/components/ProjectCard";
import { getFeaturedInitiatives } from "@/sanity/queries";
import Link from "next/link";

export const revalidate = 0;

export default async function HomePage() {
  let initiatives: Awaited<ReturnType<typeof getFeaturedInitiatives>> = [];

  try {
    initiatives = await getFeaturedInitiatives();
  } catch {
    // Sanity not configured yet
  }

  return (
    <div className="centro-glow">
      <Hero />

      {/* Featured Initiatives */}
      <section className="mx-auto max-w-7xl px-6 py-24">
        <div className="mb-12 flex items-end justify-between">
          <div>
            <span className="mono-label mb-3 block">Featured</span>
            <h2 className="text-3xl font-light tracking-tight" style={{ color: "rgb(255, 250, 234)" }}>
              Active Initiatives
            </h2>
            <p className="mt-2 text-[14px] max-w-lg" style={{ color: "rgb(140, 139, 135)" }}>
              Key AI projects being developed and deployed across CENTRO.
            </p>
          </div>
          <Link
            href="/initiatives"
            className="group flex items-center gap-1.5 text-[12px] font-medium tracking-wider uppercase transition-colors font-[family-name:var(--font-geist-mono)] hover:text-[rgb(98,246,181)]"
            style={{ color: "rgb(140, 139, 135)" }}
          >
            View all
            <svg className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>

        {initiatives.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {initiatives.map((initiative) => (
              <InitiativeCard key={initiative._id} initiative={initiative} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/[0.06] py-20 bg-white/[0.01]">
            <div className="h-14 w-14 rounded-full bg-[rgb(98,246,181)]/10 flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-[rgb(98,246,181)]/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <p className="text-[13px]" style={{ color: "rgb(140, 139, 135)" }}>
              No initiatives yet. Add some from{" "}
              <Link href="/studio" className="text-[rgb(98,246,181)] hover:underline">
                Studio
              </Link>
            </p>
          </div>
        )}
      </section>

      {/* Features grid */}
      <section className="border-t border-white/[0.04]">
        <div className="mx-auto max-w-7xl px-6 py-24">
          <div className="text-center mb-16">
            <span className="mono-label mb-3 block">Capabilities</span>
            <h2 className="text-3xl font-light tracking-tight" style={{ color: "rgb(255, 250, 234)" }}>
              AI across education
            </h2>
          </div>

          <div className="grid gap-px sm:grid-cols-2 lg:grid-cols-3 rounded-2xl border border-white/[0.04] bg-white/[0.04] overflow-hidden">
            {[
              {
                icon: "🎓",
                title: "Learning Experience",
                desc: "Personalized AI-driven adaptive learning paths for students.",
              },
              {
                icon: "📊",
                title: "Analytics & Insights",
                desc: "Data-driven decisions powered by machine learning models.",
              },
              {
                icon: "🤖",
                title: "AI Assistants",
                desc: "Intelligent assistants for faculty and administrative processes.",
              },
              {
                icon: "📝",
                title: "Content Generation",
                desc: "AI-assisted curriculum and resource development tools.",
              },
              {
                icon: "🔒",
                title: "Ethical AI",
                desc: "Responsible AI integration with privacy and bias safeguards.",
              },
              {
                icon: "🔗",
                title: "Integration",
                desc: "Seamless connection with existing educational platforms.",
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="bg-[#0E0E13] p-8 transition-all duration-300 hover:bg-[rgb(25,26,35)]"
              >
                <span className="text-2xl mb-4 block">{feature.icon}</span>
                <h3 className="text-[14px] font-semibold mb-2" style={{ color: "rgb(255, 250, 234)" }}>
                  {feature.title}
                </h3>
                <p className="text-[13px] leading-relaxed" style={{ color: "rgb(140, 139, 135)" }}>
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
