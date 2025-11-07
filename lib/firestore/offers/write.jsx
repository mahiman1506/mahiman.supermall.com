import { getAuth } from "firebase/auth";
import { getFirestore, collection, addDoc, updateDoc, deleteDoc, doc, serverTimestamp } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "@/lib/firestore/firebase";

const db = getFirestore();

/** 🔹 CREATE NEW OFFER **/
export const createNewOffer = async ({
    data,
    bannerImage,
    bannerImageURL,
    applicableShops,
    applicableCategories,
    applicableFloors,
}) => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) throw new Error("Authentication required: please log in to create an offer.");
    if (!data?.name) throw new Error("Offer name is required");
    if (!bannerImage && !bannerImageURL) throw new Error("Banner image is required");

    try {
        let finalBannerImageURL = bannerImageURL || "";

        // ✅ Upload banner image if provided
        if (bannerImage) {
            const imageRef = ref(storage, `offers/${Date.now()}_${bannerImage.name}`);
            await uploadBytes(imageRef, bannerImage);
            finalBannerImageURL = await getDownloadURL(imageRef);
        }

        // ✅ Prepare payload
        const payload = {
            ...data,
            bannerImageURL: finalBannerImageURL,
            applicableShops: applicableShops || [],
            applicableCategories: applicableCategories || [],
            applicableFloors: applicableFloors || [],
            createdAt: serverTimestamp(),
            createdBy: user.uid,
        };

        // ✅ Add to Firestore
        const docRef = await addDoc(collection(db, "offers"), payload);
        return docRef.id;
    } catch (error) {
        console.error("Error creating offer:", error);
        throw new Error(error.message || "Failed to create offer");
    }
};


/** 🔹 UPDATE EXISTING OFFER **/
export const UpdateOffer = async ({
    data,
    bannerImage,
    bannerImageURL,
    applicableShops,
    applicableCategories,
    applicableFloors,
}) => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) throw new Error("Authentication required: please log in to update an offer.");
    if (!data?.id) throw new Error("Offer ID is required for update.");
    if (!data?.name) throw new Error("Offer name is required.");

    const id = data.id;
    const offerRef = doc(db, "offers", id);

    try {
        let finalBannerImageURL = data.bannerImageURL || "";

        // ✅ If a new image is uploaded, replace it
        if (bannerImage) {
            const imageRef = ref(storage, `offers/${id}/banner_${bannerImage.name}`);
            await uploadBytes(imageRef, bannerImage);
            finalBannerImageURL = await getDownloadURL(imageRef);
        } else if (bannerImageURL) {
            finalBannerImageURL = bannerImageURL;
        }

        // ✅ Prepare updated data
        const payload = {
            ...data,
            bannerImageURL: finalBannerImageURL,
            applicableShops: applicableShops || [],
            applicableCategories: applicableCategories || [],
            applicableFloors: applicableFloors || [],
            updatedAt: serverTimestamp(),
        };

        // ✅ Update Firestore document
        await updateDoc(offerRef, payload);

        return true;
    } catch (error) {
        console.error("Error updating offer:", error);
        throw new Error(error.message || "Failed to update offer");
    }
};


/** 🔹 DELETE OFFER **/
export const deleteOffer = async ({ id }) => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) throw new Error("Authentication required: please log in to delete an offer.");
    if (!id) throw new Error("Offer ID is required to delete.");

    try {
        await deleteDoc(doc(db, "offers", id));
        return true;
    } catch (error) {
        console.error("Error deleting offer:", error);
        throw new Error(error.message || "Failed to delete offer");
    }
};
