"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firestore/firebase";
import { ArrowLeftCircleIcon } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export default function Page() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuth();

  const [product, setProduct] = useState(null);
  const [categoryName, setCategoryName] = useState("");
  const [loading, setLoading] = useState(true);

  // POPUP STATE
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    if (!id) return;

    const fetchProduct = async () => {
      try {
        const docRef = doc(db, "product", id);
        const snap = await getDoc(docRef);

        if (snap.exists()) {
          const data = snap.data();
          setProduct(data);

          if (data.category) {
            const catRef = doc(db, "categories", data.category);
            const catSnap = await getDoc(catRef);

            setCategoryName(
              catSnap.exists() ? catSnap.data().name : "Unknown Category"
            );
          }
        }
      } catch (error) {
        console.error("Product Fetch Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  // determine availability
  const isOutOfStock = product ? product.stock <= 0 : false;
  const isDraft = product ? product.status === "draft" : false;
  const isDisabled = isOutOfStock || isDraft;

  // ADD TO CART
  const handleAddToCart = async () => {
    if (!product) return;

    if (isDisabled) {
      if (isDraft)
        return alert("This product is not available for sale (Draft).");
      if (isOutOfStock) return alert("This product is currently out of stock.");
      return;
    }

    if (!user) {
      alert("Please login to add items to cart.");
      return;
    }

    const cartRef = doc(db, "users", user.uid, "cart", id);

    try {
      const cartSnap = await getDoc(cartRef);

      if (cartSnap.exists()) {
        await updateDoc(cartRef, {
          quantity: cartSnap.data().quantity + 1,
        });
      } else {
        await setDoc(cartRef, {
          name: product.name,
          price: product.price,
          image: product.mainImageURL,
          quantity: 1,
        });
      }

      // Show popup instead of alert
      setShowPopup(true);
    } catch (error) {
      console.error("Add to Cart Error:", error);
      alert("Something went wrong!");
    }
  };

  const handleBuyNow = () => {
    if (!product) return;

    if (isDisabled) {
      if (isDraft)
        return alert("This product is not available for purchase (Draft).");
      if (isOutOfStock) return alert("This product is currently out of stock.");
      return;
    }

    router.push(`/checkout?productId=${id}`);
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );

  if (!product)
    return (
      <h1 className="text-center text-2xl py-20 font-semibold text-red-500">
        Product Not Found
      </h1>
    );

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-slate-900 p-6 flex flex-col items-center">
      {/* ---------------------------------------------------------------- */}
      {/* POPUP MODAL */}
      {/* ---------------------------------------------------------------- */}
      {showPopup && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={() => setShowPopup(false)}
        >
          <div
            className="bg-white dark:bg-slate-800 rounded-xl shadow-xl p-6 w-80 text-center animate-fadeIn"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-semibold text-green-600 dark:text-green-400">
              Added to Cart 🛒
            </h2>
            <p className="mt-2 text-gray-600 dark:text-gray-300">
              Your item has been successfully added.
            </p>

            <button
              onClick={() => router.push("/cart")}
              className="w-full mt-5 bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg transition shadow"
            >
              Go to Cart
            </button>

            <button
              onClick={() => setShowPopup(false)}
              className="w-full mt-3 bg-gray-200 dark:bg-slate-700 dark:text-white py-2 rounded-lg hover:bg-gray-300 dark:hover:bg-slate-600 transition"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      )}
      {/* ---------------------------------------------------------------- */}

      <div className="max-w-5xl w-full bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 md:p-10 flex flex-col md:flex-row gap-10 transition-all">
        {/* LEFT */}
        <div className="md:w-1/2">
          <div className="w-full h-80 bg-gray-200 dark:bg-slate-700 rounded-xl overflow-hidden shadow">
            <img
              src={product.mainImageURL}
              alt={product.name}
              className="w-full h-full object-cover hover:scale-105 transition duration-300"
            />
          </div>

          {product.images?.length > 0 && (
            <div className="flex gap-3 mt-4 flex-wrap">
              {product.images.map((img, index) => (
                <img
                  key={index}
                  src={img}
                  alt={`image-${index}`}
                  className="w-20 h-20 rounded-lg object-cover shadow hover:scale-110 transition"
                />
              ))}
            </div>
          )}
        </div>

        {/* RIGHT */}
        <div className="md:w-1/2 space-y-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold">{product.name}</h1>
              <p className="text-2xl font-semibold text-indigo-600 dark:text-indigo-400">
                ₹ {product.price}
              </p>
            </div>

            <div className="text-right space-y-2">
              <span className="inline-block bg-indigo-100 dark:bg-indigo-700 text-indigo-700 dark:text-indigo-300 text-sm px-3 py-1 rounded-full shadow">
                {categoryName}
              </span>

              {isDraft && (
                <div className="mt-2 inline-block bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-200 text-sm px-3 py-1 rounded-full shadow">
                  Draft
                </div>
              )}

              {isOutOfStock && !isDraft && (
                <div className="mt-2 inline-block bg-red-100 text-red-700 dark:bg-red-800 dark:text-red-200 text-sm px-3 py-1 rounded-full shadow">
                  Out of Stock
                </div>
              )}
            </div>
          </div>

          <p>
            <strong>Stock:</strong>{" "}
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                product.stock > 0
                  ? "bg-green-100 text-green-600 dark:bg-green-800 dark:text-green-200"
                  : "bg-red-100 text-red-600 dark:bg-red-800 dark:text-red-200"
              }`}
            >
              {product.stock > 0 ? "In Stock" : "Out of Stock"}
            </span>
          </p>

          <p>
            <strong>SKU:</strong> {product.sku}
          </p>
          <p>
            <strong>Brand:</strong> {product.brand}
          </p>

          <p>
            <strong>Description:</strong>
            <br />
            <span>{product.description}</span>
          </p>

          {/* ACTION BUTTONS */}
          <div className="mt-6 flex gap-4">
            <button
              onClick={handleAddToCart}
              disabled={isDisabled}
              aria-disabled={isDisabled}
              className={`flex-1 py-3 rounded-lg shadow-lg transition text-white ${
                isDisabled
                  ? "bg-indigo-600 opacity-60 cursor-not-allowed"
                  : "bg-indigo-600 hover:bg-indigo-700"
              }`}
            >
              Add to Cart
            </button>

            <button
              onClick={handleBuyNow}
              disabled={isDisabled}
              aria-disabled={isDisabled}
              className={`flex-1 py-3 rounded-lg transition shadow ${
                isDisabled
                  ? "bg-gray-200 dark:bg-slate-700 text-black dark:text-white opacity-60 cursor-not-allowed"
                  : "bg-gray-200 dark:bg-slate-700 hover:bg-gray-300 dark:hover:bg-slate-600 text-black dark:text-white"
              }`}
            >
              Buy Now
            </button>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center mt-10">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 bg-black dark:bg-white dark:text-black text-white px-4 py-2 rounded-2xl shadow hover:opacity-80 transition"
        >
          <ArrowLeftCircleIcon className="w-5 h-5" /> Go Back
        </button>
      </div>
    </div>
  );
}
