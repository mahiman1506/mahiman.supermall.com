"use client";

import { useOffer } from "@/lib/firestore/offers/read";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function OfferAnalyticsPage() {
  const { data: offers = [], isLoading: loading } = useOffer();

  if (loading)
    return (
      <div className="flex justify-center py-20">
        <div className="w-10 h-10 border-4 border-gray-400 border-t-black rounded-full animate-spin" />
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow p-8">
        <Link
          href="/shop/offers"
          className="inline-flex gap-2 text-gray-600 mb-6"
        >
          <ArrowLeft /> Back
        </Link>

        <h1 className="text-3xl font-bold mb-6">Offer Analytics</h1>

        {offers.length === 0 ? (
          <p className="text-center text-gray-500 py-10">No offers found.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {offers.map((o) => {
              const used = Number(o.totalUsed || 0);
              const given = Number(o.totalDiscountGiven || 0);
              const limit = Number(o.globalLimit || 0);

              const start = new Date(o.startDate);
              const end = new Date(o.endDate);
              const now = new Date();

              const daysLeft = Math.ceil((end - now) / (1000 * 60 * 60 * 24));

              return (
                <div
                  key={o.id}
                  className="rounded-lg border p-5 bg-gray-50 flex flex-col gap-3"
                >
                  <div className="flex justify-between">
                    <h2 className="font-bold text-lg">{o.name}</h2>

                    <span
                      className={`px-3 py-1 rounded-full text-xs
                      ${
                        o.status === "Active"
                          ? "bg-green-100 text-green-700"
                          : o.status === "Expired"
                          ? "bg-red-100 text-red-700"
                          : "bg-gray-200 text-gray-700"
                      }`}
                    >
                      {o.status}
                    </span>
                  </div>

                  <p className="text-xs text-gray-500 uppercase">
                    {o.offerCode}
                  </p>

                  <p className="text-sm">
                    <strong>Type:</strong> {o.type}
                  </p>

                  <p className="text-sm">
                    <strong>Start:</strong> {o.startDate}
                  </p>

                  <p className="text-sm">
                    <strong>End:</strong> {o.endDate}
                  </p>

                  {o.status === "Active" && (
                    <p className="text-sm text-green-500">
                      ⏳ {daysLeft >= 0 ? `${daysLeft} days left` : "Expired"}
                    </p>
                  )}

                  <div className="border-t pt-3 mt-2 text-sm">
                    <p>
                      <strong>Used:</strong> {used} {limit > 0 && `/ ${limit}`}
                    </p>

                    <p className="">
                      <strong>Discount Given:</strong> ₹{given}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
