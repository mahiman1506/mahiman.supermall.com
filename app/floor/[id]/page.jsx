// "use client";

// import { db } from "@/lib/firestore/firebase";
// import { collection, getDocs } from "firebase/firestore";
// import { useParams } from "next/navigation";
// import { useEffect, useState } from "react";
// import Image from "next/image";
// import { ArrowLeftCircleIcon, BadgeCheck, XCircle } from "lucide-react";
// import Link from "next/link";

// export default function Page() {
//   const { id } = useParams();
//   const [Floor, setFloor] = useState(null);

//   useEffect(() => {
//     const fetchFloor = async () => {
//       try {
//         const floorSnapshot = await getDocs(collection(db, "floors"));
//         const selectedFloor = floorSnapshot.docs
//           .map((doc) => ({ id: doc.id, ...doc.data() }))
//           .find((floor) => floor.id === id);

//         setFloor(selectedFloor || null);
//       } catch (error) {
//         console.error("Error fetching Floor:", error);
//       }
//     };

//     fetchFloor();
//   }, [id]);

//   if (!Floor) {
//     return (
//       <main className="flex justify-center items-center h-[80vh] text-gray-500">
//         <p>Loading Floor details...</p>
//       </main>
//     );
//   }

//   return (
//     <main className="min-h-screen bg-gray-50 pb-2">
//       {/* Category Details */}
//       <section className="max-w-5xl mx-auto px-6 py-12">
//         <div className="bg-white shadow-lg rounded-2xl p-8">
//           <div className="flex flex-col md:flex-row gap-8 items-start md:items-center">
//             {/* Category Image */}
//             <div className="h-40 rounded-lg overflow-hidden shadow-md">
//               <Image
//                 src={Floor.floorPlanImageURL || "/placeholder-category.jpg"}
//                 alt={Floor.name}
//                 width={160} // 40 * 4 = 160px
//                 height={160} // same as above
//                 className="object-cover w-full h-full"
//               />
//             </div>

//             {/* Details */}
//             <div className="flex-1">
//               <div className="flex items-center justify-between">
//                 <h2 className="text-2xl font-semibold text-gray-800 mb-3">
//                   {Floor.name}
//                 </h2>
//                 <h1 className="text-5xl font-semibold text-gray-800">
//                   {Floor.floorNumber}
//                 </h1>
//               </div>
//               <h2 className="text-2xl text-gray-700 font-semibold">
//                 <span className="text-black">shopCapacity</span> :{" "}
//                 {Floor.shopCapacity}
//               </h2>
//               <h2>
//                 <span>Total Shop created :</span>
//               </h2>
//               <p className="text-gray-600 leading-relaxed mb-6">
//                 {Floor.description || "No description provided."}
//               </p>

//               {/* Status */}
//               <div className="flex items-center gap-2">
//                 {Floor.status === "Active" ? (
//                   <div className="flex items-center gap-1 text-green-600 bg-green-100 px-3 py-1 rounded-full text-sm font-medium">
//                     <BadgeCheck size={16} />
//                     Active
//                   </div>
//                 ) : (
//                   <div className="flex items-center gap-1 text-red-600 bg-red-100 px-3 py-1 rounded-full text-sm font-medium">
//                     <XCircle size={16} />
//                     Inactive
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>
//       <div className="flex items-center justify-center">
//         <Link href={"/"}>
//           <button className="flex gap-2 bg-black rounded-2xl text-white px-4 py-2">
//             <ArrowLeftCircleIcon /> Go Back
//           </button>
//         </Link>
//       </div>
//     </main>
//   );
// }

// "use client";

// import { db } from "@/lib/firestore/firebase";
// import { collection, getDocs, query, where } from "firebase/firestore";
// import { useParams } from "next/navigation";
// import { useEffect, useState } from "react";
// import Image from "next/image";
// import { ArrowLeftCircleIcon, BadgeCheck, XCircle } from "lucide-react";
// import Link from "next/link";

// export default function Page() {
//   const { id } = useParams();
//   const [Floor, setFloor] = useState(null);
//   const [shopCount, setShopCount] = useState(0); // 🔹 store total shop count
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchFloorAndShops = async () => {
//       try {
//         // Fetch Floor
//         const floorSnapshot = await getDocs(collection(db, "floors"));
//         const selectedFloor = floorSnapshot.docs
//           .map((doc) => ({ id: doc.id, ...doc.data() }))
//           .find((floor) => floor.id === id);

//         setFloor(selectedFloor || null);

//         // Fetch number of shops linked to this floor
//         const shopQuery = query(
//           collection(db, "shop"),
//           where("floor", "==", id)
//         );
//         const shopSnapshot = await getDocs(shopQuery);
//         setShopCount(shopSnapshot.size); // 🔹 directly set count
//       } catch (error) {
//         console.error("Error fetching Floor or Shop count:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchFloorAndShops();
//   }, [id]);

//   if (loading) {
//     return (
//       <main className="flex justify-center items-center h-[80vh] text-gray-500">
//         <p>Loading Floor details...</p>
//       </main>
//     );
//   }

//   if (!Floor) {
//     return (
//       <main className="flex justify-center items-center h-[80vh] text-gray-500">
//         <p>Floor not found.</p>
//       </main>
//     );
//   }

//   return (
//     <main className="min-h-screen bg-gray-50 pb-2">
//       {/* Floor Details */}
//       <section className="max-w-5xl mx-auto px-6 py-12">
//         <div className="bg-white shadow-lg rounded-2xl p-8">
//           <div className="flex flex-col md:flex-row gap-8 items-start md:items-center">
//             {/* Floor Image */}
//             <div className="h-40 rounded-lg overflow-hidden shadow-md">
//               <Image
//                 src={Floor.floorPlanImageURL || "/placeholder-category.jpg"}
//                 alt={Floor.name}
//                 width={160}
//                 height={160}
//                 className="object-cover w-full h-full"
//               />
//             </div>

//             {/* Floor Details */}
//             <div className="flex-1">
//               <div className="flex items-center justify-between">
//                 <h2 className="text-2xl font-semibold text-gray-800 mb-3">
//                   {Floor.name}
//                 </h2>
//                 <h1 className="text-5xl font-semibold text-gray-800">
//                   {Floor.floorNumber}
//                 </h1>
//               </div>

//               <h2 className="text-2xl text-gray-700 font-semibold">
//                 <span className="text-black">Shop Capacity</span> :{" "}
//                 {Floor.shopCapacity}
//               </h2>

//               <h2 className="text-2xl text-gray-700 font-semibold mt-2">
//                 <span className="text-black">Total Shops Created</span> :{" "}
//                 {shopCount}
//               </h2>

//               <p className="text-gray-600 leading-relaxed mb-6 mt-4">
//                 {Floor.description || "No description provided."}
//               </p>

//               {/* Status */}
//               <div className="flex items-center gap-2">
//                 {Floor.status === "Active" ? (
//                   <div className="flex items-center gap-1 text-green-600 bg-green-100 px-3 py-1 rounded-full text-sm font-medium">
//                     <BadgeCheck size={16} />
//                     Active
//                   </div>
//                 ) : (
//                   <div className="flex items-center gap-1 text-red-600 bg-red-100 px-3 py-1 rounded-full text-sm font-medium">
//                     <XCircle size={16} />
//                     Inactive
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Back Button */}
//       <div className="flex items-center justify-center">
//         <Link href={"/"}>
//           <button className="flex gap-2 bg-black rounded-2xl text-white px-4 py-2">
//             <ArrowLeftCircleIcon /> Go Back
//           </button>
//         </Link>
//       </div>
//     </main>
//   );
// }

"use client";

import { db } from "@/lib/firestore/firebase";
import {
  collection,
  getDocs,
  query,
  where,
  doc,
  updateDoc,
} from "firebase/firestore";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import { ArrowLeftCircleIcon, BadgeCheck, XCircle } from "lucide-react";
import Link from "next/link";

export default function Page() {
  const { id } = useParams();
  const [Floor, setFloor] = useState(null);
  const [shopCount, setShopCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  useEffect(() => {
    const fetchFloorAndShops = async () => {
      try {
        // Fetch Floor
        const floorSnapshot = await getDocs(collection(db, "floors"));
        const selectedFloor = floorSnapshot.docs
          .map((doc) => ({ id: doc.id, ...doc.data() }))
          .find((floor) => floor.id === id);

        setFloor(selectedFloor || null);

        // Fetch number of shops linked to this floor (note: you used collection name "shop" and field "floor")
        const shopQuery = query(
          collection(db, "shop"),
          where("floor", "==", id)
        );
        const shopSnapshot = await getDocs(shopQuery);
        setShopCount(shopSnapshot.size);
      } catch (error) {
        console.error("Error fetching Floor or Shop count:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFloorAndShops();
  }, [id]);

  // If shopCount >= capacity, automatically set floor status -> "Inactive" (so no new shops can be created)
  useEffect(() => {
    const disableFloorIfFull = async () => {
      if (!Floor) return;
      // ensure shopCapacity is numeric
      const capacity = Number(Floor.shopCapacity ?? 0);
      if (isNaN(capacity)) return;

      // Only update if count >= capacity and floor is currently Active
      if (shopCount >= capacity && Floor.status === "Active") {
        try {
          setUpdatingStatus(true);
          const floorRef = doc(db, "floors", Floor.id);
          await updateDoc(floorRef, { status: "Inactive" });
          // update local state to reflect change
          setFloor((prev) => (prev ? { ...prev, status: "Inactive" } : prev));
        } catch (err) {
          console.error("Failed to set floor inactive:", err);
        } finally {
          setUpdatingStatus(false);
        }
      }
    };

    disableFloorIfFull();
  }, [Floor, shopCount]);

  if (loading) {
    return (
      <main className="flex justify-center items-center h-[80vh] text-gray-500">
        <p>Loading Floor details...</p>
      </main>
    );
  }

  if (!Floor) {
    return (
      <main className="flex justify-center items-center h-[80vh] text-gray-500">
        <p>Floor not found.</p>
      </main>
    );
  }

  const capacity = Number(Floor.shopCapacity ?? 0);
  const isFull = !isNaN(capacity) && shopCount >= capacity;

  return (
    <main className="min-h-screen bg-gray-50 pb-6">
      {/* Floor Details */}
      <section className="max-w-5xl mx-auto px-6 py-12">
        <div className="bg-white shadow-lg rounded-2xl p-8">
          <div className="flex flex-col md:flex-row gap-8 items-start md:items-center">
            {/* Floor Image */}
            <div className="h-40 rounded-lg overflow-hidden shadow-md">
              <Image
                src={Floor.floorPlanImageURL || "/placeholder-category.jpg"}
                alt={Floor.name}
                width={160}
                height={160}
                className="object-cover w-full h-full"
              />
            </div>

            {/* Floor Details */}
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
                <span className="text-black">Shop Capacity</span> :{" "}
                {Floor.shopCapacity}
              </h2>

              <h2 className="text-2xl text-gray-700 font-semibold mt-2">
                <span className="text-black">Total Shops Created</span> :{" "}
                {shopCount}
              </h2>

              {/* Warning when full */}
              {isFull && (
                <div className="mt-4 p-4 border border-red-200 bg-red-50 rounded-lg">
                  <p className="text-sm text-red-800 font-medium">
                    This floor has reached its capacity ({capacity}). New shops
                    cannot be created on this floor.
                  </p>
                </div>
              )}

              <p className="text-gray-600 leading-relaxed mb-6 mt-4">
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

                {updatingStatus && (
                  <div className="text-xs text-gray-500 ml-2">
                    Updating status...
                  </div>
                )}
              </div>

              {/* Example action area: create new shop button — disabled when full */}
              <div className="mt-6">
                <button
                  disabled={isFull || Floor.status !== "Active"}
                  className={`px-4 py-2 rounded-2xl text-white ${
                    isFull || Floor.status !== "Active"
                      ? "bg-gray-300 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700"
                  }`}
                >
                  Create New Shop
                </button>
                {isFull && (
                  <p className="text-xs text-gray-500 mt-2">
                    Floor is full. Creation is disabled.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Back Button */}
      <div className="flex items-center justify-center mt-6">
        <Link href={"/"}>
          <button className="flex gap-2 bg-black rounded-2xl text-white px-4 py-2">
            <ArrowLeftCircleIcon /> Go Back
          </button>
        </Link>
      </div>
    </main>
  );
}
