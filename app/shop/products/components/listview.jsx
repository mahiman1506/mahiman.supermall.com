// "use client";

// import { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";
// import { Edit2Icon, Trash2Icon } from "lucide-react";
// import { getProducts } from "@/lib/firestore/products/read_server";
// // import { deleteProduct } from "@/lib/firestore/products/write";
// import { useCategory } from "@/lib/firestore/categories/read";
// import { deleteProduct } from "@/lib/firestore/products/write";

// export default function Listview() {
//   const router = useRouter();
//   const [products, setProducts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const { data: categories } = useCategory();

//   const getCategoryName = (id) =>
//     categories?.find((cat) => cat.id === id)?.name || "Unknown";

//   // Fetch products
//   useEffect(() => {
//     const fetchProducts = async () => {
//       try {
//         const productsData = await getProducts();
//         setProducts(productsData || []);
//       } catch (err) {
//         setError(err.message);
//         console.error("Error fetching products:", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchProducts();
//   }, []);

//   if (loading) {
//     return (
//       <div className="flex-1 flex items-center justify-center">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="flex-1 flex items-center justify-center text-red-600">
//         Error: {error}
//       </div>
//     );
//   }

//   if (!products.length) {
//     return (
//       <div className="flex-1 flex flex-col items-center justify-center gap-4 py-8">
//         <div className="text-gray-500 text-center">
//           <p className="text-xl font-semibold">No Products Found</p>
//           <p className="text-sm">Start by adding your first product</p>
//         </div>
//         <button
//           onClick={() => router.push("/shop/products/Form")}
//           className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
//         >
//           Add Product
//         </button>
//       </div>
//     );
//   }

//   return (
//     <div className="flex-1 flex flex-col gap-4 px-3 sm:px-6 py-4">
//       {/* Desktop Table */}
//       <div className="hidden md:block overflow-x-auto">
//         <table className="w-full border-separate border-spacing-y-3">
//           <thead>
//             <tr>
//               <td className="bg-white px-3 py-2 rounded-l-lg text-center font-semibold">
//                 SN
//               </td>
//               <td className="bg-white px-3 py-2 text-center font-semibold">
//                 Main Image
//               </td>
//               <td className="bg-white px-3 py-2 text-center font-semibold">
//                 Product Name
//               </td>
//               <td className="bg-white px-3 py-2 text-center font-semibold">
//                 Price
//               </td>
//               <td className="bg-white px-3 py-2 text-center font-semibold">
//                 Category
//               </td>
//               <td className="bg-white px-3 py-2 text-center font-semibold">
//                 Brand
//               </td>
//               <td className="bg-white px-3 py-2 text-center font-semibold">
//                 Stock
//               </td>
//               <td className="bg-white px-3 py-2 text-center font-semibold">
//                 Status
//               </td>
//               <td className="bg-white px-3 py-2 text-center rounded-r-lg font-semibold">
//                 Actions
//               </td>
//             </tr>
//           </thead>

//           <tbody>
//             {products.map((p, index) => (
//               <tr key={p.id} className="shadow bg-white">
//                 <td className="text-center py-3 rounded-l-lg">{index + 1}</td>

//                 {/* Main Image */}
//                 <td className="flex items-center justify-center p-2">
//                   <img
//                     src={p.mainImageURL || "/placeholder.png"}
//                     alt={p.name}
//                     className="w-6 object-cover"
//                   />
//                 </td>

//                 <td className="text-center">{p.name}</td>
//                 <td className="text-center">₹{p.price}</td>
//                 <td className="text-center">{getCategoryName(p.category)}</td>
//                 <td className="text-center">{p.brand}</td>
//                 <td className="text-center">{p.stock}</td>
//                 <td></td>
//                 {/* Actions */}
//                 <td className="text-center rounded-r-lg">
//                   <div className="flex justify-center items-center gap-3">
//                     <button
//                       onClick={() =>
//                         router.push(`/shop/products/Form?id=${p.id}`)
//                       }
//                       className="flex items-center gap-1 text-blue-600 hover:text-blue-800 transition-colors"
//                     >
//                       <Edit2Icon size={15} />
//                       <span>Edit</span>
//                     </button>

//                     <span className="text-gray-400">|</span>

//                     <button
//                       onClick={async () => {
//                         if (!confirm(`Delete ${p.name}?`)) return;
//                         try {
//                           await deleteProduct({ id: p.id });
//                           setProducts(
//                             products.filter((prod) => prod.id !== p.id)
//                           );
//                           alert(`${p.name} deleted successfully`);
//                         } catch (error) {
//                           alert(error?.message || "Failed to delete product");
//                         }
//                       }}
//                       className="flex items-center gap-1 text-red-600 hover:text-red-800 transition-colors"
//                     >
//                       <Trash2Icon size={15} />
//                       <span>Delete</span>
//                     </button>
//                   </div>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       {/* Mobile Card View */}
//       <div className="md:hidden flex flex-col gap-3">
//         {products.map((p, index) => (
//           <div
//             key={p.id}
//             className="bg-white shadow-sm rounded-lg p-3 flex flex-col gap-2 border border-gray-100"
//           >
//             <div className="flex items-center justify-between">
//               <div className="flex items-center gap-2">
//                 <img
//                   src={p.mainImageURL || "/placeholder.png"}
//                   alt={p.name}
//                   className="h-12 w-12 rounded-md object-cover"
//                 />

//                 <div>
//                   <h3 className="font-semibold text-gray-800 text-sm leading-tight">
//                     {p.name}
//                   </h3>
//                   <p className="text-xs text-gray-500">₹{p.price}</p>
//                 </div>
//               </div>

//               <span className="px-2 py-0.5 rounded-full text-[11px] bg-gray-100 text-gray-700 font-medium">
//                 #{index + 1}
//               </span>
//             </div>

//             <div className="grid grid-cols-2 gap-2 text-xs text-gray-700 mt-2">
//               <p>
//                 <b>Stock:</b> {p.stock}
//               </p>
//               <p>
//                 <b>SKU:</b> {p.sku}
//               </p>
//               <p>
//                 <b>Category:</b> {p.category}
//               </p>
//               <p>
//                 <b>Brand:</b> {p.brand}
//               </p>
//               <p className="col-span-2">
//                 <b>Tags:</b> {p.tags?.join(", ") || "None"}
//               </p>
//               <p className="col-span-2 line-clamp-2">
//                 <b>Description:</b> {p.description}
//               </p>
//             </div>

//             <div className="flex justify-end gap-3 border-t pt-2 mt-1">
//               <button
//                 onClick={() => router.push(`/shop/products/Form?id=${p.id}`)}
//                 className="flex items-center gap-1 text-blue-600 hover:text-blue-800 text-xs"
//               >
//                 <Edit2Icon size={13} />
//                 <span>Edit</span>
//               </button>

//               <button
//                 onClick={async () => {
//                   if (!confirm(`Delete ${p.name}?`)) return;
//                   try {
//                     await deleteProduct({ id: p.id });
//                     setProducts(products.filter((prod) => prod.id !== p.id));
//                     alert(`${p.name} deleted successfully`);
//                   } catch (error) {
//                     alert(error?.message || "Failed to delete product");
//                   }
//                 }}
//                 className="flex items-center gap-1 text-red-600 hover:text-red-800 text-xs"
//               >
//                 <Trash2Icon size={13} />
//                 <span>Delete</span>
//               </button>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Edit2Icon, Trash2Icon } from "lucide-react";
import { getProducts } from "@/lib/firestore/products/read_server";
import { deleteProduct } from "@/lib/firestore/products/write";
import { useCategory } from "@/lib/firestore/categories/read";

// STATUS BADGE COMPONENT
const StatusBadge = ({ status }) => {
  const colors = {
    active: "bg-green-100 text-green-700",
    inactive: "bg-gray-200 text-gray-700",
    draft: "bg-yellow-100 text-yellow-700",
    out_of_stock: "bg-red-100 text-red-700",
  };

  return (
    <span
      className={`px-2 py-1 text-xs rounded-full font-medium ${
        colors[status] || "bg-gray-100 text-gray-600"
      }`}
    >
      {status ? status.replace(/_/g, " ").toUpperCase() : "N/A"}
    </span>
  );
};

export default function Listview() {
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { data: categories } = useCategory();

  const getCategoryName = (id) =>
    categories?.find((cat) => cat.id === id)?.name || "Unknown";

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const productsData = await getProducts();
        setProducts(productsData || []);
      } catch (err) {
        setError(err.message);
        console.error("Error fetching products:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 flex items-center justify-center text-red-600">
        Error: {error}
      </div>
    );
  }

  if (!products.length) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-4 py-8">
        <div className="text-gray-500 text-center">
          <p className="text-xl font-semibold">No Products Found</p>
          <p className="text-sm">Start by adding your first product</p>
        </div>
        <button
          onClick={() => router.push("/shop/products/Form")}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Add Product
        </button>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col gap-4 px-3 sm:px-6 py-4">
      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full border-separate border-spacing-y-3">
          <thead>
            <tr>
              <td className="bg-white px-3 py-2 rounded-l-lg text-center font-semibold">
                SN
              </td>
              <td className="bg-white px-3 py-2 text-center font-semibold">
                Main Image
              </td>
              <td className="bg-white px-3 py-2 text-center font-semibold">
                Product Name
              </td>
              <td className="bg-white px-3 py-2 text-center font-semibold">
                Price
              </td>
              <td className="bg-white px-3 py-2 text-center font-semibold">
                Category
              </td>
              <td className="bg-white px-3 py-2 text-center font-semibold">
                Brand
              </td>
              <td className="bg-white px-3 py-2 text-center font-semibold">
                Stock
              </td>
              <td className="bg-white px-3 py-2 text-center font-semibold">
                Status
              </td>
              <td className="bg-white px-3 py-2 text-center rounded-r-lg font-semibold">
                Actions
              </td>
            </tr>
          </thead>

          <tbody>
            {products.map((p, index) => (
              <tr key={p.id} className="shadow bg-white">
                <td className="text-center py-3 rounded-l-lg">{index + 1}</td>

                {/* Main Image */}
                <td className="flex items-center justify-center p-2">
                  <img
                    src={p.mainImageURL || "/placeholder.png"}
                    alt={p.name}
                    className="w-6 object-cover"
                  />
                </td>

                <td className="text-center">{p.name}</td>
                <td className="text-center">₹{p.price}</td>
                <td className="text-center">{getCategoryName(p.category)}</td>
                <td className="text-center">{p.brand}</td>
                <td className="text-center">{p.stock}</td>

                {/* STATUS BADGE */}
                <td className="text-center">
                  <StatusBadge status={p.status} />
                </td>

                {/* Actions */}
                <td className="text-center rounded-r-lg">
                  <div className="flex justify-center items-center gap-3">
                    <button
                      onClick={() =>
                        router.push(`/shop/products/Form?id=${p.id}`)
                      }
                      className="flex items-center gap-1 text-blue-600 hover:text-blue-800 transition-colors"
                    >
                      <Edit2Icon size={15} />
                      <span>Edit</span>
                    </button>

                    <span className="text-gray-400">|</span>

                    <button
                      onClick={async () => {
                        if (!confirm(`Delete ${p.name}?`)) return;
                        try {
                          await deleteProduct({ id: p.id });
                          setProducts(
                            products.filter((prod) => prod.id !== p.id)
                          );
                          alert(`${p.name} deleted successfully`);
                        } catch (error) {
                          alert(error?.message || "Failed to delete product");
                        }
                      }}
                      className="flex items-center gap-1 text-red-600 hover:text-red-800 transition-colors"
                    >
                      <Trash2Icon size={15} />
                      <span>Delete</span>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden flex flex-col gap-3">
        {products.map((p, index) => (
          <div
            key={p.id}
            className="bg-white shadow-sm rounded-lg p-3 flex flex-col gap-2 border border-gray-100"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <img
                  src={p.mainImageURL || "/placeholder.png"}
                  alt={p.name}
                  className="h-12 w-12 rounded-md object-cover"
                />

                <div>
                  <h3 className="font-semibold text-gray-800 text-sm leading-tight">
                    {p.name}
                  </h3>
                  <p className="text-xs text-gray-500">₹{p.price}</p>

                  {/* STATUS BADGE */}
                  <StatusBadge status={p.status} />
                </div>
              </div>

              <span className="px-2 py-0.5 rounded-full text-[11px] bg-gray-100 text-gray-700 font-medium">
                #{index + 1}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs text-gray-700 mt-2">
              <p>
                <b>Stock:</b> {p.stock}
              </p>
              <p>
                <b>SKU:</b> {p.sku}
              </p>
              <p>
                <b>Category:</b> {getCategoryName(p.category)}
              </p>
              <p>
                <b>Brand:</b> {p.brand}
              </p>
              <p className="col-span-2">
                <b>Tags:</b> {p.tags?.join(", ") || "None"}
              </p>
              <p className="col-span-2 line-clamp-2">
                <b>Description:</b> {p.description}
              </p>
            </div>

            <div className="flex justify-end gap-3 border-t pt-2 mt-1">
              <button
                onClick={() => router.push(`/shop/products/Form?id=${p.id}`)}
                className="flex items-center gap-1 text-blue-600 hover:text-blue-800 text-xs"
              >
                <Edit2Icon size={13} />
                <span>Edit</span>
              </button>

              <button
                onClick={async () => {
                  if (!confirm(`Delete ${p.name}?`)) return;
                  try {
                    await deleteProduct({ id: p.id });
                    setProducts(products.filter((prod) => prod.id !== p.id));
                    alert(`${p.name} deleted successfully`);
                  } catch (error) {
                    alert(error?.message || "Failed to delete product");
                  }
                }}
                className="flex items-center gap-1 text-red-600 hover:text-red-800 text-xs"
              >
                <Trash2Icon size={13} />
                <span>Delete</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
