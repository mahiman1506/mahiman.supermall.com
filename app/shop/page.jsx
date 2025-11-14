// "use client";

// import { useEffect, useState } from "react";
// import { useAuth } from "@/contexts/AuthContext";
// import { getProducts } from "@/lib/firestore/products/read_server";
// import { getOffer } from "@/lib/firestore/offers/read_server";
// // import { getProducts } from "@/lib/firestore/shop/read";

// export default function ShopDashboard() {
//     const { user } = useAuth();

//     const [productCount, setProductCount] = useState(0);
//     const [offerCount, setOfferCount] = useState(0)
//     const [loading, setLoading] = useState(true);

//     useEffect(() => {
//         const fetchProducts = async () => {
//             try {
//                 const products = await getProducts(user?.uid);
//                 setProductCount(products.length || 0);
//             } catch (error) {
//                 console.error("Error fetching products:", error);
//             } finally {
//                 setLoading(false);
//             }
//         };

//         if (user?.uid) {
//             fetchProducts();
//         }
//     }, [user]);

//     useEffect(() => {
//         const fetchOffer = async () => {
//             try {
//                 const offers = await getOffer(user?.uid);   // FIXED
//                 setOfferCount(offers.length || 0);
//             } catch (error) {
//                 console.error("Error fetching Offers:", error);
//             } finally {
//                 setLoading(false);
//             }
//         };

//         if (user?.uid) {   // FIXED
//             fetchOffer();
//         }
//     }, [user]);

//     return (
//         <div className="w-full flex justify-center py-8">
//             <div className="max-w-7xl w-full px-6">
//                 <h1 className="text-2xl font-bold mb-6">
//                     Welcome back, {user?.displayName || "Shop Owner"}
//                 </h1>

//                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

//                     {/* Total Products */}
//                     <div className="bg-white rounded-xl shadow-sm p-6">
//                         <h3 className="text-gray-500 text-sm font-medium">Total Products</h3>
//                         <p className="text-3xl font-bold mt-2">
//                             {loading ? "..." : productCount}
//                         </p>
//                     </div>

//                     <div className="bg-white rounded-xl shadow-sm p-6">
//                         <h3 className="text-gray-500 text-sm font-medium">Total Offers</h3>
//                         <p className="text-3xl font-bold mt-2">
//                             {loading ? "..." : offerCount}
//                         </p>
//                     </div>

//                     <div className="bg-white rounded-xl shadow-sm p-6">
//                         <h3 className="text-gray-500 text-sm font-medium">Total Orders</h3>
//                         <p className="text-3xl font-bold mt-2">0</p>
//                     </div>

//                     <div className="bg-white rounded-xl shadow-sm p-6">
//                         <h3 className="text-gray-500 text-sm font-medium">Revenue</h3>
//                         <p className="text-3xl font-bold mt-2">₹ 0</p>
//                     </div>

//                     <div className="bg-white rounded-xl shadow-sm p-6">
//                         <h3 className="text-gray-500 text-sm font-medium">Customers</h3>
//                         <p className="text-3xl font-bold mt-2">0</p>
//                     </div>
//                 </div>

//                 <div className="mt-8">
//                     <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
//                     <div className="bg-white rounded-xl shadow-sm p-6">
//                         <p className="text-gray-500 text-center py-8">No recent activity</p>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// }

"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { getProducts } from "@/lib/firestore/products/read_server";
import { getOffer } from "@/lib/firestore/offers/read_server";

// 💫 Animated number with staggered scroll per digit
function AnimatedNumber({ number, stagger = false }) {
  const digits = number.toString().split("");

  return (
    <div className="flex justify-center space-x-0.5">
      {digits.map((digit, i) => {
        const randomStart = Math.floor(Math.random() * 10);
        const spinRounds = 2; // how many full scrolls before stopping
        const totalTranslate =
          (spinRounds * 10 + parseInt(digit) - randomStart) * 100;

        return (
          <div
            key={i}
            className="relative overflow-hidden h-10 w-7 flex-shrink-0"
          >
            {/* Scrolling column */}
            <div
              className={`absolute inset-0 flex flex-col animate-scrollDigit ${
                stagger ? `stagger-${i}` : ""
              }`}
              style={{
                transform: `translateY(-${totalTranslate}%)`,
              }}
            >
              {/* repeat digits enough times for smooth scroll */}
              {[...Array(spinRounds * 10 + 10).keys()].map((n) => (
                <div
                  key={n}
                  className="text-3xl font-bold leading-[2.5rem] text-gray-900 text-center"
                >
                  {n % 10}
                </div>
              ))}
            </div>

            {/* Final number fade-in */}
            <div
              className="absolute inset-0 flex items-center justify-center text-3xl font-bold text-gray-900 opacity-0 animate-fadeInDigit"
              style={{
                animationDelay: `${0.9 + i * 0.15}s`,
              }}
            >
              {digit}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default function ShopDashboard() {
  const { user } = useAuth();

  const [productCount, setProductCount] = useState(0);
  const [offerCount, setOfferCount] = useState(0);
  const [displayedProducts, setDisplayedProducts] = useState(0);
  const [displayedOffers, setDisplayedOffers] = useState(0);
  const [loading, setLoading] = useState(true);

  // 🔹 Fetch product count
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const products = await getProducts(user?.uid);
        const count = products.length || 0;
        setProductCount(count);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };
    if (user?.uid) fetchProducts();
  }, [user]);

  // 🔹 Fetch offers count
  useEffect(() => {
    const fetchOffer = async () => {
      try {
        const offers = await getOffer(user?.uid);
        const count = offers.length || 0;
        setOfferCount(count);
      } catch (error) {
        console.error("Error fetching offers:", error);
      } finally {
        setLoading(false);
      }
    };
    if (user?.uid) fetchOffer();
  }, [user]);

  // 🔢 Animate counts (smooth increment)
  useEffect(() => {
    let start = 0;
    const duration = 1000;
    const step = productCount / (duration / 20);

    const interval = setInterval(() => {
      start += step;
      if (start >= productCount) {
        setDisplayedProducts(productCount);
        clearInterval(interval);
      } else {
        setDisplayedProducts(Math.floor(start));
      }
    }, 20);

    return () => clearInterval(interval);
  }, [productCount]);

  useEffect(() => {
    let start = 0;
    const duration = 1000;
    const step = offerCount / (duration / 20);

    const interval = setInterval(() => {
      start += step;
      if (start >= offerCount) {
        setDisplayedOffers(offerCount);
        clearInterval(interval);
      } else {
        setDisplayedOffers(Math.floor(start));
      }
    }, 20);

    return () => clearInterval(interval);
  }, [offerCount]);

  return (
    <div className="w-full flex justify-center py-8">
      <div className="max-w-7xl w-full px-6">
        {/* Header */}
        <h1 className="text-3xl font-bold mb-8 text-gray-900">
          Welcome back,{" "}
          <span className="text-indigo-600">
            {user?.displayName || "Shop Owner"}
          </span>
        </h1>

        {/* Stat cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* 🛍️ Total Products */}
          <StatCard
            title="Total Products"
            loading={loading}
            value={<AnimatedNumber number={displayedProducts} />}
          />

          {/* 🎁 Total Offers */}
          <StatCard
            title="Total Offers"
            loading={loading}
            value={<AnimatedNumber number={displayedOffers} />}
          />

          {/* 🧾 Total Orders */}
          <StatCard
            title="Total Orders"
            value={<AnimatedNumber number={0} />}
          />

          {/* 💰 Revenue (staggered animation) */}
          <StatCard
            title="Revenue"
            value={
              <div className="flex items-center space-x-1 justify-center">
                <span className="text-3xl font-semibold text-gray-900">₹</span>
                <AnimatedNumber number={0} stagger />
              </div>
            }
          />

          {/* 👥 Customers (staggered animation) */}
          <StatCard
            title="Customers"
            value={<AnimatedNumber number={0} stagger />}
          />
        </div>

        {/* Recent Activity */}
        <div className="mt-10">
          <h2 className="text-xl font-semibold mb-4 text-gray-900">
            Recent Activity
          </h2>
          <div className="bg-white rounded-xl shadow-sm p-6 text-center">
            <p className="text-gray-500 py-8">No recent activity</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// 🧱 Reusable stat card
function StatCard({ title, value, loading }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 hover:shadow-md transition-shadow duration-300">
      <h3 className="text-gray-500 text-sm font-medium">{title}</h3>
      <div className="mt-3 text-center animate-slideDown min-h-[2.5rem]">
        {loading ? (
          <span className="text-lg text-gray-400 font-semibold">
            Loading...
          </span>
        ) : (
          value
        )}
      </div>
    </div>
  );
}
