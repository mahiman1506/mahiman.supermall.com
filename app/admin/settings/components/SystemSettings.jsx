"use client";

import { useState } from "react";
// import { updateSystemSettings } from "@/lib/firestore/settings/write";

export default function SystemSettings({ initialData }) {
    const [alert, setAlert] = useState({ type: "", text: "" });

    const [settings, setSettings] = useState(
        initialData || {
            database: {
                lastBackup: null,
                backupSchedule: "daily",
                retentionDays: 30,
            },
            maintenance: {
                isEnabled: false,
                message: "",
            },
        }
    );

    const [backupInProgress, setBackupInProgress] = useState(false);
    const [restoreInProgress, setRestoreInProgress] = useState(false);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [actionType, setActionType] = useState("");

    const showAlert = (type, text) => {
        setAlert({ type, text });
        setTimeout(() => setAlert({ type: "", text: "" }), 2500);
    };

    const handleBackupDatabase = async () => {
        try {
            setBackupInProgress(true);
            await new Promise((resolve) => setTimeout(resolve, 2000));
            showAlert("success", "Database backup completed successfully");

            setSettings({
                ...settings,
                database: { ...settings.database, lastBackup: new Date().toISOString() },
            });
        } catch {
            showAlert("error", "Failed to backup database");
        } finally {
            setBackupInProgress(false);
        }
    };

    const handleRestoreBackup = async () => {
        try {
            setRestoreInProgress(true);
            await new Promise((resolve) => setTimeout(resolve, 2000));
            showAlert("success", "Database restored successfully");
        } catch {
            showAlert("error", "Failed to restore backup");
        } finally {
            setRestoreInProgress(false);
        }
    };

    const handleClearLogs = async () => {
        try {
            await new Promise((resolve) => setTimeout(resolve, 800));
            showAlert("success", "System logs cleared successfully");
        } catch {
            showAlert("error", "Failed to clear logs");
        }
    };

    const handleClearCache = async () => {
        try {
            await new Promise((resolve) => setTimeout(resolve, 800));
            showAlert("success", "System cache cleared successfully");
        } catch {
            showAlert("error", "Failed to clear cache");
        }
    };

    const showConfirmationDialog = (type) => {
        setActionType(type);
        setShowConfirmation(true);
    };

    const handleConfirm = async () => {
        setShowConfirmation(false);

        switch (actionType) {
            case "backup":
                await handleBackupDatabase();
                break;
            case "restore":
                await handleRestoreBackup();
                break;
            case "clearLogs":
                await handleClearLogs();
                break;
            case "clearCache":
                await handleClearCache();
                break;
            default:
                break;
        }
    };

    return (
        <div className="space-y-6 relative">
            <h2 className="text-2xl font-bold">System Settings</h2>

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
                {/* DATABASE MANAGEMENT */}
                <section>
                    <h3 className="text-xl font-semibold mb-4">Database Management</h3>

                    <div className="space-y-4">
                        {/* Last Backup */}
                        <div>
                            <p className="mb-2">
                                Last Backup:{" "}
                                {settings.database.lastBackup
                                    ? new Date(settings.database.lastBackup).toLocaleString()
                                    : "Never"}
                            </p>

                            <button
                                type="button"
                                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                                onClick={() => showConfirmationDialog("backup")}
                                disabled={backupInProgress}
                            >
                                {backupInProgress ? "Backing up..." : "Backup Database"}
                            </button>
                        </div>

                        {/* Restore */}
                        <div>
                            <button
                                type="button"
                                className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 disabled:opacity-50"
                                onClick={() => showConfirmationDialog("restore")}
                                disabled={restoreInProgress}
                            >
                                {restoreInProgress ? "Restoring..." : "Restore from Backup"}
                            </button>
                        </div>
                    </div>
                </section>

                {/* SYSTEM MAINTENANCE */}
                <section>
                    <h3 className="text-xl font-semibold mb-4">System Maintenance</h3>

                    <div className="space-y-4">
                        <button
                            type="button"
                            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
                            onClick={() => showConfirmationDialog("clearLogs")}
                        >
                            Clear System Logs
                        </button>

                        <button
                            type="button"
                            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
                            onClick={() => showConfirmationDialog("clearCache")}
                        >
                            Clear System Cache
                        </button>
                    </div>
                </section>
            </div>

            {/* CONFIRMATION MODAL */}
            {showConfirmation && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-sm w-full shadow-lg">
                        <h3 className="text-lg font-semibold mb-3">Confirmation</h3>
                        <p className="mb-6 text-gray-700">
                            {actionType === "backup" &&
                                "Are you sure you want to create a database backup?"}
                            {actionType === "restore" &&
                                "Are you sure you want to restore from the last backup? This cannot be undone."}
                            {actionType === "clearLogs" &&
                                "Are you sure you want to clear all system logs?"}
                            {actionType === "clearCache" &&
                                "Are you sure you want to clear the system cache?"}
                        </p>

                        <div className="flex justify-end gap-3">
                            <button
                                className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
                                onClick={() => setShowConfirmation(false)}
                            >
                                Cancel
                            </button>

                            <button
                                className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
                                onClick={handleConfirm}
                            >
                                Confirm
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
