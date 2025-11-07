"use client";
import { useCategory } from "@/lib/firestore/categories/read";
import Loading from "../loading";
import { Edit2Icon, Trash2Icon } from "lucide-react";
import { useRouter } from "next/navigation";
import { deleteCategory } from "@/lib/firestore/categories/write";

export default function Listview() {
    const { data, error, isLoading } = useCategory();
    const router = useRouter();

    if (isLoading) {
        return <div className="text-center py-6 text-gray-500"><Loading /></div>;
    }

    if (error) {
        return <div className="text-center py-6 text-red-500">❌ {error}</div>;
    }

    if (!data || data.length === 0) {
        return <div className="text-center py-6 text-gray-400">No categories found</div>;
    }

    return (
        <div className="flex-1 flex flex-col gap-4 px-3 sm:px-6 py-4">
            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
                <table className="w-full border-separate border-spacing-y-3">
                    <thead>
                        <tr>
                            <td className="bg-white px-3 py-2 rounded-l-lg text-center font-semibold">SN</td>
                            <td className="bg-white px-3 py-2 text-center font-semibold">Image</td>
                            <td className="bg-white px-3 py-2 text-center font-semibold">Name</td>
                            <td className="bg-white px-3 py-2 text-center font-semibold">Status</td>
                            <td className="bg-white px-3 py-2 text-center rounded-r-lg font-semibold">Actions</td>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((cat, index) => (
                            <tr key={cat.id} className="shadow bg-white">
                                <td className="text-center py-3 rounded-l-lg">{index + 1}</td>
                                <td className="text-center">
                                    {cat.categoryImageURL ? (
                                        <img
                                            src={cat.categoryImageURL}
                                            alt={cat.name}
                                            className="h-10 object-cover rounded-lg mx-auto"
                                        />
                                    ) : (
                                        <div className="h-10 w-10 bg-gray-300 rounded-lg mx-auto" />
                                    )}
                                </td>
                                <td className="text-center">{cat.name}</td>
                                <td className="text-center">
                                    <span
                                        className={`px-3 py-1 rounded-full text-sm font-medium ${cat.status === "Active"
                                            ? "bg-green-100 text-green-700"
                                            : "bg-red-100 text-red-700"
                                            }`}
                                    >
                                        {cat.status}
                                    </span>
                                </td>
                                <td className="text-center rounded-r-lg">
                                    <div className="flex justify-center items-center gap-3">
                                        <button
                                            onClick={() => router.push(`/admin/categories/Form?id=${cat.id}`)}
                                            className="flex items-center gap-1 text-blue-600 hover:text-blue-800 transition-colors"
                                        >
                                            <Edit2Icon size={15} />
                                            <span>Edit</span>
                                        </button>

                                        <span className="text-gray-400">|</span>

                                        <button
                                            onClick={async () => {
                                                if (!confirm(`Are you sure you want to delete ${cat.name}?`)) return;
                                                try {
                                                    await deleteCategory({ id: cat.id });
                                                    alert(`${cat.name} deleted successfully`);
                                                } catch (error) {
                                                    alert(error?.message || "Failed to delete category");
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

            {/* Mobile Card View */}
            <div className="md:hidden flex flex-col gap-3">
                {data.map((cat, index) => (
                    <div
                        key={cat.id}
                        className="bg-white shadow-sm rounded-lg p-3 flex flex-col gap-2 border border-gray-100"
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                {cat.categoryImageURL ? (
                                    <img
                                        src={cat.categoryImageURL}
                                        alt={cat.name}
                                        className="h-10 w-10 rounded-md object-cover"
                                    />
                                ) : (
                                    <div className="h-10 w-10 bg-gray-300 rounded-md" />
                                )}
                                <div>
                                    <h3 className="font-semibold text-gray-800 text-sm leading-tight">{cat.name}</h3>
                                    <p className="text-xs text-gray-500">#{index + 1}</p>
                                </div>
                            </div>
                            <span
                                className={`px-2 py-0.5 rounded-full text-[11px] font-medium ${cat.status === "Active"
                                    ? "bg-green-100 text-green-700"
                                    : "bg-red-100 text-red-700"
                                    }`}
                            >
                                {cat.status}
                            </span>
                        </div>

                        <div className="flex justify-end gap-3 border-t pt-2 mt-1">
                            <button
                                onClick={() => router.push(`/admin/categories/Form?id=${cat.id}`)}
                                className="flex items-center gap-1 text-blue-600 hover:text-blue-800 text-xs"
                            >
                                <Edit2Icon size={13} />
                                <span>Edit</span>
                            </button>

                            <button
                                onClick={async () => {
                                    if (!confirm(`Are you sure you want to delete ${cat.name}?`)) return;
                                    try {
                                        await deleteCategory({ id: cat.id });
                                        alert(`${cat.name} deleted successfully`);
                                    } catch (error) {
                                        alert(error?.message || "Failed to delete category");
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
