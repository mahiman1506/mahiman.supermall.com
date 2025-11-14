"use client";

import { useState } from "react";

export default function Page() {
  // Example order data (you can replace with your Firestore data later)
  const [orders, setOrders] = useState([
    {
      id: "ORD-1001",
      customer: {
        name: "Rahul Sharma",
        email: "rahul@example.com",
        phone: "+91 9876543210",
        address: "221B Baker Street, Delhi, India",
      },
      date: "2025-11-12",
      status: "Shipped",
      paymentStatus: "Paid",
      paymentMethod: "UPI",
      shipping: {
        method: "BlueDart Express",
        trackingId: "BDX123456789",
        eta: "2025-11-15",
      },
      items: [
        {
          name: "Wireless Headphones",
          sku: "WH-9087",
          qty: 2,
          price: 1499,
          image:
            "https://media.istockphoto.com/id/860853774/photo/blue-headphones-isolated-on-a-white-background.jpg?s=612x612&w=0&k=20&c=KqMSLWuM_Prrq5XHTe79bnFRU_leFDaXTuKqup5uvrE=",
        },
        {
          name: "Smartwatch",
          sku: "SW-2200",
          qty: 1,
          price: 2499,
          image:
            "https://img.freepik.com/free-photo/rendering-smart-home-device_23-2151039302.jpg?ga=GA1.1.1690931402.1759585471&semt=ais_hybrid&w=740&q=80",
        },
      ],
    },
  ]);

  return (
    <div className="w-full flex justify-center py-8">
      <div className="max-w-6xl w-full px-4">
        <h1 className="text-3xl font-bold mb-6">🛍️ Shop Orders</h1>

        {orders.map((order) => (
          <div
            key={order.id}
            className="bg-white rounded-2xl shadow-md mb-6 border border-gray-100 p-6"
          >
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 border-b pb-3">
              <h2 className="text-lg font-semibold text-gray-800">
                Order ID: {order.id}
              </h2>
              <p className="text-sm text-gray-500">Date: {order.date}</p>
            </div>

            {/* Customer Info */}
            <section className="mb-5">
              <h3 className="text-lg font-semibold mb-2">Customer Details</h3>
              <div className="grid sm:grid-cols-2 gap-2 text-sm text-gray-700">
                <p>
                  <strong>Name:</strong> {order.customer.name}
                </p>
                <p>
                  <strong>Phone:</strong> {order.customer.phone}
                </p>
                <p>
                  <strong>Email:</strong> {order.customer.email}
                </p>
                <p>
                  <strong>Address:</strong> {order.customer.address}
                </p>
              </div>
            </section>

            {/* Order Info */}
            <section className="mb-5">
              <h3 className="text-lg font-semibold mb-2">Order Summary</h3>
              <div className="grid sm:grid-cols-2 gap-2 text-sm text-gray-700">
                <p>
                  <strong>Status:</strong> {order.status}
                </p>
                <p>
                  <strong>Payment Status:</strong> {order.paymentStatus}
                </p>
                <p>
                  <strong>Payment Method:</strong> {order.paymentMethod}
                </p>
                <p>
                  <strong>Shipping:</strong> {order.shipping.method}
                </p>
                <p>
                  <strong>Tracking ID:</strong> {order.shipping.trackingId}
                </p>
                <p>
                  <strong>ETA:</strong> {order.shipping.eta}
                </p>
              </div>
            </section>

            {/* Product Items */}
            <section className="mb-5">
              <h3 className="text-lg font-semibold mb-2">Products</h3>
              <div className="divide-y border rounded-lg overflow-hidden">
                {order.items.map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-3 hover:bg-gray-50 transition"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded-md"
                      />
                      <div>
                        <p className="font-medium text-gray-800">{item.name}</p>
                        <p className="text-sm text-gray-500">SKU: {item.sku}</p>
                        <p className="text-sm text-gray-500">Qty: {item.qty}</p>
                      </div>
                    </div>
                    <p className="font-semibold text-gray-800">
                      ₹{item.price * item.qty}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {/* Actions */}
            <div className="flex flex-wrap gap-3 pt-4">
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                Update Status
              </button>
              <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition">
                Add Tracking
              </button>
              <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition">
                Print Invoice
              </button>
              <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition">
                Cancel Order
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
