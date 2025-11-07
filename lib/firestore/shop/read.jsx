"use client"

import { useEffect, useState } from "react"
import { collection, onSnapshot } from "firebase/firestore"
import { db } from "../firebase"

export function useShop() {
    const [data, setData] = useState(null)
    const [error, setError] = useState(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const ref = collection(db, "shop")

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