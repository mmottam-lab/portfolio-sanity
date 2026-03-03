"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export default function PageViewTracker() {
    const pathname = usePathname();

    useEffect(() => {
        // Skip tracking for studio routes
        if (pathname.startsWith("/studio")) return;

        // Fire-and-forget beacon
        const track = async () => {
            try {
                await fetch(`${API_URL}/analytics/pageview`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        path: pathname,
                        referrer: document.referrer || undefined,
                        userAgent: navigator.userAgent,
                    }),
                });
            } catch {
                // Silently fail — analytics should never break the UI
            }
        };

        track();
    }, [pathname]);

    return null;
}
