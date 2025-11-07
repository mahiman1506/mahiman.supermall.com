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
    const [Floor, setFloor] = useState(null);

    useEffect(() => {
        const fetchFloor = async () => {
            try {
                const floorSnapshot = await getDocs(collection(db, "floors"));
                const selectedFloor = floorSnapshot.docs
                    .map((doc) => ({ id: doc.id, ...doc.data() }))
                    .find((floor) => floor.id === id);

                setFloor(selectedFloor || null);
            } catch (error) {
                console.error("Error fetching Floor:", error);
            }
        };

        fetchFloor();
    }, [id]);

    if (!Floor) {
        return (
            <main className="flex justify-center items-center h-[80vh] text-gray-500">
                <p>Loading Floor details...</p>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-gray-50 pb-2">
            {/* Category Details */}
            <section className="max-w-5xl mx-auto px-6 py-12">
                <div className="bg-white shadow-lg rounded-2xl p-8">
                    <div className="flex flex-col md:flex-row gap-8 items-start md:items-center">
                        {/* Category Image */}
                        <div className="h-40 rounded-lg overflow-hidden shadow-md">
                            <Image
                                src={Floor.floorPlanImageURL || "/placeholder-category.jpg"}
                                alt={Floor.name}
                                width={160}  // 40 * 4 = 160px
                                height={160} // same as above
                                className="object-cover w-full h-full"
                            />
                        </div>


                        {/* Details */}
                        <div className="flex-1">
                            <div className="flex items-center justify-between">
                                <h2 className="text-2xl font-semibold text-gray-800 mb-3">
                                    {Floor.name}
                                </h2>
                                <h1 className="text-5xl font-semibold text-gray-800">
                                    {Floor.floorNumber}
                                </h1>
                            </div>
                            <h2 className="text-2xl text-gray-700 font-semibold">
                                <span className="text-black">shopCapacity</span> : {Floor.shopCapacity}
                            </h2>
                            <p className="text-gray-600 leading-relaxed mb-6">
                                {Floor.description || "No description provided."}
                            </p>

                            {/* Status */}
                            <div className="flex items-center gap-2">
                                {Floor.status === "Active" ? (
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