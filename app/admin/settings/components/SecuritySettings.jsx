"use client";

import { useState } from "react";
import { updateSecuritySettings } from "@/lib/firestore/settings/write";

export default function SecuritySettings({ initialData }) {
    const [alert, setAlert] = useState({ type: "", text: "" });

    const [settings, setSettings] = useState(
        initialData || {
            blockedIPs: [],
            adminLogin: {
                maxAttempts: 5,
                lockoutDuration: 30,
                twoFactorEnabled: true
            },
            session: {
                timeout: 60,
                extendOnActivity: true
            },
            adminLogs: []
        }
    );

    const [newIP, setNewIP] = useState("");

    const showAlert = (type, text) => {
        setAlert({ type, text });
        setTimeout(() => setAlert({ type: "", text: "" }), 3000);
    };

    const handleAddIP = () => {
        if (newIP && !settings.blockedIPs.includes(newIP)) {
            setSettings({
                ...settings,
                blockedIPs: [...settings.blockedIPs, newIP]
            });
            setNewIP("");
        }
    };

    const handleRemoveIP = (ip) => {
        setSettings({
            ...settings,
            blockedIPs: settings.blockedIPs.filter((blockedIP) => blockedIP !== ip)
        });
    };

    const handleSave = async () => {
        try {
            await updateSecuritySettings(settings);
            showAlert("success", "Security settings updated successfully");
        } catch (error) {
            showAlert("error", "Failed to update security settings");
        }
    };

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold">Security Settings</h2>

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

            <form className="space-y-10">
                {/* IP BLOCKING */}
                <section>
                    <h3 className="text-xl font-semibold mb-4">IP Blocking</h3>

                    <div className="flex gap-2 mb-4">
                        <input
                            className="border p-2 rounded-md w-full"
                            placeholder="Enter IP address"
                            value={newIP}
                            onChange={(e) => setNewIP(e.target.value)}
                        />
                        <button
                            type="button"
                            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                            onClick={handleAddIP}
                        >
                            Add IP
                        </button>
                    </div>

                    {/* CUSTOM TABLE */}
                    <table className="w-full border rounded-md">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="py-2 px-3 text-left border-b">IP Address</th>
                                <th className="py-2 px-3 text-left border-b">Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            {settings.blockedIPs.length === 0 && (
                                <tr>
                                    <td
                                        colSpan={2}
                                        className="py-3 px-3 text-gray-500 text-center"
                                    >
                                        No blocked IPs
                                    </td>
                                </tr>
                            )}

                            {settings.blockedIPs.map((ip) => (
                                <tr key={ip} className="border-b">
                                    <td className="py-2 px-3">{ip}</td>
                                    <td className="py-2 px-3">
                                        <button
                                            type="button"
                                            className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                                            onClick={() => handleRemoveIP(ip)}
                                        >
                                            Remove
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </section>

                {/* ADMIN LOGIN SECURITY */}
                <section>
                    <h3 className="text-xl font-semibold mb-4">
                        Admin Login Security
                    </h3>

                    {/* MAX ATTEMPTS */}
                    <div className="mb-4">
                        <label className="block font-medium mb-1">
                            Maximum Login Attempts
                        </label>
                        <input
                            type="number"
                            min={1}
                            className="border p-2 rounded-md w-full"
                            value={settings.adminLogin.maxAttempts}
                            onChange={(e) =>
                                setSettings({
                                    ...settings,
                                    adminLogin: {
                                        ...settings.adminLogin,
                                        maxAttempts: Number(e.target.value)
                                    }
                                })
                            }
                        />
                    </div>

                    {/* LOCKOUT DURATION */}
                    <div className="mb-4">
                        <label className="block font-medium mb-1">
                            Account Lockout Duration (minutes)
                        </label>
                        <input
                            type="number"
                            min={1}
                            className="border p-2 rounded-md w-full"
                            value={settings.adminLogin.lockoutDuration}
                            onChange={(e) =>
                                setSettings({
                                    ...settings,
                                    adminLogin: {
                                        ...settings.adminLogin,
                                        lockoutDuration: Number(e.target.value)
                                    }
                                })
                            }
                        />
                    </div>

                    {/* TWO-FACTOR */}
                    <div>
                        <label className="flex items-center gap-3">
                            <input
                                type="checkbox"
                                checked={settings.adminLogin.twoFactorEnabled}
                                onChange={(e) =>
                                    setSettings({
                                        ...settings,
                                        adminLogin: {
                                            ...settings.adminLogin,
                                            twoFactorEnabled: e.target.checked
                                        }
                                    })
                                }
                            />
                            <span>Enable Two-Factor Authentication</span>
                        </label>
                    </div>
                </section>

                {/* SESSION SETTINGS */}
                <section>
                    <h3 className="text-xl font-semibold mb-4">
                        Session Settings
                    </h3>

                    <div className="mb-4">
                        <label className="block font-medium mb-1">
                            Session Timeout (minutes)
                        </label>
                        <input
                            type="number"
                            min={1}
                            className="border p-2 rounded-md w-full"
                            value={settings.session.timeout}
                            onChange={(e) =>
                                setSettings({
                                    ...settings,
                                    session: {
                                        ...settings.session,
                                        timeout: Number(e.target.value)
                                    }
                                })
                            }
                        />
                    </div>

                    <div>
                        <label className="flex items-center gap-3">
                            <input
                                type="checkbox"
                                checked={settings.session.extendOnActivity}
                                onChange={(e) =>
                                    setSettings({
                                        ...settings,
                                        session: {
                                            ...settings.session,
                                            extendOnActivity: e.target.checked
                                        }
                                    })
                                }
                            />
                            <span>Extend Session on Activity</span>
                        </label>
                    </div>
                </section>

                {/* ADMIN LOGS */}
                <section>
                    <h3 className="text-xl font-semibold mb-4">
                        Admin Activity Logs
                    </h3>

                    {/* LOGS TABLE */}
                    <table className="w-full border rounded-md">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="py-2 px-3 text-left border-b">Timestamp</th>
                                <th className="py-2 px-3 text-left border-b">Admin</th>
                                <th className="py-2 px-3 text-left border-b">Action</th>
                                <th className="py-2 px-3 text-left border-b">IP</th>
                            </tr>
                        </thead>

                        <tbody>
                            {settings.adminLogs.length === 0 && (
                                <tr>
                                    <td
                                        colSpan={4}
                                        className="py-3 px-3 text-gray-500 text-center"
                                    >
                                        No logs yet
                                    </td>
                                </tr>
                            )}

                            {settings.adminLogs.map((log) => (
                                <tr key={log.timestamp} className="border-b">
                                    <td className="py-2 px-3">
                                        {new Date(log.timestamp).toLocaleString()}
                                    </td>
                                    <td className="py-2 px-3">{log.admin}</td>
                                    <td className="py-2 px-3">{log.action}</td>
                                    <td className="py-2 px-3">{log.ip}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
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
