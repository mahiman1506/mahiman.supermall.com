import { collection, getDoc } from "firebase/firestore"
import { db } from "../firebase"

export const getShop = async () => {
    const snapshot = await getDoc(collection(db, "shop"));

    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};