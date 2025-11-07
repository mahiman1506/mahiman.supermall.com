"use client"

import { AuthProvider } from "@/contexts/AuthContext";
import AdminLayout from "./components/AdminLayout";

export default function Layout({ children }) {
    return (
        <AdminLayout>
            <AuthProvider>
                {children}
            </AuthProvider>
        </AdminLayout>

    );
}