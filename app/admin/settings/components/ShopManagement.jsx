"use client";

import { useState } from "react";
import { updateShopSettings } from "@/lib/firestore/settings/write";

export default function ShopManagement({ initialData }) {
    const [alert, setAlert] = useState({ type: "", text: "" });

    const [settings, setSettings] = useState(
        initialData || {
            autoApproval: false,
            maxShopsPerUser: 1,
            verificationRequired: true,
            verificationRequirements: {
                businessLicense: true,
                taxId: true,
                phoneVerification: true,
                emailVerification: true
            }
        }
    );

    const showAlert = (type, text) => {
        setAlert({ type, text });
        setTimeout(() => setAlert({ type: "", text: "" }), 2500);
    };

    const handleSave = async () => {
        try {
            await updateShopSettings(settings);
            showAlert("success", "Shop management settings updated successfully");
        } catch (error) {
            showAlert("error", "Failed to update shop settings");
        }
    };

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold">Shop Management Settings</h2>

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

            <form className="space-y-8">
                {/* AUTO APPROVAL */}
                <div>
                    <label className="block font-medium mb-1">Auto-Shop Approval</label>

                    <label className="flex items-center gap-3 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={settings.autoApproval}
                            onChange={(e) =>
                                setSettings({ ...settings, autoApproval: e.target.checked })
                            }
                        />
                        <span className="text-gray-600 text-sm">
                            Enable automatic approval for new shops
                        </span>
                    </label>
                </div>

                {/* MAX SHOPS PER USER */}
                <div>
                    <label className="block font-medium mb-1">
                        Maximum Shops per User
                    </label>

                    <input
                        type="number"
                        min={1}
                        className="border rounded-md p-2 w-full"
                        value={settings.maxShopsPerUser}
                        onChange={(e) =>
                            setSettings({
                                ...settings,
                                maxShopsPerUser: Number(e.target.value)
                            })
                        }
                    />
                </div>

                {/* VERIFICATION REQUIREMENTS */}
                <div>
                    <label className="block font-medium mb-1">
                        Verification Requirements
                    </label>

                    <label className="flex items-center gap-3 mb-2 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={settings.verificationRequired}
                            onChange={(e) =>
                                setSettings({
                                    ...settings,
                                    verificationRequired: e.target.checked
                                })
                            }
                        />
                        <span>Require Shop Verification</span>
                    </label>

                    {settings.verificationRequired && (
                        <div className="ml-4 space-y-3">
                            {/* BUSINESS LICENSE */}
                            <label className="flex items-center gap-3 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={settings.verificationRequirements.businessLicense}
                                    onChange={(e) =>
                                        setSettings({
                                            ...settings,
                                            verificationRequirements: {
                                                ...settings.verificationRequirements,
                                                businessLicense: e.target.checked
                                            }
                                        })
                                    }
                                />
                                <span>Business License</span>
                            </label>

                            {/* TAX ID */}
                            <label className="flex items-center gap-3 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={settings.verificationRequirements.taxId}
                                    onChange={(e) =>
                                        setSettings({
                                            ...settings,
                                            verificationRequirements: {
                                                ...settings.verificationRequirements,
                                                taxId: e.target.checked
                                            }
                                        })
                                    }
                                />
                                <span>Tax ID</span>
                            </label>

                            {/* PHONE VERIFICATION */}
                            <label className="flex items-center gap-3 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={
                                        settings.verificationRequirements.phoneVerification
                                    }
                                    onChange={(e) =>
                                        setSettings({
                                            ...settings,
                                            verificationRequirements: {
                                                ...settings.verificationRequirements,
                                                phoneVerification: e.target.checked
                                            }
                                        })
                                    }
                                />
                                <span>Phone Verification</span>
                            </label>

                            {/* EMAIL VERIFICATION */}
                            <label className="flex items-center gap-3 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={
                                        settings.verificationRequirements.emailVerification
                                    }
                                    onChange={(e) =>
                                        setSettings({
                                            ...settings,
                                            verificationRequirements: {
                                                ...settings.verificationRequirements,
                                                emailVerification: e.target.checked
                                            }
                                        })
                                    }
                                />
                                <span>Email Verification</span>
                            </label>
                        </div>
                    )}
                </div>

                {/* SAVE BUTTON */}
                <button
                    type="button"
                    className="px-5 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    onClick={handleSave}
                >
                    Save Changes
                </button>
            </form>
        </div>
    );
}
