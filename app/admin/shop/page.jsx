"use client";

import Listview from "./components/Listview";
import { StoreIcon } from "lucide-react";
import { useState } from "react";
import Loading from "./loading";
import { useRouter } from "next/navigation";

export default function Page() {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleCreateClick = () => {
        setIsLoading(true);
        // Simulate short loading delay before navigation
        setTimeout(() => {
            router.push("/admin/shop/Form");
        }, 800);
    };

    return (
        <main className="flex flex-col gap-5">
            {/* Header */}
            <div className="flex items-center justify-between bg-[#E2E8F0] rounded-lg px-6 py-3 shadow">
                {/* Left: Icon + Title */}
                <h1 className="flex items-center gap-3 text-lg font-semibold text-gray-800">
                    <StoreIcon size={22} />
                    Shop
                </h1>

                {/* Right: Button */}
                <button
                    onClick={handleCreateClick}
                    disabled={isLoading}
                    className={`px-4 py-2 rounded-md font-medium shadow transition-all duration-200 ${isLoading
                            ? "bg-gray-400 text-white cursor-not-allowed"
                            : "bg-white text-black hover:text-white hover:bg-[#38BDF8]"
                        }`}
                >
                    {isLoading ? <Loading /> : "Create"}
                </button>
            </div>

            {/* Listview */}
            <Listview />
        </main>
    );
}
