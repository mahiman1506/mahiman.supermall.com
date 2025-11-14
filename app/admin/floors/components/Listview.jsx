// "use client";
// import { useFloor } from "@/lib/firestore/floors/read";
// import { deleteFloor } from "@/lib/firestore/floors/write";
// import { useRouter } from "next/navigation";
// import Loading from "../loading";
// import { Edit2Icon, Trash2Icon } from "lucide-react";

// export default function Listview() {
//   const { data, error, isLoading } = useFloor();
//   const router = useRouter();

//   if (isLoading) {
//     return (
//       <div className="text-center py-6 text-gray-500">
//         <Loading />
//       </div>
//     );
//   }

//   if (error) {
//     return <div className="text-center py-6 text-red-500">❌ {error}</div>;
//   }

//   if (!data || data.length === 0) {
//     return (
//       <div className="text-center py-6 text-gray-400">No floors found</div>
//     );
//   }

//   return (
//     <div className="flex-1 flex flex-col gap-4 px-3 sm:px-6 py-4">
//       {/* ===== Desktop Table View ===== */}
//       <div className="hidden md:block overflow-x-auto">
//         <table className="w-full border-separate border-spacing-y-3">
//           <thead>
//             <tr>
//               <td className="bg-white px-3 py-2 rounded-l-lg text-center font-semibold">
//                 SN
//               </td>
//               <td className="bg-white px-3 py-2 text-center font-semibold">
//                 Floor Name
//               </td>
//               <td className="bg-white px-3 py-2 text-center font-semibold">
//                 Floor Number
//               </td>
//               <td className="bg-white px-3 py-2 text-center font-semibold">
//                 Shop Capacity
//               </td>
//               <td className="bg-white px-3 py-2 text-center font-semibold">
//                 Shop Created
//               </td>
//               <td className="bg-white px-3 py-2 text-center font-semibold">
//                 Floor Plan
//               </td>
//               <td className="bg-white px-3 py-2 text-center font-semibold">
//                 Status
//               </td>
//               <td className="bg-white px-3 py-2 rounded-r-lg text-center font-semibold">
//                 Actions
//               </td>
//             </tr>
//           </thead>
//           <tbody>
//             {data.map((floor, index) => (
//               <tr key={floor.id} className="shadow bg-white">
//                 <td className="text-center py-3 rounded-l-lg">{index + 1}</td>
//                 <td className="text-center font-semibold">{floor.name}</td>
//                 <td className="text-center">{floor.floorNumber}</td>
//                 <td className="text-center">{floor.shopCapacity}</td>
//                 <td className="text-center">
//                   {floor.floorPlanImageURL ? (
//                     <img
//                       src={floor.floorPlanImageURL}
//                       alt={floor.name}
//                       className="h-10 w-auto object-cover rounded-lg mx-auto"
//                     />
//                   ) : (
//                     <div className="h-10 w-10 bg-gray-300 rounded-lg mx-auto" />
//                   )}
//                 </td>
//                 <td className="text-center">
//                   <span
//                     className={`px-3 py-1 rounded-full text-sm font-medium ${
//                       floor.status === "Active"
//                         ? "bg-green-100 text-green-700"
//                         : "bg-red-100 text-red-700"
//                     }`}
//                   >
//                     {floor.status}
//                   </span>
//                 </td>
//                 <td className="text-center rounded-r-lg">
//                   <div className="flex justify-center items-center gap-3">
//                     <button
//                       onClick={() =>
//                         router.push(`/admin/floors/Form?id=${floor.id}`)
//                       }
//                       className="flex items-center gap-1 text-blue-600 hover:text-blue-800 transition-colors"
//                     >
//                       <Edit2Icon size={15} />
//                       <span>Edit</span>
//                     </button>
//                     <span className="text-gray-400">|</span>
//                     <button
//                       onClick={async () => {
//                         if (
//                           !confirm(
//                             `Are you sure you want to delete ${floor.name}?`
//                           )
//                         )
//                           return;
//                         try {
//                           await deleteFloor({ id: floor.id });
//                           alert(`${floor.name} deleted successfully`);
//                         } catch (error) {
//                           alert(error?.message || "Failed to delete floor");
//                         }
//                       }}
//                       className="flex items-center gap-1 text-red-600 hover:text-red-800 transition-colors"
//                     >
//                       <Trash2Icon size={15} />
//                       <span>Delete</span>
//                     </button>
//                   </div>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       {/* ===== Mobile Card View ===== */}
//       <div className="md:hidden flex flex-col gap-3">
//         {data.map((floor, index) => (
//           <div
//             key={floor.id}
//             className="bg-white shadow-sm rounded-lg p-3 flex flex-col gap-2 border border-gray-100"
//           >
//             {/* Header Section */}
//             <div className="flex items-center justify-between">
//               <div className="flex items-center gap-2">
//                 {floor.floorPlanImageURL ? (
//                   <img
//                     src={floor.floorPlanImageURL}
//                     alt={floor.name}
//                     className="h-10 w-10 rounded-md object-cover"
//                   />
//                 ) : (
//                   <div className="h-10 w-10 bg-gray-300 rounded-md" />
//                 )}
//                 <div>
//                   <h3 className="font-semibold text-gray-800 text-sm leading-tight">
//                     {floor.name}
//                   </h3>
//                   <p className="text-xs text-gray-500">#{index + 1}</p>
//                 </div>
//               </div>
//               <span
//                 className={`px-2 py-0.5 rounded-full text-[11px] font-medium ${
//                   floor.status === "Active"
//                     ? "bg-green-100 text-green-700"
//                     : "bg-red-100 text-red-700"
//                 }`}
//               >
//                 {floor.status}
//               </span>
//             </div>

//             {/* Details Section */}
//             <div className="text-xs text-gray-600 grid grid-cols-2 gap-y-1 px-1">
//               <p>
//                 <span className="font-medium text-gray-800">Floor No:</span>{" "}
//                 {floor.floorNumber}
//               </p>
//               <p>
//                 <span className="font-medium text-gray-800">Shops:</span>{" "}
//                 {floor.shopCapacity}
//               </p>
//             </div>

//             {/* Actions Section */}
//             <div className="flex justify-end gap-3 border-t pt-2 mt-1">
//               <button
//                 onClick={() => router.push(`/admin/floors/Form?id=${floor.id}`)}
//                 className="flex items-center gap-1 text-blue-600 hover:text-blue-800 text-xs"
//               >
//                 <Edit2Icon size={13} />
//                 <span>Edit</span>
//               </button>

//               <button
//                 onClick={async () => {
//                   if (
//                     !confirm(`Are you sure you want to delete ${floor.name}?`)
//                   )
//                     return;
//                   try {
//                     await deleteFloor({ id: floor.id });
//                     alert(`${floor.name} deleted successfully`);
//                   } catch (error) {
//                     alert(error?.message || "Failed to delete floor");
//                   }
//                 }}
//                 className="flex items-center gap-1 text-red-600 hover:text-red-800 text-xs"
//               >
//                 <Trash2Icon size={13} />
//                 <span>Delete</span>
//               </button>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

"use client";
import { useFloor } from "@/lib/firestore/floors/read";
import { deleteFloor, UpdateFloor } from "@/lib/firestore/floors/write";
import { useRouter } from "next/navigation";
import Loading from "../loading";
import { Edit2Icon, Trash2Icon } from "lucide-react";
import { useEffect, useState } from "react";

import { db } from "@/lib/firestore/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";

export default function Listview() {
  const { data, error, isLoading } = useFloor();
  const router = useRouter();

  const [shopCounts, setShopCounts] = useState({});

  useEffect(() => {
    if (!data) return;

    const fetchShopCounts = async () => {
      let counts = {};

      for (const floor of data) {
        const q = query(collection(db, "shop"), where("floor", "==", floor.id));
        const snap = await getDocs(q);
        const created = snap.size;
        counts[floor.id] = created;

        // 🔥 Auto Inactive when full
        if (created >= Number(floor.shopCapacity)) {
          // Only update if not already inactive
          if (floor.status !== "Inactive") {
            await UpdateFloor({
              data: {
                ...floor,
                status: "Inactive",
              },
              floorPlanImage: null,
            });
          }
        } else {
          // If shops are not full, ensure it stays Active
          if (floor.status !== "Active") {
            await UpdateFloor({
              data: {
                ...floor,
                status: "Active",
              },
              floorPlanImage: null,
            });
          }
        }
      }

      setShopCounts(counts);
    };

    fetchShopCounts();
  }, [data]);

  if (isLoading) {
    return (
      <div className="text-center py-6 text-gray-500">
        <Loading />
      </div>
    );
  }

  if (error) {
    return <div className="text-center py-6 text-red-500">❌ {error}</div>;
  }

  if (!data || data.length === 0) {
    return (
      <div className="text-center py-6 text-gray-400">No floors found</div>
    );
  }

  return (
    <div className="flex-1 flex flex-col gap-4 px-3 sm:px-6 py-4">
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full border-separate border-spacing-y-3">
          <thead>
            <tr>
              <td className="bg-white px-3 py-2 rounded-l-lg text-center font-semibold">
                SN
              </td>
              <td className="bg-white px-3 py-2 text-center font-semibold">
                Floor Name
              </td>
              <td className="bg-white px-3 py-2 text-center font-semibold">
                Floor Number
              </td>
              <td className="bg-white px-3 py-2 text-center font-semibold">
                Shop Capacity
              </td>
              <td className="bg-white px-3 py-2 text-center font-semibold">
                Shop Created
              </td>
              <td className="bg-white px-3 py-2 text-center font-semibold">
                Floor Plan
              </td>
              <td className="bg-white px-3 py-2 text-center font-semibold">
                Status
              </td>
              <td className="bg-white px-3 py-2 rounded-r-lg text-center font-semibold">
                Actions
              </td>
            </tr>
          </thead>

          <tbody>
            {data.map((floor, index) => (
              <tr key={floor.id} className="shadow bg-white">
                <td className="text-center py-3 rounded-l-lg">{index + 1}</td>
                <td className="text-center font-semibold">{floor.name}</td>
                <td className="text-center">{floor.floorNumber}</td>
                <td className="text-center">{floor.shopCapacity}</td>

                <td className="text-center font-semibold">
                  {shopCounts[floor.id] ?? 0}
                </td>

                <td className="text-center">
                  {floor.floorPlanImageURL ? (
                    <img
                      src={floor.floorPlanImageURL}
                      alt={floor.name}
                      className="h-10 w-auto object-cover rounded-lg mx-auto"
                    />
                  ) : (
                    <div className="h-10 w-10 bg-gray-300 rounded-lg mx-auto" />
                  )}
                </td>

                <td className="text-center">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      floor.status === "Active"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {floor.status}
                  </span>
                </td>

                <td className="text-center rounded-r-lg">
                  <div className="flex justify-center items-center gap-3">
                    <button
                      onClick={() =>
                        router.push(`/admin/floors/Form?id=${floor.id}`)
                      }
                      className="flex items-center gap-1 text-blue-600 hover:text-blue-800 transition-colors"
                    >
                      <Edit2Icon size={15} />
                      <span>Edit</span>
                    </button>

                    <span className="text-gray-400">|</span>

                    <button
                      onClick={async () => {
                        if (
                          !confirm(
                            `Are you sure you want to delete ${floor.name}?`
                          )
                        )
                          return;
                        try {
                          await deleteFloor({ id: floor.id });
                          alert(`${floor.name} deleted successfully`);
                        } catch (error) {
                          alert(error?.message || "Failed to delete floor");
                        }
                      }}
                      className="flex items-center gap-1 text-red-600 hover:text-red-800 transition-colors"
                    >
                      <Trash2Icon size={15} />
                      <span>Delete</span>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MOBILE VIEW */}
      <div className="md:hidden flex flex-col gap-3">
        {data.map((floor, index) => (
          <div
            key={floor.id}
            className="bg-white shadow-sm rounded-lg p-3 flex flex-col gap-2 border border-gray-100"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {floor.floorPlanImageURL ? (
                  <img
                    src={floor.floorPlanImageURL}
                    alt={floor.name}
                    className="h-10 w-10 rounded-md object-cover"
                  />
                ) : (
                  <div className="h-10 w-10 bg-gray-300 rounded-md" />
                )}

                <div>
                  <h3 className="font-semibold text-gray-800 text-sm">
                    {floor.name}
                  </h3>
                  <p className="text-xs text-gray-500">#{index + 1}</p>
                </div>
              </div>

              <span
                className={`px-2 py-0.5 rounded-full text-[11px] font-medium ${
                  floor.status === "Active"
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {floor.status}
              </span>
            </div>

            <div className="text-xs text-gray-600 grid grid-cols-2 gap-y-1 px-1">
              <p>
                <span className="font-medium text-gray-800">Floor No:</span>{" "}
                {floor.floorNumber}
              </p>

              <p>
                <span className="font-medium text-gray-800">Capacity:</span>{" "}
                {floor.shopCapacity}
              </p>

              <p>
                <span className="font-medium text-gray-800">Created:</span>{" "}
                {shopCounts[floor.id] ?? 0}
              </p>
            </div>

            <div className="flex justify-end gap-3 border-t pt-2 mt-1">
              <button
                onClick={() => router.push(`/admin/floors/Form?id=${floor.id}`)}
                className="flex items-center gap-1 text-blue-600 hover:text-blue-800 text-xs"
              >
                <Edit2Icon size={13} />
                <span>Edit</span>
              </button>

              <button
                onClick={async () => {
                  if (
                    !confirm(`Are you sure you want to delete ${floor.name}?`)
                  )
                    return;
                  try {
                    await deleteFloor({ id: floor.id });
                    alert(`${floor.name} deleted successfully`);
                  } catch (error) {
                    alert(error?.message || "Failed to delete floor");
                  }
                }}
                className="flex items-center gap-1 text-red-600 hover:text-red-800 text-xs"
              >
                <Trash2Icon size={13} />
                <span>Delete</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
