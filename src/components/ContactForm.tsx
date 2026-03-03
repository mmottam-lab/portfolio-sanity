"use client";

import { useState, type FormEvent } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export default function ContactForm() {
    const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
    const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });

    async function handleSubmit(e: FormEvent) {
        e.preventDefault();
        setStatus("sending");

        try {
            const res = await fetch(`${API_URL}/contacts`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });

            if (!res.ok) throw new Error("Failed");

            setStatus("sent");
            setForm({ name: "", email: "", subject: "", message: "" });
        } catch {
            setStatus("error");
        }
    }

    if (status === "sent") {
        return (
            <div className="rounded-2xl border border-[rgb(98,246,181)]/20 bg-[rgb(98,246,181)]/[0.04] p-12 text-center">
                <div className="h-14 w-14 rounded-full bg-[rgb(98,246,181)]/10 flex items-center justify-center mx-auto mb-4">
                    <svg className="w-6 h-6 text-[rgb(98,246,181)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2" style={{ color: "rgb(255, 250, 234)" }}>Message sent!</h3>
                <p className="text-[14px]" style={{ color: "rgb(140, 139, 135)" }}>
                    Thank you for reaching out. We&apos;ll get back to you soon.
                </p>
                <button
                    onClick={() => setStatus("idle")}
                    className="mt-6 text-[13px] text-[rgb(98,246,181)] hover:underline font-[family-name:var(--font-geist-mono)] uppercase tracking-wider"
                >
                    Send another
                </button>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid gap-5 sm:grid-cols-2">
                {/* Name */}
                <div>
                    <label htmlFor="contact-name" className="mono-label block mb-2">
                        Name
                    </label>
                    <input
                        id="contact-name"
                        type="text"
                        required
                        value={form.name}
                        onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                        className="centro-input"
                        placeholder="Your name"
                    />
                </div>

                {/* Email */}
                <div>
                    <label htmlFor="contact-email" className="mono-label block mb-2">
                        Email
                    </label>
                    <input
                        id="contact-email"
                        type="email"
                        required
                        value={form.email}
                        onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                        className="centro-input"
                        placeholder="you@example.com"
                    />
                </div>
            </div>

            {/* Subject */}
            <div>
                <label htmlFor="contact-subject" className="mono-label block mb-2">
                    Subject
                </label>
                <input
                    id="contact-subject"
                    type="text"
                    value={form.subject}
                    onChange={(e) => setForm((f) => ({ ...f, subject: e.target.value }))}
                    className="centro-input"
                    placeholder="What's this about?"
                />
            </div>

            {/* Message */}
            <div>
                <label htmlFor="contact-message" className="mono-label block mb-2">
                    Message
                </label>
                <textarea
                    id="contact-message"
                    required
                    rows={5}
                    value={form.message}
                    onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                    className="centro-input resize-none"
                    placeholder="Tell us about your project or question..."
                />
            </div>

            {/* Error */}
            {status === "error" && (
                <p className="text-[13px] text-red-400 font-[family-name:var(--font-geist-mono)]">
                    Something went wrong. Please try again.
                </p>
            )}

            {/* Submit */}
            <button
                type="submit"
                disabled={status === "sending"}
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {status === "sending" ? (
                    <span className="flex items-center gap-2">
                        <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        Sending...
                    </span>
                ) : (
                    "Send Message"
                )}
            </button>
        </form>
    );
}
