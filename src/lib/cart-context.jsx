"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem("fw_cart");
      if (saved) {
        setItems(JSON.parse(saved));
      }
    } catch {}
  }, []);

  // Sync to localStorage
  const saveItems = (newItems) => {
    setItems(newItems);
    try {
      localStorage.setItem("fw_cart", JSON.stringify(newItems));
    } catch {}
  };

  const addToCart = (item, qty = 1) => {
    const existing = items.find((i) => i.listingId === item.listingId);
    const currentQty = existing ? existing.quantity : 0;
    const requestedTotal = currentQty + qty;

    if (requestedTotal > item.maxAvailable) {
      return {
        success: false,
        message: `Only ${item.maxAvailable} portion(s) available for this item.`,
      };
    }

    if (existing) {
      const updated = items.map((i) =>
        i.listingId === item.listingId ? { ...i, quantity: requestedTotal } : i
      );
      saveItems(updated);
    } else {
      saveItems([...items, { ...item, quantity: qty }]);
    }

    return { success: true };
  };

  const removeFromCart = (listingId) => {
    const updated = items.filter((i) => i.listingId !== listingId);
    saveItems(updated);
  };

  const updateQuantity = (listingId, qty) => {
    if (qty <= 0) {
      removeFromCart(listingId);
      return true;
    }

    const target = items.find((i) => i.listingId === listingId);
    if (!target) return false;

    if (qty > target.maxAvailable) {
      return false;
    }

    const updated = items.map((i) =>
      i.listingId === listingId ? { ...i, quantity: qty } : i
    );
    saveItems(updated);
    return true;
  };

  const clearCart = () => {
    saveItems([]);
  };

  const totalPortions = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        totalPortions,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
