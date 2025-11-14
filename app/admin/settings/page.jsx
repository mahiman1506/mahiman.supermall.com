"use client";

import { useState, useEffect } from "react";
import PlatformInfo from "./components/PlatformInfo";
import ShopManagement from "./components/ShopManagement";
import ProductSettings from "./components/ProductSettings";
import UserManagement from "./components/UserManagement";
import PaymentSettings from "./components/PaymentSettings";
import OrderSettings from "./components/OrderSettings";
import SecuritySettings from "./components/SecuritySettings";
import SystemSettings from "./components/SystemSettings";
import NotificationSettings from "./components/NotificationSettings";
import DangerZone from "./components/DangerZone";
import { getSettings } from "@/lib/firestore/settings/read";
import { LogOutIcon } from "lucide-react";
import { getAuth, signOut } from "firebase/auth";
import { useRouter } from "next/navigation";

export default function AdminSettings() {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("1");
  const router = useRouter();

  // 🔹 Load settings data
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const settingsData = await getSettings();
        setSettings(settingsData);
      } catch (error) {
        console.error("Failed to load settings:", error);
      } finally {
        setLoading(false);
      }
    };
    loadSettings();
  }, []);

  // 🔹 Tabs
  const tabs = [
    {
      id: "1",
      icon: "🏢",
      label: "Platform Info",
      component: <PlatformInfo initialData={settings?.platformInfo} />,
    },
    {
      id: "2",
      icon: "🏪",
      label: "Shop Management",
      component: <ShopManagement initialData={settings?.shopManagement} />,
    },
    {
      id: "3",
      icon: "📦",
      label: "Product Settings",
      component: (
        <ProductSettings
          initialData={settings?.productSettings}
          categories={settings?.categories}
        />
      ),
    },
    {
      id: "4",
      icon: "👥",
      label: "User Management",
      component: <UserManagement initialData={settings?.userManagement} />,
    },
    {
      id: "5",
      icon: "💳",
      label: "Payment & Payouts",
      component: <PaymentSettings initialData={settings?.paymentSettings} />,
    },
    {
      id: "6",
      icon: "🛍️",
      label: "Order Settings",
      component: <OrderSettings initialData={settings?.orderSettings} />,
    },
    {
      id: "7",
      icon: "🔒",
      label: "Security",
      component: <SecuritySettings initialData={settings?.securitySettings} />,
    },
    {
      id: "8",
      icon: "⚙️",
      label: "System",
      component: <SystemSettings initialData={settings?.systemSettings} />,
    },
    {
      id: "9",
      icon: "🔔",
      label: "Notifications",
      component: (
        <NotificationSettings initialData={settings?.notificationSettings} />
      ),
    },
    {
      id: "10",
      icon: "⚠️",
      label: "Danger Zone",
      component: <DangerZone initialData={settings?.dangerZone} />,
    },
  ];

  // 🔹 Logout
  const handleLogout = async () => {
    try {
      const auth = getAuth();
      await signOut(auth);
      router.push("/login");
    } catch (error) {
      console.error("Logout failed:", error);
      alert("Logout failed. Please try again.");
    }
  };

  // 🔹 Loading spinner
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[600px]">
        <div className="w-12 h-12 border-4 border-gray-200 border-t-indigo-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold">Platform Settings</h1>
        <p className="text-gray-600 mt-2 text-sm sm:text-base">
          Manage your platform's configuration and customize its behavior
        </p>
      </div>

      <div className="bg-white rounded-lg shadow flex flex-col md:flex-row min-h-[600px] overflow-hidden">
        {/* 🔹 Mobile Tabs */}
        <div className="md:hidden border-b border-gray-200 overflow-x-auto">
          <nav className="flex space-x-4 px-3 py-3">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-2 flex items-center space-x-2 text-sm whitespace-nowrap transition
                  ${
                    activeTab === tab.id
                      ? "bg-indigo-100 text-indigo-600 rounded-md font-medium"
                      : "text-gray-600 hover:bg-gray-50 rounded-md"
                  }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}

            {/* Logout for mobile */}
            <button
              onClick={handleLogout}
              className="px-3 py-2 flex items-center space-x-2 text-sm text-red-600 hover:bg-red-50 rounded-md"
            >
              <LogOutIcon className="h-4 w-4" />
              <span>Logout</span>
            </button>
          </nav>
        </div>

        {/* 🔹 Desktop Sidebar */}
        <div className="hidden md:flex flex-col w-64 border-r border-gray-200 bg-gray-50">
          <nav className="flex-1 py-4 space-y-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full text-left px-4 py-2 flex items-center space-x-3 text-sm transition
                  ${
                    activeTab === tab.id
                      ? "bg-indigo-50 text-indigo-600 border-r-2 border-indigo-600 font-medium"
                      : "text-gray-700 hover:bg-gray-100 hover:text-indigo-600"
                  }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>

          {/* 🔹 Logout Button (Desktop) */}
          <div className="border-t border-gray-200 p-4">
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-red-600 font-medium hover:text-red-700 transition w-full"
            >
              <LogOutIcon className="h-5 w-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>

        {/* 🔹 Content Area */}
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto">
          {tabs.find((tab) => tab.id === activeTab)?.component}
        </div>
      </div>
    </div>
  );
}
