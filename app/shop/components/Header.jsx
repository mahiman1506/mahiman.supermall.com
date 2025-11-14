"use client";

import { useState, useEffect, useRef } from "react";
import { getAuth, signOut, updateProfile } from "firebase/auth";
import {
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";
import { storage } from "@/lib/firestore/firebase";
import {
  Menu,
  X,
  LayoutDashboard,
  LogOut,
  StoreIcon,
  SettingsIcon,
  UserIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function ShopHeader({ isSidebarOpen, onToggleSidebar }) {
  const [showLogout, setShowLogout] = useState(false);
  const [showUserInfo, setShowUserInfo] = useState(false);
  const [user, setUser] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState("");
  const router = useRouter();
  const auth = getAuth();

  useEffect(() => {
    if (auth.currentUser) {
      setUser(auth.currentUser);
      setNewName(auth.currentUser.displayName || "");
    }
  }, [auth.currentUser]);

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
    try {
      await signOut(auth);
      router.push("/login");
    } catch (error) {
      console.error("Logout Error:", error);
    }
  };

  const handleNameUpdate = async () => {
    if (!newName.trim()) return;

    try {
      await updateProfile(auth.currentUser, { displayName: newName });
      setUser((prev) => ({ ...prev, name: newName }));
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating name:", error);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setUploading(true);
      const imageRef = storageRef(storage, `users/${auth.currentUser.uid}`);
      await uploadBytes(imageRef, file);
      const photoURL = await getDownloadURL(imageRef);

      await updateProfile(auth.currentUser, { photoURL });
      setUser((prev) => ({ ...prev, photoURL }));
    } catch (error) {
      console.error("Error uploading image:", error);
    } finally {
      setUploading(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userRef.current && !userRef.current.contains(event.target)) {
        setShowUserInfo(false);
      }
      if (settingsRef.current && !settingsRef.current.contains(event.target)) {
        setShowLogout(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
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

  const handlePhotoChange = async (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    const auth = getAuth();
    if (!auth.currentUser) return;

    setUploading(true);
    try {
      const fileRef = storageRef(
        storage,
        `profileImages/${auth.currentUser.uid}/${file.name}`
      );
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

  return (
    <header className="fixed top-0 md:left-62 left-0 right-0 z-30 flex items-center justify-between px-6 h-20 bg-[#F8FAFC] rounded-b-lg shadow-sm">
      {/* Left: Menu Button (Mobile) */}
      <button
        onClick={onToggleSidebar}
        className="md:hidden p-2 rounded-lg hover:bg-gray-200 transition"
      >
        {isSidebarOpen ? (
          <X className="h-6 w-6 text-[#1E1E2F]" />
        ) : (
          <Menu className="h-6 w-6 text-[#1E1E2F]" />
        )}
      </button>
      <Link href={"/"}>
        <div className="flex items-center justify-center gap-3 text-[#1E1E2F] mx-auto md:mx-0">
          <StoreIcon className="h-8 w-8 md:h-10 md:w-10" />
          <span className="font-semibold text-2xl md:text-3xl">Shop Panel</span>
        </div>
      </Link>

      {/* Right Side */}
      <div className="flex items-center gap-4 ml-auto">
        {/* User Avatar */}
        <div ref={userRef} className="relative">
          {/* <button onClick={handleUserClick}>
                        <UserIcon className={`h-6 w-6 text-[#1E1E2F] cursor-pointer transition-transform`} />
                    </button> */}
          <button onClick={handleUserClick}>
            <UserIcon
              className={`h-6 w-6 text-[#1E1E2F] cursor-pointer transition-transform 
            ${showUserInfo ? "animate-slideDown" : "animate-slideUp"}
        `}
            />
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
                      <p className="font-semibold text-gray-800 text-sm truncate">
                        {user.name}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {user.email}
                      </p>
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
                        <span className="text-xs text-gray-500">
                          Uploading...
                        </span>
                      ) : (
                        <>
                          <span className="hover:underline hover:cursor-pointer">
                            Change Image
                          </span>
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

        {/* Settings Button */}
        <div className="relative" ref={settingsRef}>
          <button onClick={handleSettingsClick}>
            <SettingsIcon
              className={`h-6 w-6 text-[#1E1E2F] cursor-pointer transition-transform duration-500 ${
                showLogout ? "rotate-[90deg]" : "rotate-0"
              }`}
            />
          </button>

          {/* Settings Dropdown */}
          {showLogout && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-2">
              <Link href="/dashboard">
                <button className="flex items-center gap-2 w-full text-left px-4 py-2 hover:bg-gray-100 transition">
                  <LayoutDashboard className="h-5 w-5 text-gray-500" />
                  <span>Dashboard</span>
                </button>
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 w-full text-left px-4 py-2 text-red-500 hover:bg-gray-100 transition"
              >
                <LogOut className="h-5 w-5" />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
