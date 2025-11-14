"use client";

import { useState } from "react";

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    // Store Preferences
    shopOpen: true,
    enableOffers: true,
    showOutOfStock: false,
    autoCancelUnpaid: true,
    currency: "INR",
    taxRate: 18,

    // Account
    ownerName: "Ravi Kumar",
    ownerEmail: "shop@example.com",
    ownerPhone: "+91 98765 43210",
    password: "",

    // Payment
    paymentMethod: "UPI",
    codEnabled: true,
    bankName: "HDFC Bank",
    accountNumber: "XXXXXXXX1234",
    ifscCode: "HDFC0000123",

    // Shipping
    deliveryZones: "All India",
    deliveryCharge: 49,
    freeDeliveryAbove: 999,
    courierPartner: "BlueDart",
    deliveryTime: "2-5 business days",

    // Notifications
    emailAlerts: true,
    smsAlerts: true,
    newOrderAlerts: true,
    lowStockAlerts: true,

    // Orders & Checkout
    guestCheckout: true,
    minOrderValue: 100,
    allowNotes: true,
    returnPolicy:
      "Returns accepted within 7 days of delivery if product is unused and in original packaging.",

    // Appearance
    themeColor: "#2563eb",
    darkMode: false,
    layout: "grid",

    // Security
    twoFA: false,
    sessionTimeout: 30,

    // Integrations
    googleAnalytics: "",
    metaPixel: "",

    // System
    autoBackup: true,
    maintenanceMode: false,
  });

  return (
    <div className="max-w-6xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-8">⚙️ Shop Settings</h1>

      {/* STORE PREFERENCES */}
      <Section title="🏪 Store Preferences">
        <Toggle
          label="Shop Status (Open)"
          value={settings.shopOpen}
          onChange={(v) => setSettings({ ...settings, shopOpen: v })}
        />
        <Toggle
          label="Enable Offers"
          value={settings.enableOffers}
          onChange={(v) => setSettings({ ...settings, enableOffers: v })}
        />
        <Toggle
          label="Show Out-of-Stock Products"
          value={settings.showOutOfStock}
          onChange={(v) => setSettings({ ...settings, showOutOfStock: v })}
        />
        <Toggle
          label="Auto Cancel Unpaid Orders"
          value={settings.autoCancelUnpaid}
          onChange={(v) => setSettings({ ...settings, autoCancelUnpaid: v })}
        />
        <Select
          label="Currency"
          value={settings.currency}
          options={["INR", "USD", "EUR"]}
          onChange={(v) => setSettings({ ...settings, currency: v })}
        />
        <Input
          label="Tax / GST Percentage"
          type="number"
          value={settings.taxRate}
          onChange={(v) => setSettings({ ...settings, taxRate: v })}
        />
      </Section>

      {/* ACCOUNT SETTINGS */}
      <Section title="👤 Account Settings">
        <Input
          label="Owner Name"
          value={settings.ownerName}
          onChange={(v) => setSettings({ ...settings, ownerName: v })}
        />
        <Input
          label="Email"
          value={settings.ownerEmail}
          onChange={(v) => setSettings({ ...settings, ownerEmail: v })}
        />
        <Input
          label="Phone"
          value={settings.ownerPhone}
          onChange={(v) => setSettings({ ...settings, ownerPhone: v })}
        />
        <Input
          label="Change Password"
          type="password"
          value={settings.password}
          onChange={(v) => setSettings({ ...settings, password: v })}
        />
      </Section>

      {/* PAYMENT SETTINGS */}
      <Section title="💳 Payment Settings">
        <Select
          label="Default Payment Method"
          value={settings.paymentMethod}
          options={["UPI", "Razorpay", "PayPal", "Stripe"]}
          onChange={(v) => setSettings({ ...settings, paymentMethod: v })}
        />
        <Toggle
          label="Enable Cash on Delivery"
          value={settings.codEnabled}
          onChange={(v) => setSettings({ ...settings, codEnabled: v })}
        />
        <Input
          label="Bank Name"
          value={settings.bankName}
          onChange={(v) => setSettings({ ...settings, bankName: v })}
        />
        <Input
          label="Account Number"
          value={settings.accountNumber}
          onChange={(v) => setSettings({ ...settings, accountNumber: v })}
        />
        <Input
          label="IFSC Code"
          value={settings.ifscCode}
          onChange={(v) => setSettings({ ...settings, ifscCode: v })}
        />
      </Section>

      {/* SHIPPING SETTINGS */}
      <Section title="🚚 Shipping Settings">
        <Input
          label="Delivery Zones"
          value={settings.deliveryZones}
          onChange={(v) => setSettings({ ...settings, deliveryZones: v })}
        />
        <Input
          label="Delivery Charge (₹)"
          type="number"
          value={settings.deliveryCharge}
          onChange={(v) => setSettings({ ...settings, deliveryCharge: v })}
        />
        <Input
          label="Free Delivery Above (₹)"
          type="number"
          value={settings.freeDeliveryAbove}
          onChange={(v) => setSettings({ ...settings, freeDeliveryAbove: v })}
        />
        <Input
          label="Courier Partner"
          value={settings.courierPartner}
          onChange={(v) => setSettings({ ...settings, courierPartner: v })}
        />
        <Input
          label="Estimated Delivery Time"
          value={settings.deliveryTime}
          onChange={(v) => setSettings({ ...settings, deliveryTime: v })}
        />
      </Section>

      {/* NOTIFICATIONS */}
      <Section title="🔔 Notification Settings">
        <Toggle
          label="Email Alerts"
          value={settings.emailAlerts}
          onChange={(v) => setSettings({ ...settings, emailAlerts: v })}
        />
        <Toggle
          label="SMS Alerts"
          value={settings.smsAlerts}
          onChange={(v) => setSettings({ ...settings, smsAlerts: v })}
        />
        <Toggle
          label="New Order Alerts"
          value={settings.newOrderAlerts}
          onChange={(v) => setSettings({ ...settings, newOrderAlerts: v })}
        />
        <Toggle
          label="Low Stock Alerts"
          value={settings.lowStockAlerts}
          onChange={(v) => setSettings({ ...settings, lowStockAlerts: v })}
        />
      </Section>

      {/* ORDER SETTINGS */}
      <Section title="🧾 Order & Checkout">
        <Toggle
          label="Allow Guest Checkout"
          value={settings.guestCheckout}
          onChange={(v) => setSettings({ ...settings, guestCheckout: v })}
        />
        <Input
          label="Minimum Order Value (₹)"
          type="number"
          value={settings.minOrderValue}
          onChange={(v) => setSettings({ ...settings, minOrderValue: v })}
        />
        <Toggle
          label="Allow Customer Notes"
          value={settings.allowNotes}
          onChange={(v) => setSettings({ ...settings, allowNotes: v })}
        />
        <Textarea
          label="Return / Refund Policy"
          value={settings.returnPolicy}
          onChange={(v) => setSettings({ ...settings, returnPolicy: v })}
        />
      </Section>

      {/* APPEARANCE SETTINGS */}
      <Section title="🎨 Appearance">
        <Input
          label="Theme Color"
          type="color"
          value={settings.themeColor}
          onChange={(v) => setSettings({ ...settings, themeColor: v })}
        />
        <Toggle
          label="Enable Dark Mode"
          value={settings.darkMode}
          onChange={(v) => setSettings({ ...settings, darkMode: v })}
        />
        <Select
          label="Layout Style"
          value={settings.layout}
          options={["grid", "list", "showcase"]}
          onChange={(v) => setSettings({ ...settings, layout: v })}
        />
      </Section>

      {/* SECURITY SETTINGS */}
      <Section title="🔐 Security">
        <Toggle
          label="Enable Two-Factor Authentication"
          value={settings.twoFA}
          onChange={(v) => setSettings({ ...settings, twoFA: v })}
        />
        <Input
          label="Session Timeout (minutes)"
          type="number"
          value={settings.sessionTimeout}
          onChange={(v) => setSettings({ ...settings, sessionTimeout: v })}
        />
      </Section>

      {/* INTEGRATIONS */}
      <Section title="🔗 Integrations">
        <Input
          label="Google Analytics ID"
          value={settings.googleAnalytics}
          onChange={(v) => setSettings({ ...settings, googleAnalytics: v })}
        />
        <Input
          label="Meta Pixel ID"
          value={settings.metaPixel}
          onChange={(v) => setSettings({ ...settings, metaPixel: v })}
        />
      </Section>

      {/* SYSTEM SETTINGS */}
      <Section title="🧹 System Maintenance">
        <Toggle
          label="Auto Backup Enabled"
          value={settings.autoBackup}
          onChange={(v) => setSettings({ ...settings, autoBackup: v })}
        />
        <Toggle
          label="Maintenance Mode"
          value={settings.maintenanceMode}
          onChange={(v) => setSettings({ ...settings, maintenanceMode: v })}
        />
      </Section>

      {/* Save Button */}
      <div className="text-right mt-8">
        <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
          💾 Save Settings
        </button>
      </div>
    </div>
  );
}

/* ---------- Reusable Small Components ---------- */
function Section({ title, children }) {
  return (
    <div className="bg-white shadow rounded-xl p-6 mb-8">
      <h2 className="text-xl font-semibold mb-4">{title}</h2>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

function Input({ label, value, onChange, type = "text" }) {
  return (
    <label className="block text-sm">
      <span className="font-medium text-gray-700">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
      />
    </label>
  );
}

function Select({ label, value, onChange, options }) {
  return (
    <label className="block text-sm">
      <span className="font-medium text-gray-700">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
      >
        {options.map((opt) => (
          <option key={opt}>{opt}</option>
        ))}
      </select>
    </label>
  );
}

function Toggle({ label, value, onChange }) {
  return (
    <label className="flex items-center justify-between text-sm">
      <span className="font-medium text-gray-700">{label}</span>
      <input
        type="checkbox"
        checked={value}
        onChange={(e) => onChange(e.target.checked)}
        className="w-5 h-5 accent-blue-600"
      />
    </label>
  );
}

function Textarea({ label, value, onChange }) {
  return (
    <label className="block text-sm">
      <span className="font-medium text-gray-700">{label}</span>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={3}
        className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
      />
    </label>
  );
}
