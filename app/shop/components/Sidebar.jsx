"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    BadgePercentIcon,
    LayoutDashboard,
    PackageSearch,
    Settings,
    ShoppingBag,
    Store,
    Tags
} from "lucide-react";

export default function ShopSidebar({ isOpen, onClose }) {
    const pathname = usePathname();

    const menuItems = [
        {
            name: "Dashboard",
            icon: <LayoutDashboard className="h-5 w-5" />,
            href: "/shop",
        },
        {
            name: "Products",
            icon: <ShoppingBag className="h-5 w-5" />,
            href: "/shop/products",
        },
        {
            name: "Offers",
            icon: <BadgePercentIcon className="h-5 w-5" />,
            href: "/shop/offers",
        },
        {
            name: "Orders",
            icon: <PackageSearch className="h-5 w-5" />,
            href: "/shop/orders",
        },
        {
            name: "Profile",
            icon: <Store className="h-5 w-5" />,
            href: "/shop/profile",
        },
        {
            name: "Settings",
            icon: <Settings className="h-5 w-5" />,
            href: "/shop/settings",
        },
    ];

    const baseStyle = "transition-all duration-300 ease-in-out";
    const mobilePosition = isOpen ? "left-0" : "-left-64";
    const sidebarStyle = `${baseStyle} md:sticky fixed top-0 z-40 h-[100dvh] w-64 bg-[#1E1E2F] text-white flex-shrink-0 ${mobilePosition} md:translate-x-0 transform border-r border-gray-800`;

    return (
        <>
            {/* Sidebar */}
            <aside className={sidebarStyle}>
                {/* Logo Area */}
                <div className="flex items-center gap-2 px-6 py-5 h-16 border-b border-gray-800">
                    <Store className="h-6 w-6" />
                    <span className="text-xl font-semibold">Shop Panel</span>
                </div>

                {/* Navigation */}
                <nav className="flex-1 overflow-y-auto px-3 py-4">
                    <div className="space-y-1">
                        {menuItems.map((item) => {
                            const isActive = pathname === item.href;
                            const itemStyle = `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
                                isActive
                                    ? "bg-blue-600 text-white font-medium shadow-md"
                                    : "text-gray-400 hover:bg-white/10 hover:text-white"
                            }`;

                            return (
                                <Link key={item.name} href={item.href} className="block">
                                    <div className={itemStyle}>
                                        {item.icon}
                                        <span className="text-sm">{item.name}</span>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                </nav>
            </aside>

            {/* Mobile Overlay */}
            {isOpen && (
                <div
                    className="md:hidden fixed inset-0 bg-black/50 z-30 backdrop-blur-sm transition-opacity"
                    onClick={onClose}
                />
            )}
        </>
    );
}