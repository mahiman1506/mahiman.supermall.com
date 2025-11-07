"use client";

import { useState } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "@/lib/firestore/firebase";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");

        if (!email) {
            setMessage("⚠️ Please enter your email address.");
            return;
        }

        try {
            setLoading(true);
            await sendPasswordResetEmail(auth, email);
            setMessage("✅ Password reset link has been sent to your email.");
            setEmail("");
        } catch (error) {
            if (error.code === "auth/user-not-found") {
                setMessage("❌ No user found with this email.");
            } else if (error.code === "auth/invalid-email") {
                setMessage("⚠️ Please enter a valid email address.");
            } else {
                setMessage("❌ Something went wrong. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
            <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-8">
                <h1 className="text-2xl font-bold text-center text-gray-800 mb-2">
                    Forgot Password
                </h1>
                <p className="text-gray-500 text-center text-sm mb-8">
                    Enter your email and we’ll send you a password reset link.
                </p>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label
                            htmlFor="email"
                            className="block text-sm font-medium text-gray-700 mb-1"
                        >
                            Email Address
                        </label>
                        <input
                            type="email"
                            id="email"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full font-semibold py-3 rounded-lg transition ${loading
                                ? "bg-blue-400 cursor-not-allowed"
                                : "bg-blue-600 hover:bg-blue-700 text-white"
                            }`}
                    >
                        {loading ? "Sending..." : "Send Reset Link"}
                    </button>
                </form>

                {message && (
                    <p className="text-center text-sm text-blue-600 mt-4">{message}</p>
                )}

                <div className="mt-6 text-center">
                    <a
                        href="/login"
                        className="text-blue-600 hover:underline text-sm font-medium"
                    >
                        ← Back to Login
                    </a>
                </div>
            </div>
        </div>
    );
}
