import { db } from "@/lib/firestore/firebase";
import { doc, getDoc, getDocs, collection, setDoc } from "firebase/firestore";

/** ------------------------------------------
 * Applies offer ONCE to existing checkout data
 *
 * 1) loads pending checkout
 * 2) loads offer by offerCode
 * 3) validates
 * 4) calculates discount
 * 5) updates checkout/pending
 * ------------------------------------------ */
export async function applyOfferToPendingCheckout(userId, offerCode) {
  if (!userId) throw new Error("User missing");
  if (!offerCode) throw new Error("Offer code missing");

  const userCheckoutRef = doc(db, "users", userId, "checkout", "pending");
  const snap = await getDoc(userCheckoutRef);

  if (!snap.exists()) {
    throw new Error("Checkout session missing");
  }

  const data = snap.data();
  const items = data.items || [];
  const subtotal = data.itemsSubtotal || 0;

  if (!items.length) {
    throw new Error("Cart is empty");
  }

  // load offer
  const offerRef = collection(db, "offers");
  const offerSnap = await getDocs(
    offerRef
    // firebase web SDK v9 doesn't accept filters directly here
  );

  const offers = offerSnap.docs.map((d) => ({ id: d.id, ...d.data() }));

  const offer = offers.find(
    (o) => o.offerCode?.toUpperCase() === offerCode.toUpperCase()
  );

  if (!offer) throw new Error("Invalid offer");

  // ---- VALIDATE ----
  if (offer.status !== "Active") throw new Error("Offer inactive");

  if (offer.startDate && new Date(offer.startDate) > new Date())
    throw new Error("Offer not started yet");

  if (offer.endDate && new Date(offer.endDate) < new Date())
    throw new Error("Offer expired");

  // usage limit per user
  if (offer.usageLimit) {
    const usageRef = doc(db, "users", userId, "offerUsage", offer.id);
    const usageSnap = await getDoc(usageRef);

    const used = usageSnap.exists() ? usageSnap.data()?.count || 0 : 0;

    if (used >= offer.usageLimit) {
      throw new Error("You already used this offer limit");
    }
  }

  // ----- compute discount -----
  let discount = 0;

  if (offer.type === "percentage") {
    discount = (subtotal * Number(offer.discountValue)) / 100;
    if (offer.maxDiscount) {
      discount = Math.min(discount, Number(offer.maxDiscount));
    }
  }

  if (offer.type === "flat") {
    discount = Number(offer.discountValue || 0);
  }

  if (discount < 0) discount = 0;

  if (discount <= 0) {
    throw new Error("Offer gives zero discount");
  }

  // update totals
  const newTotal = Math.max(0, subtotal - discount + data.deliveryCharge);

  // SAVE TO DB
  await setDoc(
    userCheckoutRef,
    {
      discount,
      offerId: offer.id,
      offerCode,
      total: newTotal,
    },
    { merge: true }
  );

  return { discount, total: newTotal, offerId: offer.id };
}
