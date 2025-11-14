"use client";

import { useState } from "react";

export default function ShopProfilePage() {
  const [shop, setShop] = useState({
    name: "TechZone Store",
    owner: "Ravi Kumar",
    email: "techzone@example.com",
    phone: "+91 98765 43210",
    address: "12 MG Road, Bengaluru, India",
    city: "Bengaluru",
    banner: "https://images.unsplash.com/photo-1523275335684-37898b6baf30",
    logo: "https://cdn-icons-png.flaticon.com/512/814/814513.png",
    description:
      "We sell premium electronics and gadgets at affordable prices.",
    status: "Open",
    workingHours: "10:00 AM - 8:00 PM",
    days: "Mon - Sat",
  });

  return (
    <div className="w-full flex justify-center py-8">
      <div className="max-w-5xl w-full px-4">
        {/* Banner */}
        <div className="relative mb-16">
          <img
            src={shop.banner}
            alt="Shop Banner"
            className="w-full h-48 object-cover rounded-xl shadow-md"
          />
          <div className="absolute -bottom-12 left-6 flex items-center gap-4">
            <img
              src={shop.logo}
              alt="Shop Logo"
              className="w-24 h-24 rounded-full border-4 border-white shadow-lg object-cover"
            />
            <div>
              <h1 className="text-2xl font-bold">{shop.name}</h1>
              <p className="text-gray-500">{shop.city}</p>
            </div>
          </div>
        </div>

        {/* Info Sections */}
        <div className="bg-white rounded-xl shadow p-6 space-y-6">
          {/* About */}
          <section>
            <h2 className="text-lg font-semibold mb-2">About Shop</h2>
            <p className="text-gray-700">{shop.description}</p>
          </section>

          {/* Contact Info */}
          <section>
            <h2 className="text-lg font-semibold mb-2">Contact Information</h2>
            <div className="grid sm:grid-cols-2 gap-2 text-sm text-gray-700">
              <p>
                <strong>Email:</strong> {shop.email}
              </p>
              <p>
                <strong>Phone:</strong> {shop.phone}
              </p>
              <p>
                <strong>Address:</strong> {shop.address}
              </p>
              <p>
                <strong>City:</strong> {shop.city}
              </p>
            </div>
          </section>

          {/* Operating Info */}
          <section>
            <h2 className="text-lg font-semibold mb-2">Operating Details</h2>
            <p>
              <strong>Status:</strong> {shop.status}
            </p>
            <p>
              <strong>Working Hours:</strong> {shop.workingHours}
            </p>
            <p>
              <strong>Days:</strong> {shop.days}
            </p>
          </section>

          {/* Owner */}
          <section>
            <h2 className="text-lg font-semibold mb-2">Owner Details</h2>
            <p>
              <strong>Name:</strong> {shop.owner}
            </p>
            <p>
              <strong>Email:</strong> {shop.email}
            </p>
          </section>

          {/* Actions */}
          <div className="pt-4 flex flex-wrap gap-3">
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              Edit Profile
            </button>
            <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100">
              Upload Logo / Banner
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
