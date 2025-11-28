// "use client";
// import { createNewShop, UpdateShop } from "@/lib/firestore/shop/write";
// import { useRouter, useSearchParams } from "next/navigation";
// import { useEffect, useState } from "react";
// import { useCategory } from "@/lib/firestore/categories/read";
// import { useFloor } from "@/lib/firestore/floors/read";
// import { doc, getDoc, setDoc } from "firebase/firestore";
// import { db } from "@/lib/firestore/firebase";

// export default function Page() {
//   const { data: category } = useCategory();
//   const { data: floor } = useFloor();
//   const [logo, setLogo] = useState(null);
//   const [images, setImages] = useState([]);
//   const [bannerImage, setBannerImage] = useState(null);
//   const [data, setData] = useState({
//     name: "",
//     ownerName: "",
//     shopNumber: "",
//     category: "",
//     floor: "",
//     contactNumber: "",
//     email: "",
//     websiteLink: "",
//     description: "",
//   });
//   const [isLoading, setIsLoading] = useState(false);
//   const searchParams = useSearchParams();
//   const id = searchParams?.get("id") || null;
//   const router = useRouter();

//   useEffect(() => {
//     if (!id) return; // no id => creating new category

//     const fetchShop = async () => {
//       setIsLoading(true);
//       try {
//         const docRef = doc(db, "shop", id);
//         const docSnap = await getDoc(docRef);

//         if (docSnap.exists()) {
//           const shop = docSnap.data();
//           setData({
//             ...shop,
//             id, // important to store id for UpdateCategory
//           });
//         } else {
//           alert("⚠️ Shop not found");
//           router.push("/admin/shop");
//         }
//       } catch (error) {
//         console.error(error);
//         alert("❌ Failed to load Shop");
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchShop();
//   }, [id]);

//   const handleData = (key, value) => {
//     setData((prev) => ({ ...prev, [key]: value }));
//   };

//   const handleSubmit = async () => {
//     setIsLoading(true);
//     try {
//       await createNewShop({
//         data: data,
//         logo: logo,
//         images: images,
//         bannerImage: bannerImage,
//       });
//       setData({
//         name: "",
//         ownerName: "",
//         shopNumber: "",
//         category: "",
//         floor: "",
//         contactNumber: "",
//         email: "",
//         // password: "",
//         websiteLink: "",
//         description: "",
//       });
//       setLogo(null);
//       setBannerImage(null);
//       setImages([]);
//       alert("✅ Shop Created....");
//       router.push(`/admin/shop`);
//     } catch (error) {
//       console.log(error?.message);
//       alert(error?.message);
//     }
//     setIsLoading(false);
//   };

//   const handleUpdate = async () => {
//     setIsLoading(true);
//     try {
//       await UpdateShop({
//         data: data,
//         logo: logo,
//         images: images,
//         bannerImage: bannerImage,
//       });
//       setData({
//         name: "",
//         ownerName: "",
//         shopNumber: "",
//         category: "",
//         floor: "",
//         contactNumber: "",
//         email: "",
//         // password: "",
//         websiteLink: "",
//         description: "",
//       });
//       setLogo(null);
//       setBannerImage(null);
//       setImages([]);
//       alert("✅ Shop is Updated....");
//       router.push(`/admin/shop`);
//     } catch (error) {
//       alert(error?.message || "Something Went Wrong....!");
//     }
//     setIsLoading(false);
//   };

//   return (
//     <div className="flex-1 flex flex-col gap-5 rounded-xl p-3 sm:p-8 md:p-12 bg-gray-50">
//       <div className="flex items-center justify-between">
//         <h1 className="text-2xl font-semibold">
//           {" "}
//           {id ? "Update" : "Create"} Shop
//         </h1>
//       </div>

//       <form
//         onSubmit={(e) => {
//           e.preventDefault();
//           if (id) {
//             handleUpdate();
//           } else {
//             handleSubmit();
//           }
//         }}
//         className="grid grid-cols-1 gap-6 lg:grid-cols-3"
//       >
//         {/* Left Column: Basic Details */}
//         <div className="lg:col-span-2 bg-white rounded-lg shadow p-6 flex flex-col gap-4">
//           <h2 className="text-lg font-semibold border-b pb-2">Basic Details</h2>

//           {/* Shop Name */}
//           <div className="flex flex-col gap-1">
//             <label htmlFor="shop-name">Shop Name</label>
//             <input
//               type="text"
//               id="shop-name"
//               placeholder="Enter Shop Name"
//               value={data?.name}
//               onChange={(e) => handleData("name", e.target.value)}
//               className="border border-gray-400 rounded-lg px-3 py-2 w-full focus:outline-none"
//             />
//           </div>

//           {/* Owner Name */}
//           <div className="flex flex-col gap-1">
//             <label htmlFor="shop-owner-name">Owner Name</label>
//             <input
//               type="text"
//               id="shop-owner-name"
//               value={data?.ownerName}
//               onChange={(e) => handleData("ownerName", e.target.value)}
//               placeholder="Enter Owner Name"
//               className="border border-gray-400 rounded-lg px-3 py-2 w-full focus:outline-none"
//             />
//           </div>

//           {/* Shop Number */}
//           <div className="flex flex-col gap-1">
//             <label htmlFor="shop-number">Shop Number</label>
//             <input
//               type="number"
//               id="shop-number"
//               placeholder="Enter Shop Number"
//               value={data?.shopNumber}
//               onChange={(e) => handleData("shopNumber", e.target.value)}
//               className="border border-gray-400 rounded-lg px-3 py-2 w-full focus:outline-none"
//             />
//           </div>

//           {/* Category */}
//           <div className="flex flex-col gap-1">
//             <label htmlFor="shop-category">Category</label>
//             <select
//               id="shop-category"
//               value={data?.category || ""}
//               onChange={(e) => handleData("category", e.target.value)}
//               className="border border-gray-400 rounded-lg px-3 py-2 w-full focus:outline-none"
//             >
//               <option value="">Select Category</option>
//               {category?.map((item) => (
//                 <option value={item?.id} key={item?.id}>
//                   {item?.name}
//                 </option>
//               ))}
//             </select>
//           </div>

//           {/* Floor */}
//           <div className="flex flex-col gap-1">
//             <label htmlFor="shop-floor">Floor</label>
//             <select
//               id="shop-floor"
//               value={data?.floor || ""}
//               onChange={(e) => handleData("floor", e.target.value)}
//               className="border border-gray-400 rounded-lg px-3 py-2 w-full focus:outline-none"
//             >
//               <option value="">Select Floor</option>
//               {floor?.map((item) => (
//                 <option value={item?.id} key={item?.id}>
//                   {item?.name}
//                 </option>
//               ))}
//             </select>
//           </div>

//           {/* Contact Number */}
//           <div className="flex flex-col gap-1">
//             <label htmlFor="shop-contact-number">Contact Number</label>
//             <input
//               type="tel"
//               id="shop-contact-number"
//               placeholder="Enter Contact Number"
//               pattern="[0-9]{10}"
//               maxLength={10}
//               value={data?.contactNumber}
//               onChange={(e) => handleData("contactNumber", e.target.value)}
//               className="border border-gray-400 rounded-lg px-3 py-2 w-full focus:outline-none"
//             />
//           </div>

//           {/* Email */}
//           <div className="flex flex-col gap-1">
//             <label htmlFor="shop-email">Email</label>
//             <input
//               type="email"
//               id="shop-email"
//               placeholder="Enter Email"
//               value={data?.email}
//               onChange={(e) => handleData("email", e.target.value)}
//               className="border border-gray-400 rounded-lg px-3 py-2 w-full focus:outline-none"
//             />
//           </div>

//           {/* Website */}
//           <div className="flex flex-col gap-1">
//             <label htmlFor="website">Website / Social Link</label>
//             <input
//               type="url"
//               id="website"
//               placeholder="Enter Website / Social Link"
//               value={data?.websiteLink}
//               onChange={(e) => handleData("websiteLink", e.target.value)}
//               className="border border-gray-400 rounded-lg px-3 py-2 w-full focus:outline-none"
//             />
//           </div>
//         </div>

//         {/* Right Column: Images + Description */}
// <div className="flex flex-col gap-6">
//   {/* Images */}
//   <div className="bg-white rounded-lg shadow p-6 flex flex-col gap-4">
//     <h2 className="text-lg font-semibold border-b pb-2">Images</h2>

//     {/* Logo */}
//     <div className="flex flex-col gap-2">
//       <label htmlFor="shop-logo">Logo</label>
//       <input
//         type="file"
//         id="shop-logo"
//         accept="image/*"
//         onChange={(e) => setLogo(e.target.files[0])}
//         className="border border-gray-400 rounded-lg px-3 py-2 w-full focus:outline-none"
//       />
//       {logo && (
//         <img
//           src={URL.createObjectURL(logo)}
//           alt="Shop Logo Preview"
//           className="w-24 object-cover rounded mt-2"
//         />
//       )}
//     </div>

//     {/* Banner */}
//     <div className="flex flex-col gap-2">
//       <label htmlFor="bannerImage">Banner Image</label>
//       <input
//         type="file"
//         id="bannerImage"
//         accept="image/*"
//         onChange={(e) => setBannerImage(e.target.files[0])}
//         className="border border-gray-400 rounded-lg px-3 py-2 w-full focus:outline-none"
//       />
//       {bannerImage && (
//         <img
//           src={URL.createObjectURL(bannerImage)}
//           alt="Banner Preview"
//           className="w-24 mt-2"
//         />
//       )}
//     </div>

//     {/* Gallery Images */}
//     <div className="flex flex-col gap-2">
//       <label htmlFor="shop-images">Gallery Images</label>
//       <input
//         type="file"
//         id="shop-images"
//         multiple
//         accept="image/*"
//         onChange={(e) => setImages(Array.from(e.target.files))}
//         className="border border-gray-400 rounded-lg px-3 py-2 w-full focus:outline-none"
//       />
//       <div className="flex gap-2 flex-wrap mt-2">
//         {images.map((img, i) => (
//           <img
//             key={i}
//             src={URL.createObjectURL(img)}
//             alt={`Preview ${i}`}
//             className="h-24 object-cover rounded"
//           />
//         ))}
//       </div>
//     </div>
//   </div>

//   {/* Description */}
//   <div className="bg-white rounded-lg shadow p-6 flex flex-col gap-4">
//     <h2 className="text-lg font-semibold border-b pb-2">Description</h2>
//     <textarea
//       id="shop-description"
//       rows={6}
//       placeholder="Enter shop description..."
//       value={data?.description || ""}
//       onChange={(e) => handleData("description", e.target.value)}
//       className="border border-gray-400 rounded-lg px-3 py-2 w-full focus:outline-none"
//     />
//   </div>
// </div>

//         {/* Buttons */}
//         <div className="flex flex-col sm:flex-row gap-3 mt-4 col-span-1 sm:col-span-3">
//           <button
//             type="submit"
//             className="bg-[#FBBF24] px-6 py-2 rounded-lg w-full sm:w-auto hover:bg-[#F97316] hover:text-white disabled:opacity-50"
//             disabled={isLoading}
//           >
//             {isLoading
//               ? id
//                 ? "Updating..."
//                 : "Creating..."
//               : id
//               ? "Update"
//               : "Create"}
//           </button>
//           <button
//             type="button"
//             onClick={() => router.push("/admin/shop")}
//             className="bg-gray-300 px-6 py-2 rounded-lg w-full sm:w-auto hover:bg-gray-400 hover:text-white disabled:opacity-50"
//             disabled={isLoading}
//           >
//             Cancel
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// }

"use client";
import { createNewShop, UpdateShop } from "@/lib/firestore/shop/write";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useCategory } from "@/lib/firestore/categories/read";
import { useFloor } from "@/lib/firestore/floors/read";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firestore/firebase";

export default function Page() {
  const { data: category } = useCategory();
  const { data: floor } = useFloor();
  const [logo, setLogo] = useState(null);
  const [images, setImages] = useState([]);
  const [bannerImage, setBannerImage] = useState(null);
  const [floorStatus, setFloorStatus] = useState(null); // ✅ floor status
  const [data, setData] = useState({
    name: "",
    ownerName: "",
    shopNumber: "",
    category: "",
    floor: "",
    contactNumber: "",
    email: "",
    websiteLink: "",
    description: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const searchParams = useSearchParams();
  const id = searchParams?.get("id") || null;
  const router = useRouter();

  // Fetch shop if updating
  useEffect(() => {
    if (!id) return;

    const fetchShop = async () => {
      setIsLoading(true);
      try {
        const docRef = doc(db, "shop", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const shop = docSnap.data();
          setData({ ...shop, id });
        } else {
          alert("⚠️ Shop not found");
          router.push("/admin/shop");
        }
      } catch (error) {
        console.error(error);
        alert("❌ Failed to load Shop");
      } finally {
        setIsLoading(false);
      }
    };

    fetchShop();
  }, [id, router]);

  const handleData = (key, value) => {
    setData((prev) => ({ ...prev, [key]: value }));
  };

  // ✅ Check floor status when user selects a floor
  useEffect(() => {
    const checkFloorStatus = async () => {
      if (!data.floor) {
        setFloorStatus(null);
        return;
      }

      try {
        const floorRef = doc(db, "floors", data.floor);
        const floorSnap = await getDoc(floorRef);
        if (floorSnap.exists()) {
          const floorData = floorSnap.data();
          setFloorStatus(floorData.status || "Unknown");
        } else {
          setFloorStatus("Unknown");
        }
      } catch (error) {
        console.error("Error fetching floor status:", error);
      }
    };

    checkFloorStatus();
  }, [data.floor]);

  // ✅ Prevent submission if floor inactive
  const handleSubmit = async () => {
    if (!id && floorStatus === "Inactive") {
      alert("⚠️ This floor is inactive. You cannot create a new shop here.");
      return;
    }

    setIsLoading(true);
    try {
      await createNewShop({
        data: data,
        logo: logo,
        images: images,
        bannerImage: bannerImage,
      });
      setData({
        name: "",
        ownerName: "",
        shopNumber: "",
        category: "",
        floor: "",
        contactNumber: "",
        email: "",
        websiteLink: "",
        description: "",
      });
      setLogo(null);
      setBannerImage(null);
      setImages([]);
      alert("✅ Shop Created!");
      router.push(`/admin/shop`);
    } catch (error) {
      console.log(error?.message);
      alert(error?.message);
    }
    setIsLoading(false);
  };

  const handleUpdate = async () => {
    setIsLoading(true);
    try {
      await UpdateShop({
        data: data,
        logo: logo,
        images: images,
        bannerImage: bannerImage,
      });
      alert("✅ Shop Updated!");
      router.push(`/admin/shop`);
    } catch (error) {
      alert(error?.message || "Something Went Wrong....!");
    }
    setIsLoading(false);
  };

  const isDisabled = !id && floorStatus === "Inactive"; // ✅ disable only for creation

  return (
    <div className="flex-1 flex flex-col gap-5 rounded-xl p-3 sm:p-8 md:p-12 bg-gray-50">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">
          {id ? "Update" : "Create"} Shop
        </h1>
        <button
          type="button"
          onClick={() => router.push("/admin/shop")}
          className="bg-gray-300 px-6 py-2 rounded-lg w-full sm:w-auto hover:bg-gray-400 hover:text-white"
          disabled={isLoading}
        >
          Cancel
        </button>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (id) {
            handleUpdate();
          } else {
            handleSubmit();
          }
        }}
        className="grid grid-cols-1 gap-6 lg:grid-cols-3"
      >
        {/* Left Column: Basic Details */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow p-6 flex flex-col gap-4">
          <h2 className="text-lg font-semibold border-b pb-2">Basic Details</h2>

          {/* Shop Name */}
          <div className="flex flex-col gap-1">
            <label htmlFor="shop-name">Shop Name</label>
            <input
              type="text"
              id="shop-name"
              placeholder="Enter Shop Name"
              value={data?.name}
              onChange={(e) => handleData("name", e.target.value)}
              className="border border-gray-400 rounded-lg px-3 py-2 w-full focus:outline-none"
            />
          </div>

          {/* Owner Name */}
          <div className="flex flex-col gap-1">
            <label htmlFor="shop-owner-name">Owner Name</label>
            <input
              type="text"
              id="shop-owner-name"
              value={data?.ownerName}
              onChange={(e) => handleData("ownerName", e.target.value)}
              placeholder="Enter Owner Name"
              className="border border-gray-400 rounded-lg px-3 py-2 w-full focus:outline-none"
            />
          </div>

          {/* Shop Number */}
          <div className="flex flex-col gap-1">
            <label htmlFor="shop-number">Shop Number</label>
            <input
              type="number"
              id="shop-number"
              placeholder="Enter Shop Number"
              value={data?.shopNumber}
              onChange={(e) => handleData("shopNumber", e.target.value)}
              className="border border-gray-400 rounded-lg px-3 py-2 w-full focus:outline-none"
            />
          </div>

          {/* Category */}
          <div className="flex flex-col gap-1">
            <label htmlFor="shop-category">Category</label>
            <select
              id="shop-category"
              value={data?.category || ""}
              onChange={(e) => handleData("category", e.target.value)}
              className="border border-gray-400 rounded-lg px-3 py-2 w-full focus:outline-none"
            >
              <option value="">Select Category</option>
              {category?.map((item) => (
                <option value={item?.id} key={item?.id}>
                  {item?.name}
                </option>
              ))}
            </select>
          </div>

          {/* Floor */}
          <div className="flex flex-col gap-1">
            <label htmlFor="shop-floor">Floor</label>
            <select
              id="shop-floor"
              value={data?.floor || ""}
              onChange={(e) => handleData("floor", e.target.value)}
              className="border border-gray-400 rounded-lg px-3 py-2 w-full focus:outline-none"
            >
              <option value="">Select Floor</option>
              {floor?.map((item) => (
                <option value={item?.id} key={item?.id}>
                  {item?.name}
                </option>
              ))}
            </select>

            {/* ✅ Warning when inactive */}
            {floorStatus === "Inactive" && (
              <p className="text-red-600 text-sm mt-1">
                ⚠️ This floor is inactive. You cannot create a new shop here.
              </p>
            )}
          </div>

          {/* Contact Number */}
          <div className="flex flex-col gap-1">
            <label htmlFor="shop-contact-number">Contact Number</label>
            <input
              type="tel"
              id="shop-contact-number"
              placeholder="Enter Contact Number"
              pattern="[0-9]{10}"
              maxLength={10}
              value={data?.contactNumber}
              onChange={(e) => handleData("contactNumber", e.target.value)}
              className="border border-gray-400 rounded-lg px-3 py-2 w-full focus:outline-none"
            />
          </div>

          {/* Email */}
          <div className="flex flex-col gap-1">
            <label htmlFor="shop-email">Email</label>
            <input
              type="email"
              id="shop-email"
              placeholder="Enter Email"
              value={data?.email}
              onChange={(e) => handleData("email", e.target.value)}
              className="border border-gray-400 rounded-lg px-3 py-2 w-full focus:outline-none"
            />
          </div>

          {/* Website */}
          <div className="flex flex-col gap-1">
            <label htmlFor="website">Website / Social Link</label>
            <input
              type="url"
              id="website"
              placeholder="Enter Website / Social Link"
              value={data?.websiteLink}
              onChange={(e) => handleData("websiteLink", e.target.value)}
              className="border border-gray-400 rounded-lg px-3 py-2 w-full focus:outline-none"
            />
          </div>

          <div className="flex flex-col gap-1 col-span-2">
            <label htmlFor="status">Shop Status</label>

            <select
              id="status"
              value={data?.status}
              onChange={(e) => handleData("status", e.target.value)}
              className="border border-gray-400 rounded-lg px-3 py-2 focus:outline-none w-full"
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
              <option value="Under Maintenance">Under Maintenance</option>
              <option value="Closed">Closed</option>
            </select>
          </div>
        </div>

        {/* Right Column: Images + Description */}
        {/* unchanged code here */}
        <div className="flex flex-col gap-6">
          {/* Images */}
          <div className="bg-white rounded-lg shadow p-6 flex flex-col gap-4">
            <h2 className="text-lg font-semibold border-b pb-2">Images</h2>

            {/* Logo */}
            <div className="flex flex-col gap-2">
              <label htmlFor="shop-logo">Logo</label>
              <input
                type="file"
                id="shop-logo"
                accept="image/*"
                onChange={(e) => setLogo(e.target.files[0])}
                className="border border-gray-400 rounded-lg px-3 py-2 w-full focus:outline-none"
              />
              {logo && (
                <img
                  src={URL.createObjectURL(logo)}
                  alt="Shop Logo Preview"
                  className="w-24 object-cover rounded mt-2"
                />
              )}
            </div>

            {/* Banner */}
            <div className="flex flex-col gap-2">
              <label htmlFor="bannerImage">Banner Image</label>
              <input
                type="file"
                id="bannerImage"
                accept="image/*"
                onChange={(e) => setBannerImage(e.target.files[0])}
                className="border border-gray-400 rounded-lg px-3 py-2 w-full focus:outline-none"
              />
              {bannerImage && (
                <img
                  src={URL.createObjectURL(bannerImage)}
                  alt="Banner Preview"
                  className="w-24 mt-2"
                />
              )}
            </div>

            {/* Gallery Images */}
            <div className="flex flex-col gap-2">
              <label htmlFor="shop-images">Gallery Images</label>
              <input
                type="file"
                id="shop-images"
                multiple
                accept="image/*"
                onChange={(e) => setImages(Array.from(e.target.files))}
                className="border border-gray-400 rounded-lg px-3 py-2 w-full focus:outline-none"
              />
              <div className="flex gap-2 flex-wrap mt-2">
                {images.map((img, i) => (
                  <img
                    key={i}
                    src={URL.createObjectURL(img)}
                    alt={`Preview ${i}`}
                    className="h-24 object-cover rounded"
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="bg-white rounded-lg shadow p-6 flex flex-col gap-4">
            <h2 className="text-lg font-semibold border-b pb-2">Description</h2>
            <textarea
              id="shop-description"
              rows={6}
              placeholder="Enter shop description..."
              value={data?.description || ""}
              onChange={(e) => handleData("description", e.target.value)}
              className="border border-gray-400 rounded-lg px-3 py-2 w-full focus:outline-none"
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 mt-4 col-span-1 sm:col-span-3">
          <button
            type="submit"
            disabled={isDisabled || isLoading}
            className={`px-6 py-2 rounded-lg w-full sm:w-auto ${
              isDisabled
                ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                : "bg-[#FBBF24] hover:bg-[#F97316] hover:text-white"
            }`}
          >
            {isLoading
              ? id
                ? "Updating..."
                : "Creating..."
              : id
              ? "Update"
              : "Create"}
          </button>
        </div>
      </form>
    </div>
  );
}
