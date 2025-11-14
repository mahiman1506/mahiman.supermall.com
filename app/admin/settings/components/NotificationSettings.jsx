"use client";

import { useState } from "react";
import { updateNotificationSettings } from "@/lib/firestore/settings/write";

export default function NotificationSettings({ initialData }) {
  const [message, setMessage] = useState({ type: "", text: "" });

  const [settings, setSettings] = useState(
    initialData || {
      push: {
        enabled: true,
        vapidKey: "",
        serviceWorkerPath: "/sw.js",
      },
      email: {
        enabled: true,
        smtp: {
          host: "",
          port: 587,
          secure: true,
          auth: {
            user: "",
            pass: "",
          },
        },
        templates: {
          orderConfirmation: {
            subject: "Order Confirmation - #{orderId}",
            template:
              "Dear {customerName},\n\nYour order #{orderId} has been confirmed...",
          },
          orderDelivered: {
            subject: "Order Delivered - #{orderId}",
            template:
              "Dear {customerName},\n\nYour order #{orderId} has been delivered...",
          },
          orderCancelled: {
            subject: "Order Cancelled - #{orderId}",
            template:
              "Dear {customerName},\n\nYour order #{orderId} has been cancelled...",
          },
        },
      },
      sms: {
        enabled: false,
        provider: "twilio",
        credentials: {
          accountSid: "",
          authToken: "",
          fromNumber: "",
        },
        templates: {
          orderConfirmation:
            "Your order #{orderId} is confirmed. Track at {trackingUrl}",
          orderDelivered:
            "Your order #{orderId} has been delivered. Thank you!",
          orderCancelled:
            "Your order #{orderId} has been cancelled. Contact support.",
        },
      },
    }
  );

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: "", text: "" }), 3000);
  };

  const handleSave = async () => {
    try {
      await updateNotificationSettings(settings);
      showMessage("success", "Notification settings updated successfully");
    } catch (error) {
      showMessage("error", "Failed to update notification settings");
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Notification Settings</h2>

      {message.text && (
        <div
          className={`p-4 rounded-md ${message.type === "success"
              ? "bg-green-200 text-green-700"
              : "bg-red-200 text-red-700"
            }`}
        >
          {message.text}
        </div>
      )}

      <form className="space-y-10">
        {/* PUSH NOTIFICATIONS */}
        <section>
          <h3 className="text-xl font-semibold mb-4">Push Notifications</h3>

          <label className="flex items-center gap-2 mb-4">
            <input
              type="checkbox"
              checked={settings.push.enabled}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  push: { ...settings.push, enabled: e.target.checked },
                })
              }
            />
            <span>Enable Push Notifications</span>
          </label>

          {settings.push.enabled && (
            <div className="space-y-2">
              <label className="block text-sm font-medium">VAPID Key</label>
              <input
                type="password"
                className="w-full px-3 py-2 border rounded-md"
                value={settings.push.vapidKey}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    push: { ...settings.push, vapidKey: e.target.value },
                  })
                }
              />
            </div>
          )}
        </section>

        {/* EMAIL SETTINGS */}
        <section>
          <h3 className="text-xl font-semibold mb-4">Email Settings</h3>

          <label className="flex items-center gap-2 mb-4">
            <input
              type="checkbox"
              checked={settings.email.enabled}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  email: { ...settings.email, enabled: e.target.checked },
                })
              }
            />
            <span>Enable Email Notifications</span>
          </label>

          {settings.email.enabled && (
            <div className="space-y-4">
              {/* SMTP HOST */}
              <div>
                <label className="block text-sm font-medium">SMTP Host</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border rounded-md"
                  value={settings.email.smtp.host}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      email: {
                        ...settings.email,
                        smtp: { ...settings.email.smtp, host: e.target.value },
                      },
                    })
                  }
                />
              </div>

              {/* SMTP PORT */}
              <div>
                <label className="block text-sm font-medium">SMTP Port</label>
                <input
                  type="number"
                  className="w-full px-3 py-2 border rounded-md"
                  value={settings.email.smtp.port}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      email: {
                        ...settings.email,
                        smtp: {
                          ...settings.email.smtp,
                          port: Number(e.target.value),
                        },
                      },
                    })
                  }
                />
              </div>

              {/* SMTP USER */}
              <div>
                <label className="block text-sm font-medium">
                  SMTP Username
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border rounded-md"
                  value={settings.email.smtp.auth.user}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      email: {
                        ...settings.email,
                        smtp: {
                          ...settings.email.smtp,
                          auth: {
                            ...settings.email.smtp.auth,
                            user: e.target.value,
                          },
                        },
                      },
                    })
                  }
                />
              </div>

              {/* SMTP PASSWORD */}
              <div>
                <label className="block text-sm font-medium">
                  SMTP Password
                </label>
                <input
                  type="password"
                  className="w-full px-3 py-2 border rounded-md"
                  value={settings.email.smtp.auth.pass}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      email: {
                        ...settings.email,
                        smtp: {
                          ...settings.email.smtp,
                          auth: {
                            ...settings.email.smtp.auth,
                            pass: e.target.value,
                          },
                        },
                      },
                    })
                  }
                />
              </div>

              {/* EMAIL TEMPLATES */}
              <h4 className="text-lg font-medium mt-4">Email Templates</h4>

              {Object.entries(settings.email.templates).map(
                ([key, template]) => (
                  <div key={key} className="space-y-2 p-3 border rounded-md">
                    <label className="block text-sm font-medium">
                      {key[0].toUpperCase() + key.slice(1)} Subject
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border rounded-md"
                      value={template.subject}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          email: {
                            ...settings.email,
                            templates: {
                              ...settings.email.templates,
                              [key]: {
                                ...template,
                                subject: e.target.value,
                              },
                            },
                          },
                        })
                      }
                    />

                    <label className="block text-sm font-medium">
                      {key[0].toUpperCase() + key.slice(1)} Template
                    </label>
                    <textarea
                      rows={4}
                      className="w-full px-3 py-2 border rounded-md"
                      value={template.template}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          email: {
                            ...settings.email,
                            templates: {
                              ...settings.email.templates,
                              [key]: {
                                ...template,
                                template: e.target.value,
                              },
                            },
                          },
                        })
                      }
                    />
                  </div>
                )
              )}
            </div>
          )}
        </section>

        {/* SMS SETTINGS */}
        <section>
          <h3 className="text-xl font-semibold mb-4">SMS Settings</h3>

          <label className="flex items-center gap-2 mb-4">
            <input
              type="checkbox"
              checked={settings.sms.enabled}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  sms: { ...settings.sms, enabled: e.target.checked },
                })
              }
            />
            <span>Enable SMS Notifications</span>
          </label>

          {settings.sms.enabled && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium">Provider</label>
                <input
                  className="w-full px-3 py-2 border rounded-md"
                  value={settings.sms.provider}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      sms: {
                        ...settings.sms,
                        provider: e.target.value,
                      },
                    })
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-medium">
                  Account SID
                </label>
                <input
                  className="w-full px-3 py-2 border rounded-md"
                  value={settings.sms.credentials.accountSid}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      sms: {
                        ...settings.sms,
                        credentials: {
                          ...settings.sms.credentials,
                          accountSid: e.target.value,
                        },
                      },
                    })
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-medium">
                  Auth Token
                </label>
                <input
                  type="password"
                  className="w-full px-3 py-2 border rounded-md"
                  value={settings.sms.credentials.authToken}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      sms: {
                        ...settings.sms,
                        credentials: {
                          ...settings.sms.credentials,
                          authToken: e.target.value,
                        },
                      },
                    })
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-medium">
                  From Number
                </label>
                <input
                  className="w-full px-3 py-2 border rounded-md"
                  value={settings.sms.credentials.fromNumber}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      sms: {
                        ...settings.sms,
                        credentials: {
                          ...settings.sms.credentials,
                          fromNumber: e.target.value,
                        },
                      },
                    })
                  }
                />
              </div>

              <h4 className="text-lg font-medium mt-4">SMS Templates</h4>

              {Object.entries(settings.sms.templates).map(([key, text]) => (
                <div key={key} className="space-y-2">
                  <label className="block text-sm font-medium">
                    {key[0].toUpperCase() + key.slice(1)}
                  </label>
                  <textarea
                    rows={2}
                    className="w-full px-3 py-2 border rounded-md"
                    value={text}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        sms: {
                          ...settings.sms,
                          templates: {
                            ...settings.sms.templates,
                            [key]: e.target.value,
                          },
                        },
                      })
                    }
                  />
                </div>
              ))}
            </div>
          )}
        </section>

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
