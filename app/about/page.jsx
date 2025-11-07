"use client"

import UserHeader from "../components/Header"

export default function Page() {
    return (
        <div className="pt-10">
            <UserHeader />
            <main className="min-h-screen bg-slate-900 text-gray-800">
                {/* Header Section */}
                <section className="bg-white py-16">
                    <div className="max-w-6xl mx-auto px-4 text-center">
                        <h1 className="text-4xl md:text-5xl font-extrabold text-black mb-4">
                            About <span className="text-indigo-900">SuperMall</span>
                        </h1>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            Your one-stop online destination for fashion, electronics, home essentials, and more.
                        </p>
                    </div>
                </section>

                {/* About Section */}
                <section className="max-w-6xl mx-auto px-6 py-16 space-y-10">
                    {/* Who We Are */}
                    <div>
                        <h2 className="text-2xl font-semibold text-indigo-600 mb-4">
                            Who We Are
                        </h2>
                        <p className="text-white leading-relaxed">
                            Welcome to <strong>SuperMall</strong>, your ultimate online shopping destination for everything
                            you love — from fashion and electronics to beauty, home essentials, and more.
                            We bring together a wide range of trusted brands and top-quality products
                            under one digital roof, making shopping easier, faster, and more reliable than ever.
                        </p>
                    </div>

                    {/* Our Story */}
                    <div>
                        <h2 className="text-2xl font-semibold text-indigo-600 mb-4">
                            Our Story
                        </h2>
                        <p className="text-white leading-relaxed">
                            Founded with a vision to redefine online shopping, <strong>SuperMall</strong> started with a simple goal —
                            to create a one-stop eCommerce platform where quality, affordability, and customer satisfaction meet.
                            What began as a small startup has quickly evolved into a growing marketplace trusted by thousands of customers
                            who value convenience and excellence.
                        </p>
                    </div>

                    {/* Mission & Vision */}
                    <div className="grid md:grid-cols-2 gap-10">
                        <div>
                            <h2 className="text-2xl font-semibold text-indigo-600 mb-4">
                                Our Mission
                            </h2>
                            <p className="text-white leading-relaxed">
                                Our mission is simple — <strong>to make online shopping seamless, affordable,
                                    and enjoyable for everyone.</strong> We aim to connect people with products that
                                make everyday life better — whether it’s the latest tech gadget, a trendy outfit,
                                or home essentials that simplify your lifestyle.
                            </p>
                        </div>
                        <div>
                            <h2 className="text-2xl font-semibold text-indigo-600 mb-4">
                                Our Vision
                            </h2>
                            <p className="text-white leading-relaxed">
                                We envision <strong>SuperMall</strong> as a global online marketplace that inspires
                                trust and convenience. Our goal is to become your go-to shopping destination,
                                known for excellent service, variety, and innovation.
                            </p>
                        </div>
                    </div>

                    {/* What Makes Us Different */}
                    <div>
                        <h2 className="text-2xl font-semibold text-indigo-600 mb-4">
                            What Makes Us Different
                        </h2>
                        <ul className="list-disc pl-6 text-white space-y-2">
                            <li>🛍️ <strong>Everything in One Place:</strong> A wide range of categories — electronics, fashion, home, beauty, and more.</li>
                            <li>💰 <strong>Affordable Prices:</strong> We make sure you get the best value for your money.</li>
                            <li>🚚 <strong>Fast & Secure Delivery:</strong> Reliable shipping you can count on.</li>
                            <li>🔒 <strong>Safe Payments:</strong> Multiple secure payment options for your peace of mind.</li>
                            <li>🤝 <strong>Customer First:</strong> Our customers are at the heart of everything we do.</li>
                        </ul>
                    </div>

                    {/* Promise Section */}
                    <div className="bg-indigo-50 p-8 rounded-2xl shadow-sm">
                        <h2 className="text-2xl font-semibold text-indigo-600 mb-4">
                            Our Promise
                        </h2>
                        <p className="text-gray-700 leading-relaxed">
                            We’re committed to delivering <strong>quality products</strong>,
                            <strong> transparent service</strong>, and a <strong>smooth shopping experience</strong>
                            every time you visit SuperMall. If you ever face an issue, our dedicated support team
                            is here to help you — because your satisfaction is our top priority.
                        </p>
                    </div>

                    {/* Join Community */}
                    <div className="text-center py-10">
                        <h2 className="text-2xl font-semibold text-indigo-600 mb-4">
                            Join the SuperMall Community
                        </h2>
                        <p className="text-white mb-6 max-w-2xl mx-auto">
                            At SuperMall, shopping is more than just buying — it’s about discovering, sharing, and connecting.
                            Join thousands of happy shoppers who trust us every day for their online needs.
                        </p>
                        <a
                            href="/store"
                            className="inline-block bg-indigo-600 text-white px-6 py-3 rounded-xl text-lg font-semibold hover:bg-indigo-700 transition-all duration-200"
                        >
                            Shop Now
                        </a>
                    </div>
                </section>
            </main>
        </div>
    )
}