// "use client";

// import { useShop } from "@/lib/firestore/shop/read";
// import { useFloor } from "@/lib/firestore/floors/read";
// import { useCategory } from "@/lib/firestore/categories/read";
// import { deleteShop } from "@/lib/firestore/shop/write";
// import { useRouter } from "next/navigation";
// import { useState } from "react";
// import Loading from "../loading";
// import { Edit2Icon, GlobeIcon, Phone, Trash2Icon } from "lucide-react";

// export default function Listview() {
//   const { data, error, isLoading } = useShop();
//   const { data: categories } = useCategory();
//   const { data: floors } = useFloor();
//   const router = useRouter();

//   if (isLoading)
//     return (
//       <div className="text-center py-6 text-gray-500">
//         <Loading />
//       </div>
//     );
//   if (error)
//     return <div className="text-center py-6 text-red-500">❌ {error}</div>;
//   if (!data || data.length === 0)
//     return <div className="text-center py-6 text-gray-400">No shops found</div>;

//   const getCategoryName = (id) =>
//     categories?.find((cat) => cat.id === id)?.name || "Unknown";
//   const getFloorName = (id) =>
//     floors?.find((flr) => flr.id === id)?.name || "Unknown";

//   return (
//     <div className="w-full flex flex-col gap-6 px-3 sm:px-6 pb-10">
//       <div className="flex items-center justify-center gap-3">
//         <h1 className="text-xl font-semibold">Shop List</h1>
//       </div>

//       {/* Desktop Table View */}
//       <div className="hidden md:block overflow-x-auto">
//         <table className="w-full border-separate border-spacing-y-3">
//           <thead>
//             <tr>
//               {[
//                 "SN",
//                 "Logo",
//                 "Shop Name",
//                 "Shop Number",
//                 "Category",
//                 "Floor",
//                 "Status",
//                 "Other Details",
//                 "Actions",
//               ].map((title) => (
//                 <th
//                   key={title}
//                   className="bg-white px-3 py-2 text-center font-semibold text-gray-700 first:rounded-l-lg last:rounded-r-lg"
//                 >
//                   {title}
//                 </th>
//               ))}
//             </tr>
//           </thead>
//           <tbody>
//             {data?.map((shop, index) => (
//               <tr key={shop.id} className="bg-white shadow rounded-lg">
//                 <td className="text-center py-3 rounded-l-lg">{index + 1}</td>
//                 <td className="text-center">
//                   {shop.logoURL ? (
//                     <div className="flex items-center justify-center">
//                       <img
//                         src={shop.logoURL}
//                         alt={shop.name}
//                         className="w-12 object-cover"
//                       />
//                     </div>
//                   ) : (
//                     <div className="w-12 h-12 bg-gray-200 rounded-md mx-auto" />
//                   )}
//                 </td>
//                 <td className="text-center">
//                   <div className="flex flex-col items-center">
//                     <span className="font-semibold">{shop.name}</span>
//                     <span className="text-sm text-gray-500">
//                       {shop.ownerName || "N/A"}
//                     </span>
//                   </div>
//                 </td>
//                 <td className="text-center">{shop.shopNumber || "—"}</td>
//                 <td className="text-center">
//                   {getCategoryName(shop.category)}
//                 </td>
//                 <td className="text-center">{getFloorName(shop.floor)}</td>
//                 <td>{shop.status}</td>
//                 <td className="text-center">
//                   <div className="flex flex-col items-center gap-1 px-2 py-1">
//                     <a
//                       href={`tel:${shop.contactNumber}`}
//                       className="inline-flex items-center gap-2 text-green-700 font-medium bg-green-200 px-2 py-1 rounded-md hover:bg-green-100 transition"
//                     >
//                       <Phone size={16} /> {shop.contactNumber || "N/A"}
//                     </a>
//                     {shop.websiteLink ? (
//                       <a
//                         href={shop.websiteLink}
//                         target="_blank"
//                         rel="noopener noreferrer"
//                         className="inline-flex items-center gap-1 text-blue-600 text-sm hover:underline"
//                       >
//                         <GlobeIcon size={15} /> Visit
//                       </a>
//                     ) : (
//                       <span className="text-gray-400 text-sm">No Website</span>
//                     )}
//                   </div>
//                 </td>
//                 <td className="text-center rounded-r-lg">
//                   <div className="flex justify-center items-center gap-3">
//                     <button
//                       onClick={() =>
//                         router.push(`/admin/shop/Form?id=${shop.id}`)
//                       }
//                       className="flex items-center gap-1 text-blue-600 hover:text-blue-800 transition-colors"
//                     >
//                       <Edit2Icon size={15} />
//                       Edit
//                     </button>
//                     <span className="text-gray-400">|</span>
//                     <button
//                       onClick={async () => {
//                         if (!confirm(`Delete ${shop.name}?`)) return;
//                         try {
//                           await deleteShop({ id: shop.id });
//                           alert(`${shop.name} deleted successfully`);
//                         } catch (error) {
//                           alert(error?.message || "Failed to delete shop");
//                         }
//                       }}
//                       className="flex items-center gap-1 text-red-600 hover:text-red-800 transition-colors"
//                     >
//                       <Trash2Icon size={15} />
//                       Delete
//                     </button>
//                   </div>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       {/* Mobile Card View */}
//       <div className="md:hidden flex flex-col gap-4">
//         {data?.map((shop, index) => (
//           <div
//             key={shop.id}
//             className="bg-white rounded-xl shadow p-4 flex flex-col gap-3"
//           >
//             <div className="flex items-center justify-between gap-5">
//               <div className="flex items-center gap-3">
//                 {shop.logoURL ? (
//                   <img
//                     src={shop.logoURL}
//                     alt={shop.name}
//                     className="w-14 object-cover"
//                   />
//                 ) : (
//                   <div className="w-14 h-14 bg-gray-200 rounded-lg" />
//                 )}
//                 <div>
//                   <h3 className="font-semibold text-gray-800">{shop.name}</h3>
//                   <p className="text-sm text-gray-500">
//                     {shop.ownerName || "N/A"}
//                   </p>
//                 </div>
//               </div>
//               <div className="font-semibold">
//                 <h1>#{index + 1}</h1>
//               </div>
//             </div>

//             <div className="text-sm text-gray-600 space-y-1">
//               <p>
//                 <span className="font-semibold">Shop No:</span>{" "}
//                 {shop.shopNumber || "—"}
//               </p>
//               <p>
//                 <span className="font-semibold">Category:</span>{" "}
//                 {getCategoryName(shop.category)}
//               </p>
//               <p>
//                 <span className="font-semibold">Floor:</span>{" "}
//                 {getFloorName(shop.floor)}
//               </p>
//               <p className="flex items-center gap-2">
//                 <Phone size={14} className="text-green-700" />{" "}
//                 {shop.contactNumber || "N/A"}
//               </p>
//               {shop.websiteLink ? (
//                 <a
//                   href={shop.websiteLink}
//                   target="_blank"
//                   rel="noopener noreferrer"
//                   className="flex items-center gap-1 text-blue-600 text-sm hover:underline"
//                 >
//                   <GlobeIcon size={14} /> Visit Website
//                 </a>
//               ) : (
//                 <span className="text-gray-400 text-sm">No Website</span>
//               )}
//             </div>

//             <div className="flex justify-end items-center gap-4 pt-2">
//               <button
//                 onClick={() => router.push(`/admin/shop/Form?id=${shop.id}`)}
//                 className="flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm font-medium"
//               >
//                 <Edit2Icon size={14} />
//                 Edit
//               </button>
//               <button
//                 onClick={async () => {
//                   if (!confirm(`Delete ${shop.name}?`)) return;
//                   try {
//                     await deleteShop({ id: shop.id });
//                     alert(`${shop.name} deleted successfully`);
//                   } catch (error) {
//                     alert(error?.message || "Failed to delete shop");
//                   }
//                 }}
//                 className="flex items-center gap-1 text-red-600 hover:text-red-800 text-sm font-medium"
//               >
//                 <Trash2Icon size={14} />
//                 Delete
//               </button>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

"use client";

import { useShop } from "@/lib/firestore/shop/read";
import { useFloor } from "@/lib/firestore/floors/read";
import { useCategory } from "@/lib/firestore/categories/read";
import { deleteShop } from "@/lib/firestore/shop/write";
import { useRouter } from "next/navigation";
import Loading from "../loading";
import { Edit2Icon, GlobeIcon, Phone, Trash2Icon } from "lucide-react";

export default function Listview() {
  const { data, error, isLoading } = useShop();
  const { data: categories } = useCategory();
  const { data: floors } = useFloor();
  const router = useRouter();

  if (isLoading)
    return (
      <div className="text-center py-6 text-gray-500">
        <Loading />
      </div>
    );
  if (error)
    return <div className="text-center py-6 text-red-500">❌ {error}</div>;
  if (!data || data.length === 0)
    return <div className="text-center py-6 text-gray-400">No shops found</div>;

  const getCategoryName = (id) =>
    categories?.find((cat) => cat.id === id)?.name || "Unknown";

  const getFloorName = (id) =>
    floors?.find((flr) => flr.id === id)?.name || "Unknown";

  // ⭐ STATUS BADGE DESIGN
  const getStatusBadge = (status) => {
    let classes =
      "px-3 py-1 rounded-full text-xs font-semibold inline-block w-max";

    switch (status) {
      case "Active":
        classes += " bg-green-100 text-green-700";
        break;
      case "Inactive":
        classes += " bg-red-100 text-red-700";
        break;
      case "Under Maintenance":
        classes += " bg-yellow-100 text-yellow-700";
        break;
      default:
        classes += " bg-gray-200 text-gray-600";
    }

    return <span className={classes}>{status}</span>;
  };

  return (
    <div className="w-full flex flex-col gap-6 px-3 sm:px-6 pb-10">
      <div className="flex items-center justify-center gap-3">
        <h1 className="text-xl font-semibold">Shop List</h1>
      </div>

      {/* ================= Desktop Table View ================= */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full border-separate border-spacing-y-3">
          <thead>
            <tr>
              {[
                "SN",
                "Logo",
                "Shop Name",
                "Shop Number",
                "Category",
                "Floor",
                "Status",
                "Other Details",
                "Actions",
              ].map((title) => (
                <th
                  key={title}
                  className="bg-white px-3 py-2 text-center font-semibold text-gray-700 first:rounded-l-lg last:rounded-r-lg"
                >
                  {title}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {data?.map((shop, index) => (
              <tr key={shop.id} className="bg-white shadow rounded-lg">
                {/* SN */}
                <td className="text-center py-3 rounded-l-lg">{index + 1}</td>

                {/* Logo */}
                <td className="text-center">
                  {shop.logoURL ? (
                    <img
                      src={shop.logoURL}
                      alt={shop.name}
                      className="w-12 object-cover mx-auto rounded"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-gray-200 rounded mx-auto" />
                  )}
                </td>

                {/* Name */}
                <td className="text-center">
                  <div className="flex flex-col items-center">
                    <span className="font-semibold">{shop.name}</span>
                    <span className="text-sm text-gray-500">
                      {shop.ownerName || "N/A"}
                    </span>
                  </div>
                </td>

                {/* Shop Number */}
                <td className="text-center">{shop.shopNumber || "—"}</td>

                {/* Category */}
                <td className="text-center">
                  {getCategoryName(shop.category)}
                </td>

                {/* Floor */}
                <td className="text-center">{getFloorName(shop.floor)}</td>

                {/* ⭐ STATUS BADGE */}
                <td className="text-center">{getStatusBadge(shop.status)}</td>

                {/* Other Details */}
                <td className="text-center">
                  <div className="flex flex-col items-center gap-1 px-2 py-1">
                    {/* Phone */}
                    <a
                      href={`tel:${shop.contactNumber}`}
                      className="inline-flex items-center gap-2 text-green-700 font-medium bg-green-200 px-2 py-1 rounded-md hover:bg-green-100 transition"
                    >
                      <Phone size={16} /> {shop.contactNumber || "N/A"}
                    </a>

                    {/* Website */}
                    {shop.websiteLink ? (
                      <a
                        href={shop.websiteLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-blue-600 hover:underline text-sm"
                      >
                        <GlobeIcon size={15} /> Visit
                      </a>
                    ) : (
                      <span className="text-gray-400 text-sm">No Website</span>
                    )}
                  </div>
                </td>

                {/* Actions */}
                <td className="text-center rounded-r-lg">
                  <div className="flex justify-center items-center gap-3">
                    {/* Edit */}
                    <button
                      onClick={() =>
                        router.push(`/admin/shop/Form?id=${shop.id}`)
                      }
                      className="flex items-center gap-1 text-blue-600 hover:text-blue-800 transition-colors"
                    >
                      <Edit2Icon size={15} />
                      Edit
                    </button>

                    <span className="text-gray-400">|</span>

                    {/* Delete */}
                    <button
                      onClick={async () => {
                        if (!confirm(`Delete ${shop.name}?`)) return;
                        try {
                          await deleteShop({ id: shop.id });
                          alert(`${shop.name} deleted successfully`);
                        } catch (error) {
                          alert(error?.message || "Failed to delete shop");
                        }
                      }}
                      className="flex items-center gap-1 text-red-600 hover:text-red-800 transition-colors"
                    >
                      <Trash2Icon size={15} />
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ================= Mobile Card View ================= */}
      <div className="md:hidden flex flex-col gap-4">
        {data?.map((shop, index) => (
          <div
            key={shop.id}
            className="bg-white rounded-xl shadow p-4 flex flex-col gap-3"
          >
            <div className="flex items-center justify-between gap-5">
              {/* Logo + Name */}
              <div className="flex items-center gap-3">
                {shop.logoURL ? (
                  <img
                    src={shop.logoURL}
                    alt={shop.name}
                    className="w-14 h-14 object-cover rounded-lg"
                  />
                ) : (
                  <div className="w-14 h-14 bg-gray-200 rounded-lg" />
                )}

                <div>
                  <h3 className="font-semibold text-gray-800">{shop.name}</h3>
                  <p className="text-sm text-gray-500">
                    {shop.ownerName || "N/A"}
                  </p>
                </div>
              </div>

              {/* Status Badge */}
              {getStatusBadge(shop.status)}
            </div>

            {/* Details */}
            <div className="text-sm text-gray-600 space-y-1">
              <p>
                <span className="font-semibold">Shop No:</span>{" "}
                {shop.shopNumber || "—"}
              </p>
              <p>
                <span className="font-semibold">Category:</span>{" "}
                {getCategoryName(shop.category)}
              </p>
              <p>
                <span className="font-semibold">Floor:</span>{" "}
                {getFloorName(shop.floor)}
              </p>

              <p className="flex items-center gap-2">
                <Phone size={14} className="text-green-700" />{" "}
                {shop.contactNumber || "N/A"}
              </p>

              {shop.websiteLink ? (
                <a
                  href={shop.websiteLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-blue-600 hover:underline text-sm"
                >
                  <GlobeIcon size={14} /> Visit Website
                </a>
              ) : (
                <span className="text-gray-400 text-sm">No Website</span>
              )}
            </div>

            {/* Actions */}
            <div className="flex justify-end items-center gap-4 pt-2">
              <button
                onClick={() => router.push(`/admin/shop/Form?id=${shop.id}`)}
                className="flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                <Edit2Icon size={14} />
                Edit
              </button>

              <button
                onClick={async () => {
                  if (!confirm(`Delete ${shop.name}?`)) return;
                  try {
                    await deleteShop({ id: shop.id });
                    alert(`${shop.name} deleted successfully`);
                  } catch (error) {
                    alert(error?.message || "Failed to delete shop");
                  }
                }}
                className="flex items-center gap-1 text-red-600 hover:text-red-800 text-sm font-medium"
              >
                <Trash2Icon size={14} />
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
