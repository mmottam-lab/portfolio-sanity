"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks = [
    { href: "/", label: "Home" },
    { href: "/initiatives", label: "Initiatives" },
    { href: "/cases", label: "Cases" },
    { href: "/roadmap", label: "Roadmap" },
    { href: "/contact", label: "Contact" },
];

export default function Navbar() {
    const pathname = usePathname();

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/[0.04] bg-[#0E0E13]/70 backdrop-blur-2xl">
            <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
                {/* Logo */}
                <Link
                    href="/"
                    className="flex items-center gap-2.5 group"
                >
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[rgb(98,246,181)] transition-all duration-300 group-hover:shadow-lg group-hover:shadow-[rgb(98,246,181)]/20">
                        <span className="text-sm font-black text-[#0E0E13]">C</span>
                    </div>
                    <span className="text-[14px] font-semibold tracking-tight" style={{ color: "rgb(255, 250, 234)" }}>
                        CENTRO{" "}
                        <span style={{ color: "rgb(98, 246, 181)" }}>IA</span>
                    </span>
                </Link>

                {/* Center nav links — monospace style */}
                <div className="hidden md:flex items-center gap-0.5">
                    {navLinks.map((link) => {
                        const isActive =
                            pathname === link.href ||
                            (link.href !== "/" && pathname.startsWith(link.href));
                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`px-3.5 py-1.5 text-[12px] font-medium tracking-wide uppercase rounded-full transition-all duration-300 font-[family-name:var(--font-geist-mono)] ${isActive
                                    ? "text-[rgb(255,250,234)] bg-white/[0.08]"
                                    : "text-[rgb(140,139,135)] hover:text-[rgb(216,215,212)] hover:bg-white/[0.03]"
                                    }`}
                            >
                                {link.label}
                            </Link>
                        );
                    })}
                </div>

                {/* Right side */}
                <div className="flex items-center gap-3">
                    <Link
                        href="/studio"
                        className="text-[11px] font-medium tracking-wider uppercase text-[rgb(140,139,135)] hover:text-[rgb(98,246,181)] transition-colors font-[family-name:var(--font-geist-mono)]"
                    >
                        Studio
                    </Link>
                    <Link
                        href="/contact"
                        className="btn-primary"
                    >
                        Contact
                    </Link>
                </div>
            </div>
        </nav>
    );
}
