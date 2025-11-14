"use client";

import { useState } from "react";
import { updateUserManagement } from "@/lib/firestore/settings/write";

const UserRoles = {
    ADMIN: "admin",
    SHOP_OWNER: "shop_owner",
    CUSTOMER: "customer",
};

export default function UserManagement({ initialData }) {
    const [alert, setAlert] = useState({ type: "", text: "" });

    const [settings, setSettings] = useState(
        initialData || {
            roles: {
                [UserRoles.ADMIN]: {
                    canManageUsers: true,
                    canManageShops: true,
                    canManageProducts: true,
                    canManageSettings: true,
                },
                [UserRoles.SHOP_OWNER]: {
                    canManageOwnShop: true,
                    canManageOwnProducts: true,
                    canViewAnalytics: true,
                },
                [UserRoles.CUSTOMER]: {
                    canPlaceOrders: true,
                    canWriteReviews: true,
                    canViewOrderHistory: true,
                },
            },
            admins: [],
        }
    );

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [newAdmin, setNewAdmin] = useState({ email: "", role: "" });

    const showAlert = (type, text) => {
        setAlert({ type, text });
        setTimeout(() => setAlert({ type: "", text: "" }), 2500);
    };

    const handleAddAdmin = async (e) => {
        e.preventDefault();
        try {
            const updatedAdmins = [...settings.admins, newAdmin];

            await updateUserManagement({ ...settings, admins: updatedAdmins });

            setSettings({ ...settings, admins: updatedAdmins });
            showAlert("success", "Admin added successfully");

            setNewAdmin({ email: "", role: "" });
            setIsModalVisible(false);
        } catch {
            showAlert("error", "Failed to add admin");
        }
    };

    const handleRemoveAdmin = async (email) => {
        try {
            const updatedAdmins = settings.admins.filter((a) => a.email !== email);
            await updateUserManagement({ ...settings, admins: updatedAdmins });
            setSettings({ ...settings, admins: updatedAdmins });
            showAlert("success", "Admin removed successfully");
        } catch {
            showAlert("error", "Failed to remove admin");
        }
    };

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold">User Management</h2>

            {/* ALERT */}
            {alert.text && (
                <div
                    className={`p-3 rounded-md text-sm ${alert.type === "success"
                            ? "bg-green-200 text-green-700"
                            : "bg-red-200 text-red-700"
                        }`}
                >
                    {alert.text}
                </div>
            )}

            <div className="space-y-10">
                {/* ROLE PERMISSIONS */}
                <section>
                    <h3 className="text-xl font-semibold mb-4">Role Permissions</h3>

                    {Object.entries(settings.roles).map(([role, permissions]) => (
                        <div key={role} className="mb-6">
                            <h4 className="text-lg font-medium mb-2 capitalize">
                                {role.replace("_", " ")}
                            </h4>

                            <div className="ml-4 space-y-2">
                                {Object.entries(permissions).map(([permission, enabled]) => (
                                    <label key={permission} className="flex items-center gap-3">
                                        <input
                                            type="checkbox"
                                            checked={enabled}
                                            onChange={(e) =>
                                                setSettings({
                                                    ...settings,
                                                    roles: {
                                                        ...settings.roles,
                                                        [role]: {
                                                            ...settings.roles[role],
                                                            [permission]: e.target.checked,
                                                        },
                                                    },
                                                })
                                            }
                                        />
                                        <span>
                                            {permission.replace(/([A-Z])/g, " $1").toLowerCase()}
                                        </span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    ))}
                </section>

                {/* ADMIN MANAGEMENT */}
                <section>
                    <h3 className="text-xl font-semibold mb-4">Admin Management</h3>

                    <button
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 mb-4"
                        onClick={() => setIsModalVisible(true)}
                    >
                        Add New Admin
                    </button>

                    {/* TABLE */}
                    <table className="w-full border rounded-lg">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="py-2 px-3 text-left border-b">Email</th>
                                <th className="py-2 px-3 text-left border-b">Role</th>
                                <th className="py-2 px-3 text-left border-b">Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            {settings.admins.length === 0 && (
                                <tr>
                                    <td colSpan="3" className="py-3 px-3 text-center text-gray-500">
                                        No admins found
                                    </td>
                                </tr>
                            )}

                            {settings.admins.map((admin) => (
                                <tr key={admin.email} className="border-b">
                                    <td className="py-2 px-3">{admin.email}</td>
                                    <td className="py-2 px-3 capitalize">{admin.role}</td>
                                    <td className="py-2 px-3">
                                        <button
                                            className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                                            onClick={() => handleRemoveAdmin(admin.email)}
                                        >
                                            Remove
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {/* MODAL */}
                    {isModalVisible && (
                        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                            <div className="bg-white p-6 rounded-lg w-full max-w-sm shadow-lg">
                                <h3 className="text-lg font-semibold mb-4">Add New Admin</h3>

                                <form className="space-y-4" onSubmit={handleAddAdmin}>
                                    <div>
                                        <label className="block font-medium mb-1">Email</label>
                                        <input
                                            type="email"
                                            required
                                            className="border p-2 w-full rounded"
                                            value={newAdmin.email}
                                            onChange={(e) =>
                                                setNewAdmin({ ...newAdmin, email: e.target.value })
                                            }
                                        />
                                    </div>

                                    <div>
                                        <label className="block font-medium mb-1">Role Level</label>
                                        <select
                                            required
                                            className="border p-2 w-full rounded"
                                            value={newAdmin.role}
                                            onChange={(e) =>
                                                setNewAdmin({ ...newAdmin, role: e.target.value })
                                            }
                                        >
                                            <option value="">Select role</option>
                                            <option value="super_admin">Super Admin</option>
                                            <option value="admin">Admin</option>
                                        </select>
                                    </div>

                                    <div className="flex justify-end gap-2">
                                        <button
                                            type="button"
                                            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                                            onClick={() => setIsModalVisible(false)}
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                                        >
                                            Add Admin
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
}
