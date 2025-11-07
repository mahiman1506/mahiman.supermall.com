// "use client"

// import { auth, db } from "@/lib/firestore/firebase";
// import { signInWithEmailAndPassword } from "firebase/auth";
// import { collection, doc, getDoc, getDocs, query, where } from "firebase/firestore";
// import Link from "next/link";
// import { useRouter } from "next/navigation";
// import { useState } from "react"

// export default function Page() {

//     const [email, setEmail] = useState("");
//     const [password, setPassword] = useState("");
//     const [errorMsg, setErrorMsg] = useState("");
//     const router = useRouter();

//     const handleLogin = async (e) => {
//         e.preventDefault();
//         try {
//             const userCred = await signInWithEmailAndPassword(auth, email, password);
//             const user = userCred.user;

//             // Get user data from Firestore
//             const userDoc = await getDoc(doc(db, "users", user.uid));
//             const data = userDoc.exists() ? userDoc.data() : null;

//             const role = data?.role ?? "user";

//             if (role === "admin") {
//                 router.push("/admin");
//             } else if (role === "shop") {
//                 // redirect to shop layout route
//                 router.push("/shopLayout");
//             } else {
//                 router.push("/dashboard");
//             }

//         } catch (error) {
//             if (error.code === "auth/invalid-credential") {
//                 setErrorMsg("You are NOT registered. Please go Sign Up.");
//             } else {
//                 setErrorMsg(error.message);
//             }
//             alert(error.message);
//         }
//     };

//     return (
//         <div className="flex min-h-screen items-center justify-center bg-gray-100">
//             <form onSubmit={handleLogin} className="bg-white flex flex-col gap-5 p-6 rounded-xl shadow-md w-96">
//                 <h2 className="text-xl font-bold mb-4">Login</h2>
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
//                 <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded">
//                     Login
//                 </button>
//                 <Link href={"/signup"}>
//                     <h1>Sign Up</h1>
//                 </Link>
//             </form>
//         </div>
//     )
// }

"use client"

import { auth, db } from "@/lib/firestore/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Page() {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMsg, setErrorMsg] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleLogin = async (e) => {
        e.preventDefault();
        setErrorMsg("");
        setLoading(true);

        try {
            const userCred = await signInWithEmailAndPassword(auth, email, password);
            const user = userCred.user;

            const userDoc = await getDoc(doc(db, "users", user.uid));
            const data = userDoc.exists() ? userDoc.data() : null;
            const role = data?.role ?? "user";

            if (role === "admin") {
                router.push("/admin");
            } else if (role === "shop") {
                router.push("/shopLayout");
            } else {
                router.push("/dashboard");
            }

        } catch (error) {
            if (error.code === "auth/invalid-credential") {
                setErrorMsg("You are NOT registered. Please go Sign Up.");
            } else {
                setErrorMsg(error.message);
            }
            alert(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-100">
            <form
                onSubmit={handleLogin}
                className="bg-white flex flex-col gap-5 p-6 rounded-xl shadow-md w-96"
            >
                <h2 className="text-xl font-bold mb-4 text-center">Login</h2>

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

                {errorMsg && <p className="text-red-500 text-sm">{errorMsg}</p>}

                <button
                    type="submit"
                    disabled={loading}
                    className={`w-full py-2 rounded text-white font-semibold transition 
                        ${loading ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"}
                    `}
                >
                    {loading ? (
                        <div className="flex justify-center items-center gap-2">
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            Logging in...
                        </div>
                    ) : (
                        "Login"
                    )}
                </button>

                <div className="flex gap-5 items-center justify-center">
                    <Link href="/signup" className="text-center text-blue-600 hover:underline">
                        Sign Up
                    </Link>

                    <Link href="/forgotpassword" className="text-center text-blue-900 hover:underline">
                        Forgot Password
                    </Link>
                </div>
            </form>
        </div>
    );
}
