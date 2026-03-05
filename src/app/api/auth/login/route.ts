import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import crypto from "crypto";

function hashPassword(password: string): string {
    return crypto.createHash("sha256").update(password).digest("hex");
}

export async function POST(request: NextRequest) {
    try {
        const { username, password } = await request.json();

        const validUsername = process.env.STUDIO_USERNAME;
        const validPasswordHash = process.env.STUDIO_PASSWORD_HASH;

        if (!validUsername || !validPasswordHash) {
            return NextResponse.json(
                { error: "Studio credentials not configured" },
                { status: 500 }
            );
        }

        const inputHash = hashPassword(password);

        if (username === validUsername && inputHash === validPasswordHash) {
            // Create a session token
            const sessionToken = crypto.randomBytes(32).toString("hex");
            const expiresAt = Date.now() + 24 * 60 * 60 * 1000; // 24 hours

            const cookieStore = await cookies();
            cookieStore.set("studio_session", sessionToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "lax",
                path: "/",
                maxAge: 24 * 60 * 60, // 24 hours in seconds
            });

            cookieStore.set("studio_session_expires", String(expiresAt), {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "lax",
                path: "/",
                maxAge: 24 * 60 * 60,
            });

            return NextResponse.json({ success: true });
        }

        return NextResponse.json(
            { error: "Incorrect username or password" },
            { status: 401 }
        );
    } catch {
        return NextResponse.json(
            { error: "Request error" },
            { status: 400 }
        );
    }
}
