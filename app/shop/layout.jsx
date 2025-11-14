"use client";

import { AuthProvider } from "@/contexts/AuthContext";
import ShopLayout from "./components/ShopLayout";

export default function Layout({ children }) {
    return (
        <ShopLayout>
            <AuthProvider>
                {children}
            </AuthProvider>
        </ShopLayout>
    );
}