// "use client"

// import { auth, db } from "@/lib/firestore/firebase";
// import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
// import { doc, setDoc } from "firebase/firestore";
// import Link from "next/link";
// import { useRouter } from "next/navigation";
// import { useState } from "react";

// export default function Page() {

//     const [email, setEmail] = useState("");
//     const [name, setName] = useState("");
//     const [password, setPassword] = useState("");
//     const [photo, setPhoto] = useState(null);
//     const [photoPreview, setPhotoPreview] = useState(null);
//     const [errorMsg, setErrorMsg] = useState("");
//     const router = useRouter();

//     const handlePhotoChange = (e) => {
//         const file = e.target.files[0];
//         setPhoto(file);

//         if (file) {
//             setPhotoPreview(URL.createObjectURL(file)); // Create preview URL
//         } else {
//             setPhotoPreview(null);
//         }
//     };

//     const handleSignUp = async (e) => {
//         e.preventDefault();
//         setErrorMsg("");
//         try {
//             // Create user with email and password
//             const userCredential = await createUserWithEmailAndPassword(auth, email, password);

//             // Update displayName
//             await updateProfile(userCredential.user, {
//                 displayName: name,
//                 photoURL: photo ? URL.createObjectURL(photo) : null,
//             });

//             // Write user document to Firestore with default role 'user'
//             const userRef = doc(db, "users", userCredential.user.uid);
//             await setDoc(userRef, {
//                 name,
//                 email,
//                 role: "user",
//                 photoURL: photo ? URL.createObjectURL(photo) : null,
//                 createdAt: new Date().toISOString(),
//             });

//             // Wait a tiny bit to ensure displayName is updated
//             setTimeout(() => {
//                 router.push("/dashboard");
//             }, 100); // optional delay
//         } catch (error) {
//             if (error.code === "auth/email-already-in-use") {
//                 setErrorMsg("You are already registered. Please go login.");
//             } else {
//                 setErrorMsg(error.message);
//             }
//             console.log(error.message);
//         }
//     }

//     return (
//         <div className="flex min-h-screen items-center justify-center bg-gray-100">
//             <form onSubmit={handleSignUp} className="bg-white flex flex-col gap-5 p-6 rounded-xl shadow-md w-96">
//                 <h2 className="text-xl font-bold mb-4">Sign Up</h2>
//                 {photoPreview && (
//                     <div className="flex items-center justify-center">
//                         <img
//                             src={photoPreview}
//                             alt="Preview"
//                             className="w-32 object-cover rounded-lg"
//                         />
//                     </div>
//                 )}
//                 <input
//                     type="file"
//                     accept="image/*"
//                     onChange={handlePhotoChange}
//                     className="border-b p-2 w-full focus:outline-none"
//                 />

//                 {errorMsg && <p className="text-red-500">{errorMsg}</p>}
//                 <input
//                     type="text"
//                     placeholder="Enter Name"
//                     value={name}
//                     onChange={(e) => setName(e.target.value)}
//                     className="border-b p-2 w-full focus:outline-none"
//                 />
//                 <input
//                     type="email"
//                     placeholder="Email"
//                     value={email}
//                     onChange={(e) => setEmail(e.target.value)}
//                     className="border-b p-2 w-full focus:outline-none"
//                 />
//                 <input
//                     type="password"
//                     placeholder="Password"
//                     value={password}
//                     onChange={(e) => setPassword(e.target.value)}
//                     className="border-b p-2 w-full focus:outline-none"
//                 />
//                 {errorMsg && <p className="text-red-500">{errorMsg}</p>}
//                 <button type="submit" className="w-full bg-green-600 text-white py-2 rounded">
//                     Sign Up
//                 </button>
//                 <Link href={"/login"}>
//                     <button className="">
//                         login
//                     </button>
//                 </Link>
//             </form>
//         </div>
//     )
// }



"use client"

import { auth, db } from "@/lib/firestore/firebase";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Page() {
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [photo, setPhoto] = useState(null);
    const [photoPreview, setPhotoPreview] = useState(null);
    const [errorMsg, setErrorMsg] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        setPhoto(file);

        if (file) {
            setPhotoPreview(URL.createObjectURL(file));
        } else {
            setPhotoPreview(null);
        }
    };

    const handleSignUp = async (e) => {
        e.preventDefault();
        setErrorMsg("");
        setLoading(true);

        try {
            // Create user with email and password
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);

            // Update displayName
            await updateProfile(userCredential.user, {
                displayName: name,
                photoURL: photo ? URL.createObjectURL(photo) : null,
            });

            // Write user document to Firestore
            const userRef = doc(db, "users", userCredential.user.uid);
            await setDoc(userRef, {
                name,
                email,
                role: "user",
                photoURL: photo ? URL.createObjectURL(photo) : null,
                createdAt: new Date().toISOString(),
            });

            setTimeout(() => {
                router.push("/dashboard");
            }, 100);
        } catch (error) {
            if (error.code === "auth/email-already-in-use") {
                setErrorMsg("You are already registered. Please go login.");
            } else {
                setErrorMsg(error.message);
            }
            console.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-100">
            <form
                onSubmit={handleSignUp}
                className="bg-white flex flex-col gap-5 p-6 rounded-xl shadow-md w-96"
            >
                <h2 className="text-xl font-bold mb-4 text-center">Sign Up</h2>

                {photoPreview && (
                    <div className="flex items-center justify-center">
                        <img
                            src={photoPreview}
                            alt="Preview"
                            className="w-32 h-32 object-cover rounded-lg"
                        />
                    </div>
                )}

                <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoChange}
                    className="border-b p-2 w-full focus:outline-none"
                    disabled={loading}
                />

                {errorMsg && <p className="text-red-500 text-sm">{errorMsg}</p>}

                <input
                    type="text"
                    placeholder="Enter Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="border-b p-2 w-full focus:outline-none"
                    disabled={loading}
                />

                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="border-b p-2 w-full focus:outline-none"
                    disabled={loading}
                />

                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="border-b p-2 w-full focus:outline-none"
                    disabled={loading}
                />

                <button
                    type="submit"
                    disabled={loading}
                    className={`w-full py-2 rounded text-white font-semibold transition 
                        ${loading ? "bg-green-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"}
                    `}
                >
                    {loading ? (
                        <div className="flex justify-center items-center gap-2">
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            Signing up...
                        </div>
                    ) : (
                        "Sign Up"
                    )}
                </button>

                <Link href="/login" className="text-center text-blue-600 hover:underline">
                    Already have an account? Login
                </Link>
            </form>
        </div>
    );
}
