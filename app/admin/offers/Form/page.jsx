"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { useShop } from "@/lib/firestore/shop/read";
import { useCategory } from "@/lib/firestore/categories/read";
import { useFloor } from "@/lib/firestore/floors/read";
import { createNewOffer, UpdateOffer } from "@/lib/firestore/offers/write";
import { useAuth } from "@/contexts/AuthContext";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "@/lib/firestore/firebase";

export default function Form() {
    const router = useRouter();
    const { user, role, loading: authLoading } = useAuth();

    const { data: shops = [] } = useShop();
    const { data: categories = [] } = useCategory();
    const { data: floors = [] } = useFloor();

    const [loading, setLoading] = useState(false);
    const [bannerImage, setBannerImage] = useState(null);
    const [preview, setPreview] = useState(null);

    const [data, setData] = useState({
        name: "",
        offerCode: "",
        type: "",
        discountValue: "",
        applicableOn: "",
        startDate: "",
        endDate: "",
        minimumPurchase: "",
        maxDiscount: "",
        usageLimit: "",
        status: "Active",
        description: "",
    });

    const [selectedShops, setSelectedShops] = useState([]);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [selectedFloors, setSelectedFloors] = useState([]);
    const searchParams = useSearchParams();
    const id = searchParams?.get("id") || null;

    useEffect(() => {
        if (!id) return; // no id => creating new category

        const fetchOffer = async () => {
            setLoading(true);
            try {
                const res = await fetch(`/api/offers/${id}`);
                const json = await res.json();
                if (!res.ok || !json.ok) {
                    alert("⚠️ Offer not found");
                    router.push("/admin/offers");
                    return;
                }
                const offer = json.data;
                setData({ ...offer, id });
                setPreview(offer?.bannerImageURL || null);
            } catch (error) {
                console.error(error);
                alert("❌ Failed to load offers");
            } finally {
                setLoading(false);
            }
        };

        fetchOffer();
    }, [id]);

    const handleData = (key, value) => {
        setData((prev) => ({
            ...prev,
            [key]: value ?? "", // ensure not undefined
        }));
    };

    const handleSelect = (value, type) => {
        if (!value) return;
        if (type === "shop" && !selectedShops.includes(value)) {
            setSelectedShops([...selectedShops, value]);
        }
        if (type === "category" && !selectedCategories.includes(value)) {
            setSelectedCategories([...selectedCategories, value]);
        }
        if (type === "floor" && !selectedFloors.includes(value)) {
            setSelectedFloors([...selectedFloors, value]);
        }
    };

    const removeItem = (value, type) => {
        if (type === "shop") setSelectedShops(selectedShops.filter((s) => s !== value));
        if (type === "category") setSelectedCategories(selectedCategories.filter((c) => c !== value));
        if (type === "floor") setSelectedFloors(selectedFloors.filter((f) => f !== value));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setBannerImage(file);
            setPreview(URL.createObjectURL(file));
        } else {
            setBannerImage(null);
            setPreview(null);
        }
    };

    const handleSubmit = async () => {
        setLoading(true);
        try {
            let bannerImageURL = "";

            if (bannerImage) {
                const storageRef = ref(storage, `offers/${Date.now()}_${bannerImage.name}`);
                const snapshot = await uploadBytes(storageRef, bannerImage);
                bannerImageURL = await getDownloadURL(snapshot.ref);
            }

            await createNewOffer({
                data,
                bannerImageURL: bannerImageURL,
                applicableShops: selectedShops,
                applicableCategories: selectedCategories,
                applicableFloors: selectedFloors,
            });
            setData({
                name: "",
                offerCode: "",
                type: "",
                discountValue: "",
                applicableOn: "",
                startDate: "",
                endDate: "",
                minimumPurchase: "",
                maxDiscount: "",
                usageLimit: "",
                status: "Active",
                description: "",
            });
            alert("✅ Offer created successfully");
            router.push("/admin/offers");
        } catch (error) {
            // Log full error for debugging (supports string or Error)
            console.error(error);
            const message = (error && error.message) || String(error) || "An error occurred";
            alert(message);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = async () => {
        setLoading(true);
        try {
            let bannerImageURL = data.bannerImageURL || ""; // keep old banner if no new upload
            if (bannerImage) {
                const storageRef = ref(storage, `offers/${Date.now()}_${bannerImage.name}`);
                const snapshot = await uploadBytes(storageRef, bannerImage);
                bannerImageURL = await getDownloadURL(snapshot.ref);
            }

            await UpdateOffer({
                data,
                bannerImageURL: bannerImageURL,
                applicableShops: selectedShops,
                applicableCategories: selectedCategories,
                applicableFloors: selectedFloors,
            });

            setData({
                name: "",
                offerCode: "",
                type: "",
                discountValue: "",
                applicableOn: "",
                startDate: "",
                endDate: "",
                minimumPurchase: "",
                maxDiscount: "",
                usageLimit: "",
                status: "Active",
                description: "",
            });

            alert("✅ Offer Updated successfully");
            router.push("/admin/offers");
        } catch (error) {
            console.error(error);
            const message = (error && error.message) || String(error) || "An error occurred";
            alert(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex-1 flex flex-col gap-5 rounded-xl p-6 sm:p-8 md:p-12 bg-gray-50 shadow">
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                            if (authLoading) {
                                alert("Authentication not ready yet. Please wait a moment and try again.");
                                return;
                            }

                            // Guard: only admin can create/update offers
                            if (!user || role !== "admin") {
                                alert("You do not have permission to perform this action. Admin access required.");
                                return;
                            }

                            if (id) {
                                handleUpdate();
                            } else {
                                handleSubmit();
                            }
                }}
                className="grid grid-cols-1 gap-6 sm:grid-cols-2"
            >
                {/* Offer Name */}
                <div className="flex flex-col gap-1 col-span-1 sm:col-span-2">
                    <label htmlFor="offer-name">Offer Name</label>
                    <input
                        type="text"
                        id="offer-name"
                        placeholder="Enter Offer Name"
                        value={data.name || ""}
                        onChange={(e) => handleData("name", e.target.value)}
                        className="border border-gray-400 rounded-lg px-3 py-2 focus:outline-none w-full"
                        required
                    />
                </div>

                {/* Offer Code */}
                <div className="flex flex-col gap-1">
                    <label htmlFor="offer-code">Offer Code</label>
                    <input
                        type="text"
                        id="offer-code"
                        placeholder="Enter Offer Code"
                        value={data.offerCode || ""}
                        onChange={(e) => handleData("offerCode", e.target.value)}
                        className="border border-gray-400 rounded-lg px-3 py-2 focus:outline-none w-full"
                        required
                    />
                </div>

                {/* Offer Type */}
                <div className="flex flex-col gap-1">
                    <label htmlFor="offer-type">Offer Type</label>
                    <select
                        id="offer-type"
                        value={data.type || ""}
                        onChange={(e) => handleData("type", e.target.value)}
                        className="border border-gray-400 rounded-lg px-3 py-2 focus:outline-none w-full"
                        required
                    >
                        <option value="">Select Offer Type</option>
                        <option value="percentage">Percentage Discount</option>
                        <option value="flat">Flat Discount</option>
                        <option value="buyxgety">Buy X Get Y</option>
                        <option value="gift">Free Gift</option>
                    </select>
                </div>

                {/* Discount Value */}
                <div className="flex flex-col gap-1">
                    <label htmlFor="discount-value">Discount Value</label>
                    <input
                        type="number"
                        id="discount-value"
                        placeholder="Enter Discount Value"
                        value={data.discountValue || ""}
                        onChange={(e) => handleData("discountValue", e.target.value)}
                        className="border border-gray-400 rounded-lg px-3 py-2 focus:outline-none w-full"
                        required
                    />
                </div>

                {/* Applicable On */}
                <div className="flex flex-col gap-1 col-span-1 sm:col-span-2">
                    <label htmlFor="applicable-on">Applicable On</label>
                    <select
                        id="applicable-on"
                        value={data.applicableOn || ""}
                        onChange={(e) => handleData("applicableOn", e.target.value)}
                        className="border border-gray-400 rounded-lg px-3 py-2 focus:outline-none w-full"
                        required
                    >
                        <option value="">Select Option</option>
                        <option value="all">All Shops</option>
                        <option value="shop">Specific Shop</option>
                        <option value="category">Category</option>
                        <option value="floor">Floor</option>
                    </select>
                </div>

                {/* Dynamic Lists (Shops/Categories/Floors) */}
                {["shop", "category", "floor"].map((type) => {
                    const selected =
                        type === "shop"
                            ? selectedShops
                            : type === "category"
                                ? selectedCategories
                                : selectedFloors;
                    const options =
                        type === "shop" ? shops : type === "category" ? categories : floors;

                    return data.applicableOn === type ? (
                        <div key={type} className="flex flex-col gap-2 col-span-1 sm:col-span-2">
                            <div className="flex flex-wrap gap-2">
                                {selected.map((item) => (
                                    <span
                                        key={item}
                                        className={`${type === "shop"
                                                ? "bg-blue-100 text-blue-700"
                                                : type === "category"
                                                    ? "bg-green-100 text-green-700"
                                                    : "bg-purple-100 text-purple-700"
                                            } px-3 py-1 rounded-full flex items-center gap-2`}
                                    >
                                        {item}
                                        <button
                                            type="button"
                                            className="text-red-500 font-bold"
                                            onClick={() => removeItem(item, type)}
                                        >
                                            ×
                                        </button>
                                    </span>
                                ))}
                            </div>
                            <select
                                onChange={(e) => handleSelect(e.target.value, type)}
                                className="border border-gray-400 rounded-lg px-3 py-2 focus:outline-none w-full"
                            >
                                <option value="">Select {type.charAt(0).toUpperCase() + type.slice(1)}</option>
                                {options.map((opt) => (
                                    <option key={opt?.id} value={opt?.name}>
                                        {opt?.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    ) : null;
                })}

                {/* Dates */}
                <div className="flex flex-col gap-1">
                    <label htmlFor="start-date">Start Date</label>
                    <input
                        type="date"
                        id="start-date"
                        value={data.startDate || ""}
                        onChange={(e) => handleData("startDate", e.target.value)}
                        className="border border-gray-400 rounded-lg px-3 py-2 focus:outline-none w-full"
                        required
                    />
                </div>

                <div className="flex flex-col gap-1">
                    <label htmlFor="end-date">End Date</label>
                    <input
                        type="date"
                        id="end-date"
                        value={data.endDate || ""}
                        onChange={(e) => handleData("endDate", e.target.value)}
                        className="border border-gray-400 rounded-lg px-3 py-2 focus:outline-none w-full"
                        required
                    />
                </div>

                {/* Numbers */}
                <div className="flex flex-col gap-1">
                    <label htmlFor="min-purchase">Minimum Purchase (₹)</label>
                    <input
                        type="number"
                        id="min-purchase"
                        value={data.minimumPurchase || ""}
                        onChange={(e) => handleData("minimumPurchase", e.target.value)}
                        className="border border-gray-400 rounded-lg px-3 py-2 focus:outline-none w-full"
                    />
                </div>

                <div className="flex flex-col gap-1">
                    <label htmlFor="max-discount">Maximum Discount (₹)</label>
                    <input
                        type="number"
                        id="max-discount"
                        value={data.maxDiscount || ""}
                        onChange={(e) => handleData("maxDiscount", e.target.value)}
                        className="border border-gray-400 rounded-lg px-3 py-2 focus:outline-none w-full"
                    />
                </div>

                <div className="flex flex-col gap-1">
                    <label htmlFor="usage-limit">Usage Limit</label>
                    <input
                        type="number"
                        id="usage-limit"
                        value={data.usageLimit || ""}
                        onChange={(e) => handleData("usageLimit", e.target.value)}
                        className="border border-gray-400 rounded-lg px-3 py-2 focus:outline-none w-full"
                    />
                </div>

                {/* Image Upload */}
                <div className="flex flex-col gap-1 col-span-1 sm:col-span-2">
                    {preview && (
                        <div className="mt-3">
                            <Image
                                src={preview}
                                alt="Offer Banner Preview"
                                width={200}
                                height={120}
                                className="rounded-lg border shadow-md object-contain w-full max-w-xs"
                            />
                        </div>
                    )}
                    <label htmlFor="offer-banner">Upload Offer Banner</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="border border-gray-400 rounded-lg px-3 py-2 focus:outline-none w-full"
                    />
                </div>

                {/* Status */}
                <div className="flex flex-col gap-1">
                    <label htmlFor="status">Status</label>
                    <select
                        id="status"
                        value={data.status || "Active"}
                        onChange={(e) => handleData("status", e.target.value)}
                        className="border border-gray-400 rounded-lg px-3 py-2 focus:outline-none w-full"
                    >
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                        <option value="Expired">Expired</option>
                    </select>
                </div>

                {/* Description */}
                <div className="flex flex-col gap-1 col-span-1 sm:col-span-2">
                    <label htmlFor="description">Offer Description</label>
                    <textarea
                        id="description"
                        placeholder="Enter Offer Description..."
                        value={data.description || ""}
                        onChange={(e) => handleData("description", e.target.value)}
                        className="border border-gray-400 rounded-lg px-3 py-2 focus:outline-none w-full h-24"
                    />
                </div>

                {/* Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 col-span-1 sm:col-span-2">
                    <button
                        type="submit"
                        disabled={loading || authLoading || role !== "admin"}
                        className="bg-[#FBBF24] px-6 py-2 rounded-lg hover:bg-[#F97316] hover:text-white disabled:opacity-50 w-full sm:w-auto"
                        title={role !== "admin" ? "Admin access required" : undefined}
                    >
                        {loading || authLoading ? (id ? "Updating..." : "Creating...") : id ? "Update" : "Create"}
                    </button>

                    <button
                        type="button"
                        disabled={loading}
                        onClick={() => router.push("/admin/offers")}
                        className="bg-gray-300 px-6 py-2 rounded-lg hover:bg-gray-400 hover:text-white disabled:opacity-50 w-full sm:w-auto"
                    >
                        {loading ? "Please wait..." : "Cancel"}
                    </button>
                </div>
            </form>
        </div>
    );
}
