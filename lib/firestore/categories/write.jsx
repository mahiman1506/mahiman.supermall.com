import { getAuth } from "firebase/auth";
import { getFirestore, collection, addDoc, updateDoc, deleteDoc, doc, serverTimestamp } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "@/lib/firestore/firebase";

const db = getFirestore();

/** 🔹 CREATE NEW CATEGORY **/
export const createNewCategory = async ({ data, categoryImage, bannerImage }) => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) throw new Error("Authentication required: please log in to create a category.");
    if (!data?.name) throw new Error("Category name is required.");
    if (!categoryImage) throw new Error("Category image is required.");

    try {
        // ✅ Upload category image
        const categoryImageRef = ref(storage, `categories/${Date.now()}_${categoryImage.name}`);
        await uploadBytes(categoryImageRef, categoryImage);
        const categoryImageURL = await getDownloadURL(categoryImageRef);

        // ✅ Upload banner image if provided
        let bannerImageURL = "";
        if (bannerImage) {
            const bannerImageRef = ref(storage, `categories/${Date.now()}_${bannerImage.name}`);
            await uploadBytes(bannerImageRef, bannerImage);
            bannerImageURL = await getDownloadURL(bannerImageRef);
        }

        // ✅ Prepare Firestore payload
        const payload = {
            ...data,
            categoryImageURL,
            bannerImageURL,
            createdAt: serverTimestamp(),
            createdBy: user.uid,
        };

        // ✅ Add category to Firestore
        const docRef = await addDoc(collection(db, "categories"), payload);
        return docRef.id;
    } catch (error) {
        console.error("Error creating category:", error);
        throw new Error(error.message || "Failed to create category");
    }
};


/** 🔹 UPDATE CATEGORY **/
export const UpdateCategory = async ({ data, categoryImage, bannerImage }) => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) throw new Error("Authentication required: please log in to update a category.");
    if (!data?.id) throw new Error("Category ID is required.");
    if (!data?.name) throw new Error("Category name is required.");

    const id = data.id;
    const categoryRef = doc(db, "categories", id);

    try {
        let categoryImageURL = data.categoryImageURL || "";
        let bannerImageURL = data.bannerImageURL || "";

        // ✅ Upload new category image if provided
        if (categoryImage) {
            const categoryImageRef = ref(storage, `categories/${id}/feature_${categoryImage.name}`);
            await uploadBytes(categoryImageRef, categoryImage);
            categoryImageURL = await getDownloadURL(categoryImageRef);
        }

        // ✅ Upload new banner image if provided
        if (bannerImage) {
            const bannerImageRef = ref(storage, `categories/${id}/banner_${bannerImage.name}`);
            await uploadBytes(bannerImageRef, bannerImage);
            bannerImageURL = await getDownloadURL(bannerImageRef);
        }

        // ✅ Prepare updated payload
        const payload = {
            ...data,
            categoryImageURL,
            bannerImageURL,
            updatedAt: serverTimestamp(),
        };

        // ✅ Update Firestore document
        await updateDoc(categoryRef, payload);
        return true;
    } catch (error) {
        console.error("Error updating category:", error);
        throw new Error(error.message || "Failed to update category");
    }
};


/** 🔹 DELETE CATEGORY **/
export const deleteCategory = async ({ id }) => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) throw new Error("Authentication required: please log in to delete a category.");
    if (!id) throw new Error("Category ID is required.");

    try {
        await deleteDoc(doc(db, "categories", id));
        return true;
    } catch (error) {
        console.error("Error deleting category:", error);
        throw new Error(error.message || "Failed to delete category");
    }
};
