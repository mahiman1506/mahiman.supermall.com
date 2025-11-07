import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";

export const getOffer = async () => {
    const snapshot = await getDocs(collection(db, "offers"));
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}