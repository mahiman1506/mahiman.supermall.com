"use client";

import { useState } from "react";
import {
    BadgePercentIcon,
    Building,
    LayoutDashboard,
    SettingsIcon,
    StoreIcon,
    Tags,
} from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";

export default function Sidebar({ isOpen, onClose }) {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const pathName = usePathname();

    const menu = [
        { id: 1, name: "Dashboard", link: "/admin", icon: <LayoutDashboard className="h-5 w-5" /> },
        { id: 2, name: "Shop", link: "/admin/shop", icon: <StoreIcon className="h-5 w-5" /> },
        // { id: 3, name: "Offers", link: "/admin/offers", icon: <BadgePercentIcon className="h-5 w-5" /> },
        { id: 3, name: "Categories", link: "/admin/categories", icon: <Tags className="h-5 w-5" /> },
        { id: 4, name: "Floors", link: "/admin/floors", icon: <Building className="h-5 w-5" /> },
        { id: 5, name: "Settings", link: "/admin/settings", icon: <SettingsIcon className="h-5 w-5" /> },
    ];

    const handleClick = (link) => {
        setIsLoading(true);
        onClose?.(); // close sidebar on mobile
        router.push(link);
        // Optional: remove loading after short delay
        setTimeout(() => setIsLoading(false), 800);
    };

    return (
        <>
            {/* ✅ Loading Overlay */}
            {isLoading && (
                <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-[999]">
                    <div className="flex flex-col items-center gap-3 bg-white px-6 py-5 rounded-2xl shadow-lg">
                        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                        <p className="text-gray-700 font-medium">Loading...</p>
                    </div>
                </div>
            )}

            {/* Sidebar Overlay (mobile only) */}
            <div
                onClick={onClose}
                className={`fixed inset-0 bg-black/40 z-30 md:hidden transition-opacity duration-300 ${isOpen ? "opacity-100 visible" : "opacity-0 invisible"
                    }`}
            ></div>

            {/* Sidebar Container */}
            <aside
                className={`fixed top-0 left-0 z-40 h-screen w-[280px] bg-[#1E293B] flex flex-col justify-between transform transition-transform duration-300 ease-in-out
                    ${isOpen ? "translate-x-0" : "-translate-x-full"}
                    md:translate-x-0 md:w-[300px]`}
            >
                <div className="flex flex-col gap-10 mt-5 overflow-y-auto h-full">
                    {/* Logo */}
                    <Link href={"/"}>
                        <h1 className="flex items-center justify-center gap-3 p-5 text-[#F8FAFC]">
                            <Building className="h-10 w-10" />
                            <span className="font-semibold text-3xl whitespace-nowrap">
                                Super Mall
                            </span>
                        </h1>
                    </Link>

                    {/* Menu */}
                    <ul className="flex flex-col gap-2 px-4">
                        {menu.map((item) => {
                            const itemPath = item.link;
                            const isSelected =
                                pathName === itemPath ||
                                (itemPath !== "/admin" && pathName.startsWith(`${itemPath}/`));

                            return (
                                <li key={item.id}>
                                    <button
                                        onClick={() => handleClick(item.link)}
                                        className={`flex w-full items-center gap-3 px-3 py-2 rounded-md text-left transition-all duration-200 cursor-pointer
                                            ${isSelected
                                                ? "bg-[#F3E2A7] text-black font-semibold"
                                                : "text-[#F8FAFC] hover:bg-[#334155]"
                                            }`}
                                    >
                                        {item.icon}
                                        <span className="capitalize">{item.name}</span>
                                    </button>
                                </li>
                            );
                        })}
                    </ul>
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-gray-700 text-[#CBD5E1] text-sm">
                    <p>© 2025 Super Mall</p>
                </div>
            </aside>
        </>
    );
}
