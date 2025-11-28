"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { useShop } from "@/lib/firestore/shop/read";
import { useCategory } from "@/lib/firestore/categories/read";
import { useFloor } from "@/lib/firestore/floors/read";
import { createNewOffer, UpdateOffer } from "@/lib/firestore/offers/write";
import { getOfferById } from "@/lib/firestore/offers/read";
import { useAuth } from "@/contexts/AuthContext";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "@/lib/firestore/firebase";

// ---- Helpers ----
const toInputDate = (d) => {
  if (!d) return "";
  const date = new Date(d);
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
};

const getToday = () => toInputDate(new Date());
const getTomorrow = () => {
  const t = new Date();
  t.setDate(t.getDate() + 1);
  return toInputDate(t);
};

const generateOfferCode = () => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code = "";
  for (let i = 0; i < 8; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
};

export default function OfferForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams?.get("id") || null;

  const { user, role, loading: authLoading } = useAuth();
  const { data: shops = [] } = useShop();
  const { data: categories = [] } = useCategory();
  const { data: floors = [] } = useFloor();

  const [loading, setLoading] = useState(false);
  const [bannerImage, setBannerImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState("");

  const [data, setData] = useState({
    name: "",
    offerCode: "",
    type: "", // percentage | flat | buyxgety | gift
    discountValue: "",
    applicableOn: "", // all | shop | category | floor
    startDate: "",
    endDate: "",
    minimumPurchase: "",
    maxDiscount: "",
    usageLimit: "", // per user
    globalLimit: "", // total usage across all users
    status: "Active",
    description: "",
    buyX: "",
    getY: "",
    autoApply: true,
  });

  const [selectedShops, setSelectedShops] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedFloors, setSelectedFloors] = useState([]);

  // for auto-expire check
  const dataRef = useRef(data);
  useEffect(() => {
    dataRef.current = data;
  }, [data]);

  // Load existing offer when editing
  useEffect(() => {
    if (!id) return;

    const fetchOffer = async () => {
      setLoading(true);
      try {
        const offer = await getOfferById(id);
        if (!offer) {
          alert("⚠️ Offer not found");
          router.push("/shop/offers");
          return;
        }

        const normalized = {
          ...offer,
          startDate: offer.startDate ? toInputDate(offer.startDate) : "",
          endDate: offer.endDate ? toInputDate(offer.endDate) : "",
          offerCode: offer.offerCode || "",
          maxDiscount: offer.maxDiscount || "",
          minimumPurchase: offer.minimumPurchase || "",
          usageLimit: offer.usageLimit || "",
          globalLimit: offer.globalLimit || "",
          buyX: offer.buyX || "",
          getY: offer.getY || "",
          autoApply:
            typeof offer.autoApply === "boolean" ? offer.autoApply : true,
          status: offer.status || "Active",
        };

        setData({ ...normalized, id });

        setPreview(offer?.bannerImageURL || null);

        if (offer?.applicableShops)
          setSelectedShops(offer.applicableShops || []);
        if (offer?.applicableCategories)
          setSelectedCategories(offer.applicableCategories || []);
        if (offer?.applicableFloors)
          setSelectedFloors(offer.applicableFloors || []);
      } catch (err) {
        console.error(err);
        alert("❌ Failed to load offer");
      } finally {
        setLoading(false);
      }
    };

    fetchOffer();
  }, [id, router]);

  // Auto-expire if end date passed (client side status)
  useEffect(() => {
    const checkExpiry = () => {
      const todayStr = getToday();
      const end = dataRef.current.endDate;
      if (end && todayStr >= end && dataRef.current.status !== "Expired") {
        setData((prev) => ({ ...prev, status: "Expired" }));
      }
    };

    checkExpiry();
    const interval = setInterval(checkExpiry, 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  // --- Handlers ---
  const handleData = (key, value) => {
    setData((prev) => ({
      ...prev,
      [key]: value ?? "",
    }));
  };

  const handleNumber = (key, value) => {
    if (value === "") {
      handleData(key, "");
    } else {
      handleData(key, Number(value));
    }
  };

  const handleSelect = (value, type) => {
    if (!value) return;
    if (type === "shop" && !selectedShops.includes(value)) {
      setSelectedShops((prev) => [...prev, value]);
    }
    if (type === "category" && !selectedCategories.includes(value)) {
      setSelectedCategories((prev) => [...prev, value]);
    }
    if (type === "floor" && !selectedFloors.includes(value)) {
      setSelectedFloors((prev) => [...prev, value]);
    }
  };

  const removeItem = (value, type) => {
    if (type === "shop")
      setSelectedShops((prev) => prev.filter((s) => s !== value));
    if (type === "category")
      setSelectedCategories((prev) => prev.filter((c) => c !== value));
    if (type === "floor")
      setSelectedFloors((prev) => prev.filter((f) => f !== value));
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setBannerImage(file);
      setPreview(URL.createObjectURL(file));
    } else {
      setBannerImage(null);
      setPreview(null);
    }
  };

  // --- Validation more realistic ---
  const validateForm = () => {
    setError("");

    if (!data.name.trim()) {
      setError("Offer name is required.");
      return false;
    }
    if (!data.offerCode.trim()) {
      setError("Offer code is required.");
      return false;
    }
    if (!data.type) {
      setError("Offer type is required.");
      return false;
    }
    if (!data.applicableOn) {
      setError("Please select where this offer applies.");
      return false;
    }
    if (!data.startDate || !data.endDate) {
      setError("Start and end dates are required.");
      return false;
    }

    const today = getToday();

    if (data.startDate < today) {
      setError("Start date cannot be earlier than today.");
      return false;
    }
    if (data.endDate <= data.startDate) {
      setError("End date must be later than start date.");
      return false;
    }

    // Type-specific validation
    if (data.type === "percentage" || data.type === "flat") {
      if (!data.discountValue || Number(data.discountValue) <= 0) {
        setError("Please enter a valid discount value.");
        return false;
      }
      if (data.type === "percentage" && Number(data.discountValue) > 100) {
        setError("Percentage discount cannot exceed 100%.");
        return false;
      }
    }

    if (data.type === "buyxgety") {
      if (!data.buyX || !data.getY) {
        setError("For 'Buy X Get Y', please fill both X and Y quantities.");
        return false;
      }
      if (Number(data.buyX) <= 0 || Number(data.getY) <= 0) {
        setError("Buy X and Get Y must be greater than 0.");
        return false;
      }
    }

    // applicability validation
    if (data.applicableOn === "shop" && selectedShops.length === 0) {
      setError("Select at least one shop for this offer.");
      return false;
    }
    if (data.applicableOn === "category" && selectedCategories.length === 0) {
      setError("Select at least one category for this offer.");
      return false;
    }
    if (data.applicableOn === "floor" && selectedFloors.length === 0) {
      setError("Select at least one floor for this offer.");
      return false;
    }

    return true;
  };

  const clearForm = () => {
    setData({
      name: "",
      offerCode: "",
      type: "",
      discountValue: "",
      applicableOn: "",
      startDate: "",
      endDate: "",
      minimumPurchase: "",
      maxDiscount: "",
      usageLimit: "",
      globalLimit: "",
      status: "Active",
      description: "",
      buyX: "",
      getY: "",
      autoApply: true,
    });
    setBannerImage(null);
    setPreview(null);
    setSelectedShops([]);
    setSelectedCategories([]);
    setSelectedFloors([]);
    setError("");
  };

  const uploadBannerIfNeeded = async () => {
    if (!bannerImage) return data.bannerImageURL || "";
    const storageRef = ref(storage, `offers/${Date.now()}_${bannerImage.name}`);
    const snapshot = await uploadBytes(storageRef, bannerImage);
    const url = await getDownloadURL(snapshot.ref);
    return url;
  };

  const handleCreateOrUpdate = async () => {
    if (!validateForm()) return;

    setLoading(true);
    setError("");

    try {
      const bannerImageURL = await uploadBannerIfNeeded();

      const payload = {
        ...data,
        buyX: data.buyX || null,
        getY: data.getY || null,
        minimumPurchase: data.minimumPurchase || 0,
        maxDiscount: data.maxDiscount || 0,
        usageLimit: data.usageLimit || 0,
        globalLimit: data.globalLimit || 0,
        bannerImageURL,
      };

      if (id) {
        await UpdateOffer({
          data: payload,
          bannerImageURL,
          applicableShops: selectedShops,
          applicableCategories: selectedCategories,
          applicableFloors: selectedFloors,
        });
        alert("✅ Offer updated successfully");
      } else {
        await createNewOffer({
          data: payload,
          bannerImageURL,
          applicableShops: selectedShops,
          applicableCategories: selectedCategories,
          applicableFloors: selectedFloors,
        });
        alert("✅ Offer created successfully");
      }

      clearForm();
      router.push("/shop/offers");
    } catch (err) {
      console.error(err);
      setError(err?.message || "Something went wrong while saving offer.");
    } finally {
      setLoading(false);
    }
  };

  // --- UI ---
  return (
    <div className="flex-1 flex flex-col gap-5 rounded-xl p-6 sm:p-8 md:p-10 bg-gray-50 shadow">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold">
          {id ? "Edit Offer" : "Create New Offer"}
        </h1>
        <button
          type="button"
          onClick={() => router.push("/shop/offers")}
          className="text-sm text-gray-600 hover:text-black"
        >
          ← Back to offers
        </button>
      </div>

      {error && (
        <div className="rounded-lg bg-red-50 text-red-700 px-4 py-2 text-sm">
          {error}
        </div>
      )}

      <form
        onSubmit={(e) => {
          e.preventDefault();

          if (authLoading) {
            alert(
              "Authentication not ready yet. Please try again in a moment."
            );
            return;
          }
          if (!user || role !== "shop") {
            alert("You do not have permission. Shop access required.");
            return;
          }

          handleCreateOrUpdate();
        }}
        className="grid grid-cols-1 sm:grid-cols-2 gap-6"
      >
        {/* SECTION: Basic Info */}
        <div className="col-span-1 sm:col-span-2">
          <h2 className="text-lg font-semibold mb-2">Basic Details</h2>
          <p className="text-xs text-gray-500 mb-3">
            Name, code and description shown to customers.
          </p>
        </div>

        <div className="flex flex-col gap-1 col-span-1 sm:col-span-2">
          <label htmlFor="offer-name" className="text-sm font-medium">
            Offer Name
          </label>
          <input
            type="text"
            id="offer-name"
            placeholder="e.g. Summer Sale 20% OFF"
            value={data.name || ""}
            onChange={(e) => handleData("name", e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-black w-full"
            required
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="offer-code" className="text-sm font-medium">
            Offer Code
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              id="offer-code"
              placeholder="e.g. SUMMER20"
              value={data.offerCode || ""}
              onChange={(e) =>
                handleData("offerCode", e.target.value.toUpperCase())
              }
              className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-black w-full"
              required
            />
            <button
              type="button"
              onClick={() =>
                handleData("offerCode", generateOfferCode().toUpperCase())
              }
              className="px-3 py-2 text-xs border border-gray-300 rounded-lg hover:bg-gray-100"
            >
              Generate
            </button>
          </div>
          <span className="text-[11px] text-gray-500">
            Customers will enter this code at checkout.
          </span>
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="description" className="text-sm font-medium">
            Short Description
          </label>
          <textarea
            id="description"
            placeholder="e.g. Get 20% off on all fashion items above ₹999."
            value={data.description || ""}
            onChange={(e) => handleData("description", e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-black w-full h-20"
          />
        </div>

        {/* SECTION: Type & Value */}
        <div className="col-span-1 sm:col-span-2 mt-4">
          <h2 className="text-lg font-semibold mb-2">Discount Details</h2>
          <p className="text-xs text-gray-500 mb-3">
            Choose how this offer gives value to the customer.
          </p>
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="offer-type" className="text-sm font-medium">
            Offer Type
          </label>
          <select
            id="offer-type"
            value={data.type || ""}
            onChange={(e) => handleData("type", e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-black w-full"
            required
          >
            <option value="">Select Offer Type</option>
            <option value="percentage">Percentage Discount</option>
            <option value="flat">Flat Discount</option>
            <option value="buyxgety">Buy X Get Y</option>
            <option value="gift">Free Gift</option>
          </select>
        </div>

        {/* Discount Value (for percentage / flat) */}
        {(data.type === "percentage" || data.type === "flat") && (
          <div className="flex flex-col gap-1">
            <label htmlFor="discount-value" className="text-sm font-medium">
              {data.type === "percentage"
                ? "Discount Percentage (%)"
                : "Flat Discount (₹)"}
            </label>
            <input
              type="number"
              id="discount-value"
              placeholder={
                data.type === "percentage" ? "e.g. 20" : "e.g. 200 (₹)"
              }
              value={data.discountValue || ""}
              onChange={(e) => handleNumber("discountValue", e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-black w-full"
              required={data.type === "percentage" || data.type === "flat"}
              min={0}
            />
          </div>
        )}

        {/* Buy X Get Y fields */}
        {data.type === "buyxgety" && (
          <>
            <div className="flex flex-col gap-1">
              <label htmlFor="buy-x" className="text-sm font-medium">
                Buy X Quantity
              </label>
              <input
                type="number"
                id="buy-x"
                placeholder="e.g. 2"
                value={data.buyX || ""}
                onChange={(e) => handleNumber("buyX", e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-black w-full"
                min={1}
              />
            </div>

            <div className="flex flex-col gap-1">
              <label htmlFor="get-y" className="text-sm font-medium">
                Get Y Free
              </label>
              <input
                type="number"
                id="get-y"
                placeholder="e.g. 1"
                value={data.getY || ""}
                onChange={(e) => handleNumber("getY", e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-black w-full"
                min={1}
              />
            </div>
          </>
        )}

        {/* Max discount for percentage */}
        {data.type === "percentage" && (
          <div className="flex flex-col gap-1">
            <label htmlFor="max-discount" className="text-sm font-medium">
              Max Discount Amount (₹)
            </label>
            <input
              type="number"
              id="max-discount"
              placeholder="e.g. 500"
              value={data.maxDiscount || ""}
              onChange={(e) => handleNumber("maxDiscount", e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-black w-full"
              min={0}
            />
            <span className="text-[11px] text-gray-500">
              Optional cap on how much can be discounted.
            </span>
          </div>
        )}

        {/* Minimum purchase */}
        <div className="flex flex-col gap-1">
          <label htmlFor="min-purchase" className="text-sm font-medium">
            Minimum Order Value (₹)
          </label>
          <input
            type="number"
            id="min-purchase"
            placeholder="e.g. 999"
            value={data.minimumPurchase || ""}
            onChange={(e) => handleNumber("minimumPurchase", e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-black w-full"
            min={0}
          />
        </div>

        {/* SECTION: Applicability */}
        <div className="col-span-1 sm:col-span-2 mt-4">
          <h2 className="text-lg font-semibold mb-2">Where does this apply?</h2>
          <p className="text-xs text-gray-500 mb-3">
            Control which shops, categories or floors this offer applies to.
          </p>
        </div>

        <div className="flex flex-col gap-1 col-span-1 sm:col-span-2">
          <label htmlFor="applicable-on" className="text-sm font-medium">
            Applies To
          </label>
          <select
            id="applicable-on"
            value={data.applicableOn || ""}
            onChange={(e) => handleData("applicableOn", e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-black w-full"
            required
          >
            <option value="">Select</option>
            <option value="all">All Shops</option>
            <option value="shop">Specific Shop(s)</option>
            <option value="category">Category</option>
            <option value="floor">Floor</option>
          </select>
        </div>

        {/* Dynamic selection: shops / categories / floors */}
        {["shop", "category", "floor"].map((type) => {
          const selected =
            type === "shop"
              ? selectedShops
              : type === "category"
              ? selectedCategories
              : selectedFloors;
          const options =
            type === "shop" ? shops : type === "category" ? categories : floors;

          return data.applicableOn === type ? (
            <div
              key={type}
              className="flex flex-col gap-2 col-span-1 sm:col-span-2"
            >
              <div className="flex flex-wrap gap-2">
                {selected.map((item) => (
                  <span
                    key={item}
                    className={`${
                      type === "shop"
                        ? "bg-blue-100 text-blue-700"
                        : type === "category"
                        ? "bg-green-100 text-green-700"
                        : "bg-purple-100 text-purple-700"
                    } px-3 py-1 rounded-full flex items-center gap-2 text-xs`}
                  >
                    {item}
                    <button
                      type="button"
                      className="text-red-500 font-bold"
                      onClick={() => removeItem(item, type)}
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>

              <select
                onChange={(e) => handleSelect(e.target.value, type)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-black w-full"
              >
                <option value="">
                  Select {type.charAt(0).toUpperCase() + type.slice(1)}
                </option>
                {options.map((opt) => (
                  <option key={opt?.id} value={opt?.name}>
                    {opt?.name}
                  </option>
                ))}
              </select>
            </div>
          ) : null;
        })}

        {/* SECTION: Duration & Limits */}
        <div className="col-span-1 sm:col-span-2 mt-4">
          <h2 className="text-lg font-semibold mb-2">Duration & Limits</h2>
          <p className="text-xs text-gray-500 mb-3">
            Control when this offer is active and how many times it can be used.
          </p>
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="start-date" className="text-sm font-medium">
            Start Date
          </label>
          <input
            type="date"
            id="start-date"
            value={data.startDate || ""}
            onChange={(e) => handleData("startDate", e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-black w-full"
            required
            min={getToday()}
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="end-date" className="text-sm font-medium">
            End Date
          </label>
          <input
            type="date"
            id="end-date"
            value={data.endDate || ""}
            onChange={(e) => handleData("endDate", e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-black w-full"
            required
            min={getTomorrow()}
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="usage-limit" className="text-sm font-medium">
            Usage Limit per Customer
          </label>
          <input
            type="number"
            id="usage-limit"
            value={data.usageLimit || ""}
            onChange={(e) => handleNumber("usageLimit", e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-black w-full"
            min={0}
          />
          <span className="text-[11px] text-gray-500">
            0 or empty means unlimited per customer.
          </span>
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="global-limit" className="text-sm font-medium">
            Global Usage Limit
          </label>
          <input
            type="number"
            id="global-limit"
            value={data.globalLimit || ""}
            onChange={(e) => handleNumber("globalLimit", e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-black w-full"
            min={0}
          />
          <span className="text-[11px] text-gray-500">
            0 or empty means unlimited overall.
          </span>
        </div>

        {/* Status & auto-apply */}
        <div className="flex flex-col gap-1">
          <label htmlFor="status" className="text-sm font-medium">
            Status
          </label>
          <select
            id="status"
            value={data.status || "Active"}
            onChange={(e) => handleData("status", e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-black w-full"
          >
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
            <option value="Expired">Expired</option>
          </select>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium">Auto apply at checkout</label>
          <div className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              id="auto-apply"
              checked={data.autoApply}
              onChange={(e) => handleData("autoApply", e.target.checked)}
              className="h-4 w-4"
            />
            <label htmlFor="auto-apply" className="text-gray-700">
              Automatically apply this offer when cart meets conditions.
            </label>
          </div>
        </div>

        {/* Banner Upload */}
        <div className="flex flex-col gap-1 col-span-1 sm:col-span-2 mt-4">
          <h2 className="text-lg font-semibold mb-2">Marketing Banner</h2>
          <p className="text-xs text-gray-500 mb-3">
            Optional image to show on offer listings or homepage banners.
          </p>

          {preview && (
            <div className="mb-3">
              <Image
                src={preview}
                alt="Offer Banner Preview"
                width={320}
                height={120}
                className="rounded-lg border shadow-md object-cover w-full max-w-md"
              />
            </div>
          )}

          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-black w-full bg-white"
          />
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 col-span-1 sm:col-span-2 mt-4">
          <button
            type="submit"
            disabled={loading || authLoading || role !== "shop"}
            className="bg-[#FBBF24] px-6 py-2 rounded-lg hover:bg-[#F97316] hover:text-white disabled:opacity-50 w-full sm:w-auto font-medium"
            title={role !== "shop" ? "Shop access required" : undefined}
          >
            {loading || authLoading
              ? id
                ? "Updating..."
                : "Creating..."
              : id
              ? "Update Offer"
              : "Create Offer"}
          </button>

          <button
            type="button"
            disabled={loading}
            onClick={() => router.push("/shop/offers")}
            className="bg-gray-300 px-6 py-2 rounded-lg hover:bg-gray-400 hover:text-white disabled:opacity-50 w-full sm:w-auto font-medium"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
