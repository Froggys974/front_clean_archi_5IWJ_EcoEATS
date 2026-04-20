"use client";

import React, { createContext, useContext, useState } from "react";

export type CartItem = {
    foodId: number;
    name: string;
    price: number;
    quantity: number;
    image: string;
};

type AddItemResult = "added" | "conflict";

type CartContextType = {
    items: CartItem[];
    restaurantId: number | null;
    restaurantName: string;
    addItem: (item: Omit<CartItem, "quantity">, restaurantId: number, restaurantName: string) => AddItemResult;
    removeItem: (foodId: number) => void;
    updateQuantity: (foodId: number, delta: number) => void;
    clearCart: () => void;
    totalItems: number;
    subtotal: number;
};

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
    const [items, setItems] = useState<CartItem[]>([]);
    const [restaurantId, setRestaurantId] = useState<number | null>(null);
    const [restaurantName, setRestaurantName] = useState("");

    const addItem = (
        item: Omit<CartItem, "quantity">,
        newRestaurantId: number,
        newRestaurantName: string,
    ): AddItemResult => {
        if (restaurantId !== null && restaurantId !== newRestaurantId && items.length > 0) {
            return "conflict";
        }

        setRestaurantId(newRestaurantId);
        setRestaurantName(newRestaurantName);
        setItems((prev) => {
            const existing = prev.find((i) => i.foodId === item.foodId);
            if (existing) {
                return prev.map((i) =>
                    i.foodId === item.foodId ? { ...i, quantity: i.quantity + 1 } : i,
                );
            }
            return [...prev, { ...item, quantity: 1 }];
        });

        return "added";
    };

    const removeItem = (foodId: number) => {
        setItems((prev) => {
            const updated = prev.filter((i) => i.foodId !== foodId);
            if (updated.length === 0) setRestaurantId(null);
            return updated;
        });
    };

    const updateQuantity = (foodId: number, delta: number) => {
        setItems((prev) => {
            const updated = prev
                .map((i) =>
                    i.foodId === foodId ? { ...i, quantity: Math.max(0, i.quantity + delta) } : i,
                )
                .filter((i) => i.quantity > 0);
            if (updated.length === 0) setRestaurantId(null);
            return updated;
        });
    };

    const clearCart = () => {
        setItems([]);
        setRestaurantId(null);
        setRestaurantName("");
    };

    const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
    const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

    return (
        <CartContext.Provider
            value={{
                items,
                restaurantId,
                restaurantName,
                addItem,
                removeItem,
                updateQuantity,
                clearCart,
                totalItems,
                subtotal,
            }}
        >
            {children}
        </CartContext.Provider>
    );
}

export function useCart(): CartContextType {
    const ctx = useContext(CartContext);
    if (!ctx) throw new Error("useCart must be used within CartProvider");
    return ctx;
}
