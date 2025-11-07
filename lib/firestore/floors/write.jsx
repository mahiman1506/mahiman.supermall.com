import { getAuth } from "firebase/auth";
import { getFirestore, collection, addDoc, updateDoc, deleteDoc, doc, serverTimestamp } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "@/lib/firestore/firebase";

const db = getFirestore();

/** 🔹 CREATE NEW FLOOR **/
export const createNewFloor = async ({ data, floorPlanImage }) => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) throw new Error("Authentication required: please log in to create a floor.");
    if (!data?.name) throw new Error("Floor name is required.");
    if (!data?.floorNumber) throw new Error("Floor number is required.");
    if (!floorPlanImage) throw new Error("Floor plan image is required.");

    try {
        // ✅ Upload floor plan image to Firebase Storage
        const floorPlanImageRef = ref(storage, `floors/${Date.now()}_${floorPlanImage.name}`);
        await uploadBytes(floorPlanImageRef, floorPlanImage);
        const floorPlanImageURL = await getDownloadURL(floorPlanImageRef);

        // ✅ Prepare Firestore data
        const payload = {
            ...data,
            floorPlanImageURL,
            createdAt: serverTimestamp(),
            createdBy: user.uid,
        };

        // ✅ Add floor to Firestore
        const docRef = await addDoc(collection(db, "floors"), payload);
        return docRef.id;
    } catch (error) {
        console.error("Error creating floor:", error);
        throw new Error(error.message || "Failed to create floor");
    }
};


/** 🔹 UPDATE EXISTING FLOOR **/
export const UpdateFloor = async ({ data, floorPlanImage }) => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) throw new Error("Authentication required: please log in to update a floor.");
    if (!data?.id) throw new Error("Floor ID is required.");
    if (!data?.name) throw new Error("Floor name is required.");

    const id = data.id;
    const floorRef = doc(db, "floors", id);

    try {
        let floorPlanImageURL = data.floorPlanImageURL || "";

        // ✅ Upload new image if provided
        if (floorPlanImage) {
            const floorPlanImageRef = ref(storage, `floors/${id}/plan_${floorPlanImage.name}`);
            await uploadBytes(floorPlanImageRef, floorPlanImage);
            floorPlanImageURL = await getDownloadURL(floorPlanImageRef);
        }

        // ✅ Prepare updated data
        const payload = {
            ...data,
            floorPlanImageURL,
            updatedAt: serverTimestamp(),
        };

        // ✅ Update Firestore document
        await updateDoc(floorRef, payload);
        return true;
    } catch (error) {
        console.error("Error updating floor:", error);
        throw new Error(error.message || "Failed to update floor");
    }
};


/** 🔹 DELETE FLOOR **/
export const deleteFloor = async ({ id }) => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) throw new Error("Authentication required: please log in to delete a floor.");
    if (!id) throw new Error("Floor ID is required to delete.");

    try {
        await deleteDoc(doc(db, "floors", id));
        return true;
    } catch (error) {
        console.error("Error deleting floor:", error);
        throw new Error(error.message || "Failed to delete floor");
    }
};
