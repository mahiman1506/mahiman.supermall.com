"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Loader2, ShoppingBag } from "lucide-react";
import { db } from "@/lib/firestore/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import Link from "next/link";

export default function OrderDetailsPage() {
  const { orderId } = useParams();
  const router = useRouter();

  const [order, setOrder] = useState(null);
  const [shopId, setShopId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  useEffect(() => {
    if (!orderId) return;

    const fetchOrder = async () => {
      try {
        const ref = doc(db, "orders", orderId);
        const snap = await getDoc(ref);

        if (snap.exists()) {
          const data = snap.data();
          setOrder(data);

          const extractedShopId =
            // data?.meta?.shopId ||
            // data?.meta?.shopID ||
            // data?.meta?.shopid ||
            // (data.items?.length > 0 ? data.shopId : null);
            data?.shopId;

          setShopId(extractedShopId);
        } else {
          setOrder(null);
        }
      } catch (err) {
        console.error("Error loading order:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  async function handleStatusChange(newStatus) {
    if (!order) return;

    setUpdatingStatus(true);

    try {
      await updateDoc(doc(db, "orders", orderId), {
        status: newStatus,
        updatedAt: new Date(),
      });

      setOrder((prev) => ({
        ...prev,
        status: newStatus,
      }));
    } catch (err) {
      console.log("Failed to update status", err);
    }

    setUpdatingStatus(false);
  }

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <Loader2 className="h-10 w-10 animate-spin text-gray-500" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center">
        <ShoppingBag className="text-gray-400 w-16 h-16 mb-4" />
        <h2 className="text-xl font-semibold">Order Not Found</h2>
        <p className="text-gray-500 mt-2">
          The order you are looking for doesn’t exist.
        </p>

        <button
          onClick={() => router.back()}
          className="mt-5 px-4 py-2 bg-blue-600 text-white rounded-md"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-5">
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => router.back()}
          className="p-2 rounded-full bg-gray-100 hover:bg-gray-200"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-2xl font-semibold">Order #{orderId}</h1>
      </div>

      {/* Shop Info */}
      <div className="bg-white p-4 rounded-xl shadow mb-6">
        <h2 className="text-lg font-semibold mb-2">Shop Information</h2>
        <p>
          <strong>Shop ID:</strong> {shopId ? shopId : "Not available"}
        </p>
      </div>

      {/* Status */}
      <div className="bg-white p-5 rounded-xl shadow mb-6">
        <h2 className="text-lg font-semibold mb-2">Order Status</h2>

        <div className="flex items-center gap-3 mb-3">
          <span
            className={`px-4 py-1 rounded-full text-sm font-medium
    ${
      order.status === "pending"
        ? "bg-yellow-100 text-yellow-700"
        : order.status === "confirmed"
        ? "bg-blue-100 text-blue-700"
        : order.status === "processing"
        ? "bg-purple-100 text-purple-700"
        : order.status === "on-the-way"
        ? "bg-orange-100 text-orange-700"
        : order.status === "delivered"
        ? "bg-teal-100 text-teal-700"
        : order.status === "completed"
        ? "bg-sky-100 text-sky-700"
        : order.status === "cancelled"
        ? "bg-red-100 text-red-700"
        : "bg-gray-100 text-gray-700"
    }`}
          >
            {order.status}
          </span>
        </div>

        <select
          className="border rounded-md p-2"
          value={order.status}
          onChange={(e) => handleStatusChange(e.target.value)}
          disabled={updatingStatus}
        >
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="processing">Processing</option>
          <option value="on-the-way">On The Way</option>
          <option value="delivered">Delivered</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>

        {updatingStatus && (
          <p className="text-sm text-gray-500 mt-2">Updating...</p>
        )}
      </div>

      {/* Customer */}
      <div className="bg-white p-5 rounded-xl shadow mb-6">
        <h2 className="text-lg font-semibold mb-3">Customer Information</h2>
        <p>
          <strong>Name:</strong> {order.customer?.fullName}
        </p>
        <p>
          <strong>Phone:</strong> {order.customer?.phone}
        </p>
        <p>
          <strong>Address:</strong> {order.customer?.fullAddress}
        </p>
      </div>

      {/* Items */}
      <div className="bg-white p-5 rounded-xl shadow mb-6">
        <h2 className="text-lg font-semibold mb-3">Items</h2>
        <div className="divide-y">
          {order.items?.map((item, i) => (
            <div key={i} className="py-3 flex justify-between">
              <div>
                <p className="font-medium">{item.name}</p>
                <p className="text-sm text-gray-500">
                  Qty: {item.quantity} × ₹{item.price}
                </p>
              </div>
              <div className="font-semibold">₹{item.quantity * item.price}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Payment */}
      <div className="bg-white p-5 rounded-xl shadow mb-6">
        <h2 className="text-lg font-semibold mb-3">Payment Summary</h2>

        <div className="flex justify-between text-base mt-1">
          <span>Delivery:</span>
          <span>₹{order.deliveryCharge}</span>
        </div>

        <hr className="my-3" />

        <div className="flex justify-between text-xl font-bold">
          <span>Total:</span>
          <span>₹{order.totalAmount}</span>
        </div>

        <p className="text-sm text-gray-500 mt-3">
          Payment Method: <b>{order.paymentMethod}</b>
        </p>
      </div>

      <div className="flex gap-3">
        <Link
          href="/shop/orders"
          className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
        >
          Back to Orders
        </Link>
      </div>
    </div>
  );
}
