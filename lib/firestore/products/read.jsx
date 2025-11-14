// "use client"

// import { useEffect, useState } from "react"
// import { collection, onSnapshot } from "firebase/firestore"
// import { db } from "../firebase"

// export function useProduct() {
//     const [data, setData] = useState(null)
//     const [error, setError] = useState(null)
//     const [isLoading, setIsLoading] = useState(true)

//     useEffect(() => {
//         const ref = collection(db, "product")

//         const unsubscribe = onSnapshot(
//             ref,
//             (snapshot) => {
//                 if (snapshot.empty) {
//                     setData(null)
//                 } else {
//                     setData(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })))
//                 }
//                 setIsLoading(false)
//             },
//             (err) => {
//                 setError(err.message)
//                 setIsLoading(false)
//             }
//         )

//         return () => unsubscribe()
//     }, [])

//     return { data, error, isLoading }
// }

"use client"

import { useEffect, useState } from "react"
// import { collection, onSnapshot } from "firebase/firestore"
import { db } from "../firebase"
import { collection, onSnapshot } from "firebase/firestore"


export function useProduct() {
    const [data, setData] = useState([])          // ✅ default should be array
    const [error, setError] = useState(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const ref = collection(db, "product")

        const unsubscribe = onSnapshot(
            ref,
            (snapshot) => {
                const items = snapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data()
                }))

                setData(items)                   // ✅ empty array instead of null
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
