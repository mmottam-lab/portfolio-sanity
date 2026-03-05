"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function ConditionalLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();

    // Don't show Navbar/Footer on login page or studio pages
    const isLoginPage = pathname === "/login";
    const isStudioPage = pathname.startsWith("/studio");
    const hideChrome = isLoginPage || isStudioPage;

    if (hideChrome) {
        return <>{children}</>;
    }

    return (
        <>
            <Navbar />
            <main className="pt-16">{children}</main>
            <Footer />
        </>
    );
}
