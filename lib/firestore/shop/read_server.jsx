import { collection, getDoc, getDocs } from "firebase/firestore"
import { db } from "../firebase"

export const getShop = async () => {
    const snapshot = await getDoc(collection(db, "shop"));

    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const getAllShops = async () => {
    try {
        const ref = collection(db, "shop");
        const snapshot = await getDocs(ref);

        return snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
        }));
    } catch (err) {
        console.error("Error fetching all shops:", err);
        return [];
    }
};
