// "use client"

// import Link from "next/link";
// import UserHeader from "./components/Header";
// import { Building2Icon, LogInIcon, SearchIcon, ShoppingBagIcon, StoreIcon, TagIcon, UserPlus2Icon } from "lucide-react";
// import { useCategory } from "@/lib/firestore/categories/read";
// import { useOffer } from "@/lib/firestore/offers/read";
// import Image from "next/image";
// import { useAuth } from "@/contexts/AuthContext";
// import { useRouter } from "next/navigation";

// export default function Home() {
//   const { data: category } = useCategory();
//   const { data: offer } = useOffer();
//   const { user, loading: authLoading } = useAuth();
//   const router = useRouter();

//   return (
//     <div className="min-h-screen flex flex-col bg-slate-900 text-white">
//       {/* Header */}
//       <UserHeader />

//       {/* Hero Section */}
//       <section className="relative bg-gradient-to-r from-indigo-600 to-blue-700 py-24 text-center">
//         <div className="max-w-3xl mx-auto px-4">
//           <h2 className="text-4xl font-bold mb-4">Welcome to Super Mall</h2>
//           <p className="text-lg text-gray-200 mb-8">
//             Discover your favorite stores, exclusive offers, and premium brands — all in one digital mall.
//           </p>
//           <button
//             className="bg-yellow-400 text-slate-900 px-6 py-3 rounded-full font-semibold hover:bg-yellow-300 transition"
//           >
//             Start Shopping
//           </button>
//         </div>
//       </section>

//       {authLoading ? (
//         <div className="flex-1 flex justify-center items-center">
//           <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
//         </div>
//       ) : !user ? (
//         <section className="flex-1 flex flex-col items-center justify-center py-16 text-center px-4">
//           <h2 className="text-3xl font-bold mb-6">Please Login to Access Super Mall</h2>
//           <p className="text-gray-300 mb-8 max-w-md">
//             Login to explore our categories, exclusive offers, and start shopping at Super Mall
//           </p>
//           <div className="space-x-4">
//             <button
//               onClick={() => router.push('/login')}
//               className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
//             >
//               Login
//             </button>
//             <button
//               onClick={() => router.push('/signup')}
//               className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors"
//             >
//               Sign Up
//             </button>
//           </div>
//         </section>
//       ) : (
//         <>
//           {/* Quick Categories */}
//           <section className="py-16 max-w-6xl mx-auto px-6">
//             <h3 className="text-2xl font-semibold text-center mb-10">Browse Categories</h3>
//             <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
//               {category && category.length > 0 ? (
//                 category.map((cat) => (
//                   <div key={cat.id} className="flex flex-col items-center">
//                     <img src={cat.categoryImageURL} alt={cat.categoryImageURL || "No image"} className="h-24 object-cover rounded-lg mb-2" />
//                     <h4 className="font-semibold text-white">{cat.name}</h4>
//                   </div>
//                 ))
//               ) : (
//                 <p className="text-gray-400 col-span-full text-center">No categories available.</p>
//               )}
//             </div>
//           </section>

//           {/* Offers Section */}
//           <section className="py-16 bg-slate-800">
//             <div className="max-w-6xl mx-auto px-6 text-center">
//               <h3 className="text-2xl font-semibold mb-10">Exclusive Offers</h3>
//               <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
//                 {offer && offer.length > 0 ? (
//                   offer.map((off) => (
//                     <div
//                       key={off.id}
//                       className="bg-slate-700 rounded-xl shadow hover:shadow-yellow-400/30 p-6 transition"
//                     >
//                       <div className="flex items-center justify-center h-40 w-full mb-4">
//                         <img
//                           src={off.bannerImageURL || "/window.svg"}
//                           alt={off.name || "Offer"}
//                           className="object-cover rounded-lg h-full"
//                         />
//                       </div>

//                       <h4 className="font-medium text-white mb-2">{off.name}</h4>
//                       <p className="text-gray-300 text-sm">{off.description}</p>
//                     </div>
//                   ))
//                 ) : (
//                   <p className="text-gray-400 col-span-full text-center">No offers available.</p>
//                 )}
//               </div>
//             </div>
//           </section>
//         </>
//       )}

//       {/* Footer */}
//       <footer className="bg-slate-900 text-gray-400 py-8 border-t border-slate-800 text-center">
//         <p>© {new Date().getFullYear()} Super Mall — All rights reserved.</p>
//       </footer>
//     </div>
//   );
// }

"use client";

import Link from "next/link";
import UserHeader from "./components/Header";
import { useCategory } from "@/lib/firestore/categories/read";
import { useOffer } from "@/lib/firestore/offers/read";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { getProducts } from "@/lib/firestore/products/read_server";
import { useEffect, useState } from "react";

export default function Home() {
  const { data: category } = useCategory();
  const { data: offer } = useOffer();
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [loadingCategory, setLoadingCategory] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await getProducts();
        setProducts(res || []);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoadingProducts(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gray-100 text-black dark:bg-slate-900 dark:text-white transition-all duration-300">
      {/* Header */}
      <UserHeader />

      {/* Hero Section */}
      <section className="relative py-24 text-center bg-gradient-to-r from-indigo-500 to-blue-600 dark:from-indigo-700 dark:to-blue-900 transition-all duration-300">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-4xl text-gray-100 font-bold mb-4">
            Welcome to Super Mall
          </h2>
          <p className="text-lg text-gray-300 dark:text-gray-200 mb-8">
            Discover your favorite stores, exclusive offers, and premium brands
            — all in one digital mall.
          </p>
          <button className="bg-yellow-400 text-slate-900 px-6 py-3 rounded-full font-semibold hover:bg-yellow-300 transition">
            Start Shopping
          </button>
        </div>
      </section>

      {/* Auth Check */}
      {authLoading ? (
        <div className="flex-1 flex justify-center items-center">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : !user ? (
        <section className="flex-1 flex flex-col items-center justify-center py-16 text-center px-4">
          <h2 className="text-3xl font-bold mb-6">
            Please Login to Access Super Mall
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-8 max-w-md">
            Login to explore our categories, exclusive offers, and start
            shopping at Super Mall
          </p>
          <div className="space-x-4">
            <button
              onClick={() => router.push("/login")}
              className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
            >
              Login
            </button>
            <button
              onClick={() => router.push("/signup")}
              className="bg-gray-300 dark:bg-gray-700 text-black dark:text-white px-6 py-2 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-600 transition-colors"
            >
              Sign Up
            </button>
          </div>
        </section>
      ) : (
        <>
          {/* Categories */}
          <section className="py-16 max-w-6xl mx-auto px-6">
            {/* LOADING OVERLAY */}
            {loadingCategory && (
              <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}

            <h3 className="text-2xl font-semibold text-center mb-10">
              Browse Categories
            </h3>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {category && category.length > 0 ? (
                category.map((cat) => (
                  <Link
                    href={`/category/${cat.id}`}
                    key={cat.id}
                    onClick={() => setLoadingCategory(true)} // 🔥 show loading
                  >
                    <div className="flex flex-col items-center cursor-pointer">
                      <img
                        src={cat.categoryImageURL}
                        alt={cat.name}
                        className="h-24 object-cover rounded-lg mb-2 shadow dark:shadow-none"
                      />
                      <h4 className="font-semibold">{cat.name}</h4>
                    </div>
                  </Link>
                ))
              ) : (
                <p className="text-gray-500 dark:text-gray-400 col-span-full text-center">
                  No categories available.
                </p>
              )}
            </div>
          </section>

          {/* =========================== */}
          {/* ⭐ Featured Products Section */}
          {/* =========================== */}
          <section className="py-16 bg-white dark:bg-slate-800 transition-all duration-300">
            <div className="max-w-6xl mx-auto px-6 text-center">
              <h3 className="text-2xl font-semibold mb-10">
                Featured Products
              </h3>

              {loadingProducts ? (
                <div className="flex justify-center py-10">
                  <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : products && products.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                  {products
                    .filter((p) => p.status?.toLowerCase() !== "inactive")
                    .slice(0, 8)
                    .map((product) => {
                      const status = product.status?.toLowerCase() || "";

                      let badgeStyle =
                        "bg-blue-500/20 text-blue-600 border border-blue-500/40";

                      if (status === "active")
                        badgeStyle =
                          "bg-green-500/20 text-green-700 border border-green-500/40";

                      if (status === "out_of_stock")
                        badgeStyle =
                          "bg-red-500/20 text-red-700 border border-red-500/40";

                      if (status === "draft")
                        badgeStyle =
                          "bg-gray-400/20 text-gray-700 border border-gray-400/40";

                      return (
                        <div
                          key={product.id}
                          className="relative bg-gray-50 dark:bg-slate-700 rounded-xl shadow hover:shadow-lg transition transform hover:-translate-y-1 overflow-hidden"
                        >
                          <div className="flex items-center justify-center pt-4">
                            <img
                              src={product.mainImageURL || "/placeholder.png"}
                              alt={product.name}
                              className="h-20 object-cover"
                            />
                          </div>

                          <div className="p-4 text-left">
                            {/* ⭐ Name + Badge in one row */}
                            <div className="flex items-center justify-between">
                              <h4 className="font-semibold text-base truncate max-w-[60%]">
                                {product.name}
                              </h4>

                              {product.status && (
                                <span
                                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                                    product.stock > 0
                                      ? "bg-green-100 text-green-600 dark:bg-green-800 dark:text-green-200"
                                      : "bg-red-100 text-red-600 dark:bg-red-800 dark:text-red-200"
                                  }`}
                                >
                                  {product.stock > 0
                                    ? "In Stock"
                                    : "Out of Stock"}
                                </span>
                              )}
                            </div>

                            <p className="text-sm text-gray-500 dark:text-gray-300 mt-1">
                              ₹ {product.price?.toLocaleString() || "N/A"}
                            </p>

                            <Link
                              href={`/product/${product.id}`}
                              className="mt-3 w-full block bg-indigo-500 hover:bg-indigo-600 text-white text-sm py-2 rounded-lg transition text-center"
                            >
                              View Details
                            </Link>
                          </div>
                        </div>
                      );
                    })}
                </div>
              ) : (
                <p className="text-gray-500 dark:text-gray-300 col-span-full text-center">
                  No products available.
                </p>
              )}
            </div>
          </section>

          {/* Offers */}
          <section className="py-16 bg-gray-200 dark:bg-slate-800 transition-all duration-300">
            <div className="max-w-6xl mx-auto px-6 text-center">
              <h3 className="text-2xl font-semibold mb-10">Exclusive Offers</h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {offer && offer.length > 0 ? (
                  offer
                    .filter((o) => o.status?.toLowerCase() !== "inactive") // ⛔ hide inactive
                    .map((off) => {
                      const status = off.status?.toLowerCase() || "";

                      let badgeStyle =
                        "bg-blue-500/20 text-blue-600 border border-blue-500/40"; // default

                      if (status === "active")
                        badgeStyle =
                          "bg-green-500/20 text-green-700 border border-green-500/40";

                      if (status === "expired")
                        badgeStyle =
                          "bg-red-500/20 text-red-700 border border-red-500/40";

                      if (status === "draft")
                        badgeStyle =
                          "bg-gray-400/20 text-gray-700 border border-gray-400/40";

                      return (
                        <div
                          key={off.id}
                          className="relative bg-white dark:bg-slate-700 rounded-xl shadow-lg dark:shadow-gray-900/20 p-6 transition"
                        >
                          {/* ⭐ Bigger Status Badge */}
                          {off.status && (
                            <span
                              className={`absolute top-3 right-3 text-sm font-bold px-3 py-1.5 rounded-full shadow-md backdrop-blur ${badgeStyle}`}
                            >
                              {off.status.replace("-", " ").toUpperCase()}
                            </span>
                          )}

                          <div className="flex items-center justify-center h-40 w-full mb-4">
                            <img
                              src={off.bannerImageURL || "/window.svg"}
                              alt={off.name}
                              className="object-cover rounded-lg h-full"
                            />
                          </div>

                          <h4 className="font-medium">{off.name}</h4>
                          <p className="text-gray-600 dark:text-gray-300 text-sm">
                            {off.description}
                          </p>
                        </div>
                      );
                    })
                ) : (
                  <p className="text-gray-500 dark:text-gray-300 col-span-full text-center">
                    No offers available.
                  </p>
                )}
              </div>
            </div>
          </section>
        </>
      )}

      {/* Footer */}
      <footer className="bg-gray-200 dark:bg-slate-900 text-gray-600 dark:text-gray-400 py-8 border-t border-gray-300 dark:border-slate-800 text-center transition-all duration-300">
        <p>© {new Date().getFullYear()} Super Mall — All rights reserved.</p>
      </footer>
    </div>
  );
}
