"use client"

import { useEffect, useRef, useState } from "react";
import { BadgePercentIcon, Building2Icon, BuildingIcon, HomeIcon, InfoIcon, LayoutDashboardIcon, LogInIcon, LogOutIcon, Menu, PhoneIcon, SettingsIcon, StoreIcon, TagsIcon, UserIcon, X } from "lucide-react";
import { getAuth, onAuthStateChanged, signOut, updateProfile } from "firebase/auth";
import { ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";
import { app, storage } from "@/lib/firestore/firebase";
import { useAuth } from "@/contexts/AuthContext";
import { getCategories } from "@/lib/firestore/categories/read_server";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getFloor } from "@/lib/firestore/floors/read_server";



export default function UserHeader() {
    const [isOpen, setIsOpen] = useState(false);
    const [showUserInfo, setShowUserInfo] = useState(false);
    const [showLogout, setShowLogout] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [newName, setNewName] = useState("");
    const [uploading, setUploading] = useState(false);
    const [user, setUser] = useState(null);
    const [categories, setCategories] = useState([]);
    const [floor, setFloor] = useState([]);
    const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
    const [showFloorDropdown, setShowFloorDropdown] = useState(false);

    // const router = useRouter();

    const auth = getAuth(app);
    const { role } = useAuth();

    const userRef = useRef(null);
    const settingsRef = useRef(null);

    // Fetch categories from Firebase
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const data = await getCategories();
                setCategories(data);
            } catch (err) {
                console.error("Error fetching categories:", err);
            }
        };
        fetchCategories();
    }, []);

    // Fetch Floor from Firebase
    useEffect(() => {
        const fetchFloor = async () => {
            try {
                const data = await getFloor();
                setFloor(data);
            } catch (err) {
                console.error("Error fetching Floor:", err);
            }
        };
        fetchFloor();
    }, []);

    // Auth state listener
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            if (currentUser) {
                setUser({
                    name: currentUser.displayName || "No Name",
                    email: currentUser.email,
                    photoURL: currentUser.photoURL || null,
                });
            } else {
                setUser(null);
            }
        });
        return () => unsubscribe();
    }, []);

    const handleSettingsClick = () => {
        setShowLogout((prev) => !prev);
        setShowUserInfo(false);
    };

    const handleUserClick = () => {
        setShowUserInfo((prev) => !prev);
        setShowLogout(false);
    };

    const handlePhotoChange = async (e) => {
        const file = e.target.files && e.target.files[0];
        if (!file || !auth.currentUser) return;

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

    const handleLogout = async () => {
        await signOut(auth);
        setIsOpen(false);
    };

    const handleNameUpdate = async () => {
        try {
            if (auth.currentUser && newName.trim() !== "") {
                await updateProfile(auth.currentUser, { displayName: newName });
                setUser((prev) => ({ ...prev, name: newName }));
                setIsEditing(false);
            }
        } catch (error) {
            console.error("Error updating name:", error);
        }
    };

    // Close dropdowns on outside click
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                userRef.current && !userRef.current.contains(event.target) &&
                settingsRef.current && !settingsRef.current.contains(event.target)
            ) {
                setShowUserInfo(false);
                setShowLogout(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const menuList = [
        { id: 1, name: "Home", link: "/", icon: <HomeIcon className="h-5 w-5" /> },
        { id: 2, name: "Store", link: "/store", icon: <StoreIcon className="h-5 w-5" /> },
        { id: 3, name: "Category", link: "", icon: <TagsIcon className="h-5 w-5" /> },
        { id: 4, name: "Floor", link: "/floor", icon: <Building2Icon className="h-5 w-5" /> },
        { id: 5, name: "Offers", link: "/offers", icon: <BadgePercentIcon className="h-5 w-5" /> },
        { id: 6, name: "About", link: "/about", icon: <InfoIcon className="h-5 w-5" /> },
        { id: 7, name: "Contact Us", link: "/contact-us", icon: <PhoneIcon className="h-5 w-5" /> },
    ];

    return (
        <header className="fixed top-0 left-0 z-50 bg-gradient-to-r from-indigo-600 to-blue-700 flex items-center justify-between p-4 w-full">
            {/* Logo */}
            <div className="flex items-center gap-3">
                <BuildingIcon className="h-10 w-10 text-[#F8FAFC]" />
                <span className="font-semibold text-2xl text-[#F8FAFC] whitespace-nowrap">
                    Super Mall
                </span>
            </div>

            {/* Desktop Menu */}
            <nav className="hidden md:flex flex-row gap-8 items-center justify-center absolute left-1/2 -translate-x-1/2">
                {menuList.map((item) => (
                    <div key={item.id} className="relative">
                        {item.name === "Category" || item.name === "Floor" ? (
                            <>
                                <button
                                    onClick={() => {
                                        if (item.name === "Category") {
                                            setShowCategoryDropdown((prev) => !prev);
                                            setShowFloorDropdown(false);
                                        } else if (item.name === "Floor") {
                                            setShowFloorDropdown((prev) => !prev);
                                            setShowCategoryDropdown(false);
                                        }
                                    }}
                                    className="flex items-center gap-1 text-white font-semibold hover:underline focus:outline-none"
                                >
                                    {item.name}
                                </button>

                                {/* Category Dropdown */}
                                {item.name === "Category" && showCategoryDropdown && (
                                    <div
                                        className="absolute top-full left-0 mt-2 bg-white shadow-lg rounded-lg p-2 min-w-[220px] z-50 animate-fadeIn"
                                    >
                                        {categories.length > 0 ? (
                                            categories.map((cat) => (
                                                <Link
                                                    key={cat.id}
                                                    href={`/category/${cat.id}`}
                                                    onClick={(e) => {
                                                        e.stopPropagation(); // prevent dropdown close before navigation
                                                        setShowCategoryDropdown(false);
                                                    }}
                                                    className="block px-3 py-2 text-gray-800 hover:bg-gray-100 rounded-md transition"
                                                >
                                                    {cat.name}
                                                </Link>

                                            ))
                                        ) : (
                                            <p className="text-gray-500 text-sm px-3 py-2">No categories found</p>
                                        )}
                                    </div>
                                )}
                                {item.name === "Floor" && showFloorDropdown && (
                                    <div
                                        className="absolute top-full left-0 mt-2 bg-white shadow-lg rounded-lg p-2 min-w-[220px] z-50 animate-fadeIn"
                                    >
                                        {floor.length > 0 ? (
                                            floor.map((floor) => (
                                                <Link
                                                    key={floor.id}
                                                    href={`/floor/${floor.id}`}
                                                    onClick={(e) => {
                                                        e.stopPropagation(); // prevent dropdown close before navigation
                                                        setShowFloorDropdown(false);
                                                    }}
                                                    className="block px-3 py-2 text-gray-800 hover:bg-gray-100 rounded-md transition"
                                                >
                                                    {floor.name}
                                                </Link>

                                            ))
                                        ) : (
                                            <p className="text-gray-500 text-sm px-3 py-2">No Floor found</p>
                                        )}
                                    </div>
                                )}
                            </>
                        ) : (
                            <Link
                                href={item.link}
                                className="flex items-center gap-1 text-white font-semibold hover:underline"
                            >
                                {item.name}
                            </Link>
                        )}
                    </div>
                ))}

                {role === "admin" && (
                    <Link href="/admin">
                        <h1 className="text-white font-semibold hover:underline">Admin panel</h1>
                    </Link>
                )}
            </nav>

            {/* Right Side */}
            <div className="flex items-center">
                {/* --- Desktop Section --- */}
                <div className="hidden md:flex items-center gap-4 relative">
                    {user ? (
                        <>
                            {/* User Icon + Info Dropdown */}
                            <div ref={userRef} className="relative">
                                <button onClick={handleUserClick}>
                                    <UserIcon
                                        className={`h-6 w-6 text-white cursor-pointer transition-transform ${showUserInfo ? "animate-slideDown" : "animate-slideUp"
                                            }`}
                                    />
                                </button>

                                {showUserInfo && (
                                    <div className="absolute right-0 top-12 w-64 sm:w-72 bg-white shadow-lg rounded-xl p-4 animate-fadeIn flex flex-col gap-3 z-50">
                                        {isEditing ? (
                                            <>
                                                <input
                                                    type="text"
                                                    value={newName}
                                                    onChange={(e) => setNewName(e.target.value)}
                                                    className="border text-black border-gray-300 p-2 rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm"
                                                    placeholder="Enter new name"
                                                />
                                                <div className="flex justify-end gap-2">
                                                    <button
                                                        onClick={() => setIsEditing(false)}
                                                        className="px-3 py-1 rounded-lg text-black bg-gray-100 hover:bg-gray-200 text-sm"
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
                                                            className="w-12 h-12 object-cover shadow shadow-gray-400 rounded-full"
                                                        />
                                                    ) : (
                                                        <div className="h-12 w-12 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 font-semibold text-lg">
                                                            {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                                                        </div>
                                                    )}
                                                    <div className="flex flex-col">
                                                        <p className="font-semibold text-gray-800 text-sm truncate">{user.name || "User"}</p>
                                                        <p className="text-xs text-gray-500 truncate">{user.email}</p>
                                                    </div>
                                                </div>

                                                <div className="flex items-center justify-between gap-3">
                                                    <button
                                                        onClick={() => {
                                                            setIsEditing(true);
                                                            setNewName(user.name || "");
                                                        }}
                                                        className="text-sm hover:underline text-black"
                                                    >
                                                        Edit Name
                                                    </button>

                                                    <label className="text-sm cursor-pointer inline-flex items-center gap-2">
                                                        {uploading ? (
                                                            <span className="text-xs text-gray-500">Uploading...</span>
                                                        ) : (
                                                            <>
                                                                <span className="hover:underline text-black">Change Image</span>
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

                            {/* Settings + Logout Dropdown */}
                            <div ref={settingsRef} className="relative">
                                <button onClick={handleSettingsClick}>
                                    <SettingsIcon
                                        className={`h-6 w-6 text-white cursor-pointer transition-transform duration-500 ${showLogout ? "rotate-[90deg]" : "rotate-0"
                                            }`}
                                    />
                                </button>

                                {showLogout && (
                                    <div className="absolute right-0 top-12 bg-white shadow-md rounded-lg p-2 w-32 animate-fadeIn z-50">
                                        <button
                                            onClick={handleLogout}
                                            className="flex items-center text-red-500 gap-2 w-full text-left px-3 py-2 rounded-lg hover:bg-gray-100 transition"
                                        >
                                            <LogOutIcon className="h-5 w-5 text-red-500" />
                                            <span>Logout</span>
                                        </button>
                                    </div>
                                )}
                            </div>
                        </>
                    ) : (
                        <Link href="/login">
                            <button className="bg-white text-slate-800 px-4 py-2 rounded-lg font-semibold transition-colors duration-300 ease-in-out transform hover:scale-105 hover:bg-slate-700 hover:text-white shadow hover:shadow-lg">
                                Login
                            </button>
                        </Link>
                    )}
                </div>

                {/* --- Mobile Hamburger --- */}
                <button className="md:hidden text-white ml-2" onClick={() => setIsOpen(!isOpen)}>
                    {isOpen ? <X size={28} /> : <Menu size={28} />}
                </button>

                {/* --- Mobile Sidebar --- */}
                <div
                    className={`fixed top-0 right-0 h-full w-2/3 bg-gradient-to-r from-indigo-600 to-blue-700 text-white p-6 overflow-y-auto transform transition-transform duration-300 ease-in-out z-[60] ${isOpen ? "translate-x-0" : "translate-x-full"
                        }`}
                >
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-semibold flex gap-2">
                            <BuildingIcon className="h-8 w-8 text-center" />
                            Super Mall
                        </h2>
                        <X className="cursor-pointer" onClick={() => setIsOpen(false)} />
                    </div>

                    {user && (
                        <div className="bg-slate-700 rounded-xl p-4 flex flex-col gap-3 mb-4 shadow-lg">
                            <div className="flex flex-col items-center gap-2">
                                {user.photoURL ? (
                                    <img
                                        src={user.photoURL}
                                        alt="avatar"
                                        className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-md"
                                    />
                                ) : (
                                    <div className="h-16 w-16 rounded-full bg-gray-300 flex items-center justify-center text-gray-700 font-semibold text-xl">
                                        {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                                    </div>
                                )}
                                {!isEditing ? (
                                    <>
                                        <p className="font-semibold text-white text-lg">{user.name || "User"}</p>
                                        <p className="text-xs font-semibold text-gray-300">{user.email}</p>
                                    </>
                                ) : (
                                    <>
                                        <input
                                            type="text"
                                            value={newName}
                                            onChange={(e) => setNewName(e.target.value)}
                                            className="border border-gray-300 p-2 rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm"
                                            placeholder="Enter new name"
                                        />
                                        <div className="flex items-center justify-between gap-2 w-full">
                                            <button
                                                onClick={() => setIsEditing(false)}
                                                className="px-3 py-1 rounded-lg bg-gray-200 hover:bg-gray-300 text-sm text-black"
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
                                )}
                            </div>

                            <div className="flex flex-col gap-2 mt-3">
                                {!isEditing && (
                                    <button
                                        onClick={() => {
                                            setIsEditing(true);
                                            setNewName(user.name || "");
                                        }}
                                        className="px-3 py-1 rounded-lg bg-blue-600 text-white hover:bg-blue-700 text-sm"
                                    >
                                        Edit Name
                                    </button>
                                )}

                                <label className="px-3 py-1 rounded-lg bg-green-600 text-white hover:bg-green-700 text-sm cursor-pointer inline-flex justify-center">
                                    {uploading ? "Uploading..." : "Change Photo"}
                                    <input type="file" accept="image/*" className="hidden" onChange={handlePhotoChange} />
                                </label>
                            </div>
                        </div>
                    )}

                    <nav className="flex flex-col gap-4">
                        {menuList.map((item) => (
                            <div key={item.id} className="flex flex-col">

                                {/* Category Dropdown (Mobile) */}
                                {item.name === "Category" ? (
                                    <>
                                        <button
                                            onClick={() => {
                                                setShowCategoryDropdown(!showCategoryDropdown)
                                                setShowFloorDropdown(false) // close Floor dropdown when Category opens
                                            }}
                                            className="flex items-center justify-between w-full text-lg hover:underline"
                                        >
                                            {item.name}
                                            <span>{showCategoryDropdown ? "▲" : "▼"}</span>
                                        </button>

                                        {showCategoryDropdown && (
                                            <div className="flex flex-col ml-4 mt-2">
                                                {categories.map((cat) => (
                                                    <Link
                                                        key={cat.id}
                                                        href={`/category/${cat.id}`}
                                                        className="py-1 hover:underline"
                                                        onClick={() => setIsOpen(false)}
                                                    >
                                                        {cat.name}
                                                    </Link>
                                                ))}
                                            </div>
                                        )}
                                    </>
                                ) : item.name === "Floor" ? (
                                    /* Floor Dropdown (Mobile) */
                                    <>
                                        <button
                                            onClick={() => {
                                                setShowFloorDropdown(!showFloorDropdown)
                                                setShowCategoryDropdown(false) // close Category dropdown when Floor opens
                                            }}
                                            className="flex items-center justify-between w-full text-lg hover:underline"
                                        >
                                            {item.name}
                                            <span>{showFloorDropdown ? "▲" : "▼"}</span>
                                        </button>

                                        {showFloorDropdown && (
                                            <div className="flex flex-col ml-4 mt-2">
                                                {floor?.map((f) => (
                                                    <Link
                                                        key={f.id}
                                                        href={`/floor/${f.id}`}
                                                        className="py-1 hover:underline"
                                                        onClick={() => setIsOpen(false)}
                                                    >
                                                        {f.name}
                                                    </Link>
                                                ))}
                                            </div>
                                        )}
                                    </>
                                ) : (
                                    /* Normal menu items */
                                    <Link
                                        href={item.link}
                                        className="flex gap-2 items-center"
                                        onClick={() => setIsOpen(false)}
                                    >
                                        {item.icon}
                                        <h1 className="text-lg hover:underline">{item.name}</h1>
                                    </Link>
                                )}
                            </div>
                        ))}

                        {role === "admin" && (
                            <Link href="/admin">
                                <h1 className="flex gap-2 items-center text-white font-semibold hover:underline">
                                    <LayoutDashboardIcon className="h-5 w-5" />
                                    Admin panel
                                </h1>
                            </Link>
                        )}

                        {user ? (
                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-2 px-3 py-2 bg-red-600 rounded-lg hover:bg-red-700 mt-4"
                            >
                                <LogOutIcon className="h-5 w-5" />
                                Logout
                            </button>
                        ) : (
                            <Link href="/login">
                                <button className="bg-white text-slate-800 px-3 py-1.5 rounded-lg font-semibold hover:bg-slate-700 hover:text-white mt-4">
                                    Login
                                </button>
                            </Link>
                        )}
                    </nav>
                </div>
            </div>

            {/* Overlay */}
            {isOpen && <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setIsOpen(false)} />}
        </header>
    );
}
