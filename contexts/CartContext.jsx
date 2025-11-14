"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { db } from "@/lib/firestore/firebase";
import { useAuth } from "@/contexts/AuthContext";
import {
  collection,
  getDocs,
  setDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cart, setCart] = useState([]);

  // ---------------------------------------------
  // Load Cart (guest → localStorage, user → Firestore)
  // ---------------------------------------------
  useEffect(() => {
    if (!user) {
      const stored = localStorage.getItem("cart");
      if (stored) setCart(JSON.parse(stored));
      return;
    }

    const loadFirestoreCart = async () => {
      const cartRef = collection(db, "users", user.uid, "cart");
      const snap = await getDocs(cartRef);

      const items = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setCart(items);
    };

    loadFirestoreCart();
  }, [user]);

  // ---------------------------------------------
  // Save guest cart to localStorage
  // ---------------------------------------------
  useEffect(() => {
    if (!user) {
      localStorage.setItem("cart", JSON.stringify(cart));
    }
  }, [cart, user]);

  // ---------------------------------------------
  // Sync to Firestore for logged-in user
  // ---------------------------------------------
  const syncToFirestore = async (updatedCart) => {
    if (!user) return;

    const cartRef = collection(db, "users", user.uid, "cart");

    const snap = await getDocs(cartRef);

    // Clear existing Firestore cart
    await Promise.all(
      snap.docs.map((d) => deleteDoc(doc(db, "users", user.uid, "cart", d.id)))
    );

    // Add updated cart
    await Promise.all(
      updatedCart.map((item) =>
        setDoc(doc(db, "users", user.uid, "cart", item.id), item)
      )
    );
  };

  // ---------------------------------------------
  // Update cart function
  // ---------------------------------------------
  const updateCart = async (newCart) => {
    setCart(newCart);

    if (user) {
      await syncToFirestore(newCart);
    }
  };

  // ---------------------------------------------
  // Cart Count (Badge number)
  // ---------------------------------------------
  const cartCount = cart.reduce(
    (total, item) => total + (item.quantity || 1),
    0
  );

  return (
    <CartContext.Provider value={{ cart, cartCount, setCart: updateCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
