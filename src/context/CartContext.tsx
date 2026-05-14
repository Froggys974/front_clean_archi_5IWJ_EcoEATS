"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import { useAuth } from "@/context/AuthContext";
import { apiRequest } from "@/services/api";

export type CartItem = {
    foodId: string;
    name: string;
    price: number;
    quantity: number;
    image: string;
};

type AddItemResult = "added" | "conflict";

type ApiCartItem = {
    dishId: string;
    dishName: string;
    dishPrice: number;
    dishImageUrl: string | null;
    quantity: number;
};

type ApiCart = {
    id: string;
    clientId: string;
    restaurantId: string | null;
    isCheckedOut: boolean;
    items: ApiCartItem[];
    totalPrice: number;
    totalItems: number;
    updatedAt: string;
};

type CartContextType = {
    items: CartItem[];
    restaurantId: string | null;
    restaurantName: string;
    cartId: string | null;
    addItem: (item: Omit<CartItem, "quantity">, restaurantId: string, restaurantName: string) => AddItemResult;
    replaceCart: (item: Omit<CartItem, "quantity">, restaurantId: string, restaurantName: string) => void;
    removeItem: (foodId: string) => void;
    updateQuantity: (foodId: string, delta: number) => void;
    clearCart: () => void;
    totalItems: number;
    subtotal: number;
};

const CartContext = createContext<CartContextType | null>(null);

const RESTAURANT_NAME_KEY = "cart_restaurant_name";

function hydrateItems(apiItems: ApiCartItem[]): CartItem[] {
    return apiItems.map((apiItem) => ({
        foodId: apiItem.dishId,
        name: apiItem.dishName,
        price: apiItem.dishPrice,
        quantity: apiItem.quantity,
        image: apiItem.dishImageUrl ?? "",
    }));
}

export function CartProvider({ children }: { children: React.ReactNode }) {
    const { token, user, isLoading: authLoading } = useAuth();
    const isClient = !authLoading && !!token && (user?.roles?.includes("CLIENT") ?? false);

    const [items, setItems] = useState<CartItem[]>([]);
    const [restaurantId, setRestaurantId] = useState<string | null>(null);
    const [restaurantName, setRestaurantName] = useState("");
    const [cartId, setCartId] = useState<string | null>(null);

    const itemsRef = useRef(items);
    itemsRef.current = items;

    const applyCart = useCallback((cart: ApiCart) => {
        setCartId(cart.id);
        setItems(hydrateItems(cart.items));
        setRestaurantId(cart.items.length > 0 ? cart.restaurantId : null);
    }, []);

    useEffect(() => {
        if (!isClient || !token) return;
        const saved = localStorage.getItem(RESTAURANT_NAME_KEY);
        if (saved) setRestaurantName(saved);
        const fetchCart = async () => {
            try {
                const cart = await apiRequest<ApiCart>("/cart", "GET", undefined, token);
                applyCart(cart);
            } catch {}
        };
        fetchCart();
    }, [isClient, token, applyCart]);

    const saveRestaurantName = (name: string) => {
        setRestaurantName(name);
        localStorage.setItem(RESTAURANT_NAME_KEY, name);
    };

    const addItem = (
        item: Omit<CartItem, "quantity">,
        newRestaurantId: string,
        newRestaurantName: string,
    ): AddItemResult => {
        if (restaurantId !== null && restaurantId !== newRestaurantId && items.length > 0) {
            return "conflict";
        }

        setRestaurantId(newRestaurantId);
        saveRestaurantName(newRestaurantName);
        setItems((prev) => {
            const existing = prev.find((cartItem) => cartItem.foodId === item.foodId);
            if (existing) {
                return prev.map((cartItem) =>
                    cartItem.foodId === item.foodId ? { ...cartItem, quantity: cartItem.quantity + 1 } : cartItem,
                );
            }
            return [...prev, { ...item, quantity: 1 }];
        });

        if (isClient && token) {
            const add = async () => {
                try {
                    const cart = await apiRequest<ApiCart>("/cart/items", "POST", {
                        dishId: item.foodId,
                        restaurantId: newRestaurantId,
                        quantity: 1,
                    }, token);
                    applyCart(cart);
                } catch {}
            };
            add();
        }

        return "added";
    };

    const removeItem = (foodId: string) => {
        setItems((prev) => {
            const updated = prev.filter((cartItem) => cartItem.foodId !== foodId);
            if (updated.length === 0) {
                setRestaurantId(null);
                localStorage.removeItem(RESTAURANT_NAME_KEY);
            }
            return updated;
        });
        if (isClient && token) {
            const remove = async () => {
                try {
                    const cart = await apiRequest<ApiCart>(`/cart/items/${foodId}`, "DELETE", undefined, token);
                    applyCart(cart);
                } catch {}
            };
            remove();
        }
    };

    const updateQuantity = (foodId: string, delta: number) => {
        const current = itemsRef.current.find((cartItem) => cartItem.foodId === foodId);
        setItems((prev) => {
            const updated = prev
                .map((cartItem) => cartItem.foodId === foodId ? { ...cartItem, quantity: Math.max(0, cartItem.quantity + delta) } : cartItem)
                .filter((cartItem) => cartItem.quantity > 0);
            if (updated.length === 0) {
                setRestaurantId(null);
                localStorage.removeItem(RESTAURANT_NAME_KEY);
            }
            return updated;
        });

        if (isClient && token && current) {
            const newQty = Math.max(0, current.quantity + delta);
            const update = async () => {
                try {
                    const cart = newQty === 0
                        ? await apiRequest<ApiCart>(`/cart/items/${foodId}`, "DELETE", undefined, token)
                        : await apiRequest<ApiCart>(`/cart/items/${foodId}`, "PATCH", { quantity: newQty }, token);
                    applyCart(cart);
                } catch {}
            };
            update();
        }
    };

    const replaceCart = (
        item: Omit<CartItem, "quantity">,
        newRestaurantId: string,
        newRestaurantName: string,
    ) => {
        setRestaurantId(newRestaurantId);
        saveRestaurantName(newRestaurantName);
        setItems([{ ...item, quantity: 1 }]);

        if (isClient && token) {
            const replace = async () => {
                try {
                    await apiRequest<ApiCart>("/cart", "DELETE", undefined, token);
                    const cart = await apiRequest<ApiCart>("/cart/items", "POST", {
                        dishId: item.foodId,
                        restaurantId: newRestaurantId,
                        quantity: 1,
                    }, token);
                    applyCart(cart);
                } catch {}
            };
            replace();
        }
    };

    const clearCart = () => {
        setItems([]);
        setRestaurantId(null);
        setRestaurantName("");
        setCartId(null);
        localStorage.removeItem(RESTAURANT_NAME_KEY);
        if (isClient && token) {
            const clear = async () => {
                try {
                    const cart = await apiRequest<ApiCart>("/cart", "DELETE", undefined, token);
                    applyCart(cart);
                } catch {}
            };
            clear();
        }
    };

    const totalItems = items.reduce((sum, cartItem) => sum + cartItem.quantity, 0);
    const subtotal = items.reduce((sum, cartItem) => sum + cartItem.price * cartItem.quantity, 0);

    return (
        <CartContext.Provider
            value={{
                items,
                restaurantId,
                restaurantName,
                cartId,
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
