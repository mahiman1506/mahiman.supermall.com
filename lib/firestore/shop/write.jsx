import { getAuth } from "firebase/auth";
import { getFirestore, doc, setDoc, updateDoc, addDoc, deleteDoc, collection, serverTimestamp } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "@/lib/firestore/firebase";

const db = getFirestore();

/** CREATE NEW SHOP **/
export const createNewShop = async ({ data, logo, images, bannerImage }) => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) throw new Error("Authentication required: please log in to create a shop.");
    if (!data?.name) throw new Error("Name is required");
    if (!logo) throw new Error("Logo is required");
    if (!images || images.length === 0) throw new Error("At least one image is required");
    if (!bannerImage) throw new Error("Banner image is required");

    try {
        // ✅ Upload logo
        const logoRef = ref(storage, `shop/${Date.now()}_${logo.name}`);
        await uploadBytes(logoRef, logo);
        const logoURL = await getDownloadURL(logoRef);

        // ✅ Upload banner image
        const bannerImageRef = ref(storage, `shop/${Date.now()}_${bannerImage.name}`);
        await uploadBytes(bannerImageRef, bannerImage);
        const bannerImageURL = await getDownloadURL(bannerImageRef);

        // ✅ Upload gallery images
        const imagesURL = [];
        for (let i = 0; i < images.length; i++) {
            const image = images[i];
            const imageRef = ref(storage, `shop/${Date.now()}_${image.name}`);
            await uploadBytes(imageRef, image);
            const url = await getDownloadURL(imageRef);
            imagesURL.push(url);
        }

        // ✅ Create Firestore document
        const payload = {
            ...data,
            logoURL,
            bannerImageURL,
            images: imagesURL,
            createdAt: serverTimestamp(),
            createdBy: user.uid,
        };

        const docRef = await addDoc(collection(db, "shop"), payload);
        return docRef.id;
    } catch (error) {
        console.error("Error creating shop:", error);
        throw new Error(error.message || "Failed to create shop");
    }
};


/** UPDATE EXISTING SHOP **/
export const UpdateShop = async ({ data, logo, images, bannerImage }) => {
    if (!data?.id) throw new Error("Shop ID is required for update.");
    if (!data?.name) throw new Error("Shop name is required.");

    const id = data.id;
    const shopRef = doc(db, "shop", id);

    try {
        let logoURL = data.logoURL || "";
        let bannerImageURL = data.bannerImageURL || "";
        let imagesURL = data.images || [];

        // ✅ Upload new logo (if provided)
        if (logo) {
            const logoRef = ref(storage, `shop/${id}/logo_${logo.name}`);
            await uploadBytes(logoRef, logo);
            logoURL = await getDownloadURL(logoRef);
        }

        // ✅ Upload new banner (if provided)
        if (bannerImage) {
            const bannerRef = ref(storage, `shop/${id}/banner_${bannerImage.name}`);
            await uploadBytes(bannerRef, bannerImage);
            bannerImageURL = await getDownloadURL(bannerRef);
        }

        // ✅ Upload new gallery images (if provided)
        if (images && images.length > 0) {
            imagesURL = [];
            for (let i = 0; i < images.length; i++) {
                const image = images[i];
                const imageRef = ref(storage, `shop/${id}/gallery_${image.name}`);
                await uploadBytes(imageRef, image);
                const url = await getDownloadURL(imageRef);
                imagesURL.push(url);
            }
        }

        // ✅ Update Firestore document
        await updateDoc(shopRef, {
            ...data,
            logoURL,
            bannerImageURL,
            images: imagesURL,
            updatedAt: serverTimestamp(),
        });

        return true;
    } catch (error) {
        console.error("Error updating shop:", error);
        throw new Error(error.message || "Failed to update shop");
    }
};


/** DELETE SHOP **/
export const deleteShop = async ({ id }) => {
    if (!id) throw new Error("Shop ID is required to delete.");

    try {
        const shopRef = doc(db, "shop", id);
        await deleteDoc(shopRef);
        return true;
    } catch (error) {
        console.error("Error deleting shop:", error);
        throw new Error(error.message || "Failed to delete shop");
    }
};
