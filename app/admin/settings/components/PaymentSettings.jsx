"use client";

import { useState } from "react";
import { updatePaymentSettings } from "@/lib/firestore/settings/write";

export default function PaymentSettings({ initialData }) {
    const [alert, setAlert] = useState({ type: "", text: "" });

    const [settings, setSettings] = useState(
        initialData || {
            razorpay: { keyId: "", keySecret: "", enabled: false },
            stripe: { publicKey: "", secretKey: "", enabled: false },
            payouts: { schedule: "weekly", minimumAmount: 1000, commission: 5 },
            refunds: { autoApproval: false, maxDays: 7, restockItems: true }
        }
    );

    const showAlert = (type, text) => {
        setAlert({ type, text });
        setTimeout(() => setAlert({ type: "", text: "" }), 3000);
    };

    const handleSave = async () => {
        try {
            await updatePaymentSettings(settings);
            showAlert("success", "Payment settings updated successfully");
        } catch (error) {
            showAlert("error", "Failed to update payment settings");
        }
    };

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold">Payment & Payout Settings</h2>

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

            <form className="space-y-10">
                {/* RAZORPAY */}
                <section>
                    <h3 className="text-xl font-semibold mb-4">Razorpay Settings</h3>

                    <div className="space-y-3">
                        <div>
                            <label className="block font-medium mb-1">Key ID</label>
                            <input
                                type="text"
                                className="border p-2 rounded-md w-full"
                                placeholder="Enter Razorpay Key ID"
                                value={settings.razorpay.keyId}
                                onChange={(e) =>
                                    setSettings({
                                        ...settings,
                                        razorpay: { ...settings.razorpay, keyId: e.target.value }
                                    })
                                }
                            />
                        </div>

                        <div>
                            <label className="block font-medium mb-1">Key Secret</label>
                            <input
                                type="password"
                                className="border p-2 rounded-md w-full"
                                placeholder="Enter Razorpay Key Secret"
                                value={settings.razorpay.keySecret}
                                onChange={(e) =>
                                    setSettings({
                                        ...settings,
                                        razorpay: {
                                            ...settings.razorpay,
                                            keySecret: e.target.value
                                        }
                                    })
                                }
                            />
                        </div>
                    </div>
                </section>

                {/* STRIPE SETTINGS */}
                <section>
                    <h3 className="text-xl font-semibold mb-4">Stripe Settings</h3>

                    <div className="space-y-3">
                        <div>
                            <label className="block font-medium mb-1">Public Key</label>
                            <input
                                type="text"
                                className="border p-2 rounded-md w-full"
                                placeholder="Enter Stripe Public Key"
                                value={settings.stripe.publicKey}
                                onChange={(e) =>
                                    setSettings({
                                        ...settings,
                                        stripe: { ...settings.stripe, publicKey: e.target.value }
                                    })
                                }
                            />
                        </div>

                        <div>
                            <label className="block font-medium mb-1">Secret Key</label>
                            <input
                                type="password"
                                className="border p-2 rounded-md w-full"
                                placeholder="Enter Stripe Secret Key"
                                value={settings.stripe.secretKey}
                                onChange={(e) =>
                                    setSettings({
                                        ...settings,
                                        stripe: { ...settings.stripe, secretKey: e.target.value }
                                    })
                                }
                            />
                        </div>
                    </div>
                </section>

                {/* PAYOUT SETTINGS */}
                <section>
                    <h3 className="text-xl font-semibold mb-4">Payout Settings</h3>

                    <div className="space-y-3">
                        {/* SCHEDULE */}
                        <div>
                            <label className="block font-medium mb-1">Payout Schedule</label>
                            <select
                                className="border p-2 rounded-md w-full"
                                value={settings.payouts.schedule}
                                onChange={(e) =>
                                    setSettings({
                                        ...settings,
                                        payouts: { ...settings.payouts, schedule: e.target.value }
                                    })
                                }
                            >
                                <option value="daily">Daily</option>
                                <option value="weekly">Weekly</option>
                                <option value="monthly">Monthly</option>
                            </select>
                        </div>

                        {/* MINIMUM AMOUNT */}
                        <div>
                            <label className="block font-medium mb-1">
                                Minimum Payout Amount
                            </label>
                            <input
                                type="number"
                                className="border p-2 rounded-md w-full"
                                min={0}
                                value={settings.payouts.minimumAmount}
                                onChange={(e) =>
                                    setSettings({
                                        ...settings,
                                        payouts: {
                                            ...settings.payouts,
                                            minimumAmount: Number(e.target.value)
                                        }
                                    })
                                }
                            />
                        </div>

                        {/* COMMISSION */}
                        <div>
                            <label className="block font-medium mb-1">
                                Commission Percentage
                            </label>
                            <input
                                type="number"
                                className="border p-2 rounded-md w-full"
                                min={0}
                                max={100}
                                value={settings.payouts.commission}
                                onChange={(e) =>
                                    setSettings({
                                        ...settings,
                                        payouts: {
                                            ...settings.payouts,
                                            commission: Number(e.target.value)
                                        }
                                    })
                                }
                            />
                        </div>
                    </div>
                </section>

                {/* REFUND SETTINGS */}
                <section>
                    <h3 className="text-xl font-semibold mb-4">Refund Settings</h3>

                    <div className="space-y-3">
                        {/* AUTO APPROVAL */}
                        <div>
                            <label className="block font-medium mb-1">
                                Auto-Approve Refunds
                            </label>
                            <select
                                className="border p-2 rounded-md w-full"
                                value={settings.refunds.autoApproval}
                                onChange={(e) =>
                                    setSettings({
                                        ...settings,
                                        refunds: {
                                            ...settings.refunds,
                                            autoApproval: e.target.value === "true"
                                        }
                                    })
                                }
                            >
                                <option value="true">Yes</option>
                                <option value="false">No</option>
                            </select>
                        </div>

                        {/* MAX DAYS */}
                        <div>
                            <label className="block font-medium mb-1">
                                Maximum Refund Days
                            </label>
                            <input
                                type="number"
                                className="border p-2 rounded-md w-full"
                                min={1}
                                value={settings.refunds.maxDays}
                                onChange={(e) =>
                                    setSettings({
                                        ...settings,
                                        refunds: {
                                            ...settings.refunds,
                                            maxDays: Number(e.target.value)
                                        }
                                    })
                                }
                            />
                        </div>

                        {/* RESTOCK */}
                        <div>
                            <label className="block font-medium mb-1">
                                Restock Returned Items
                            </label>
                            <select
                                className="border p-2 rounded-md w-full"
                                value={settings.refunds.restockItems}
                                onChange={(e) =>
                                    setSettings({
                                        ...settings,
                                        refunds: {
                                            ...settings.refunds,
                                            restockItems: e.target.value === "true"
                                        }
                                    })
                                }
                            >
                                <option value="true">Yes</option>
                                <option value="false">No</option>
                            </select>
                        </div>
                    </div>
                </section>

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
