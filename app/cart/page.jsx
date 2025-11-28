"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Minus, Plus, Trash2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { db } from "@/lib/firestore/firebase";
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { useRouter } from "next/navigation";

/* compute discount */
function computeDiscountForOffer(cart, offer) {
  if (!offer) return 0;
  if (offer.status !== "Active") return 0;

  const now = new Date();
  if (offer.startDate && new Date(offer.startDate) > now) return 0;
  if (offer.endDate && new Date(offer.endDate) < now) return 0;

  const subtotal = cart.reduce((a, b) => a + b.price * (b.quantity || 1), 0);

  let discount = 0;

  if (offer.type === "flat") discount = Number(offer.discountValue);

  if (offer.type === "percentage") {
    discount = (subtotal * Number(offer.discountValue)) / 100;

    if (offer.maxDiscount) {
      discount = Math.min(discount, Number(offer.maxDiscount));
    }
  }

  return Math.max(0, discount);
}

/* Validations */
async function validateOfferForCart(user, cartItems, offer) {
  if (!offer) return { ok: false, reason: "Offer not found" };

  const now = new Date();

  if (offer.status !== "Active") return { ok: false, reason: "Offer inactive" };

  if (offer.startDate && new Date(offer.startDate) > now)
    return { ok: false, reason: "Offer not started" };

  if (offer.endDate && new Date(offer.endDate) < now)
    return { ok: false, reason: "Offer expired" };

  if (offer.usageLimit) {
    const usageRef = doc(db, "users", user.uid, "offerUsage", offer.id);
    const usageSnap = await getDoc(usageRef);

    const used = usageSnap.exists() ? usageSnap.data().count || 0 : 0;

    if (used >= Number(offer.usageLimit)) {
      return {
        ok: false,
        reason: "Offer usage limit reached",
      };
    }
  }

  const discount = computeDiscountForOffer(cartItems, offer);

  if (discount <= 0) return { ok: false, reason: "Offer gives no discount" };

  return { ok: true, discount };
}

export default function CartPage() {
  const { user } = useAuth();
  const router = useRouter();

  const [cart, setCart] = useState([]);
  const [offers, setOffers] = useState([]);

  const [appliedOffer, setAppliedOffer] = useState(null);

  const [bestOffer, setBestOffer] = useState(null);

  const [offerInput, setOfferInput] = useState("");
  const [offerError, setOfferError] = useState("");

  const [loading, setLoading] = useState(true);
  const [checking, setChecking] = useState(false);

  // Load cart + offers
  useEffect(() => {
    if (!user) return;

    (async () => {
      const c = await getDocs(collection(db, "users", user.uid, "cart"));
      setCart(c.docs.map((d) => ({ id: d.id, ...d.data() })));

      const o = await getDocs(
        query(collection(db, "offers"), where("status", "==", "Active"))
      );

      const offerList = o.docs.map((d) => ({ id: d.id, ...d.data() }));
      setOffers(offerList);

      setLoading(false);
    })();
  }, [user]);

  // BEST OFFER FINDER
  useEffect(() => {
    let best = null;
    let saving = 0;

    offers.forEach((o) => {
      const d = computeDiscountForOffer(cart, o);
      if (d > saving) {
        saving = d;
        best = o;
      }
    });

    setBestOffer(best);
  }, [cart, offers]);

  /* REMOVE ITEM */
  const removeItem = async (id) => {
    await deleteDoc(doc(db, "users", user.uid, "cart", id));
    setCart(cart.filter((c) => c.id !== id));
  };

  /* UPDATE QTY */
  const updateQty = async (id, type) => {
    const item = cart.find((x) => x.id === id);
    if (!item) return;

    const qty =
      type === "inc" ? item.quantity + 1 : Math.max(1, item.quantity - 1);

    await updateDoc(doc(db, "users", user.uid, "cart", id), { quantity: qty });

    setCart(cart.map((x) => (x.id === id ? { ...x, quantity: qty } : x)));
  };

  /* MANUAL APPLY */
  const applyOffer = async () => {
    if (!offerInput.trim()) return;

    try {
      setChecking(true);
      setOfferError("");

      const qOffer = query(
        collection(db, "offers"),
        where("offerCode", "==", offerInput.trim().toUpperCase())
      );

      const snap = await getDocs(qOffer);

      if (snap.empty) {
        setOfferError("Invalid offer code");
        return;
      }

      const offerData = {
        id: snap.docs[0].id,
        ...snap.docs[0].data(),
      };

      const res = await validateOfferForCart(user, cart, offerData);

      if (!res.ok) {
        setOfferError(res.reason);
        return;
      }

      setAppliedOffer(offerData);
    } finally {
      setChecking(false);
    }
  };

  // totals
  const subtotal = cart.reduce((a, b) => a + b.price * (b.quantity || 1), 0);

  const discount = appliedOffer
    ? computeDiscountForOffer(cart, appliedOffer)
    : 0;

  const deliveryCharge = subtotal > 50000 ? 0 : 40;

  const total = subtotal - discount + deliveryCharge;

  // Save pending checkout
  const proceed = async () => {
    await setDoc(
      doc(db, "users", user.uid, "checkout", "pending"),
      {
        items: cart,
        itemsSubtotal: subtotal,
        discount,
        deliveryCharge,
        total,
        offerId: appliedOffer?.id || "",
        offerCode: appliedOffer?.offerCode || "",
      },
      { merge: true }
    );

    router.push("/payment_page");
  };

  if (loading) return "Loading...";

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto bg-white p-6 rounded-xl shadow">
        <div className="flex items-center gap-2 mb-6">
          <Link href="/">
            <ArrowLeft />
          </Link>
          <h2 className="text-xl font-semibold">Your Cart</h2>
        </div>

        {cart.length === 0 ? (
          <p className="text-center py-12 text-gray-500">Cart Empty</p>
        ) : (
          <div className="grid grid-cols-3 gap-6">
            {/* LEFT */}
            <div className="col-span-2 space-y-4">
              {cart.map((i) => (
                <div
                  key={i.id}
                  className="bg-gray-50 border rounded-lg p-4 flex justify-between items-center"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={i.image}
                      className="w-20 h-20 rounded-lg border"
                    />
                    <div>
                      <h3 className="font-semibold">{i.name}</h3>
                      <p>₹{i.price}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      className="bg-gray-200  rounded p-1"
                      onClick={() => updateQty(i.id, "dec")}
                    >
                      <Minus size={15} />
                    </button>

                    <span>{i.quantity}</span>

                    <button
                      className="bg-gray-200  rounded p-1"
                      onClick={() => updateQty(i.id, "inc")}
                    >
                      <Plus size={15} />
                    </button>
                  </div>

                  <button
                    className="text-red-600"
                    onClick={() => removeItem(i.id)}
                  >
                    <Trash2 />
                  </button>
                </div>
              ))}
            </div>

            {/* RIGHT */}
            <div className="bg-gray-50 border p-5 rounded-xl h-fit">
              {/* OFFER SUGGEST */}
              {bestOffer && !appliedOffer && (
                <div className="bg-green-50 p-2 rounded border text-sm">
                  Best Offer: {bestOffer.offerCode}
                  Save ₹{computeDiscountForOffer(cart, bestOffer)}
                  <button
                    className="ml-2 underline text-green-700"
                    onClick={() => {
                      setAppliedOffer(bestOffer);
                      setOfferInput(bestOffer.offerCode);
                    }}
                  >
                    Apply
                  </button>
                </div>
              )}

              {/* manual input */}
              <input
                className="border rounded w-full mt-3 p-2"
                placeholder="Offer Code"
                value={offerInput}
                onChange={(e) => setOfferInput(e.target.value.toUpperCase())}
              />

              <button
                onClick={applyOffer}
                className="w-full bg-green-600 text-white rounded py-2 mt-2"
                disabled={checking}
              >
                {checking ? "Checking..." : "Apply"}
              </button>

              {offerError && (
                <p className="text-red-600 text-xs">{offerError}</p>
              )}

              {/* summary */}
              <div className="border-t mt-4 pt-4 space-y-1">
                <p className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>₹{subtotal}</span>
                </p>

                {discount > 0 && (
                  <p className="flex justify-between text-green-700">
                    <span>Discount:</span>
                    <span>-₹{discount}</span>
                  </p>
                )}

                <p className="flex justify-between">
                  <span>Delivery:</span>
                  <span>
                    {deliveryCharge === 0 ? "FREE" : `₹${deliveryCharge}`}
                  </span>
                </p>

                <p className="flex justify-between text-lg font-bold">
                  <span>Total:</span>
                  <span>₹{total}</span>
                </p>
              </div>

              <button
                className="w-full bg-black text-white rounded py-3 mt-5"
                onClick={proceed}
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
