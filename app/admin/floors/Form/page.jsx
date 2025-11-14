// "use client"

// import { db } from "@/lib/firestore/firebase";
// import { createNewFloor, UpdateFloor } from "@/lib/firestore/floors/write";
// import { doc, getDoc } from "firebase/firestore";
// import { useRouter, useSearchParams } from "next/navigation";
// import { useEffect, useState } from "react"

// export default function Form() {

//     // const [image,setImage] = useState(null);
//     const router = useRouter()
//     const [loading, setLoading] = useState(false);
//     const [data, setData] = useState({
//         name: "",
//         floorNumber: "",
//         shopCapacity: "",
//         description: "",
//         status: "Active",
//     });
//     const [floorPlanImage, setFloorPlanImage] = useState(null);
//     const [floorPlanImagePreview, setFloorPlanImagePreview] = useState(null);
//     const searchParams = useSearchParams();
//     const id = searchParams?.get("id") || null;

//     useEffect(() => {
//         if (!id) return; // no id => creating new category

//         const fetchFloor = async () => {
//             setLoading(true);
//             try {
//                 const docRef = doc(db, "floors", id);
//                 const docSnap = await getDoc(docRef);

//                 if (docSnap.exists()) {
//                     const floor = docSnap.data();
//                     setData({
//                         ...floor,
//                         id, // important to store id for UpdateCategory
//                     });
//                     setFloorPlanImagePreview(floor.floorPlanImageURL || null);
//                 } else {
//                     alert("⚠️ Floor not found");
//                     router.push("/admin/floors");
//                 }
//             } catch (error) {
//                 console.error(error);
//                 alert("❌ Failed to load Floor");
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchFloor();
//     }, [id]);

//     const handleData = (key, value) => {
//         setData((prev) => ({
//             ...prev,
//             [key]: value,
//         }));
//     };

//     const handleFloorPlanImageChange = (e) => {
//         const file = e.target.files[0];
//         if (file) {
//             setFloorPlanImage(file);
//             setFloorPlanImagePreview(URL.createObjectURL(file)); // ✅ creates a preview link
//         }
//     };

//     const handleSubmit = async () => {
//         setLoading(true);

//         try {
//             await createNewFloor({
//                 data,
//                 floorPlanImage,
//             });

//             // ✅ Reset form
//             setData({
//                 name: "",
//                 floorNumber: "",
//                 shopCapacity: "",
//                 description: "",
//                 status: "Active",
//             });
//             setFloorPlanImage(null);
//             setFloorPlanImagePreview(null);

//             alert("✅ Floor created successfully");
//             router.push("/admin/floors");
//         } catch (error) {
//             alert(error?.message || "❌ Something went wrong");
//         }

//         setLoading(false);
//     };

//     const handleUpdate = async () => {
//         setLoading(true);

//         try {
//             await UpdateFloor({
//                 data,
//                 floorPlanImage,
//             });

//             // ✅ Reset form
//             setData({
//                 name: "",
//                 floorNumber: "",
//                 shopCapacity: "",
//                 description: "",
//                 status: "Active",
//             });
//             setFloorPlanImage(null);
//             setFloorPlanImagePreview(null);

//             alert("✅ Floor updated successfully");
//             router.push("/admin/floors");
//         } catch (error) {
//             alert(error?.message || "❌ Something went wrong");
//         }

//         setLoading(false);
//     };

//     return (
//         <div className="flex-1 flex flex-col gap-5 rounded-xl p-12 bg-gray-50 shadow">
//             <form
//                 onSubmit={(e) => {
//                     e.preventDefault();
//                     if (id) {
//                         handleUpdate();
//                     }
//                     else {
//                         handleSubmit();
//                     }
//                 }}
//                 className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//                 {/* Flooor Name */}
//                 <div className="flex flex-col gap-1 col-span-2">
//                     <label htmlFor="floor-name">Floor Name</label>
//                     <input
//                         type="text"
//                         id="floor-name"
//                         placeholder="Enter Floor Name"
//                         value={data?.name}
//                         onChange={(e) => handleData("name", e.target.value)}
//                         suppressHydrationWarning
//                         className="border border-gray-400 rounded-lg px-3 py-2 focus:outline-none w-full"
//                     />
//                 </div>

//                 <div className="flex flex-col gap-1 col-span-2">
//                     <label htmlFor="floor-number">Floor Number</label>
//                     <input
//                         type="number"
//                         id="floor-number"
//                         placeholder="Enter Floor Number"
//                         value={data?.floorNumber}
//                         onChange={(e) => handleData("floorNumber", e.target.value)}
//                         suppressHydrationWarning
//                         className="border border-gray-400 rounded-lg px-3 py-2 focus:outline-none w-full"
//                     />
//                 </div>

//                 <div className="flex flex-col gap-1 col-span-2">
//                     <label htmlFor="floor-shop-capacity">Shop Capacity</label>
//                     <input
//                         type="number"
//                         id="floor-shop-capacity"
//                         placeholder="Enter Shop Capacity"
//                         value={data?.shopCapacity}
//                         onChange={(e) => handleData("shopCapacity", e.target.value)}
//                         suppressHydrationWarning
//                         className="border border-gray-400 rounded-lg px-3 py-2 focus:outline-none w-full"
//                     />
//                 </div>

//                 <div className="flex flex-col gap-1 col-span-2">
//                     {floorPlanImagePreview && (
//                         <img
//                             src={floorPlanImagePreview}
//                             alt="Floor Plan Preview"
//                             className="mt-2 w-32 object-cover rounded-lg"
//                         />
//                     )}
//                     <label htmlFor="floor-plan-image">Upload Floor Plan</label>
//                     <input
//                         type="file"
//                         id="floor-plan-image"
//                         suppressHydrationWarning
//                         className="border border-gray-400 rounded-lg px-3 py-2 focus:outline-none w-full"
//                         onChange={handleFloorPlanImageChange}
//                     />
//                 </div>

//                 <div className="flex flex-col gap-1 col-span-2">
//                     <label htmlFor="floor-plan-image">Status</label>
//                     <select
//                         type="file"
//                         id="floor-plan-image"
//                         value={data?.status}
//                         onChange={(e) => handleData("status", e.target.value)}
//                         suppressHydrationWarning
//                         className="border border-gray-400 rounded-lg px-3 py-2 focus:outline-none w-full"
//                     >
//                         <option value="Active">Active</option>
//                         <option value="Inactive">Inactive</option>
//                     </select>
//                 </div>

//                 <div className="flex flex-col gap-1 col-span-2">
//                     <label htmlFor="floor-description">Floor Description</label>
//                     <textarea
//                         id="floor-description"
//                         rows={6}
//                         placeholder="Enter Shop Description..."
//                         value={data?.description}
//                         onChange={(e) => handleData("description", e.target.value)}
//                         className="border border-gray-400 rounded-lg px-2 py-2 focus:outline-none"
//                     ></textarea>
//                 </div>

//                 {/* Button */}
//                 <div className="flex gap-5">
//                     {/* Submit */}
//                     <div className="col-span-2">
//                         <button
//                             type="submit"
//                             disabled={loading}
//                             className="bg-[#FBBF24] px-6 py-2 rounded-lg hover:bg-[#F97316] hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
//                         >
//                             {loading
//                                 ? (id ? "Updating..." : "Creating...")
//                                 : (id ? "Update" : "Create")}
//                         </button>
//                     </div>
//                     {/* Cancel */}
//                     <div className="col-span-2">
//                         <button
//                             type="button" // ✅ Prevents form submission
//                             disabled={loading}
//                             onClick={() => router.push("/admin/floors")} // ✅ Redirect
//                             className="bg-gray-300 px-6 py-2 rounded-lg hover:bg-gray-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
//                         >
//                             {loading ? "Please wait..." : "Cancel"}
//                         </button>
//                     </div>
//                 </div>
//             </form>
//         </div>

//     )
// }

"use client";

import { db } from "@/lib/firestore/firebase";
import { createNewFloor, UpdateFloor } from "@/lib/firestore/floors/write";
import {
  doc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function Form() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [data, setData] = useState({
    name: "",
    floorNumber: "",
    shopCapacity: "",
    description: "",
    status: "Active",
  });

  const [floorPlanImage, setFloorPlanImage] = useState(null);
  const [floorPlanImagePreview, setFloorPlanImagePreview] = useState(null);

  const [createdShops, setCreatedShops] = useState(0); // 🔥 Total shops created

  const searchParams = useSearchParams();
  const id = searchParams?.get("id") || null;

  // 🔥 Fetch floor data
  useEffect(() => {
    if (!id) return;

    const fetchFloor = async () => {
      setLoading(true);
      try {
        const docRef = doc(db, "floors", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const floor = docSnap.data();
          setData({ ...floor, id });
          setFloorPlanImagePreview(floor.floorPlanImageURL || null);
        } else {
          alert("⚠️ Floor not found");
          router.push("/admin/floors");
        }
      } catch (error) {
        alert("❌ Failed to load floor");
      } finally {
        setLoading(false);
      }
    };

    fetchFloor();
  }, [id]);

  // 🔥 Fetch total shops created for this floor
  useEffect(() => {
    if (!id) return;

    const fetchShops = async () => {
      const q = query(collection(db, "shop"), where("floor", "==", id));
      const snap = await getDocs(q);
      setCreatedShops(snap.size);
    };

    fetchShops();
  }, [id]);

  const handleData = (key, value) => {
    setData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleFloorPlanImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFloorPlanImage(file);
      setFloorPlanImagePreview(URL.createObjectURL(file));
    }
  };

  // 🔥 CREATE
  const handleSubmit = async () => {
    setLoading(true);

    try {
      await createNewFloor({
        data,
        floorPlanImage,
      });

      alert("✅ Floor created successfully");
      router.push("/admin/floors");
    } catch (error) {
      alert(error?.message || "❌ Something went wrong");
    }

    setLoading(false);
  };

  // 🔥 UPDATE
  const handleUpdate = async () => {
    setLoading(true);

    try {
      // 🔥 Auto inactive when full
      let updatedData = { ...data };
      if (createdShops >= Number(data.shopCapacity)) {
        updatedData.status = "Inactive";
      }

      await UpdateFloor({
        data: updatedData,
        floorPlanImage,
      });

      alert("✅ Floor updated successfully");
      router.push("/admin/floors");
    } catch (error) {
      alert(error?.message || "❌ Something went wrong");
    }

    setLoading(false);
  };

  return (
    <div className="flex-1 flex flex-col gap-5 rounded-xl p-12 bg-gray-50 shadow">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (id) handleUpdate();
          else handleSubmit();
        }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
      >
        {/* Floor Name */}
        <div className="flex flex-col gap-1 col-span-2">
          <label>Floor Name</label>
          <input
            type="text"
            placeholder="Enter Floor Name"
            value={data?.name}
            onChange={(e) => handleData("name", e.target.value)}
            className="border border-gray-400 rounded-lg px-3 py-2"
          />
        </div>

        {/* Floor Number */}
        <div className="flex flex-col gap-1 col-span-2">
          <label>Floor Number</label>
          <input
            type="number"
            placeholder="Enter Floor Number"
            value={data?.floorNumber}
            onChange={(e) => handleData("floorNumber", e.target.value)}
            className="border border-gray-400 rounded-lg px-3 py-2"
          />
        </div>

        {/* Capacity */}
        <div className="flex flex-col gap-1 col-span-2">
          <label>Shop Capacity</label>
          <input
            type="number"
            placeholder="Enter Shop Capacity"
            value={data?.shopCapacity}
            min="0" // 🔥 Prevent negative numbers
            onChange={(e) => {
              const value = Number(e.target.value);

              // 🔥 Prevent negative input
              if (value < 0) return;

              handleData("shopCapacity", value);
            }}
            className="border border-gray-400 rounded-lg px-3 py-2"
          />
        </div>

        {/* Image */}
        <div className="flex flex-col gap-1 col-span-2">
          {floorPlanImagePreview && (
            <img
              src={floorPlanImagePreview}
              className="mt-2 w-32 object-cover rounded-lg"
            />
          )}

          <label>Upload Floor Plan</label>
          <input
            type="file"
            onChange={handleFloorPlanImageChange}
            className="border border-gray-400 rounded-lg px-3 py-2"
          />
        </div>

        {/* 🔥 Status Dropdown with Auto Disable */}
        <div className="flex flex-col gap-1 col-span-2">
          <label>Status</label>

          <select
            value={data?.status}
            onChange={(e) => handleData("status", e.target.value)}
            className="border border-gray-400 rounded-lg px-3 py-2"
          >
            {/* ACTIVE IS DISABLED IF FLOOR IS FULL */}
            <option
              value="Active"
              disabled={createdShops >= Number(data.shopCapacity)}
            >
              Active
            </option>

            <option value="Inactive">Inactive</option>
          </select>

          {/* Show info */}
          {id && (
            <p className="text-xs text-gray-500 mt-1">
              Shops Created: {createdShops} / {data.shopCapacity}
            </p>
          )}
        </div>

        {/* Description */}
        <div className="flex flex-col gap-1 col-span-2">
          <label>Floor Description</label>
          <textarea
            rows={6}
            placeholder="Enter Description..."
            value={data?.description}
            onChange={(e) => handleData("description", e.target.value)}
            className="border border-gray-400 rounded-lg px-2 py-2"
          ></textarea>
        </div>

        {/* Buttons */}
        <div className="flex gap-5 col-span-2">
          <button
            type="submit"
            disabled={loading}
            className="bg-[#FBBF24] px-6 py-2 rounded-lg hover:bg-[#F97316] hover:text-white disabled:opacity-50"
          >
            {loading
              ? id
                ? "Updating..."
                : "Creating..."
              : id
              ? "Update"
              : "Create"}
          </button>

          <button
            type="button"
            disabled={loading}
            onClick={() => router.push("/admin/floors")}
            className="bg-gray-300 px-6 py-2 rounded-lg hover:bg-gray-400 hover:text-white disabled:opacity-50"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
