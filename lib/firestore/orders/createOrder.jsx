import { db } from "@/lib/firestore/firebase";
import { doc, runTransaction, serverTimestamp } from "firebase/firestore";

export async function createOrder({
  userId,
  items,
  total,
  customer,
  shopId,
  meta,
}) {
  return await runTransaction(db, async (transaction) => {
    // 1) VALIDATE USER
    const userRef = doc(db, "users", userId);
    const userSnap = await transaction.get(userRef);

    if (!userSnap.exists()) {
      throw new Error("User does not exist.");
    }

    const role = userSnap.data()?.role;
    if (role === "admin" || role === "shop") {
      throw new Error("Admin or shop account cannot place order.");
    }

    // 2) PRE-READ ALL PRODUCTS FIRST
    const productSnapshots = [];

    for (const item of items) {
      const productRef = doc(db, "products", item.id);
      const snap = await transaction.get(productRef);

      if (!snap.exists()) {
        throw new Error(`Product "${item.name}" not found.`);
      }

      productSnapshots.push({ ref: productRef, snap, item });
    }

    // Auto-detect shopId from first product if not provided
    let finalShopId = shopId || null;

    if (!finalShopId && productSnapshots.length > 0) {
      finalShopId = productSnapshots[0].snap.data().shopId || null;
    }

    // 3) VALIDATE STOCK FIRST (NO WRITES YET)
    for (const { snap, item } of productSnapshots) {
      const currentStock = Number(snap.data().stock || 0);
      const qty = Number(item.quantity || 1);

      if (currentStock - qty < 0) {
        throw new Error(`Insufficient stock for "${item.name}".`);
      }
    }

    // 4) WRITE STOCK UPDATES LAST
    for (const { ref, snap, item } of productSnapshots) {
      const qty = Number(item.quantity || 1);
      const currentStock = Number(snap.data().stock || 0);
      transaction.update(ref, { stock: currentStock - qty });
    }

    // 5) BUILD ORDER
    const orderRef = doc(db, "orders", crypto.randomUUID());

    const orderData = {
      userId,
      shopId: finalShopId,
      items,
      totalAmount: Number(total) || 0,
      createdAt: serverTimestamp(),
      status: "pending",

      paymentMethod: meta.paymentMethod || "",
      deliveryCharge: meta.deliveryCharge ?? 0,
      itemsSubtotal: meta.itemsSubtotal ?? 0,
      discount: meta.discount ?? 0,

      customer: {
        fullName: customer?.fullName ?? "",
        phone: customer?.phone ?? "",
        email: customer?.email ?? "",
        fullAddress: customer?.fullAddress ?? "",
      },

      uploadedFilePath: meta.uploadedFilePath || null,

      meta,
    };

    // 6) WRITE ORDER LAST
    transaction.set(orderRef, orderData);

    return orderRef.id;
  });
}
