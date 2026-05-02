"use client";

import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useApi } from "@/hooks/useApi";
import { CartDto } from "@/types/api";

export type CartItem = {
    foodId: string;
    name: string;
    price: number;
    quantity: number;
    image: string;
};

type AddItemResult = "added" | "conflict";

type CartContextType = {
    items: CartItem[];
    cartId: string | null;
    restaurantId: string | null;
    restaurantName: string;
    isLoading: boolean;
    addItem: (item: Omit<CartItem, "quantity">, restaurantId: string, restaurantName: string) => Promise<AddItemResult>;
    replaceCart: (item: Omit<CartItem, "quantity">, restaurantId: string, restaurantName: string) => Promise<AddItemResult>;
    removeItem: (foodId: string) => Promise<void>;
    updateQuantity: (foodId: string, delta: number) => Promise<void>;
    clearCart: () => Promise<void>;
    totalItems: number;
    subtotal: number;
};

const CartContext = createContext<CartContextType | null>(null);

function mapCartItem(item: CartDto["items"][number], image: string): CartItem {
    return {
        foodId: item.dishId,
        name: item.dishName,
        price: item.dishPrice,
        quantity: item.quantity,
        image,
    };
}

export function CartProvider({ children }: { children: React.ReactNode }) {
    const { get, post, patch, del } = useApi();
    const { token, isLoading: isAuthLoading } = useAuth();
    const [items, setItems] = useState<CartItem[]>([]);
    const [cartId, setCartId] = useState<string | null>(null);
    const [restaurantId, setRestaurantId] = useState<string | null>(null);
    const [restaurantName, setRestaurantName] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const imagesByDishId = useRef<Record<string, string>>({});

    useEffect(() => {
        if (isAuthLoading) {
            return;
        }

        if (!token) {
            imagesByDishId.current = {};
            setItems([]);
            setCartId(null);
            setRestaurantId(null);
            setRestaurantName("");
            setIsLoading(false);
            return;
        }

        let cancelled = false;
        setIsLoading(true);

        get<CartDto>("/cart")
            .then((cart) => {
                if (cancelled) {
                    return;
                }

                setCartId(cart.id);
                setRestaurantId(cart.restaurantId);
                setRestaurantName(cart.restaurantId ? `Restaurant ${cart.restaurantId.slice(-4)}` : "");
                setItems(cart.items.map((item) => mapCartItem(item, imagesByDishId.current[item.dishId] ?? "")));
            })
            .catch(() => {
                if (cancelled) {
                    return;
                }

                imagesByDishId.current = {};
                setItems([]);
                setCartId(null);
                setRestaurantId(null);
                setRestaurantName("");
            })
            .finally(() => {
                if (!cancelled) {
                    setIsLoading(false);
                }
            });

        return () => {
            cancelled = true;
        };
    }, [get, isAuthLoading, token]);

    const syncCart = (cart: CartDto) => {
        setCartId(cart.id);
        setRestaurantId(cart.restaurantId);
        setItems(cart.items.map((item) => mapCartItem(item, imagesByDishId.current[item.dishId] ?? "")));
    };

    const addItem = async (
        item: Omit<CartItem, "quantity">,
        newRestaurantId: string,
        newRestaurantName: string,
    ): Promise<AddItemResult> => {
        try {
            const updated = await post<CartDto>("/cart/items", {
                dishId: item.foodId,
                restaurantId: newRestaurantId,
                quantity: 1,
            });
            imagesByDishId.current[item.foodId] = item.image;
            setRestaurantName(newRestaurantName);
            syncCart(updated);
            return "added";
        } catch (error) {
            const message = error instanceof Error ? error.message.toLowerCase() : "";
            if (message.includes("cannot add items from restaurant") || message.includes("different restaurant")) {
                return "conflict";
            }
            throw error;
        }
    };

    const replaceCart = async (
        item: Omit<CartItem, "quantity">,
        newRestaurantId: string,
        newRestaurantName: string,
    ): Promise<AddItemResult> => {
        await del<CartDto>("/cart");
        imagesByDishId.current = { [item.foodId]: item.image };
        setRestaurantName(newRestaurantName);
        const updated = await post<CartDto>("/cart/items", {
            dishId: item.foodId,
            restaurantId: newRestaurantId,
            quantity: 1,
        });
        syncCart(updated);
        return "added";
    };

    const removeItem = async (foodId: string) => {
        const updated = await del<CartDto>(`/cart/items/${foodId}`);
        delete imagesByDishId.current[foodId];
        syncCart(updated);
    };

    const updateQuantity = async (foodId: string, delta: number) => {
        const currentItem = items.find((item) => item.foodId === foodId);
        if (!currentItem) {
            return;
        }

        const nextQuantity = currentItem.quantity + delta;
        if (nextQuantity <= 0) {
            await removeItem(foodId);
            return;
        }

        const updated = await patch<CartDto>(`/cart/items/${foodId}`, {
            quantity: nextQuantity,
        });
        syncCart(updated);
    };

    const clearCart = async () => {
        const updated = await del<CartDto>("/cart");
        imagesByDishId.current = {};
        setRestaurantName("");
        syncCart(updated);
    };

    const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
    const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

    return (
        <CartContext.Provider
            value={{
                items,
                cartId,
                restaurantId,
                restaurantName,
                isLoading,
                addItem,
                replaceCart,
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
