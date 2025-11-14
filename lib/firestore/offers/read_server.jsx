import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";

export const getOffer = async () => {
    const snapshot = await getDocs(collection(db, "offers"));
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const getAllOffers = async () => {
    try {
        const ref = collection(db, "offers");
        const snapshot = await getDocs(ref);

        return snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
        }));
    } catch (err) {
        console.error("Error fetching all offers:", err);
        return [];
    }
};