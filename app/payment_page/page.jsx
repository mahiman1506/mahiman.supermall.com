"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { db } from "@/lib/firestore/firebase";
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";

export default function CheckoutPage() {
  const router = useRouter();
  const { user } = useAuth();

  const [cart, setCart] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [showPopup, setShowPopup] = useState(false);

  // Billing fields
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [fullAddress, setFullAddress] = useState("");

  // --------------------------------------------------
  // Fetch Cart Items
  // --------------------------------------------------
  const fetchCart = async () => {
    if (!user) return;

    const cartRef = collection(db, "users", user.uid, "cart");
    const snap = await getDocs(cartRef);

    const items = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    setCart(items);
  };

  useEffect(() => {
    fetchCart();
  }, [user]);

  // --------------------------------------------------
  // Price Calculations
  // --------------------------------------------------
  const itemsTotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const deliveryCharge = itemsTotal > 0 ? 40 : 0;
  const total = itemsTotal + deliveryCharge;

  // --------------------------------------------------
  // SAVE ORDER TO FIRESTORE
  // --------------------------------------------------
  const saveOrder = async () => {
    const orderId = Date.now().toString(); // unique order id

    await setDoc(doc(db, "orders", orderId), {
      orderId: orderId,
      userId: user.uid,
      paymentMethod: paymentMethod,
      total: total,
      deliveryCharge: deliveryCharge,
      itemsTotal: itemsTotal,
      createdAt: serverTimestamp(),

      // Billing details
      address: {
        fullName,
        phone,
        email,
        fullAddress,
      },

      // Cart items
      items: cart,
    });
  };

  // --------------------------------------------------
  // Clear Cart After Payment
  // --------------------------------------------------
  const clearCart = async () => {
    if (!user) return;

    const cartRef = collection(db, "users", user.uid, "cart");
    const snap = await getDocs(cartRef);

    const deletePromises = snap.docs.map((d) =>
      deleteDoc(doc(db, "users", user.uid, "cart", d.id))
    );

    await Promise.all(deletePromises);
  };

  // --------------------------------------------------
  // Handle Payment
  // --------------------------------------------------
  const handlePayNow = async () => {
    if (cart.length === 0) {
      alert("Your cart is empty.");
      return;
    }

    if (!fullName || !phone || !email || !fullAddress) {
      alert("Please fill all billing details.");
      return;
    }

    // 1️⃣ Save order to Firestore
    await saveOrder();

    // 2️⃣ Clear cart
    await clearCart();

    // 3️⃣ Show success popup
    setShowPopup(true);

    // 4️⃣ Redirect
    setTimeout(() => {
      setShowPopup(false);
      router.push("/");
    }, 2000);
  };

  // --------------------------------------------------
  // If not logged in
  // --------------------------------------------------
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center text-xl text-gray-700">
        Please login to checkout.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      {/* POPUP */}
      {showPopup && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-80 text-center animate-fadeIn">
            <h2 className="text-xl font-semibold text-green-600">
              Payment Successful 🎉
            </h2>
            <p className="mt-2 text-gray-600">Redirecting to home...</p>
          </div>
        </div>
      )}

      <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-lg p-6 md:p-10">
        {/* Back */}
        <Link
          href="/cart"
          className="inline-flex items-center gap-2 text-gray-700 hover:text-black transition mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="text-sm font-medium">Back to Cart</span>
        </Link>

        <h2 className="text-2xl md:text-3xl font-semibold mb-8">Checkout</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* LEFT SECTION */}
          <div className="md:col-span-2 space-y-8">
            {/* Billing Details */}
            <div className="bg-gray-50 p-5 rounded-xl border">
              <h3 className="text-xl font-semibold mb-5">Billing Details</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Full Name"
                  className="border p-3 rounded-lg w-full"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
                <input
                  type="text"
                  placeholder="Phone Number"
                  className="border p-3 rounded-lg w-full"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>

              <input
                type="email"
                placeholder="Email Address"
                className="border p-3 rounded-lg w-full mt-4"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <textarea
                rows="3"
                placeholder="Full Address"
                className="border p-3 rounded-lg w-full mt-4"
                value={fullAddress}
                onChange={(e) => setFullAddress(e.target.value)}
              />
            </div>

            {/* Payment Method */}
            <div className="bg-gray-50 p-5 rounded-xl border">
              <h3 className="text-xl font-semibold mb-5">Payment Method</h3>

              <div className="space-y-4">
                <label className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === "card"}
                    onChange={() => setPaymentMethod("card")}
                  />
                  <span>Credit / Debit Card</span>
                </label>

                <label className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === "cod"}
                    onChange={() => setPaymentMethod("cod")}
                  />
                  <span>Cash on Delivery</span>
                </label>

                <label className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === "upi"}
                    onChange={() => setPaymentMethod("upi")}
                  />
                  <span>UPI / Wallet</span>
                </label>
              </div>
            </div>
          </div>

          {/* RIGHT SECTION */}
          <div className="bg-gray-50 p-5 rounded-xl border h-fit">
            <h3 className="text-xl font-semibold mb-5">Order Summary</h3>

            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Items Total:</span>
                <span>₹{itemsTotal}</span>
              </div>

              <div className="flex justify-between">
                <span>Delivery Charge:</span>
                <span>₹{deliveryCharge}</span>
              </div>

              <div className="flex justify-between font-semibold text-lg border-t pt-3">
                <span>Total:</span>
                <span>₹{total}</span>
              </div>
            </div>

            {/* PAY NOW */}
            <button
              onClick={handlePayNow}
              className="w-full mt-6 bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition"
            >
              Pay Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
