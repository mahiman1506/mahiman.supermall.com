"use client";

import { useState, useEffect, useRef } from "react";
import { getAuth, signOut, updateProfile } from "firebase/auth";
import { ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "@/lib/firestore/firebase";
import {
    MenuIcon,
    X,
    LayoutDashboardIcon,
    UserIcon,
    SettingsIcon,
    LogOutIcon
} from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AdminHeader({ isSidebarOpen, onToggleSidebar }) {
    const [showLogout, setShowLogout] = useState(false);
    const [showUserInfo, setShowUserInfo] = useState(false);
    const [user, setUser] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [newName, setNewName] = useState("");
    const router = useRouter();

    const userRef = useRef(null);
    const settingsRef = useRef(null);

    const handleSettingsClick = () => {
        setShowLogout(!showLogout);
        setShowUserInfo(false);
        setIsEditing(false);
    };

    const handleUserClick = () => {
        setShowUserInfo(!showUserInfo);
        setShowLogout(false);
        setIsEditing(false);
    };

    const handleLogout = async () => {
        const auth = getAuth();
        try {
            await signOut(auth);
            router.push("/login");
        } catch (error) {
            console.error("Logout Error:", error);
        }
    };

    const handleNameUpdate = async () => {
        try {
            const auth = getAuth();
            if (auth.currentUser && newName.trim() !== "") {
                await updateProfile(auth.currentUser, { displayName: newName });
                setUser((prev) => ({ ...prev, name: newName }));
                setIsEditing(false);
            }
        } catch (error) {
            console.error("Error updating name:", error);
        }
    };

    const handlePhotoChange = async (e) => {
        const file = e.target.files && e.target.files[0];
        if (!file) return;

        const auth = getAuth();
        if (!auth.currentUser) return;

        setUploading(true);
        try {
            const fileRef = storageRef(storage, `profileImages/${auth.currentUser.uid}/${file.name}`);
            await uploadBytes(fileRef, file);
            const downloadURL = await getDownloadURL(fileRef);

            await updateProfile(auth.currentUser, { photoURL: downloadURL });
            setUser((prev) => ({ ...prev, photoURL: downloadURL }));
        } catch (error) {
            console.error("Error uploading profile image:", error);
        } finally {
            setUploading(false);
        }
    };

    // Close dropdowns on outside click
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                userRef.current && !userRef.current.contains(event.target) &&
                settingsRef.current && !settingsRef.current.contains(event.target)
            ) {
                setShowLogout(false);
                setShowUserInfo(false);
                setIsEditing(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Fetch current user
    useEffect(() => {
        const auth = getAuth();
        const currentUser = auth.currentUser;

        if (currentUser) {
            setUser({
                name: currentUser.displayName || "No Name",
                email: currentUser.email,
                photoURL: currentUser.photoURL || null,
            });
        }

        const unsubscribe = auth.onAuthStateChanged((user) => {
            if (user) {
                setUser({
                    name: user.displayName || "No Name",
                    email: user.email,
                    photoURL: user.photoURL || null,
                });
            } else {
                setUser(null);
            }
        });

        return () => unsubscribe();
    }, []);

    return (
        <header className="fixed top-0 md:left-75 left-0 right-0 md:z-50 flex items-center justify-between px-6 h-20 bg-[#F8FAFC] rounded-b-lg shadow-sm">
            {/* Left: Menu Button (Mobile) */}
            <button
                onClick={onToggleSidebar}
                className="md:hidden p-2 rounded-lg hover:bg-gray-200 transition"
            >
                {isSidebarOpen ? (
                    <X className="h-6 w-6 text-[#1E1E2F]" />
                ) : (
                    <MenuIcon className="h-6 w-6 text-[#1E1E2F]" />
                )}
            </button>

            {/* Center: Title */}
            <Link href={"/"}>
                <h1 className="flex items-center justify-center gap-3 text-[#1E1E2F] mx-auto md:mx-0">

                    <LayoutDashboardIcon className="h-8 w-8 md:h-10 md:w-10" />
                    <span className="font-semibold text-2xl md:text-3xl">Admin Panel</span>
                </h1>
            </Link>

            {/* Right: Icons */}
            <div className="flex items-center gap-4 relative">
                {/* User Icon */}
                <div ref={userRef} className="relative">
                    <button onClick={handleUserClick}>
                        <UserIcon className={`h-6 w-6 text-[#1E1E2F] cursor-pointer transition-transform`} />
                    </button>

                    {showUserInfo && user && (
                        <div className="absolute right-0 top-12 w-64 sm:w-72 bg-white shadow-lg rounded-xl p-4 flex flex-col gap-3 z-50">
                            {isEditing ? (
                                <>
                                    <input
                                        type="text"
                                        value={newName}
                                        onChange={(e) => setNewName(e.target.value)}
                                        className="border border-gray-300 p-2 rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm"
                                        placeholder="Enter new name"
                                    />
                                    <div className="flex justify-end gap-2">
                                        <button
                                            onClick={() => setIsEditing(false)}
                                            className="px-3 py-1 rounded-lg bg-gray-100 hover:bg-gray-200 text-sm"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={handleNameUpdate}
                                            className="px-3 py-1 rounded-lg bg-green-600 text-white hover:bg-green-700 text-sm"
                                        >
                                            Save
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="flex items-center gap-4">
                                        {user.photoURL ? (
                                            <img
                                                src={user.photoURL}
                                                alt="avatar"
                                                className="w-12 rounded-lg object-cover border border-gray-200"
                                            />
                                        ) : (
                                            <div className="h-12 w-12 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 font-semibold text-lg">
                                                {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                                            </div>
                                        )}
                                        <div className="flex flex-col">
                                            <p className="font-semibold text-gray-800 text-sm truncate">{user.name}</p>
                                            <p className="text-xs text-gray-500 truncate">{user.email}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between gap-3">
                                        <button
                                            onClick={() => {
                                                setIsEditing(true);
                                                setNewName(user.name);
                                            }}
                                            className="text-sm hover:underline hover:cursor-pointer"
                                        >
                                            Edit Name
                                        </button>

                                        <label className="text-sm cursor-pointer inline-flex items-center gap-2">
                                            {uploading ? (
                                                <span className="text-xs text-gray-500">Uploading...</span>
                                            ) : (
                                                <>
                                                    <span className="hover:underline hover:cursor-pointer">Change Image</span>
                                                    <input
                                                        type="file"
                                                        accept="image/*"
                                                        className="hidden"
                                                        onChange={handlePhotoChange}
                                                    />
                                                </>
                                            )}
                                        </label>
                                    </div>
                                </>
                            )}
                        </div>
                    )}
                </div>

                {/* Settings Icon */}
                <div ref={settingsRef} className="relative">
                    <button onClick={handleSettingsClick}>
                        <SettingsIcon
                            className={`h-6 w-6 text-[#1E1E2F] cursor-pointer transition-transform duration-500 ${showLogout ? "rotate-[90deg]" : "rotate-0"}`}
                        />
                    </button>

                    {showLogout && (
                        <div className="absolute right-0 top-12 bg-white shadow-md rounded-lg p-2 w-32 z-50">
                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-2 w-full text-left px-3 py-2 rounded-lg hover:bg-gray-100 transition"
                            >
                                <LogOutIcon className="h-5 w-5 text-red-500" />
                                <span>Logout</span>
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}
