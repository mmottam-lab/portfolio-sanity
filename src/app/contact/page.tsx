import type { Metadata } from "next";
import ContactForm from "@/components/ContactForm";

export const metadata: Metadata = {
    title: "Contact",
    description: "Get in touch with the CENTRO IA team. Questions, collaborations, or feedback.",
};

export default function ContactPage() {
    return (
        <section className="mx-auto max-w-3xl px-6 py-24 min-h-screen">
            {/* Header */}
            <div className="mb-12 text-center">
                <span className="mono-label mb-3 block">Contact</span>
                <h1 className="text-4xl font-light tracking-tight sm:text-5xl" style={{ color: "rgb(255, 250, 234)" }}>
                    Get in touch
                </h1>
                <p className="mt-4 text-[15px] max-w-lg mx-auto leading-relaxed" style={{ color: "rgb(140, 139, 135)" }}>
                    Have a question about our AI initiatives? Want to collaborate or provide feedback? We&apos;d love to hear from you.
                </p>
            </div>

            {/* Form card */}
            <div className="centro-card p-8 sm:p-10">
                <ContactForm />
            </div>

            {/* Alternative contact */}
            <div className="mt-12 grid gap-6 sm:grid-cols-3">
                {[
                    {
                        icon: "📧",
                        title: "Email",
                        desc: "ia@centro.edu.mx",
                        href: "mailto:ia@centro.edu.mx",
                    },
                    {
                        icon: "🌐",
                        title: "Website",
                        desc: "centro.edu.mx",
                        href: "https://centro.edu.mx",
                    },
                    {
                        icon: "📍",
                        title: "Location",
                        desc: "CDMX, México",
                        href: undefined,
                    },
                ].map((item) => (
                    <div
                        key={item.title}
                        className="centro-card p-5 text-center"
                    >
                        <span className="text-xl mb-2 block">{item.icon}</span>
                        <h3 className="text-[13px] font-semibold mb-1" style={{ color: "rgb(255, 250, 234)" }}>{item.title}</h3>
                        {item.href ? (
                            <a
                                href={item.href}
                                target={item.href.startsWith("http") ? "_blank" : undefined}
                                rel="noopener noreferrer"
                                className="text-[12px] text-[rgb(98,246,181)] hover:underline font-[family-name:var(--font-geist-mono)]"
                            >
                                {item.desc}
                            </a>
                        ) : (
                            <p className="text-[12px]" style={{ color: "rgb(140, 139, 135)" }}>{item.desc}</p>
                        )}
                    </div>
                ))}
            </div>
        </section>
    );
}
