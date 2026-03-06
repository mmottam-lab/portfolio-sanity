"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    async function handleSubmit(e: FormEvent) {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const res = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password }),
            });

            const data = await res.json();

            if (res.ok && data.success) {
                router.push("/cases");
            } else {
                setError(data.error || "Invalid credentials");
            }
        } catch {
            setError("Connection error. Please try again.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="studio-login-page">
            {/* Background effects */}
            <div className="studio-login-bg">
                <div className="studio-login-grid" />
                <div className="studio-login-glow-top" />
                <div className="studio-login-glow-bottom" />
            </div>

            <div className="studio-login-container">
                {/* Logo / Brand */}
                <div className="studio-login-brand">
                    <div className="studio-login-icon">
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                        </svg>
                    </div>
                    <h1 className="studio-login-title">CENTRO IA</h1>
                    <p className="studio-login-subtitle">Platform Access</p>
                </div>

                {/* Login Card */}
                <form onSubmit={handleSubmit} className="studio-login-card">
                    {error && (
                        <div className="studio-login-error">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="10" />
                                <line x1="15" y1="9" x2="9" y2="15" />
                                <line x1="9" y1="9" x2="15" y2="15" />
                            </svg>
                            <span>{error}</span>
                        </div>
                    )}

                    <div className="studio-login-field">
                        <label htmlFor="login-username" className="studio-login-label">
                            Username
                        </label>
                        <input
                            id="login-username"
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="centro-input"
                            placeholder="Enter your username"
                            required
                            autoComplete="username"
                            autoFocus
                        />
                    </div>

                    <div className="studio-login-field">
                        <label htmlFor="login-password" className="studio-login-label">
                            Password
                        </label>
                        <input
                            id="login-password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="centro-input"
                            placeholder="Enter your password"
                            required
                            autoComplete="current-password"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="studio-login-button"
                    >
                        {loading ? (
                            <span className="studio-login-spinner" />
                        ) : (
                            <>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                                    <polyline points="10 17 15 12 10 7" />
                                    <line x1="15" y1="12" x2="3" y2="12" />
                                </svg>
                                Sign In
                            </>
                        )}
                    </button>
                </form>

                <p className="studio-login-footer">
                    Restricted access · Authorized personnel only
                </p>
            </div>
        </div>
    );
}
