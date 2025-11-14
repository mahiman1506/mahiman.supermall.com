"use client";

import { useEffect, useState } from "react";
import ShopHeader from "./Header";
import ShopSidebar from "./Sidebar";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import Loading from "@/app/loading";
import { useShop } from "@/lib/firestore/shop/read";

export default function ShopLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { user, role, loading } = useAuth();
  const { data: shopData, isLoading: shopLoading } = useShop();
  const router = useRouter();

  useEffect(() => {
    // If user is signed out (no role and not loading), redirect to login
    if (!loading && !role) {
      router.push("/login");
      return;
    }

    // If user is authenticated but not a shop owner, show alert then redirect to dashboard
    if (!loading && role && role !== "shop") {
      alert("You do not have shop access privileges");
      router.push("/dashboard");
    }
  }, [role, loading, router]);

  // wait for auth check
  if (loading) return <Loading />;

  // wait for shop data to load before rendering layout
  if (shopLoading) return <Loading />;
  if (role !== "shop") return null;

  return (
    <main className="bg-[#F0F7FF] min-h-screen">
      <div className="flex">
        {/* Sidebar */}
        <ShopSidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />

        {/* Main Content Area */}
        <div className="flex-1">
          {/* Header */}
          <ShopHeader
            isSidebarOpen={isSidebarOpen}
            onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          />

          {/* Page Content */}
          <section className="flex-1 pt-24 px-4 md:px-6">{children}</section>
        </div>
      </div>
    </main>
  );
}
