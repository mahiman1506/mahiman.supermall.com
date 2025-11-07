"use client";

import { db } from "@/lib/firestore/firebase";
import { collection, getDocs } from "firebase/firestore";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import { ArrowLeftCircleIcon, BadgeCheck, XCircle } from "lucide-react";
import Link from "next/link";

export default function Page() {
    const { id } = useParams();
    const [category, setCategory] = useState(null);

    useEffect(() => {
        const fetchCategory = async () => {
            try {
                const categoriesSnapshot = await getDocs(collection(db, "categories"));
                const selectedCategory = categoriesSnapshot.docs
                    .map((doc) => ({ id: doc.id, ...doc.data() }))
                    .find((cat) => cat.id === id);

                setCategory(selectedCategory || null);
            } catch (error) {
                console.error("Error fetching category:", error);
            }
        };

        fetchCategory();
    }, [id]);

    if (!category) {
        return (
            <main className="flex justify-center items-center h-[80vh] text-gray-500">
                <p>Loading category details...</p>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-gray-50 pb-2">
            {/* Banner Section */}
            <section className="relative w-full h-64 sm:h-80 md:h-96">
                <Image
                    src={category.bannerImageURL || "/placeholder-banner.jpg"}
                    alt={category.name}
                    fill
                    className="object-cover brightness-75"
                    priority
                />
                <div className="absolute inset-0 flex flex-col justify-center items-center text-white text-center">
                    <h1 className="text-4xl sm:text-5xl font-bold">{category.name}</h1>
                    <p className="mt-2 text-sm sm:text-base opacity-90">
                        {category.slug ? `Slug: ${category.slug}` : ""}
                    </p>
                </div>
            </section>

            {/* Category Details */}
            <section className="max-w-5xl mx-auto px-6 py-12">
                <div className="bg-white shadow-lg rounded-2xl p-8">
                    <div className="flex flex-col md:flex-row gap-8 items-start md:items-center">
                        {/* Category Image */}
                        <div className="h-40 rounded-lg overflow-hidden shadow-md">
                            <Image
                                src={category.categoryImageURL || "/placeholder-category.jpg"}
                                alt={category.name}
                                width={160}  // 40 * 4 = 160px
                                height={160} // same as above
                                className="object-cover w-full h-full"
                            />
                        </div>


                        {/* Details */}
                        <div className="flex-1">
                            <h2 className="text-2xl font-semibold text-gray-800 mb-3">
                                {category.name}
                            </h2>
                            <p className="text-gray-600 leading-relaxed mb-6">
                                {category.description || "No description provided."}
                            </p>

                            {/* Status */}
                            <div className="flex items-center gap-2">
                                {category.status === "Active" ? (
                                    <div className="flex items-center gap-1 text-green-600 bg-green-100 px-3 py-1 rounded-full text-sm font-medium">
                                        <BadgeCheck size={16} />
                                        Active
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-1 text-red-600 bg-red-100 px-3 py-1 rounded-full text-sm font-medium">
                                        <XCircle size={16} />
                                        Inactive
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <div className="flex items-center justify-center">
                <Link href={"/"}>
                    <button className="flex gap-2 bg-black rounded-2xl text-white px-4 py-2">
                        <ArrowLeftCircleIcon /> Go Back
                    </button>
                </Link>
            </div>
        </main>
    );
}






