import { db } from "@/lib/firestore/firebase";
import {
  collection,
  deleteDoc,
  doc,
  setDoc,
  updateDoc,
} from "firebase/firestore";

/**
 * createNewProduct
 * @param {Object} param
 * @param {Object} param.data  - product data (must include shopId)
 */
export async function createNewProduct({ data }) {
  if (!data) throw new Error("No product data provided");
  if (!data.shopId) throw new Error("shopId is required for product creation");

  const collRef = collection(db, "products"); // ⭐ Correct collection
  const newDocRef = doc(collRef);
  const ts = Date.now();

  const payload = {
    ...data,
    id: newDocRef.id,
    createdAt: ts,
    updatedAt: ts,
  };

  // ⭐ Ensure shopId is always stored
  if (!payload.shopId) {
    throw new Error("Product missing shopId");
  }

  await setDoc(newDocRef, payload);
  return payload;
}

/**
 * UpdateProduct
 * @param {Object} param
 * @param {Object} param.data - product data (must include id + shopId)
 */
export async function UpdateProduct({ data }) {
  if (!data || !data.id) throw new Error("No product id provided for update");

  if (!data.shopId) throw new Error("Product update missing shopId");

  const docRef = doc(db, "products", data.id);
  const updatedAt = Date.now();

  // Do not overwrite createdAt
  const { id, createdAt, ...rest } = data;

  const payload = {
    ...rest,
    updatedAt,
    shopId: data.shopId, // ⭐ Force preserve shopId
  };

  await updateDoc(docRef, payload);

  return { id: data.id, ...payload };
}

export const deleteProduct = async ({ id }) => {
  if (!id) throw new Error("Product ID is required.");

  try {
    const productRef = doc(db, "products", id);
    await deleteDoc(productRef);
    return true;
  } catch (error) {
    console.error("Error deleting product:", error);
    throw new Error(error.message || "Failed to delete product.");
  }
};
