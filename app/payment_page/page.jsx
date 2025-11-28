"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { db } from "@/lib/firestore/firebase";
import QRCode from "qrcode";
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  increment,
} from "firebase/firestore";

import { createOrder } from "@/lib/firestore/orders/createOrder";

const uploadedFilePath = "/mnt/data/0422dea7-746c-4049-9be8-48746550876c.png";

export default function CheckoutPage() {
  const router = useRouter();
  const { user } = useAuth();

  const [cart, setCart] = useState([]);
  const [checkoutData, setCheckoutData] = useState(null);
  const [loadingInitial, setLoadingInitial] = useState(true);

  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [qrCodeURL, setQrCodeURL] = useState("");

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [fullAddress, setFullAddress] = useState("");

  // Card (we will NOT store CVV for security)
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCVV, setCardCVV] = useState("");

  const [upiId, setUpiId] = useState("");

  const [role, setRole] = useState(null);
  const [loadingPay, setLoadingPay] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  const isBlockedRole = role === "admin" || role === "shop";

  // --- Debounce save to firestore ---
  const saveTimeoutRef = useRef(null);
  const isMountedRef = useRef(false);

  // Fetch user role
  useEffect(() => {
    if (!user) return;
    getDoc(doc(db, "users", user.uid)).then((snap) => {
      if (snap.exists()) {
        setRole(snap.data().role || null);
      }
    });
  }, [user]);

  // Fetch cart + checkout session
  useEffect(() => {
    if (!user) return;

    const load = async () => {
      setLoadingInitial(true);

      const cartSnap = await getDocs(collection(db, "users", user.uid, "cart"));
      const items = cartSnap.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      }));
      setCart(items);

      const pendingSnap = await getDoc(
        doc(db, "users", user.uid, "checkout", "pending")
      );

      if (pendingSnap.exists()) {
        const pending = pendingSnap.data();
        // hydrate local form state with pending values
        setCheckoutData(pending);
        setFullName(pending.fullName || "");
        setPhone(pending.phone || "");
        setEmail(pending.email || "");
        setFullAddress(pending.fullAddress || "");
        setPaymentMethod(pending.paymentMethod || "cod");
        setUpiId(pending.upiId || "");
        // only store last4 + expiry for card (avoid storing CVV)
        setCardNumber(
          pending.cardLast4 ? `**** **** **** ${pending.cardLast4}` : ""
        );
        setCardExpiry(pending.cardExpiry || "");
      } else {
        setCheckoutData(null);
      }

      setLoadingInitial(false);
    };

    load();
  }, [user]);

  // Fallback values
  const itemsSubtotal = checkoutData?.itemsSubtotal ?? 0;
  const discount = checkoutData?.discount ?? 0;
  const deliveryCharge = checkoutData?.deliveryCharge ?? 0;
  const total =
    checkoutData?.total ?? itemsSubtotal - discount + deliveryCharge;

  const offerId = checkoutData?.offerId || "";
  const offerCode = checkoutData?.offerCode || "";

  // Generate UPI QR
  useEffect(() => {
    if (paymentMethod !== "upi") return;
    if (!total || total <= 0) return;

    const upiLink = `upi://pay?pa=9104880776@fam&pn=Super Mall&am=${total}&cu=INR`;

    QRCode.toDataURL(upiLink).then(setQrCodeURL);
  }, [paymentMethod, total]);

  // Save pending checkout to firestore (debounced)
  const savePendingCheckout = async (overrides = {}) => {
    if (!user) return;
    const docRef = doc(db, "users", user.uid, "checkout", "pending");

    // compute cardLast4 safely
    const cardLast4 = (cardNumber || "").replace(/\s+/g, "").slice(-4);

    const payload = {
      fullName: fullName || "",
      phone: phone || "",
      email: email || "",
      fullAddress: fullAddress || "",
      paymentMethod,
      upiId: paymentMethod === "upi" ? upiId || "" : "",
      // DO NOT store CVV
      cardLast4: paymentMethod === "card" && cardLast4 ? cardLast4 : "",
      cardExpiry: paymentMethod === "card" ? cardExpiry || "" : "",
      items: cart || [],
      itemsSubtotal,
      discount,
      deliveryCharge,
      total,
      offerId: offerId || "",
      offerCode: offerCode || "",
      uploadedFilePath,
      updatedAt: new Date().toISOString(),
      ...overrides,
    };

    try {
      await setDoc(docRef, payload, { merge: true });
      setCheckoutData((prev) => ({ ...(prev || {}), ...payload }));
    } catch (e) {
      console.error("Failed to save pending checkout:", e);
    }
  };

  // Debounce effect: when form or payment changes, save
  useEffect(() => {
    if (!user) return;
    // avoid saving on initial mount if data was loaded from firestore
    if (!isMountedRef.current) {
      isMountedRef.current = true;
      return;
    }

    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    saveTimeoutRef.current = setTimeout(() => {
      savePendingCheckout();
    }, 600);

    return () => clearTimeout(saveTimeoutRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    fullName,
    phone,
    email,
    fullAddress,
    paymentMethod,
    upiId,
    cardNumber,
    cardExpiry,
    cart,
    total,
  ]);

  // Clear cart
  const clearCart = async () => {
    const snap = await getDocs(collection(db, "users", user.uid, "cart"));
    await Promise.all(snap.docs.map((d) => deleteDoc(d.ref)));
  };

  // Clear checkout session
  const clearPendingCheckout = async () => {
    await deleteDoc(doc(db, "users", user.uid, "checkout", "pending")).catch(
      () => {}
    );
  };

  // Place order
  const placeOrder = async () => {
    const items = checkoutData?.items || cart || [];

    // create order meta - include payment-safe fields
    const meta = {
      paymentMethod,
      deliveryCharge,
      itemsSubtotal,
      discount,
      offerCode,
      uploadedFilePath,
      upiId: paymentMethod === "upi" ? upiId || "" : "",
      cardLast4:
        paymentMethod === "card"
          ? (cardNumber || "").replace(/\s+/g, "").slice(-4)
          : "",
      cardExpiry: paymentMethod === "card" ? cardExpiry || "" : "",
    };

    const order = await createOrder({
      userId: user.uid,
      items,
      total,
      shopId: items[0]?.shopId || null,
      meta,
      customer: {
        fullName: fullName.trim(),
        phone: phone.trim(),
        email: email.trim(),
        fullAddress: fullAddress.trim(),
      },
    });

    if (offerId) {
      const offerRef = doc(db, "offers", offerId);

      // 🔹 step 1: increment usage + discount
      await updateDoc(offerRef, {
        totalUsed: increment(1),
        totalDiscountGiven: increment(discount),
      });

      // 🔹 step 2: read offer again (global values)
      const snap = await getDoc(offerRef);

      const used = snap.data()?.totalUsed || 0;
      const limit = snap.data()?.globalLimit || 0;

      // 🔹 step 3: if reached => disable globally
      if (limit > 0 && used >= limit) {
        await updateDoc(offerRef, {
          status: "Inactive",
        });
      }
    }

    return order;
  };

  const handlePayNow = async () => {
    if (!fullName || !phone || !email || !fullAddress)
      return alert("Fill all details");

    if (!cart.length) return alert("Cart empty");

    setLoadingPay(true);

    try {
      // ensure latest pending snapshot is saved before placing order
      await savePendingCheckout({ savingForOrder: true });

      await placeOrder();
      await clearCart();
      await clearPendingCheckout();

      setShowPopup(true);

      setTimeout(() => {
        router.push("/");
      }, 1500);
    } catch (e) {
      alert(e.message || "Failed to place order");
    } finally {
      setLoadingPay(false);
    }
  };

  if (!checkoutData && loadingInitial)
    return (
      <div className="min-h-screen flex flex-col justify-center items-center">
        <p>Loading...</p>
      </div>
    );

  if (!checkoutData)
    return (
      <div className="min-h-screen flex flex-col justify-center items-center">
        <p>No checkout session.</p>
        <Link href="/cart">Go back</Link>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* success popup */}
      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40">
          <div className="bg-white px-6 py-4 rounded-xl text-center">
            <p className="text-green-600 font-semibold text-xl">
              Order Successful
            </p>
          </div>
        </div>
      )}

      <div className="max-w-5xl mx-auto bg-white rounded-xl p-8 shadow">
        <Link
          href="/cart"
          className="flex items-center gap-1 mb-4 text-gray-700"
        >
          <ArrowLeft size={18} />
          Back
        </Link>

        <h2 className="text-2xl font-semibold mb-6">Checkout</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* LEFT */}
          <div className="md:col-span-2 space-y-8">
            {/* BILLING */}
            <div className="bg-gray-50 rounded-lg p-4 border">
              <h3 className="font-semibold text-lg mb-4">Billing Details</h3>

              <input
                placeholder="Full Name"
                className="border p-2 rounded w-full mb-3"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />

              <input
                placeholder="Phone"
                className="border p-2 rounded w-full mb-3"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />

              <input
                placeholder="Email"
                className="border p-2 rounded w-full mb-3"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <textarea
                placeholder="Full Address"
                className="border p-2 rounded w-full"
                rows={3}
                value={fullAddress}
                onChange={(e) => setFullAddress(e.target.value)}
              />
            </div>

            {/* PAYMENT */}
            <div className="bg-gray-50 rounded-lg p-4 border">
              <h3 className="font-semibold text-lg mb-4">Payment Method</h3>

              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  checked={paymentMethod === "cod"}
                  onChange={() => setPaymentMethod("cod")}
                />
                Cash On Delivery
              </label>

              <label className="flex items-center gap-2 mt-3">
                <input
                  type="radio"
                  checked={paymentMethod === "card"}
                  onChange={() => setPaymentMethod("card")}
                />
                Card
              </label>

              {paymentMethod === "card" && (
                <div className="p-3 bg-white border rounded-md mt-2">
                  <input
                    placeholder="Card Number"
                    className="border rounded p-2 w-full mb-2"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                  />

                  <input
                    placeholder="MM/YY"
                    className="border rounded p-2 w-full mb-2"
                    value={cardExpiry}
                    onChange={(e) => setCardExpiry(e.target.value)}
                  />

                  <input
                    placeholder="CVV"
                    className="border rounded p-2 w-full"
                    value={cardCVV}
                    onChange={(e) => setCardCVV(e.target.value)}
                  />

                  <p className="text-xs text-gray-500 mt-2">
                    We do NOT store CVV. Only card last 4 digits and expiry are
                    saved for convenience.
                  </p>
                </div>
              )}

              <label className="flex items-center gap-2 mt-3">
                <input
                  type="radio"
                  checked={paymentMethod === "upi"}
                  onChange={() => setPaymentMethod("upi")}
                />
                UPI
              </label>

              {paymentMethod === "upi" && (
                <div className="p-3 bg-white border rounded-md mt-2 text-center">
                  <input
                    placeholder="Enter UPI ID"
                    className="border rounded p-2 w-full"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                  />

                  {qrCodeURL && (
                    <img src={qrCodeURL} className="w-40 h-40 mx-auto mt-4" />
                  )}
                </div>
              )}
            </div>
          </div>

          {/* RIGHT */}
          <div className="bg-gray-50 rounded-lg p-4 border h-fit">
            <h3 className="font-semibold text-lg mb-4">Order Summary</h3>

            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>₹{itemsSubtotal}</span>
              </div>

              {discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount:</span>
                  <span>-₹{discount}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>Delivery:</span>
                <span>
                  {deliveryCharge === 0 ? "FREE" : `₹${deliveryCharge}`}
                </span>
              </div>

              <div className="border-t pt-2 flex justify-between font-semibold text-lg">
                <span>Total:</span>
                <span>₹{total}</span>
              </div>
            </div>

            <button
              onClick={handlePayNow}
              disabled={loadingPay}
              className="w-full mt-5 bg-black text-white py-3 rounded-md"
            >
              {loadingPay ? "Processing..." : "Pay Now"}
            </button>

            <button
              onClick={() => savePendingCheckout()}
              disabled={!user}
              className="w-full mt-3 border border-gray-300 bg-white text-gray-700 py-2 rounded-md"
            >
              Save & Continue Later
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
