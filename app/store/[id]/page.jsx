"use client";

import { useEffect, useState } from "react";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { useParams } from "next/navigation";
import { db } from "@/lib/firestore/firebase";
import { ArrowLeftCircleIcon, HomeIcon } from "lucide-react";
import Link from "next/link";

export default function ShopDetails() {
    const { id } = useParams();
    const [shop, setShop] = useState(null);
    const [categories, setCategories] = useState([]);
    const [floor, setFloor] = useState([]);

    const getCategoryName = (id) =>
        categories?.find((cat) => cat.id === id)?.name || "Unknown";

    const getFloorName = (id) =>
        floor?.find((floor) => floor.id === id)?.name || "Unknown";

    useEffect(() => {
        const fetchShop = async () => {
            try {
                const docRef = doc(db, "shop", id);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) setShop(docSnap.data());
                else console.error("Shop not found");
            } catch (error) {
                console.error("Error fetching shop:", error);
            }
        };
        fetchShop();
    }, [id]);

    useEffect(() => {
        const fetchCategory = async () => {
            try {
                const categoriesSnapshot = await getDocs(collection(db, "categories"));
                const categoriesData = categoriesSnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setCategories(categoriesData);
            } catch (error) {
                console.error("Error fetching category:", error);
            }
        };
        fetchCategory();
    }, []);

    useEffect(() => {
        const fetchFloor = async () => {
            try {
                const floorSnapshot = await getDocs(collection(db, "floors"));
                const floorData = floorSnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setFloor(floorData);
            } catch (error) {
                console.error("Error fetching Floor:", error);
            }
        };
        fetchFloor();
    }, []);

    if (!shop) return <div className="text-center py-10 text-gray-500">Loading...</div>;

    return (
        <main className="bg-gradient-to-tr from-indigo-200 to-blue-600 p-6">
            <div className="bg-white rounded-xl">
                {/* ✅ Banner Image */}
                {shop.bannerImageURL && (
                    <div className="w-full flex items-center justify-center h-36 rounded-xl overflow-hidden shadow-md mb-8">
                        <img
                            src={shop.bannerImageURL}
                            alt="Banner"
                            className="h-32 object-center object-cover"
                        />
                    </div>
                )}
            </div>

            {/* ✅ Two-Column Layout */}
            <div className="flex flex-col md:flex-row gap-8">
                {/* ✅ Left: Images */}
                <div className="w-full md:w-1/2">
                    {shop.images?.length > 0 && (
                        <div className="w-full rounded-xl overflow-hidden shadow-md bg-white p-4">
                            <h3 className="font-semibold text-lg mb-4 text-center">Gallery</h3>
                            <div className="flex flex-wrap items-center justify-center gap-4">
                                {shop.images.map((img, i) => (
                                    <div
                                        key={i}
                                        className="rounded-lg overflow-hidden transition-all duration-300"
                                    >
                                        <div className="flex items-center justify-center">
                                            <img
                                                src={img}
                                                alt={`Gallery ${i}`}
                                                className="h-32 object-cover object-center hover:scale-105 transition-transform duration-300"
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* ✅ Right: Details */}
                <div className="w-full md:w-1/2 space-y-6">
                    <div className="bg-white rounded-xl shadow-md p-5">
                        <div className="flex flex-col items-center">
                            {shop.logoURL && (
                                <img
                                    src={shop.logoURL}
                                    alt="Logo"
                                    className="w-24 object-cover"
                                />
                            )}
                            <h2 className="text-2xl font-semibold mt-4">{shop.name}</h2>
                            <p className="text-gray-500">{getCategoryName(shop.category)}</p>
                        </div>

                        <div className="mt-6 text-sm text-gray-600 space-y-1">
                            <p><b>Owner:</b> {shop.ownerName}</p>
                            <p><b>Shop No:</b> {shop.shopNumber}</p>
                            <p><b>Floor:</b> {getFloorName(shop.floor)}</p>
                            <p><b>Contact:</b> {shop.contactNumber}</p>
                            <p><b>Email:</b> {shop.email}</p>
                        </div>
                    </div>

                    {/* ✅ Description */}
                    <div className="bg-white rounded-xl shadow-md p-5">
                        <h3 className="font-semibold mb-2 text-lg">Description</h3>
                        <p className="text-gray-700">{shop.description}</p>
                    </div>
                </div>
            </div>

            <div className="flex items-center justify-center p-10">
                <Link href={"/store"}>
                    <button className="flex gap-2 cursor-pointer bg-black text-white px-4 py-2 rounded-2xl">
                        <span><ArrowLeftCircleIcon /></span>Go Back
                    </button>
                </Link>
            </div>
        </main>
    );
}
