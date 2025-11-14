// "use client";

// import { useState, useEffect } from "react";
// import { useRouter, useSearchParams } from "next/navigation";

// import {
//   createNewProduct,
//   UpdateProduct,
// } from "@/lib/firestore/products/write";
// import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
// import { storage } from "@/lib/firestore/firebase";
// import { getCategories } from "@/lib/firestore/categories/read_server";
// import { getProduct } from "@/lib/firestore/products/read_server";

// export default function Page() {
//   const router = useRouter();
//   const searchParams = useSearchParams();
//   const id = searchParams.get("id");

//   const [data, setData] = useState({
//     name: "",
//     price: "",
//     category: "",
//     brand: "",
//     stock: "",
//     sku: "",
//     tags: "",
//     description: "",
//     mainImageURL: "",
//     images: [],
//   });

//   const [categories, setCategories] = useState([]);
//   const [mainImage, setMainImage] = useState(null);
//   const [mainImagePreview, setMainImagePreview] = useState(null);

//   const [images, setImages] = useState([]);
//   const [imagesPreview, setImagesPreview] = useState([]);

//   const [isLoading, setIsLoading] = useState(false);
//   const [errors, setErrors] = useState({});

//   const handleData = (field, value) => {
//     setData((prev) => ({ ...prev, [field]: value }));
//     if (errors[field]) {
//       setErrors((prev) => ({ ...prev, [field]: "" }));
//     }
//   };

//   const handleMainImageChange = (e) => {
//     const file = e.target.files[0];
//     if (!file) return;

//     if (mainImagePreview?.startsWith("blob:"))
//       URL.revokeObjectURL(mainImagePreview);

//     const url = URL.createObjectURL(file);
//     setMainImage(file);
//     setMainImagePreview(url);
//   };

//   const handleGalleryChange = (e) => {
//     const files = Array.from(e.target.files);

//     imagesPreview.forEach((url) => {
//       if (url.startsWith("blob:")) URL.revokeObjectURL(url);
//     });

//     const previewUrls = files.map((file) => URL.createObjectURL(file));

//     setImages(files);
//     setImagesPreview(previewUrls);
//   };

//   useEffect(() => {
//     return () => {
//       if (mainImagePreview?.startsWith("blob:"))
//         URL.revokeObjectURL(mainImagePreview);
//       imagesPreview.forEach((url) => {
//         if (url.startsWith("blob:")) URL.revokeObjectURL(url);
//       });
//     };
//   }, [mainImagePreview, imagesPreview]);

//   useEffect(() => {
//     const fetchCats = async () => {
//       try {
//         const cats = await getCategories();
//         setCategories(cats);
//       } catch (err) {
//         console.error("Category fetch error:", err);
//       }
//     };
//     fetchCats();
//   }, []);

//   useEffect(() => {
//     const fetchProduct = async () => {
//       if (!id) return;

//       try {
//         const product = await getProduct(id);

//         setData({
//           name: product.name || "",
//           price: product.price || "",
//           category: product.category || "",
//           brand: product.brand || "",
//           stock: product.stock || "",
//           sku: product.sku || "",
//           tags: product.tags?.join(", ") || "",
//           description: product.description || "",
//           mainImageURL: product.mainImageURL || "",
//           images: product.images || [],
//         });

//         if (product.mainImageURL) setMainImagePreview(product.mainImageURL);
//         if (product.images?.length) setImagesPreview(product.images);
//       } catch (err) {
//         console.error("Product fetch error:", err);
//       }
//     };

//     fetchProduct();
//   }, [id]);

//   const validateForm = () => {
//     const e = {};
//     if (!data.name) e.name = "Name is required";
//     if (!data.price) e.price = "Price is required";
//     if (!data.category) e.category = "Category is required";
//     if (!data.stock) e.stock = "Stock is required";
//     if (!mainImage && !data.mainImageURL)
//       e.mainImage = "Main image is required";

//     setErrors(e);
//     return Object.keys(e).length === 0;
//   };

//   const uploadToStorage = async (file, path) => {
//     if (!file) return null;
//     const fileRef = ref(storage, `product/${path}/${Date.now()}_${file.name}`);
//     await uploadBytes(fileRef, file);
//     return await getDownloadURL(fileRef);
//   };

//   const handleSubmit = async () => {
//     if (!validateForm()) return;

//     setIsLoading(true);

//     try {
//       const mainImageURL = mainImage
//         ? await uploadToStorage(mainImage, "main")
//         : data.mainImageURL;

//       const galleryImages = await Promise.all(
//         images.map((file) => uploadToStorage(file, "gallery"))
//       );

//       const finalData = {
//         ...data,
//         mainImageURL,
//         images: [...(data.images || []), ...galleryImages].filter(Boolean),
//         tags: data.tags.split(",").map((t) => t.trim()),
//         price: Number(data.price),
//         stock: Number(data.stock),
//       };

//       if (id) {
//         await UpdateProduct({
//           data: { id, ...finalData },
//           mainImage: mainImage,
//           images: images,
//         });
//       } else {
//         await createNewProduct({
//           data: finalData,
//           mainImage,
//           images,
//         });
//       }

//       router.push("/shop/products");
//     } catch (err) {
//       console.error("Save error:", err);
//       alert("Failed to save product.");
//     }

//     setIsLoading(false);
//   };

//   return (
//     <div className="flex-1 flex flex-col gap-5 p-6 bg-gray-50">
//       <h1 className="text-2xl font-semibold">
//         {id ? "Update" : "Create"} Product
//       </h1>

//       <form
//         onSubmit={(e) => {
//           e.preventDefault();
//           handleSubmit();
//         }}
//         className="grid grid-cols-1 lg:grid-cols-3 gap-6"
//       >
//         {/* LEFT */}
//         <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow flex flex-col gap-4">
//           <h2 className="font-semibold text-lg border-b pb-2">Basic Details</h2>

//           <Input
//             label="Product Name"
//             value={data.name}
//             error={errors.name}
//             onChange={(e) => handleData("name", e.target.value)}
//           />

//           <Input
//             label="Price"
//             type="number"
//             value={data.price}
//             error={errors.price}
//             onChange={(e) => handleData("price", e.target.value)}
//           />

//           <div className="flex flex-col gap-1">
//             <label>Category</label>
//             <select
//               className="border rounded px-3 py-2"
//               value={data.category}
//               onChange={(e) => handleData("category", e.target.value)}
//             >
//               <option value="">Select...</option>
//               {categories.map((c) => (
//                 <option key={c.id} value={c.id}>
//                   {c.name}
//                 </option>
//               ))}
//             </select>
//             {errors.category && (
//               <p className="text-red-500 text-sm">{errors.category}</p>
//             )}
//           </div>

//           <Input
//             label="Brand"
//             value={data.brand}
//             onChange={(e) => handleData("brand", e.target.value)}
//           />

//           <Input
//             label="Stock"
//             type="number"
//             value={data.stock}
//             error={errors.stock}
//             onChange={(e) => handleData("stock", e.target.value)}
//           />

//           <Input
//             label="SKU"
//             value={data.sku}
//             onChange={(e) => handleData("sku", e.target.value)}
//           />

//           <Input
//             label="Tags"
//             placeholder="comma separated"
//             value={data.tags}
//             onChange={(e) => handleData("tags", e.target.value)}
//           />
//           <div className="flex flex-col gap-1">
//             <label>Status</label>
//             <select
//               className="border rounded px-3 py-2"
//               value={data.status || ""}
//               onChange={(e) => handleData("status", e.target.value)}
//             >
//               <option value="active">Active</option>
//               <option value="inactive">Inactive</option>
//               <option value="draft">Draft</option>
//               <option value="out_of_stock">Out of Stock</option>
//             </select>

//             {errors.status && (
//               <p className="text-red-500 text-sm">{errors.status}</p>
//             )}
//           </div>
//         </div>

//         {/* RIGHT */}
//         <div className="flex flex-col gap-6">
//           <div className="bg-white p-6 rounded shadow flex flex-col gap-4">
//             <h2 className="font-semibold text-lg border-b pb-2">Images</h2>

//             {/* Main */}
//             <div className="flex flex-col gap-2">
//               <label>Main Image</label>
//               <input
//                 type="file"
//                 accept="image/*"
//                 onChange={handleMainImageChange}
//                 className="border rounded px-3 py-2"
//               />
//               {mainImagePreview && (
//                 <img
//                   src={mainImagePreview}
//                   className="w-20 rounded object-cover mt-2"
//                 />
//               )}
//             </div>

//             {/* Gallery */}
//             <div className="flex flex-col gap-2">
//               <label>Gallery Images</label>
//               <input
//                 type="file"
//                 accept="image/*"
//                 multiple
//                 onChange={handleGalleryChange}
//                 className="border rounded px-3 py-2"
//               />

//               <div className="grid grid-cols-2 gap-2 mt-2">
//                 {(images.length ? imagesPreview : data.images)?.map(
//                   (url, i) => (
//                     <img
//                       key={i}
//                       src={url}
//                       className="w-20 object-cover rounded"
//                     />
//                   )
//                 )}
//               </div>
//             </div>
//           </div>

//           <div className="bg-white p-6 rounded shadow">
//             <h2 className="font-semibold text-lg border-b pb-2">Description</h2>
//             <textarea
//               className="border rounded px-3 py-2 w-full"
//               rows={5}
//               value={data.description}
//               onChange={(e) => handleData("description", e.target.value)}
//             />
//           </div>
//         </div>

//         {/* BUTTONS */}
//         <div className="col-span-full flex gap-4 mt-4">
//           <button
//             type="submit"
//             disabled={isLoading}
//             className="bg-blue-600 text-white px-6 py-2 rounded"
//           >
//             {isLoading ? "Saving..." : id ? "Update Product" : "Create Product"}
//           </button>

//           <button
//             type="button"
//             disabled={isLoading}
//             onClick={() => router.push("/shop/products")}
//             className="bg-gray-300 px-6 py-2 rounded"
//           >
//             Cancel
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// }

// function Input({ label, error, ...props }) {
//   return (
//     <div className="flex flex-col gap-1">
//       <label>{label}</label>
//       <input
//         {...props}
//         className={`border rounded px-3 py-2 w-full ${
//           error ? "border-red-500" : "border-gray-300"
//         }`}
//       />
//       {error && <p className="text-red-500 text-sm">{error}</p>}
//     </div>
//   );
// }

"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import {
  createNewProduct,
  UpdateProduct,
} from "@/lib/firestore/products/write";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "@/lib/firestore/firebase";
import { getCategories } from "@/lib/firestore/categories/read_server";
import { getProduct } from "@/lib/firestore/products/read_server";

export default function Page() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const [data, setData] = useState({
    name: "",
    price: "",
    category: "",
    brand: "",
    stock: "",
    sku: "",
    tags: "",
    description: "",
    status: "active", // auto update only
    mainImageURL: "",
    images: [],
  });

  const [categories, setCategories] = useState([]);
  const [mainImage, setMainImage] = useState(null);
  const [mainImagePreview, setMainImagePreview] = useState(null);

  const [images, setImages] = useState([]);
  const [imagesPreview, setImagesPreview] = useState([]);

  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleData = (field, value) => {
    setData((prev) => ({ ...prev, [field]: value }));

    // Auto-status logic
    if (field === "stock") {
      const v = Number(value);

      if (v === 0) {
        setData((prev) => ({ ...prev, status: "out_of_stock" }));
      } else if (v > 0) {
        setData((prev) => ({ ...prev, status: "active" }));
      }
    }

    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleMainImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (mainImagePreview?.startsWith("blob:"))
      URL.revokeObjectURL(mainImagePreview);

    const url = URL.createObjectURL(file);
    setMainImage(file);
    setMainImagePreview(url);
  };

  const handleGalleryChange = (e) => {
    const files = Array.from(e.target.files);

    imagesPreview.forEach((url) => {
      if (url.startsWith("blob:")) URL.revokeObjectURL(url);
    });

    const previewUrls = files.map((file) => URL.createObjectURL(file));

    setImages(files);
    setImagesPreview(previewUrls);
  };

  useEffect(() => {
    return () => {
      if (mainImagePreview?.startsWith("blob:"))
        URL.revokeObjectURL(mainImagePreview);
      imagesPreview.forEach((url) => {
        if (url.startsWith("blob:")) URL.revokeObjectURL(url);
      });
    };
  }, [mainImagePreview, imagesPreview]);

  useEffect(() => {
    const fetchCats = async () => {
      try {
        const cats = await getCategories();
        setCategories(cats);
      } catch (err) {
        console.error("Category fetch error:", err);
      }
    };
    fetchCats();
  }, []);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;

      try {
        const product = await getProduct(id);

        setData({
          name: product.name || "",
          price: product.price || "",
          category: product.category || "",
          brand: product.brand || "",
          stock: product.stock || "",
          sku: product.sku || "",
          tags: product.tags?.join(", ") || "",
          description: product.description || "",
          status: product.status || "active",
          mainImageURL: product.mainImageURL || "",
          images: product.images || [],
        });

        if (product.mainImageURL) setMainImagePreview(product.mainImageURL);
        if (product.images?.length) setImagesPreview(product.images);
      } catch (err) {
        console.error("Product fetch error:", err);
      }
    };

    fetchProduct();
  }, [id]);

  const validateForm = () => {
    const e = {};
    if (!data.name) e.name = "Name is required";
    if (!data.price) e.price = "Price is required";
    if (!data.category) e.category = "Category is required";
    if (!data.stock) e.stock = "Stock is required";
    if (!mainImage && !data.mainImageURL)
      e.mainImage = "Main image is required";

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const uploadToStorage = async (file, path) => {
    if (!file) return null;
    const fileRef = ref(storage, `product/${path}/${Date.now()}_${file.name}`);
    await uploadBytes(fileRef, file);
    return await getDownloadURL(fileRef);
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const mainImageURL = mainImage
        ? await uploadToStorage(mainImage, "main")
        : data.mainImageURL;

      const galleryImages = await Promise.all(
        images.map((file) => uploadToStorage(file, "gallery"))
      );

      // Final auto-status check
      if (Number(data.stock) === 0) {
        data.status = "out_of_stock";
      } else {
        data.status = "active";
      }

      const finalData = {
        ...data,
        mainImageURL,
        images: [...(data.images || []), ...galleryImages].filter(Boolean),
        tags: data.tags.split(",").map((t) => t.trim()),
        price: Number(data.price),
        stock: Number(data.stock),
        status: data.status,
      };

      if (id) {
        await UpdateProduct({
          data: { id, ...finalData },
          mainImage: mainImage,
          images: images,
        });
      } else {
        await createNewProduct({
          data: finalData,
          mainImage,
          images,
        });
      }

      router.push("/shop/products");
    } catch (err) {
      console.error("Save error:", err);
      alert("Failed to save product.");
    }

    setIsLoading(false);
  };

  return (
    <div className="flex-1 flex flex-col gap-5 p-6 bg-gray-50">
      <h1 className="text-2xl font-semibold">
        {id ? "Update" : "Create"} Product
      </h1>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
        className="grid grid-cols-1 lg:grid-cols-3 gap-6"
      >
        {/* LEFT */}
        <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow flex flex-col gap-4">
          <h2 className="font-semibold text-lg border-b pb-2">Basic Details</h2>

          <Input
            label="Product Name"
            value={data.name}
            error={errors.name}
            onChange={(e) => handleData("name", e.target.value)}
          />

          <Input
            label="Price"
            type="number"
            value={data.price}
            error={errors.price}
            onChange={(e) => handleData("price", e.target.value)}
          />

          <div className="flex flex-col gap-1">
            <label>Category</label>
            <select
              className="border rounded px-3 py-2"
              value={data.category}
              onChange={(e) => handleData("category", e.target.value)}
            >
              <option value="">Select...</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
            {errors.category && (
              <p className="text-red-500 text-sm">{errors.category}</p>
            )}
          </div>

          <Input
            label="Brand"
            value={data.brand}
            onChange={(e) => handleData("brand", e.target.value)}
          />

          {/* AUTO-STOCK STATUS LOGIC */}
          <Input
            label="Stock"
            type="number"
            value={data.stock}
            error={errors.stock}
            onChange={(e) => handleData("stock", e.target.value)}
          />

          <Input
            label="SKU"
            value={data.sku}
            onChange={(e) => handleData("sku", e.target.value)}
          />

          <Input
            label="Tags"
            placeholder="comma separated"
            value={data.tags}
            onChange={(e) => handleData("tags", e.target.value)}
          />

          {/* Hidden Status Field */}
          <input type="hidden" value={data.status} />
        </div>

        {/* RIGHT */}
        <div className="flex flex-col gap-6">
          <div className="bg-white p-6 rounded shadow flex flex-col gap-4">
            <h2 className="font-semibold text-lg border-b pb-2">Images</h2>

            {/* Main */}
            <div className="flex flex-col gap-2">
              <label>Main Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleMainImageChange}
                className="border rounded px-3 py-2"
              />
              {mainImagePreview && (
                <img
                  src={mainImagePreview}
                  className="w-20 rounded object-cover mt-2"
                />
              )}
            </div>

            {/* Gallery */}
            <div className="flex flex-col gap-2">
              <label>Gallery Images</label>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleGalleryChange}
                className="border rounded px-3 py-2"
              />

              <div className="grid grid-cols-2 gap-2 mt-2">
                {(images.length ? imagesPreview : data.images)?.map(
                  (url, i) => (
                    <img
                      key={i}
                      src={url}
                      className="w-20 object-cover rounded"
                    />
                  )
                )}
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded shadow">
            <h2 className="font-semibold text-lg border-b pb-2">Description</h2>
            <textarea
              className="border rounded px-3 py-2 w-full"
              rows={5}
              value={data.description}
              onChange={(e) => handleData("description", e.target.value)}
            />
          </div>
        </div>

        {/* BUTTONS */}
        <div className="col-span-full flex gap-4 mt-4">
          <button
            type="submit"
            disabled={isLoading}
            className="bg-blue-600 text-white px-6 py-2 rounded"
          >
            {isLoading ? "Saving..." : id ? "Update Product" : "Create Product"}
          </button>

          <button
            type="button"
            disabled={isLoading}
            onClick={() => router.push("/shop/products")}
            className="bg-gray-300 px-6 py-2 rounded"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

function Input({ label, error, ...props }) {
  return (
    <div className="flex flex-col gap-1">
      <label>{label}</label>
      <input
        {...props}
        className={`border rounded px-3 py-2 w-full ${
          error ? "border-red-500" : "border-gray-300"
        }`}
      />
      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  );
}
