"use client";

import { useEffect, useState } from "react";
import {
  Package,
  Tag,
  Store,
  Users,
  ChevronRight,
  LineChart,
} from "lucide-react";
import { getProducts } from "@/lib/firestore/products/read_server";
import { getAllOffers } from "@/lib/firestore/offers/read_server";
import { getAllShops } from "@/lib/firestore/shop/read_server";
import { getAllUsers } from "@/lib/firestore/users/read_server";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    products: 0,
    offers: 0,
    shops: 0,
    users: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [p, o, s, u] = await Promise.all([
          getProducts(),
          getAllOffers(),
          getAllShops(),
          getAllUsers(),
        ]);

        setStats({
          products: p?.length || 0,
          offers: o?.length || 0,
          shops: s?.length || 0,
          users: u?.length || 0,
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  return (
    <div className="w-full flex justify-center py-8">
      <div className="max-w-7xl w-full px-6 animate-fadeIn">
        <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            icon={<Package size={32} />}
            title="Total Products"
            value={stats.products}
            loading={loading}
          />

          <StatCard
            icon={<Tag size={32} />}
            title="Total Offers"
            value={stats.offers}
            loading={loading}
          />

          <StatCard
            icon={<Store size={32} />}
            title="Total Shops"
            value={stats.shops}
            loading={loading}
          />

          <StatCard
            icon={<Users size={32} />}
            title="Total Users"
            value={stats.users}
            loading={loading}
          />
        </div>

        {/* Recent Activity */}
        <div className="mt-10">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <LineChart size={20} /> Recent Activity
          </h2>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <p className="text-gray-500 text-center py-8">No recent activity</p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* Animated Number Component */
function AnimatedNumber({ value, duration = 1000 }) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let start = 0;
    let startTime = null;

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const currentValue = Math.floor(progress * value);
      setDisplayValue(currentValue);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setDisplayValue(value);
      }
    };

    requestAnimationFrame(animate);
  }, [value, duration]);

  return <span>{displayValue.toLocaleString()}</span>;
}

/* Card Component */
function StatCard({ title, value, icon, loading }) {
  return (
    <div
      className="
            bg-white rounded-xl shadow-sm p-6
            transition-all duration-300
            hover:shadow-lg hover:-translate-y-1
            animate-slideUp
        "
    >
      <div className="flex items-center justify-between">
        <div className="text-gray-500">{icon}</div>
        <ChevronRight className="text-gray-300" />
      </div>

      <h3 className="text-gray-500 text-sm font-medium mt-3">{title}</h3>

      <p className="text-4xl font-bold mt-2">
        {loading ? "..." : <AnimatedNumber value={value} />}
      </p>
    </div>
  );
}
