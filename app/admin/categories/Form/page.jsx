"use client";

import { createNewCategory, UpdateCategory } from "@/lib/firestore/categories/write";
import { db } from "@/lib/firestore/firebase";
import { doc, getDoc } from "firebase/firestore";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function Form() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState({
        name: "",
        slug: "",
        description: "",
        status: "Active",
    });

    // ✅ States for images and previews
    const [categoryImage, setCategoryImage] = useState(null);
    const [bannerImage, setBannerImage] = useState(null);
    const [categoryImagePreview, setCategoryImagePreview] = useState(null);
    const [bannerImagePreview, setBannerImagePreview] = useState(null);
    const searchParams = useSearchParams();
    const id = searchParams?.get("id") || null;

    useEffect(() => {
        if (!id) return; // no id => creating new category

        const fetchCategory = async () => {
            setLoading(true);
            try {
                const docRef = doc(db, "categories", id);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    const category = docSnap.data();
                    setData({
                        ...category,
                        id, // important to store id for UpdateCategory
                    });
                    setCategoryImagePreview(category.categoryImageURL || null);
                    setBannerImagePreview(category.bannerImageURL || null);
                } else {
                    alert("⚠️ Category not found");
                    router.push("/admin/categories");
                }
            } catch (error) {
                console.error(error);
                alert("❌ Failed to load category");
            } finally {
                setLoading(false);
            }
        };

        fetchCategory();
    }, [id]);

    const handleData = (key, value) => {
        setData((prev) => ({
            ...prev,
            [key]: value,
        }));
    };

    // ✅ Handle image upload and preview
    const handleImageChange = (e, type) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onloadend = () => {
            if (type === "category") {
                setCategoryImage(file);
                setCategoryImagePreview(reader.result);
            } else if (type === "banner") {
                setBannerImage(file);
                setBannerImagePreview(reader.result);
            }
        };
        reader.readAsDataURL(file);
    };

    const handleSubmit = async () => {
        setLoading(true);

        try {
            await createNewCategory({
                data,
                categoryImage,
                bannerImage,
            });

            // ✅ Reset form
            setData({
                name: "",
                slug: "",
                description: "",
                status: "Active",
            });
            setCategoryImage(null);
            setBannerImage(null);
            setCategoryImagePreview(null);
            setBannerImagePreview(null);

            alert("✅ Category created successfully");
            router.push("/admin/categories");
        } catch (error) {
            alert(error?.message || "❌ Something went wrong");
        }

        setLoading(false);
    };

    const handleUpdate = async () => {
        setLoading(true);
        try {
            await UpdateCategory({
                data,
                categoryImage,
                bannerImage,
            });

            // ✅ Reset form
            setData({
                name: "",
                slug: "",
                description: "",
                status: "Active",
            });
            setCategoryImage(null);
            setBannerImage(null);
            setCategoryImagePreview(null);
            setBannerImagePreview(null);

            alert("✅ Category Updated successfully");
            router.push("/admin/categories");
        } catch (error) {
            alert(error?.message || "❌ Something went wrong");
        }
        setLoading(false);
    }

    return (
        <div className="flex-1 flex flex-col gap-5 rounded-xl p-6 sm:p-8 lg:p-12 bg-gray-50 shadow">
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    if (id) {
                        handleUpdate();
                    }
                    else {
                        handleSubmit();
                    }
                }}
                className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4"
            >
                {/* ✅ Image Uploads */}
                <ImageSection
                    categoryImagePreview={categoryImagePreview}
                    bannerImagePreview={bannerImagePreview}
                    handleImageChange={handleImageChange}
                />

                {/* Category Name */}
                <div className="flex flex-col gap-1 md:col-span-2">
                    <label htmlFor="category-name" className="font-medium">
                        Category Name
                    </label>
                    <input
                        type="text"
                        id="category-name"
                        placeholder="Enter Category Name"
                        value={data?.name ?? ""}
                        onChange={(e) => handleData("name", e.target.value)}
                        className="border border-gray-400 rounded-lg px-3 py-2 focus:outline-none w-full"
                    />
                </div>

                {/* Slug */}
                <div className="flex flex-col gap-1 md:col-span-2">
                    <label htmlFor="slug" className="font-medium">Slug</label>
                    <input
                        type="text"
                        id="slug"
                        placeholder="auto-generated or enter manually"
                        value={data?.slug ?? ""}
                        onChange={(e) => handleData("slug", e.target.value)}
                        className="border border-gray-400 rounded-lg px-3 py-2 focus:outline-none w-full"
                        required
                    />
                </div>

                {/* Description */}
                <div className="flex flex-col gap-1 md:col-span-2">
                    <label htmlFor="description" className="font-medium">
                        Description
                    </label>
                    <textarea
                        id="description"
                        rows="3"
                        placeholder="Enter category description"
                        value={data?.description ?? ""}
                        onChange={(e) => handleData("description", e.target.value)}
                        className="border border-gray-400 rounded-lg px-3 py-2 focus:outline-none w-full"
                    />
                </div>

                {/* Status */}
                <div className="flex flex-col gap-1 md:col-span-2">
                    <label htmlFor="status" className="font-medium">Status</label>
                    <select
                        id="status"
                        value={data?.status ?? "Active"}
                        onChange={(e) => handleData("status", e.target.value)}
                        className="border border-gray-400 rounded-lg px-3 py-2 focus:outline-none w-full"
                    >
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                    </select>
                </div>

                {/* Buttons */}
                <div className="flex gap-5 md:col-span-2 mt-4">
                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-[#FBBF24] px-6 py-2 rounded-lg cursor-pointer hover:bg-[#F97316] hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading
                            ? (id ? "Updating..." : "Creating...")
                            : (id ? "Update" : "Create")}
                    </button>

                    <button
                        type="button"
                        disabled={loading}
                        onClick={() => router.push("/admin/categories")}
                        className="bg-gray-300 px-6 py-2 rounded-lg cursor-pointer hover:bg-gray-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? "Please wait..." : "Cancel"}
                    </button>
                </div>
            </form>
        </div>
    );
}

/* ✅ Separate component for image inputs */
function ImageSection({ categoryImagePreview, bannerImagePreview, handleImageChange }) {
    return (
        <div className="flex flex-col gap-4 md:col-span-2">
            {/* Category Image */}
            <div className="flex flex-col gap-1">
                {categoryImagePreview && (
                    <img
                        src={categoryImagePreview}
                        alt="Category Preview"
                        className="mt-2 w-32 object-cover rounded-lg"
                    />
                )}
                <label htmlFor="category" className="font-medium">Category Image</label>
                <input
                    type="file"
                    id="category"
                    className="border border-gray-400 rounded-lg px-3 py-2 w-full text-sm"
                    onChange={(e) => handleImageChange(e, "category")}
                />
            </div>

            {/* Banner Image */}
            <div className="flex flex-col gap-1">
                {bannerImagePreview && (
                    <img
                        src={bannerImagePreview}
                        alt="Banner Preview"
                        className="mt-2 w-32 object-cover rounded-lg"
                    />
                )}
                <label htmlFor="banner" className="font-medium">Banner Image</label>
                <input
                    type="file"
                    id="banner"
                    className="border border-gray-400 rounded-lg px-3 py-2 w-full text-sm"
                    onChange={(e) => handleImageChange(e, "banner")}
                />
            </div>
        </div>
    );
}
