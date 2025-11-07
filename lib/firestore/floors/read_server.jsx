import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";

export const getFloor = async () => {
    const snapshot = await getDocs(collection(db, "floors"));
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};