"use client";

import { useEffect, useState, useContext } from "react";
import Link from "next/link";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { app } from "@/lib/firestore/firebase";
import UserHeader from "../components/Header";
import { AuthContext } from "@/contexts/AuthContext";

export default function OffersPage() {
  const { user, loading: authLoading } = useContext(AuthContext);
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const db = getFirestore(app);

  // Function to determine status
  const getStatus = (startDate, endDate) => {
    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (now < start)
      return { label: "Upcoming", color: "bg-yellow-100 text-yellow-700" };
    if (now > end)
      return { label: "Expired", color: "bg-red-100 text-red-700" };
    return { label: "Active", color: "bg-green-100 text-green-700" };
  };

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "offers"));
        const offersData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setOffers(offersData);
      } catch (error) {
        console.error("Error fetching offers:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOffers();
  }, []);

  return (
    <main className="min-h-screen bg-gray-50">
      <UserHeader />

      <section className="max-w-7xl mx-auto px-4 py-25">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">All Offers</h1>

        {authLoading ? (
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : !user ? (
          <div className="text-center py-20">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Please Login First
            </h2>
            <p className="text-gray-600 mb-6">
              You need to be logged in to view the offers
            </p>
            <button
              onClick={() => router.push("/login")}
              className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
            >
              Go to Login
            </button>
          </div>
        ) : loading ? (
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : offers.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {offers.map((offer) => {
              const status = getStatus(offer.startDate, offer.endDate);
              return (
                <div
                  key={offer.id}
                  className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 p-5"
                >
                  {offer.bannerImageURL && (
                    <div className="flex justify-center">
                      <img
                        src={offer.bannerImageURL}
                        alt={`${offer.name} banner`}
                        className="h-40 object-cover rounded-xl mb-4"
                      />
                    </div>
                  )}

                  <div className="flex items-center justify-between mb-2">
                    <h2 className="text-2xl font-semibold text-gray-800">
                      {offer.name || "Unnamed Offer"}
                    </h2>
                    <span
                      className={`text-xs font-semibold px-2.5 py-1 rounded-full ${status.color}`}
                    >
                      {status.label}
                    </span>
                  </div>

                  <div className="text-gray-600 text-sm space-y-1">
                    {offer.type && (
                      <p>
                        <span className="font-medium text-gray-700">Type:</span>{" "}
                        {offer.type}
                      </p>
                    )}
                    {offer.offerCode && (
                      <p>
                        <span className="font-medium text-gray-700">
                          Offer Code:
                        </span>{" "}
                        <span className="bg-blue-100 text-blue-700 font-semibold px-2 py-0.5 rounded">
                          {offer.offerCode}
                        </span>
                      </p>
                    )}
                    {offer.minimumPurchase && (
                      <p>
                        <span className="font-medium text-gray-700">
                          Min Purchase:
                        </span>{" "}
                        ₹{offer.minimumPurchase}
                      </p>
                    )}
                    {offer.maxDiscount && (
                      <p>
                        <span className="font-medium text-gray-700">
                          Max Discount:
                        </span>{" "}
                        ₹{offer.maxDiscount}
                      </p>
                    )}
                    {offer.usageLimit && (
                      <p>
                        <span className="font-medium text-gray-700">
                          Usage Limit:
                        </span>{" "}
                        {offer.usageLimit}
                      </p>
                    )}
                    {offer.applicableOn && (
                      <p>
                        <span className="font-medium text-gray-700">
                          Applicable On:
                        </span>{" "}
                        {offer.applicableOn}
                      </p>
                    )}
                    {offer.startDate && offer.endDate && (
                      <p>
                        <span className="font-medium text-gray-700">
                          Duration:
                        </span>{" "}
                        {new Date(offer.startDate).toLocaleDateString()} -{" "}
                        {new Date(offer.endDate).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-center text-gray-500 py-20">
            No offers found in Firestore.
          </p>
        )}
      </section>
    </main>
  );
}
