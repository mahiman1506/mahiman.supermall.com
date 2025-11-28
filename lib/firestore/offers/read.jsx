"use client";

import { useEffect, useState } from "react";
import { collection, onSnapshot, doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";

export function useOffer() {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const ref = collection(db, "offers");

    const unsubscribe = onSnapshot(
      ref,
      (snapshot) => {
        if (snapshot.empty) {
          setData([]);
        } else {
          setData(
            snapshot.docs.map((doc) => {
              const d = doc.data();
              return {
                id: doc.id,
                ...d,
                totalUsed: d.totalUsed ?? 0,
                totalDiscountGiven: d.totalDiscountGiven ?? 0,
                usageLimit: d.usageLimit ?? 0,
              };
            })
          );
        }
        setIsLoading(false);
      },
      (err) => {
        setError(err.message);
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  return { data, error, isLoading };
}

// 🔹 Single Offer by ID
export async function getOfferById(id) {
  if (!id) return null;
  try {
    const ref = doc(db, "offers", id);
    const snap = await getDoc(ref);
    if (!snap.exists()) return null;
    const d = snap.data();
    return {
      id: snap.id,
      ...d,
      totalUsed: d.totalUsed ?? 0,
      totalDiscountGiven: d.totalDiscountGiven ?? 0,
      usageLimit: d.usageLimit ?? 0,
    };
  } catch (err) {
    console.error("Error fetching offer by id:", err);
    throw err;
  }
}
