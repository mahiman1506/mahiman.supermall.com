"use client"

import { useEffect, useState } from "react"
import { collection, onSnapshot, doc, getDoc } from "firebase/firestore"
import { db } from "../firebase"

export function useOffer() {
    const [data, setData] = useState(null)
    const [error, setError] = useState(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const ref = collection(db, "offers")

        const unsubscribe = onSnapshot(
            ref,
            (snapshot) => {
                if (snapshot.empty) {
                    setData(null)
                } else {
                    setData(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })))
                }
                setIsLoading(false)
            },
            (err) => {
                setError(err.message)
                setIsLoading(false)
            }
        )

        return () => unsubscribe()
    }, [])

    return { data, error, isLoading }
}

// Client helper to fetch a single offer by id
export async function getOfferById(id) {
    if (!id) return null;
    try {
        const ref = doc(db, "offers", id);
        const snap = await getDoc(ref);
        if (!snap.exists()) return null;
        return { id: snap.id, ...snap.data() };
    } catch (err) {
        console.error("Error fetching offer by id:", err);
        throw err;
    }
}
