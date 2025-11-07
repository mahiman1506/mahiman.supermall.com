"use client";

import { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import AdminHeader from "./Header";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import Loading from "@/app/loading";


export default function AdminLayout({ children }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const { user, role, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        // If user is signed out (no role and not loading), redirect to login
        if (!loading && !role) {
            router.push('/login');
            return;
        }

        // If user is authenticated but not an admin, show alert then redirect to dashboard
        if (!loading && role && role !== "admin") {
            // show a simple alert to inform user
            // In future this can be replaced with a nicer toast/notification
            alert('You are not an admin');
            router.push('/dashboard');
        }
    }, [role, loading, router]);

    if (loading) return <Loading />; // wait for auth check
    if (role !== "admin") return null;

    return (
        <main className="bg-[#F0F7FF] min-h-screen">
            <div className="flex">
                {/* Sidebar */}
                <Sidebar
                    isOpen={isSidebarOpen}
                    onClose={() => setIsSidebarOpen(false)}
                />

                {/* Main Content Area */}
                <div className="flex-1 flex flex-col ml-0 md:ml-[300px] overflow-y-auto">
                    <AdminHeader
                        isSidebarOpen={isSidebarOpen}
                        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
                    />
                    <section className="flex-1 pt-24 pl-4 pr-4">{children}</section>
                </div>
            </div>
        </main>
    );
}
