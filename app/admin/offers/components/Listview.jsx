// "use client";

// import { useOffer } from "@/lib/firestore/offers/read";
// import { useRouter } from "next/navigation";
// import Loading from "../loading";
// import { Edit2Icon, Trash2Icon } from "lucide-react";
// import { deleteOffer } from "@/lib/firestore/offers/write";

// export default function Listview() {
//     const { data, error, isLoading } = useOffer();
//     const router = useRouter();

//     if (isLoading) {
//         return (
//             <div className="text-center py-6 text-gray-500">
//                 <Loading />
//             </div>
//         );
//     }

//     if (error) {
//         return (
//             <div className="text-center py-6 text-red-500">❌ {error}</div>
//         );
//     }

//     if (!data || data.length === 0) {
//         return (
//             <div className="text-center py-6 text-gray-400">
//                 No Offer found
//             </div>
//         );
//     }

//     return (
//         <div className="w-full flex-1 flex flex-col gap-6 px-3 sm:px-6 pb-10">
//             {/* Desktop Table */}
//             <div className="hidden md:block overflow-x-auto">
//                 <table className="w-full border-separate border-spacing-y-3">
//                     <thead>
//                         <tr>
//                             {[
//                                 "SN",
//                                 "Banner Image",
//                                 "Offer Name",
//                                 "Offer Code",
//                                 "Type",
//                                 "Value",
//                                 "Applicable On",
//                                 "Status",
//                                 "Actions",
//                             ].map((title) => (
//                                 <th
//                                     key={title}
//                                     className="bg-white px-3 py-2 text-center font-semibold text-gray-700 first:rounded-l-lg last:rounded-r-lg"
//                                 >
//                                     {title}
//                                 </th>
//                             ))}
//                         </tr>
//                     </thead>

//                     <tbody>
//                         {data?.map((offer, index) => (
//                             <tr key={offer.id} className="bg-white shadow rounded-lg">
//                                 <td className="text-center py-3 rounded-l-lg">{index + 1}</td>
//                                 <td><img src="" alt="" /></td>
//                                 <td className="text-center py-3">{offer.name}</td>
//                                 <td className="text-center py-3">{offer.offerCode}</td>
//                                 <td className="text-center py-3">{offer.type}</td>
//                                 <td className="text-center py-3">{offer.discountValue}</td>
//                                 <td className="text-center py-3">{offer.applicableOn}</td>
//                                 <td className="text-center">
//                                     <span
//                                         className={`px-3 py-1 rounded-full text-sm font-medium ${offer.status === "Active"
//                                             ? "bg-green-100 text-green-700"
//                                             : "bg-red-100 text-red-700"
//                                             }`}
//                                     >
//                                         {offer.status}
//                                     </span>
//                                 </td>
//                                 <td className="text-center rounded-r-lg">
//                                     <div className="flex justify-center items-center gap-3">
//                                         <button
//                                             onClick={() =>
//                                                 router.push(`/admin/offers/Form?id=${offer.id}`)
//                                             }
//                                             className="flex items-center gap-1 text-blue-600 hover:text-blue-800 transition-colors"
//                                         >
//                                             <Edit2Icon size={15} />
//                                             <span>Edit</span>
//                                         </button>

//                                         <span className="text-gray-400">|</span>

//                                         <button
//                                             onClick={async () => {
//                                                 if (
//                                                     !confirm(
//                                                         `Are you sure you want to delete ${offer.name}?`
//                                                     )
//                                                 )
//                                                     return;
//                                                 try {
//                                                     await deleteOffer({ id: offer.id });
//                                                     alert(`${offer.name} deleted successfully`);
//                                                 } catch (error) {
//                                                     alert(error?.message || "Failed to delete offer");
//                                                 }
//                                             }}
//                                             className="flex items-center gap-1 text-red-600 hover:text-red-800 transition-colors"
//                                         >
//                                             <Trash2Icon size={15} />
//                                             <span>Delete</span>
//                                         </button>
//                                     </div>
//                                 </td>
//                             </tr>
//                         ))}
//                     </tbody>
//                 </table>
//             </div>

//             {/* Mobile Card Layout */}
//             <div className="md:hidden flex flex-col gap-4">
//                 {data?.map((offer, index) => (
//                     <div
//                         key={offer.id}
//                         className="bg-white rounded-xl shadow p-4 flex flex-col gap-2"
//                     >
//                         <h1 className="font-semibold text-xl">#{index + 1}</h1>
//                         <div className="flex justify-between items-center">
//                             <h3 className="font-semibold text-2xl font-mono text-gray-800">
//                                 {offer.name}
//                             </h3>
//                             <span
//                                 className={`px-3 py-1 rounded-full text-xs font-medium ${offer.status === "Active"
//                                     ? "bg-green-100 text-green-700"
//                                     : "bg-red-100 text-red-700"
//                                     }`}
//                             >
//                                 {offer.status}
//                             </span>
//                         </div>

//                         <div className="text-sm text-gray-600 space-y-1">
//                             <p>
//                                 <span className="font-semibold">Code:</span> {offer.offerCode}
//                             </p>
//                             <p>
//                                 <span className="font-semibold">Type:</span> {offer.type}
//                             </p>
//                             <p>
//                                 <span className="font-semibold">Value:</span>{" "}
//                                 {offer.discountValue}
//                             </p>
//                             <p>
//                                 <span className="font-semibold">Applicable On:</span>{" "}
//                                 {offer.applicableOn}
//                             </p>
//                         </div>

//                         <div className="flex justify-end items-center gap-4 pt-2">
//                             <button
//                                 onClick={() =>
//                                     router.push(`/admin/offers/Form?id=${offer.id}`)
//                                 }
//                                 className="flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm font-medium"
//                             >
//                                 <Edit2Icon size={14} />
//                                 Edit
//                             </button>

//                             <button
//                                 onClick={async () => {
//                                     if (!confirm(`Delete ${offer.name}?`)) return;
//                                     try {
//                                         await deleteOffer({ id: offer.id });
//                                         alert(`${offer.name} deleted successfully`);
//                                     } catch (error) {
//                                         alert(error?.message || "Failed to delete offer");
//                                     }
//                                 }}
//                                 className="flex items-center gap-1 text-red-600 hover:text-red-800 text-sm font-medium"
//                             >
//                                 <Trash2Icon size={14} />
//                                 Delete
//                             </button>
//                         </div>
//                     </div>
//                 ))}
//             </div>
//         </div>
//     );
// }


"use client";

import { useOffer } from "@/lib/firestore/offers/read";
import { useRouter } from "next/navigation";
import Loading from "../loading";
import { Edit2Icon, Trash2Icon } from "lucide-react";
import { deleteOffer } from "@/lib/firestore/offers/write";

export default function Listview() {
    const { data, error, isLoading } = useOffer();
    const router = useRouter();

    if (isLoading) {
        return (
            <div className="text-center py-6 text-gray-500">
                <Loading />
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-6 text-red-500">❌ {error}</div>
        );
    }

    if (!data || data.length === 0) {
        return (
            <div className="text-center py-6 text-gray-400">
                No Offer found
            </div>
        );
    }

    return (
        <div className="w-full flex-1 flex flex-col gap-6 px-3 sm:px-6 pb-10">
            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
                <table className="w-full border-separate border-spacing-y-3">
                    <thead>
                        <tr>
                            {[
                                "SN",
                                "Banner Image",
                                "Offer Name",
                                "Offer Code",
                                "Type",
                                "Value",
                                "Applicable On",
                                "Status",
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
                        {data?.map((offer, index) => (
                            <tr key={offer.id} className="bg-white shadow rounded-lg">
                                <td className="text-center py-3 rounded-l-lg">{index + 1}</td>
                                <td className="py-3 text-center">
                                    <img
                                        src={offer.bannerImageURL}
                                        alt={offer.name}
                                        className="h-16 w-32 object-cover mx-auto rounded"
                                    />
                                </td>
                                <td className="text-center py-3">{offer.name}</td>
                                <td className="text-center py-3">{offer.offerCode}</td>
                                <td className="text-center py-3">{offer.type}</td>
                                <td className="text-center py-3">{offer.discountValue}</td>
                                <td className="text-center py-3">{offer.applicableOn}</td>
                                <td className="text-center">
                                    <span
                                        className={`px-3 py-1 rounded-full text-sm font-medium ${offer.status === "Active"
                                            ? "bg-green-100 text-green-700"
                                            : "bg-red-100 text-red-700"
                                            }`}
                                    >
                                        {offer.status}
                                    </span>
                                </td>
                                <td className="text-center rounded-r-lg">
                                    <div className="flex justify-center items-center gap-3">
                                        <button
                                            onClick={() =>
                                                router.push(`/admin/offers/Form?id=${offer.id}`)
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
                                                        `Are you sure you want to delete ${offer.name}?`
                                                    )
                                                )
                                                    return;
                                                try {
                                                    await deleteOffer({ id: offer.id });
                                                    alert(`${offer.name} deleted successfully`);
                                                } catch (error) {
                                                    alert(error?.message || "Failed to delete offer");
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

            {/* Mobile Card Layout */}
            <div className="md:hidden flex flex-col gap-4">
                {data?.map((offer, index) => (
                    <div
                        key={offer.id}
                        className="bg-white rounded-xl shadow p-4 flex flex-col gap-2"
                    >
                        <h1 className="font-semibold text-xl">#{index + 1}</h1>
                        <div className="flex justify-between items-center">
                            <h3 className="font-semibold text-2xl font-mono text-gray-800">
                                {offer.name}
                            </h3>
                            <span
                                className={`px-3 py-1 rounded-full text-xs font-medium ${offer.status === "Active"
                                    ? "bg-green-100 text-green-700"
                                    : "bg-red-100 text-red-700"
                                    }`}
                            >
                                {offer.status}
                            </span>
                        </div>

                        <div className="text-sm text-gray-600 space-y-1">
                            <p>
                                <span className="font-semibold">Code:</span> {offer.offerCode}
                            </p>
                            <p>
                                <span className="font-semibold">Type:</span> {offer.type}
                            </p>
                            <p>
                                <span className="font-semibold">Value:</span>{" "}
                                {offer.discountValue}
                            </p>
                            <p>
                                <span className="font-semibold">Applicable On:</span>{" "}
                                {offer.applicableOn}
                            </p>
                        </div>

                        <div className="py-2">
                            <img
                                src={offer.bannerImageURL}
                                alt={offer.name}
                                className="w-full h-40 object-cover rounded-lg"
                            />
                        </div>

                        <div className="flex justify-end items-center gap-4 pt-2">
                            <button
                                onClick={() =>
                                    router.push(`/admin/offers/Form?id=${offer.id}`)
                                }
                                className="flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm font-medium"
                            >
                                <Edit2Icon size={14} />
                                Edit
                            </button>

                            <button
                                onClick={async () => {
                                    if (!confirm(`Delete ${offer.name}?`)) return;
                                    try {
                                        await deleteOffer({ id: offer.id });
                                        alert(`${offer.name} deleted successfully`);
                                    } catch (error) {
                                        alert(error?.message || "Failed to delete offer");
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
