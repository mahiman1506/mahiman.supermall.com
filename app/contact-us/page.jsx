"use client";

import React, { useState } from "react";
import UserHeader from "../components/Header";
import { db } from "@/lib/firestore/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export default function ContactPage() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        message: "",
    });

    const [successMsg, setSuccessMsg] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setSuccessMsg("");

        try {
            await addDoc(collection(db, "contactMessages"), {
                name: formData.name,
                email: formData.email,
                message: formData.message,
                createdAt: serverTimestamp(),
            });

            setSuccessMsg("✅ Successfully Message Sent!");
            setFormData({ name: "", email: "", message: "" });
        } catch (error) {
            console.error("Error sending message: ", error);
            setSuccessMsg("❌ Failed to send message. Try again!");
        }

        setLoading(false);
    };

    return (
        <div className="pt-10" suppressHydrationWarning>
            <UserHeader />

            <main className="min-h-screen bg-slate-900 text-gray-800">
                {/* Header Section */}
                <section className="bg-white py-16">
                    <div className="max-w-6xl mx-auto px-4 text-center">
                        <h1 className="text-4xl md:text-5xl font-extrabold text-black mb-4">
                            Contact <span className="text-indigo-900">SuperMall</span>
                        </h1>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            Have questions, feedback, or need help? We’d love to hear from you!
                        </p>
                    </div>
                </section>

                {/* Contact Section */}
                <section className="max-w-6xl mx-auto px-6 py-16 space-y-10">
                    <div className="grid md:grid-cols-2 gap-10">
                        {/* Left Info */}
                        <div>
                            <h2 className="text-2xl font-semibold text-indigo-600 mb-4">
                                Get In Touch
                            </h2>
                            <p className="text-white leading-relaxed mb-6">
                                Whether you have a question about your order, products, or our
                                services, the SuperMall support team is here to assist you every
                                step of the way.
                            </p>

                            <ul className="text-white space-y-4">
                                <li>📍 <strong>Address:</strong> Ahmedabad, Gujarat, India</li>
                                <li>📞 <strong>Phone:</strong> +91 98765 43210</li>
                                <li>✉️ <strong>Email:</strong> support@supermall.com</li>
                                <li>🕒 <strong>Business Hours:</strong> Mon–Sat, 9:00 AM – 8:00 PM</li>
                            </ul>
                        </div>

                        {/* Right Contact Form */}
                        <div className="bg-white p-8 rounded-2xl shadow-lg">
                            <h2 className="text-2xl font-semibold text-indigo-900 mb-6">
                                Send Us a Message
                            </h2>

                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div>
                                    <label className="block text-gray-700 font-medium mb-2">
                                        Your Name
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        placeholder="Enter your name"
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:outline-none"
                                        required
                                        suppressHydrationWarning
                                    />
                                </div>

                                <div>
                                    <label className="block text-gray-700 font-medium mb-2">
                                        Email Address
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="Enter your email"
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:outline-none"
                                        required
                                        suppressHydrationWarning
                                    />
                                </div>

                                <div>
                                    <label className="block text-gray-700 font-medium mb-2">
                                        Message
                                    </label>
                                    <textarea
                                        name="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        placeholder="Write your message..."
                                        rows="4"
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:outline-none resize-none"
                                        required
                                        suppressHydrationWarning
                                    ></textarea>
                                </div>

                                <button
                                    type="submit"
                                    suppressHydrationWarning
                                    disabled={loading}
                                    className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-all duration-200"
                                >
                                    {loading ? "Sending..." : "Send Message"}
                                </button>

                                {/* Success message with hydration warning suppressed */}
                                <p
                                    suppressHydrationWarning
                                    className={`text-center mt-4 font-medium ${successMsg.includes("✅")
                                        ? "text-green-600"
                                        : successMsg.includes("❌")
                                            ? "text-red-600"
                                            : ""
                                        }`}
                                >
                                    {successMsg}
                                </p>
                            </form>
                        </div>
                    </div>

                    {/* Map */}
                    <div className="mt-16 text-center">
                        <h2 className="text-2xl font-semibold text-indigo-600 mb-4">
                            Visit Our Store
                        </h2>
                        <p className="text-white mb-6 max-w-2xl mx-auto">
                            Prefer face-to-face assistance? You’re always welcome at our main
                            store in Ahmedabad. Drop by and our team will be happy to help you.
                        </p>
                        <div className="w-full h-80 rounded-2xl overflow-hidden shadow-md">
                            <iframe
                                title="SuperMall Ahmedabad Location"
                                className="w-full h-full border-0"
                                loading="lazy"
                                allowFullScreen
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3670.239897428654!2d72.57136297526086!3d23.022505979168286!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x395e84f5f9f82c61%3A0xdeb10e45c81489d2!2sAhmedabad%2C%20Gujarat!5e0!3m2!1sen!2sin!4v1730981234567!5m2!1sen!2sin"
                            ></iframe>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
}
