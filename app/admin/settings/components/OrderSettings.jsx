"use client";

import { useState } from "react";
import { updateOrderSettings } from "@/lib/firestore/settings/write";

export default function OrderSettings({ initialData }) {
    const [alert, setAlert] = useState({ type: "", text: "" });

    const [settings, setSettings] = useState(
        initialData || {
            delivery: {
                globalShipping: true,
                defaultShippingFee: 50,
                freeShippingThreshold: 500,
            },
            cod: {
                enabled: true,
                maxAmount: 10000,
            },
            orderCancellation: {
                autoCancel: true,
                cancelAfterHours: 24,
            },
            pendingOrders: {
                maxPerUser: 5,
                maxPerShop: 50,
            },
        }
    );

    const showAlert = (type, text) => {
        setAlert({ type, text });
        setTimeout(() => setAlert({ type: "", text: "" }), 3000);
    };

    const handleSave = async () => {
        try {
            await updateOrderSettings(settings);
            showAlert("success", "Order settings updated successfully");
        } catch (error) {
            showAlert("error", "Failed to update order settings");
        }
    };

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold">Order Settings</h2>

            {/* Alert */}
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
                {/* Delivery Settings */}
                <section>
                    <h3 className="text-xl font-semibold mb-4">Global Delivery Settings</h3>

                    {/* Global Shipping */}
                    <div className="mb-4">
                        <label className="flex items-center gap-3">
                            <input
                                type="checkbox"
                                checked={settings.delivery.globalShipping}
                                onChange={(e) =>
                                    setSettings({
                                        ...settings,
                                        delivery: {
                                            ...settings.delivery,
                                            globalShipping: e.target.checked,
                                        },
                                    })
                                }
                            />
                            <span>Enable Global Shipping</span>
                        </label>
                    </div>

                    {/* Default Shipping Fee */}
                    <div className="mb-4">
                        <label className="block font-medium mb-1">
                            Default Shipping Fee
                        </label>
                        <input
                            type="number"
                            className="border rounded-md p-2 w-full"
                            min={0}
                            value={settings.delivery.defaultShippingFee}
                            onChange={(e) =>
                                setSettings({
                                    ...settings,
                                    delivery: {
                                        ...settings.delivery,
                                        defaultShippingFee: Number(e.target.value),
                                    },
                                })
                            }
                        />
                    </div>

                    {/* Free Shipping Threshold */}
                    <div>
                        <label className="block font-medium mb-1">
                            Free Shipping Threshold
                        </label>
                        <input
                            type="number"
                            className="border rounded-md p-2 w-full"
                            min={0}
                            value={settings.delivery.freeShippingThreshold}
                            onChange={(e) =>
                                setSettings({
                                    ...settings,
                                    delivery: {
                                        ...settings.delivery,
                                        freeShippingThreshold: Number(e.target.value),
                                    },
                                })
                            }
                        />
                    </div>
                </section>

                {/* COD Settings */}
                <section>
                    <h3 className="text-xl font-semibold mb-4">Cash on Delivery Settings</h3>

                    {/* Enable COD */}
                    <div className="mb-4">
                        <label className="flex items-center gap-3">
                            <input
                                type="checkbox"
                                checked={settings.cod.enabled}
                                onChange={(e) =>
                                    setSettings({
                                        ...settings,
                                        cod: { ...settings.cod, enabled: e.target.checked },
                                    })
                                }
                            />
                            <span>Enable COD</span>
                        </label>
                    </div>

                    {/* Max COD Amount */}
                    {settings.cod.enabled && (
                        <div>
                            <label className="block font-medium mb-1">
                                Maximum COD Amount
                            </label>
                            <input
                                type="number"
                                className="border rounded-md p-2 w-full"
                                min={0}
                                value={settings.cod.maxAmount}
                                onChange={(e) =>
                                    setSettings({
                                        ...settings,
                                        cod: {
                                            ...settings.cod,
                                            maxAmount: Number(e.target.value),
                                        },
                                    })
                                }
                            />
                        </div>
                    )}
                </section>

                {/* Order Cancellation Settings */}
                <section>
                    <h3 className="text-xl font-semibold mb-4">
                        Order Cancellation Settings
                    </h3>

                    <div className="mb-4">
                        <label className="flex items-center gap-3">
                            <input
                                type="checkbox"
                                checked={settings.orderCancellation.autoCancel}
                                onChange={(e) =>
                                    setSettings({
                                        ...settings,
                                        orderCancellation: {
                                            ...settings.orderCancellation,
                                            autoCancel: e.target.checked,
                                        },
                                    })
                                }
                            />
                            <span>Enable Auto-Cancellation</span>
                        </label>
                    </div>

                    {/* Cancel After */}
                    {settings.orderCancellation.autoCancel && (
                        <div>
                            <label className="block font-medium mb-1">
                                Auto-Cancel After (Hours)
                            </label>
                            <input
                                type="number"
                                className="border rounded-md p-2 w-full"
                                min={1}
                                value={settings.orderCancellation.cancelAfterHours}
                                onChange={(e) =>
                                    setSettings({
                                        ...settings,
                                        orderCancellation: {
                                            ...settings.orderCancellation,
                                            cancelAfterHours: Number(e.target.value),
                                        },
                                    })
                                }
                            />
                        </div>
                    )}
                </section>

                {/* Pending Orders */}
                <section>
                    <h3 className="text-xl font-semibold mb-4">
                        Pending Orders Limits
                    </h3>

                    {/* Per User */}
                    <div className="mb-4">
                        <label className="block font-medium mb-1">
                            Maximum Pending Orders per User
                        </label>
                        <input
                            type="number"
                            className="border rounded-md p-2 w-full"
                            min={1}
                            value={settings.pendingOrders.maxPerUser}
                            onChange={(e) =>
                                setSettings({
                                    ...settings,
                                    pendingOrders: {
                                        ...settings.pendingOrders,
                                        maxPerUser: Number(e.target.value),
                                    },
                                })
                            }
                        />
                    </div>

                    {/* Per Shop */}
                    <div>
                        <label className="block font-medium mb-1">
                            Maximum Pending Orders per Shop
                        </label>
                        <input
                            type="number"
                            className="border rounded-md p-2 w-full"
                            min={1}
                            value={settings.pendingOrders.maxPerShop}
                            onChange={(e) =>
                                setSettings({
                                    ...settings,
                                    pendingOrders: {
                                        ...settings.pendingOrders,
                                        maxPerShop: Number(e.target.value),
                                    },
                                })
                            }
                        />
                    </div>
                </section>

                {/* Save Button */}
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
