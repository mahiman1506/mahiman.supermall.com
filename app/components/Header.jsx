"use client";

import { useEffect, useRef, useState } from "react";
import {
  BadgePercentIcon,
  Building2Icon,
  BuildingIcon,
  HomeIcon,
  InfoIcon,
  LayoutDashboardIcon,
  LogOutIcon,
  Menu,
  PhoneIcon,
  SettingsIcon,
  ShoppingCartIcon,
  StoreIcon,
  TagsIcon,
  UserIcon,
  X,
} from "lucide-react";
import {
  getAuth,
  onAuthStateChanged,
  signOut,
  updateProfile,
} from "firebase/auth";
import {
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";
import { app, storage } from "@/lib/firestore/firebase";
import { useAuth } from "@/contexts/AuthContext";
import { getCategories } from "@/lib/firestore/categories/read_server";
import Link from "next/link";
import { getFloor } from "@/lib/firestore/floors/read_server";
import { useCart } from "@/contexts/CartContext";

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

  const { cartCount } = useCart(); // cart from context
  const auth = getAuth(app);
  const { role } = useAuth();

  const userRef = useRef(null);
  const settingsRef = useRef(null);

  // ⭐ Calculate TOTAL cart item quantity
  // const totalItems = cartCount?.reduce(
  //   (sum, item) => sum + (item.quantity || 0),
  //   0
  // );

  // Fetch categories
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

  // Fetch floors
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

  // Firebase Auth Listener
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

  const handlePhotoChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !auth.currentUser) return;

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
      console.error("Error uploading image:", error);
    }

    setUploading(false);
  };

  const handleLogout = async () => {
    await signOut(auth);
    setIsOpen(false);
  };

  const handleNameUpdate = async () => {
    if (auth.currentUser && newName.trim()) {
      await updateProfile(auth.currentUser, { displayName: newName });
      setUser((prev) => ({ ...prev, name: newName }));
      setIsEditing(false);
    }
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        userRef.current &&
        !userRef.current.contains(e.target) &&
        settingsRef.current &&
        !settingsRef.current.contains(e.target)
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
    {
      id: 2,
      name: "Store",
      link: "/store",
      icon: <StoreIcon className="h-5 w-5" />,
    },
    {
      id: 3,
      name: "Category",
      link: "",
      icon: <TagsIcon className="h-5 w-5" />,
    },
    {
      id: 4,
      name: "Floor",
      link: "/floor",
      icon: <Building2Icon className="h-5 w-5" />,
    },
    {
      id: 5,
      name: "Offers",
      link: "/offers",
      icon: <BadgePercentIcon className="h-5 w-5" />,
    },
    {
      id: 6,
      name: "About",
      link: "/about",
      icon: <InfoIcon className="h-5 w-5" />,
    },
    {
      id: 7,
      name: "Contact Us",
      link: "/contact-us",
      icon: <PhoneIcon className="h-5 w-5" />,
    },
  ];

  return (
    <header className="fixed top-0 left-0 z-50 bg-gradient-to-r from-indigo-600 to-blue-700 flex items-center justify-between p-4 w-full">
      {/* LOGO */}
      <div className="flex items-center gap-3">
        <BuildingIcon className="h-10 w-10 text-white" />
        <span className="font-semibold text-2xl text-white">Super Mall</span>
      </div>

      {/* DESKTOP MENU */}
      <nav className="hidden md:flex gap-8 items-center absolute left-1/2 -translate-x-1/2">
        {menuList.map((item) => (
          <div key={item.id} className="relative">
            {item.name === "Category" || item.name === "Floor" ? (
              <>
                <button
                  onClick={() => {
                    if (item.name === "Category") {
                      setShowCategoryDropdown((prev) => !prev);
                      setShowFloorDropdown(false);
                    } else {
                      setShowFloorDropdown((prev) => !prev);
                      setShowCategoryDropdown(false);
                    }
                  }}
                  className="text-white font-semibold hover:underline"
                >
                  {item.name}
                </button>

                {/* CATEGORY DROPDOWN */}
                {item.name === "Category" && showCategoryDropdown && (
                  <div className="absolute top-full left-0 mt-2 bg-white shadow-lg rounded-lg p-2 min-w-[200px] z-50">
                    {categories.map((cat) => (
                      <Link
                        key={cat.id}
                        href={`/category/${cat.id}`}
                        onClick={() => setShowCategoryDropdown(false)}
                        className="block px-3 py-2 hover:bg-gray-100 rounded-md"
                      >
                        {cat.name}
                      </Link>
                    ))}
                  </div>
                )}

                {/* FLOOR DROPDOWN */}
                {item.name === "Floor" && showFloorDropdown && (
                  <div className="absolute top-full left-0 mt-2 bg-white shadow-lg rounded-lg p-2 min-w-[200px] z-50">
                    {floor.map((f) => (
                      <Link
                        key={f.id}
                        href={`/floor/${f.id}`}
                        onClick={() => setShowFloorDropdown(false)}
                        className="block px-3 py-2 hover:bg-gray-100 rounded-md"
                      >
                        {f.name}
                      </Link>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <Link href={item.link} className="text-white hover:underline">
                {item.name}
              </Link>
            )}
          </div>
        ))}

        {role === "admin" && (
          <Link
            href="/admin"
            className="text-white font-semibold hover:underline"
          >
            Admin Panel
          </Link>
        )}

        {role === "shop" && (
          <Link
            href="/shop"
            className="text-white font-semibold hover:underline"
          >
            Shop Panel
          </Link>
        )}
      </nav>

      {/* RIGHT SECTION */}
      <div className="flex items-center gap-3">
        {/* ⭐ DESKTOP CART ICON (Correct Total Count) */}
        <div className="hidden md:flex relative items-center gap-3">
          {/* ⭐ DESKTOP CART ICON */}
          <div className="relative">
            <Link href="/cart">
              <ShoppingCartIcon className="w-6 h-6 text-white" />

              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>

        {/* USER + SETTINGS (DESKTOP) */}
        <div className="hidden md:flex items-center gap-4">
          {user ? (
            <>
              {/* USER DROPDOWN */}
              <div ref={userRef} className="relative">
                <button onClick={() => setShowUserInfo((prev) => !prev)}>
                  <UserIcon className="h-6 w-6 text-white cursor-pointer" />
                </button>

                {showUserInfo && (
                  <div className="absolute right-0 top-12 w-64 bg-white shadow-lg rounded-xl p-4 z-50">
                    <div className="flex items-center gap-3">
                      {user.photoURL ? (
                        <img
                          src={user.photoURL}
                          className="w-12 h-12 rounded-full object-cover shadow"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-gray-300 rounded-full flex justify-center items-center text-lg font-bold">
                          {user.name?.charAt(0)}
                        </div>
                      )}

                      <div>
                        <p className="font-semibold">{user.name}</p>
                        <p className="text-xs text-gray-600">{user.email}</p>
                      </div>
                    </div>

                    {/* Edit name */}
                    {!isEditing ? (
                      <button
                        onClick={() => {
                          setIsEditing(true);
                          setNewName(user.name);
                        }}
                        className="text-sm mt-3 underline text-blue-600"
                      >
                        Edit Name
                      </button>
                    ) : (
                      <>
                        <input
                          value={newName}
                          onChange={(e) => setNewName(e.target.value)}
                          className="border p-2 w-full rounded mt-2"
                        />
                        <div className="flex justify-end gap-2 mt-2">
                          <button
                            onClick={() => setIsEditing(false)}
                            className="px-3 py-1 bg-gray-200 rounded"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={handleNameUpdate}
                            className="px-3 py-1 bg-green-600 text-white rounded"
                          >
                            Save
                          </button>
                        </div>
                      </>
                    )}

                    {/* Change photo */}
                    <label className="text-sm cursor-pointer mt-3 block underline">
                      Change Image
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={handlePhotoChange}
                      />
                    </label>
                  </div>
                )}
              </div>

              {/* SETTINGS DROPDOWN */}
              <div ref={settingsRef} className="relative">
                <button onClick={() => setShowLogout((prev) => !prev)}>
                  <SettingsIcon className="h-6 w-6 text-white cursor-pointer" />
                </button>

                {showLogout && (
                  <div className="absolute right-0 top-12 bg-white shadow-md rounded-lg p-2 w-32">
                    <button
                      onClick={handleLogout}
                      className="flex items-center text-red-500 gap-2 px-3 py-2 w-full hover:bg-gray-100 rounded"
                    >
                      <LogOutIcon className="h-5 w-5" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <Link href="/login">
              <button className="bg-white text-slate-800 px-4 py-2 rounded-lg font-semibold hover:bg-slate-700 hover:text-white shadow">
                Login
              </button>
            </Link>
          )}
        </div>

        {/* ⭐ MOBILE CART ICON */}
        <div className="md:hidden mr-2">
          <Link href="/cart">
            <button className="relative">
              <ShoppingCartIcon className="h-6 w-6 text-white" />

              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                  {cartCount}
                </span>
              )}
            </button>
          </Link>
        </div>

        {/* MOBILE HAMBURGER */}
        <button
          className="md:hidden text-white"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* SIDEBAR OVERLAY */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* MOBILE SIDEBAR */}
      <div
        className={`fixed top-0 right-0 h-full w-2/3 bg-indigo-700 text-white p-6 z-[60] transform transition-all ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* SIDEBAR HEADER */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold flex gap-2">
            <BuildingIcon className="h-8 w-8" />
            Super Mall
          </h2>

          <X className="cursor-pointer" onClick={() => setIsOpen(false)} />
        </div>

        {/* USER BOX (MOBILE) */}
        {user && (
          <div className="bg-slate-700 rounded-xl p-4 mb-4">
            <div className="flex flex-col items-center gap-2">
              {user.photoURL ? (
                <img
                  src={user.photoURL}
                  className="w-16 h-16 rounded-full object-cover border-2 border-white shadow"
                />
              ) : (
                <div className="w-16 h-16 bg-gray-300 rounded-full flex justify-center items-center text-xl font-bold text-gray-700">
                  {user.name?.charAt(0) || "U"}
                </div>
              )}

              {!isEditing ? (
                <>
                  <p className="font-semibold">{user.name}</p>
                  <p className="text-sm text-gray-300">{user.email}</p>
                </>
              ) : (
                <>
                  <input
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="border p-2 w-full rounded text-black"
                  />
                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={() => setIsEditing(false)}
                      className="bg-gray-200 text-black px-3 py-1 rounded"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleNameUpdate}
                      className="bg-green-600 px-3 py-1 rounded"
                    >
                      Save
                    </button>
                  </div>
                </>
              )}

              <label className="mt-3 underline cursor-pointer">
                Change Photo
                <input
                  type="file"
                  className="hidden"
                  onChange={handlePhotoChange}
                />
              </label>
            </div>
          </div>
        )}

        {/* MOBILE MENU */}
        <nav className="flex flex-col gap-4">
          {/* Category */}
          <div>
            <button
              onClick={() => {
                setShowCategoryDropdown((prev) => !prev);
                setShowFloorDropdown(false);
              }}
              className="flex justify-between w-full text-lg"
            >
              Category {showCategoryDropdown ? "▲" : "▼"}
            </button>

            {showCategoryDropdown && (
              <div className="ml-4 mt-2 flex flex-col">
                {categories.map((cat) => (
                  <Link
                    key={cat.id}
                    href={`/category/${cat.id}`}
                    onClick={() => setIsOpen(false)}
                    className="py-1 underline"
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Floor */}
          <div>
            <button
              onClick={() => {
                setShowFloorDropdown((prev) => !prev);
                setShowCategoryDropdown(false);
              }}
              className="flex justify-between w-full text-lg"
            >
              Floor {showFloorDropdown ? "▲" : "▼"}
            </button>

            {showFloorDropdown && (
              <div className="ml-4 mt-2 flex flex-col">
                {floor.map((f) => (
                  <Link
                    key={f.id}
                    href={`/floor/${f.id}`}
                    onClick={() => setIsOpen(false)}
                    className="py-1 underline"
                  >
                    {f.name}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Normal menu items */}
          {menuList
            .filter((m) => m.name !== "Category" && m.name !== "Floor")
            .map((item) => (
              <Link
                key={item.id}
                href={item.link}
                onClick={() => setIsOpen(false)}
                className="text-lg underline"
              >
                {item.name}
              </Link>
            ))}

          {role === "admin" && (
            <Link href="/admin" className="text-lg underline">
              Admin Panel
            </Link>
          )}

          {role === "shop" && (
            <Link href="/shop" className="text-lg underline">
              Shop Panel
            </Link>
          )}

          {user ? (
            <button
              onClick={handleLogout}
              className="bg-red-600 px-3 py-2 rounded mt-4 flex items-center gap-2"
            >
              <LogOutIcon className="h-5 w-5" /> Logout
            </button>
          ) : (
            <Link href="/login">
              <button className="bg-white text-black px-3 py-2 rounded mt-4">
                Login
              </button>
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
