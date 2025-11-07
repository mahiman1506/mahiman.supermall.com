"use client"

import Link from "next/link";
import UserHeader from "./components/Header";
import { Building2Icon, LogInIcon, SearchIcon, ShoppingBagIcon, StoreIcon, TagIcon, UserPlus2Icon } from "lucide-react";
import { useCategory } from "@/lib/firestore/categories/read";
import { useOffer } from "@/lib/firestore/offers/read";
import Image from "next/image";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";

export default function Home() {
  const { data: category } = useCategory();
  const { data: offer } = useOffer();
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col bg-slate-900 text-white">
      {/* Header */}
      <UserHeader />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-indigo-600 to-blue-700 py-24 text-center">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-4xl font-bold mb-4">Welcome to Super Mall</h2>
          <p className="text-lg text-gray-200 mb-8">
            Discover your favorite stores, exclusive offers, and premium brands — all in one digital mall.
          </p>
          <button
            className="bg-yellow-400 text-slate-900 px-6 py-3 rounded-full font-semibold hover:bg-yellow-300 transition"
          >
            Start Shopping
          </button>
        </div>
      </section>

      {authLoading ? (
        <div className="flex-1 flex justify-center items-center">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : !user ? (
        <section className="flex-1 flex flex-col items-center justify-center py-16 text-center px-4">
          <h2 className="text-3xl font-bold mb-6">Please Login to Access Super Mall</h2>
          <p className="text-gray-300 mb-8 max-w-md">
            Login to explore our categories, exclusive offers, and start shopping at Super Mall
          </p>
          <div className="space-x-4">
            <button
              onClick={() => router.push('/login')}
              className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
            >
              Login
            </button>
            <button
              onClick={() => router.push('/signup')}
              className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors"
            >
              Sign Up
            </button>
          </div>
        </section>
      ) : (
        <>
          {/* Quick Categories */}
          <section className="py-16 max-w-6xl mx-auto px-6">
            <h3 className="text-2xl font-semibold text-center mb-10">Browse Categories</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {category && category.length > 0 ? (
                category.map((cat) => (
                  <div key={cat.id} className="flex flex-col items-center">
                    <img src={cat.categoryImageURL} alt={cat.categoryImageURL || "No image"} className="h-24 object-cover rounded-lg mb-2" />
                    <h4 className="font-semibold text-white">{cat.name}</h4>
                  </div>
                ))
              ) : (
                <p className="text-gray-400 col-span-full text-center">No categories available.</p>
              )}
            </div>
          </section>

          {/* Offers Section */}
          <section className="py-16 bg-slate-800">
            <div className="max-w-6xl mx-auto px-6 text-center">
              <h3 className="text-2xl font-semibold mb-10">Exclusive Offers</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {offer && offer.length > 0 ? (
                  offer.map((off) => (
                    <div
                      key={off.id}
                      className="bg-slate-700 rounded-xl shadow hover:shadow-yellow-400/30 p-6 transition"
                    >
                      <div className="flex items-center justify-center h-40 w-full mb-4">
                        <img
                          src={off.bannerImageURL || "/window.svg"}
                          alt={off.name || "Offer"}
                          className="object-cover rounded-lg h-full"
                        />
                      </div>

                      <h4 className="font-medium text-white mb-2">{off.name}</h4>
                      <p className="text-gray-300 text-sm">{off.description}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-400 col-span-full text-center">No offers available.</p>
                )}
              </div>
            </div>
          </section>
        </>
      )}

      {/* Footer */}
      <footer className="bg-slate-900 text-gray-400 py-8 border-t border-slate-800 text-center">
        <p>© {new Date().getFullYear()} Super Mall — All rights reserved.</p>
      </footer>
    </div>
  );
}
