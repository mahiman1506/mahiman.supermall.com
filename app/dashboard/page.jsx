"use client"
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";

export default function Page() {

    const { role } = useAuth();

    return (
        <div>
            <h1>User Dashboard</h1>
            <Link href={"/"}>
                <h1>Home</h1>
            </Link>
            {role === "admin" ? (
                <Link href="/admin">
                    <h1>Admin panel</h1>
                </Link>
            ) : (
                <Link className="hidden " href="/admin">
                    <h1>Admin panel</h1>
                </Link>
            )}

            {role === "shop" ? (
                <Link href={"/shopLayout"}>
                    <h1>Shop panel</h1>
                </Link>
            ) : (
                <Link className="hidden " href={"/shopLayout"}>
                    <h1>Shop panel</h1>
                </Link>
            )}

        </div>
    )
}