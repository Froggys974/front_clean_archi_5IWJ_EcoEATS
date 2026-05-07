"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { FoodItem, Place } from "@/types/food";
import { ApiRestaurant, ApiDish } from "@/types/api";
import { useAuth } from "@/context/AuthContext";
import { apiRequest } from "@/services/api";

export type DashboardOrderStatus = "PENDING" | "ACCEPTED" | "REFUSED" | "READY" | "DELIVERED";

export type DashboardOrderItem = {
    foodId: string;
    name: string;
    price: number;
    quantity: number;
};

export type DashboardOrder = {
    id: string;
    customerName: string;
    items: DashboardOrderItem[];
    total: number;
    status: DashboardOrderStatus;
    createdAt: Date;
    estimatedMinutes?: number;
    address: string;
};

type RestaurantContextType = {
    restaurant: Place | null;
    dishes: FoodItem[];
    orders: DashboardOrder[];
    addDish: (dish: Omit<FoodItem, "id" | "url" | "placeId">) => void;
    updateDish: (id: string, updates: Partial<FoodItem>) => void;
    deleteDish: (id: string) => void;
    getDish: (id: string) => FoodItem | undefined;
    acceptOrder: (id: string, estimatedMinutes: number) => void;
    refuseOrder: (id: string) => void;
    markReady: (id: string) => void;
};

type ApiOrderItem = {
    dishId: string;
    dishName: string;
    dishPrice: number;
    quantity: number;
};

type ApiOrderForDashboard = {
    id: string;
    clientId: string;
    status: string;
    items: ApiOrderItem[];
    deliveryAddress: { street: string; city: string; postalCode: string; country: string };
    totalPrice: number;
    preparationTimeMinutes: number | null;
    createdAt: string;
};

function apiRestaurantToPlace(apiRestaurant: ApiRestaurant): Place {
    return {
        id: apiRestaurant.id,
        name: apiRestaurant.name,
        address: apiRestaurant.address.street,
        city: apiRestaurant.address.city,
        rating: apiRestaurant.rating,
        image: apiRestaurant.imageUrl ?? "",
        url: "",
        maxDeliveryTime: 30,
        highlighted: apiRestaurant.highlighted,
        openingHours: apiRestaurant.openingHours,
        ownerId: apiRestaurant.ownerId,
    };
}

function apiDishToFoodItem(apiDish: ApiDish): FoodItem {
    return {
        id: apiDish.id,
        name: apiDish.name,
        description: apiDish.description,
        price: apiDish.price,
        image: apiDish.imageUrl ?? "",
        url: "",
        offerId: null,
        categoryId: apiDish.category ?? "Autre",
        placeId: apiDish.restaurantId ?? "",
        popular: false,
        allergens: apiDish.allergens,
        dailyStock: apiDish.dailyStock,
    };
}

function apiOrderToDashboard(apiOrder: ApiOrderForDashboard): DashboardOrder {
    return {
        id: apiOrder.id,
        customerName: `Client #${apiOrder.clientId.slice(-6)}`,
        items: apiOrder.items.map((item) => ({
            foodId: item.dishId,
            name: item.dishName,
            price: item.dishPrice,
            quantity: item.quantity,
        })),
        total: apiOrder.totalPrice,
        status: apiOrder.status as DashboardOrderStatus,
        createdAt: new Date(apiOrder.createdAt),
        estimatedMinutes: apiOrder.preparationTimeMinutes ?? undefined,
        address: `${apiOrder.deliveryAddress.street}, ${apiOrder.deliveryAddress.city}`,
    };
}

const RestaurantContext = createContext<RestaurantContextType | null>(null);

export function RestaurantProvider({ children }: { children: React.ReactNode }) {
    const { token, user, isLoading: authLoading } = useAuth();
    const isOwner = !authLoading && !!token && (user?.roles?.includes("RESTAURATEUR") ?? false);

    const [restaurant, setRestaurant] = useState<Place | null>(null);
    const [dishes, setDishes] = useState<FoodItem[]>([]);
    const [orders, setOrders] = useState<DashboardOrder[]>([]);

    useEffect(() => {
        if (!isOwner || !token) return;

        apiRequest<ApiRestaurant>("/restaurants/me/restaurant", "GET", undefined, token)
            .then((apiRestaurant) => setRestaurant(apiRestaurantToPlace(apiRestaurant)))
            .catch(() => {});

        apiRequest<ApiDish[]>("/restaurants/me/dishes", "GET", undefined, token)
            .then((list) => setDishes(list.map(apiDishToFoodItem)))
            .catch(() => {});

        apiRequest<ApiOrderForDashboard[]>("/orders/restaurant", "GET", undefined, token)
            .then((list) => setOrders(list.map(apiOrderToDashboard)))
            .catch(() => {});
    }, [isOwner, token]);

    const addDish = (dish: Omit<FoodItem, "id" | "url" | "placeId">) => {
        const tempId = `tmp-${Date.now()}`;
        const tempDish: FoodItem = { ...dish, id: tempId, url: "", placeId: restaurant?.id ?? "" };
        setDishes((prev) => [...prev, tempDish]);

        if (token) {
            apiRequest<ApiDish>("/restaurants/me/dishes", "POST", {
                name: dish.name,
                description: dish.description,
                priceAmount: dish.price,
                allergens: dish.allergens ?? [],
                dailyStock: dish.dailyStock ?? 10,
                imageUrl: dish.image || undefined,
                category: dish.categoryId || undefined,
            }, token)
                .then((apiDish) => {
                    setDishes((prev) => prev.map((dish) => dish.id === tempId ? apiDishToFoodItem(apiDish) : dish));
                })
                .catch(() => {
                    setDishes((prev) => prev.filter((dish) => dish.id !== tempId));
                });
        }
    };

    const updateDish = (id: string, updates: Partial<FoodItem>) => {
        setDishes((prev) => prev.map((dish) => (dish.id === id ? { ...dish, ...updates } : dish)));

        if (token) {
            apiRequest<ApiDish>(`/restaurants/me/dishes/${id}`, "PATCH", {
                name: updates.name,
                description: updates.description,
                priceAmount: updates.price,
                allergens: updates.allergens,
                dailyStock: updates.dailyStock,
                imageUrl: updates.image || undefined,
                category: updates.categoryId || undefined,
            }, token)
                .then((apiDish) => {
                    setDishes((prev) => prev.map((dish) => dish.id === id ? apiDishToFoodItem(apiDish) : dish));
                })
                .catch(() => {});
        }
    };

    const deleteDish = (id: string) => {
        setDishes((prev) => prev.filter((dish) => dish.id !== id));

        if (token) {
            apiRequest(`/restaurants/me/dishes/${id}`, "DELETE", undefined, token).catch(() => {});
        }
    };

    const getDish = (id: string) => dishes.find((dish) => dish.id === id);

    const acceptOrder = (id: string, estimatedMinutes: number) => {
        setOrders((prev) =>
            prev.map((order) => (order.id === id ? { ...order, status: "ACCEPTED" as DashboardOrderStatus, estimatedMinutes } : order))
        );
        if (token) {
            apiRequest(`/orders/${id}/accept`, "POST", { preparationTimeMinutes: estimatedMinutes }, token).catch(() => {});
        }
    };

    const refuseOrder = (id: string) => {
        setOrders((prev) =>
            prev.map((order) => (order.id === id ? { ...order, status: "REFUSED" as DashboardOrderStatus } : order))
        );
        if (token) {
            apiRequest(`/orders/${id}/refuse`, "POST", {}, token).catch(() => {});
        }
    };

    const markReady = (id: string) => {
        setOrders((prev) =>
            prev.map((order) => (order.id === id ? { ...order, status: "READY" as DashboardOrderStatus } : order))
        );
        if (token) {
            apiRequest(`/orders/${id}/ready`, "POST", undefined, token).catch(() => {});
        }
    };

    return (
        <RestaurantContext.Provider
            value={{ restaurant, dishes, orders, addDish, updateDish, deleteDish, getDish, acceptOrder, refuseOrder, markReady }}
        >
            {children}
        </RestaurantContext.Provider>
    );
}

export function useRestaurant(): RestaurantContextType {
    const ctx = useContext(RestaurantContext);
    if (!ctx) throw new Error("useRestaurant must be used within RestaurantProvider");
    return ctx;
}
