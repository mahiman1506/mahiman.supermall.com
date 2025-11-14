import { db } from "@/lib/firestore/firebase";
import { collection, getDocs } from "firebase/firestore";

export const getAllUsers = async () => {
    try {
        const ref = collection(db, "users");
        const snapshot = await getDocs(ref);

        return snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
        }));
    } catch (err) {
        console.error("Error fetching all users:", err);
        return [];
    }
};
