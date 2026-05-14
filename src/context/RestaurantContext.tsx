"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { FoodItem, Place } from "@/types/food";
import { ApiRestaurant, ApiDish } from "@/types/api";
import { useAuth } from "@/context/AuthContext";
import { apiRequest } from "@/services/api";

export type DashboardOrderStatus = "PENDING" | "ACCEPTED" | "PREPARING" | "REFUSED" | "READY" | "DELIVERING" | "DELIVERED";

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

type RestaurantUpdateData = {
    openingHours?: Array<{ dayOfWeek: number; openTime: string; closeTime: string }>;
    status?: "OPEN" | "CLOSED" | "TEMPORARILY_CLOSED";
    description?: string;
    cuisineType?: string;
};

type RestaurantContextType = {
    restaurant: Place | null;
    dishes: FoodItem[];
    orders: DashboardOrder[];
    addDish: (dish: Omit<FoodItem, "id" | "url" | "placeId">) => void;
    updateDish: (id: string, updates: Partial<FoodItem>) => void;
    deleteDish: (id: string) => void;
    getDish: (id: string) => FoodItem | undefined;
    updateRestaurant: (updates: RestaurantUpdateData) => Promise<void>;
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
        status: apiRestaurant.status,
        cuisineType: apiRestaurant.cuisineType,
        description: apiRestaurant.description,
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

function normalizeDashboardStatus(apiStatus: string): DashboardOrderStatus {
    switch (apiStatus) {
        case "PAID": return "PENDING";
        case "READY_FOR_PICKUP": return "READY";
        case "PICKED_UP": return "DELIVERING";
        case "CANCELLED": return "REFUSED";
        default: return apiStatus as DashboardOrderStatus;
    }
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
        status: normalizeDashboardStatus(apiOrder.status),
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

        const fetchRestaurant = async () => {
            try {
                const apiRestaurant = await apiRequest<ApiRestaurant>("/restaurants/me/restaurant", "GET", undefined, token);
                setRestaurant(apiRestaurantToPlace(apiRestaurant));
            } catch {}
        };
        fetchRestaurant();

        const fetchDishes = async () => {
            try {
                const list = await apiRequest<ApiDish[]>("/restaurants/me/dishes", "GET", undefined, token);
                setDishes(list.map(apiDishToFoodItem));
            } catch {}
        };
        fetchDishes();

        const pollOrders = async () => {
            try {
                const list = await apiRequest<ApiOrderForDashboard[]>("/orders/restaurant", "GET", undefined, token);
                setOrders(list.map(apiOrderToDashboard));
            } catch {}
        };

        pollOrders();
        const interval = setInterval(pollOrders, 5000);
        return () => clearInterval(interval);
    }, [isOwner, token]);

    const addDish = (dish: Omit<FoodItem, "id" | "url" | "placeId">) => {
        const tempId = `tmp-${Date.now()}`;
        const tempDish: FoodItem = { ...dish, id: tempId, url: "", placeId: restaurant?.id ?? "" };
        setDishes((prev) => [...prev, tempDish]);

        if (token) {
            const save = async () => {
                try {
                    const apiDish = await apiRequest<ApiDish>("/restaurants/me/dishes", "POST", {
                        name: dish.name,
                        description: dish.description,
                        priceAmount: dish.price,
                        allergens: dish.allergens ?? [],
                        dailyStock: dish.dailyStock ?? 10,
                        imageUrl: dish.image || undefined,
                        category: dish.categoryId || undefined,
                    }, token);
                    setDishes((prev) => prev.map((d) => d.id === tempId ? apiDishToFoodItem(apiDish) : d));
                } catch {
                    setDishes((prev) => prev.filter((d) => d.id !== tempId));
                }
            };
            save();
        }
    };

    const updateDish = (id: string, updates: Partial<FoodItem>) => {
        setDishes((prev) => prev.map((dish) => (dish.id === id ? { ...dish, ...updates } : dish)));

        if (token) {
            const update = async () => {
                try {
                    const apiDish = await apiRequest<ApiDish>(`/restaurants/me/dishes/${id}`, "PATCH", {
                        name: updates.name,
                        description: updates.description,
                        priceAmount: updates.price,
                        allergens: updates.allergens,
                        dailyStock: updates.dailyStock,
                        imageUrl: updates.image || undefined,
                        category: updates.categoryId || undefined,
                    }, token);
                    setDishes((prev) => prev.map((dish) => dish.id === id ? apiDishToFoodItem(apiDish) : dish));
                } catch {}
            };
            update();
        }
    };

    const deleteDish = (id: string) => {
        setDishes((prev) => prev.filter((dish) => dish.id !== id));

        if (token) {
            const remove = async () => {
                try {
                    await apiRequest(`/restaurants/me/dishes/${id}`, "DELETE", undefined, token);
                } catch {}
            };
            remove();
        }
    };

    const getDish = (id: string) => dishes.find((dish) => dish.id === id);

    const updateRestaurant = async (updates: RestaurantUpdateData): Promise<void> => {
        if (!token) return;
        const apiRestaurant = await apiRequest<ApiRestaurant>("/restaurants/me/restaurant", "PATCH", updates, token);
        setRestaurant(apiRestaurantToPlace(apiRestaurant));
    };

    const acceptOrder = (id: string, estimatedMinutes: number) => {
        setOrders((prev) =>
            prev.map((order) => (order.id === id ? { ...order, status: "ACCEPTED" as DashboardOrderStatus, estimatedMinutes } : order))
        );
        if (token) {
            const accept = async () => {
                try {
                    await apiRequest(`/orders/${id}/accept`, "POST", { preparationTimeMinutes: estimatedMinutes }, token);
                } catch {}
            };
            accept();
        }
    };

    const refuseOrder = (id: string) => {
        setOrders((prev) =>
            prev.map((order) => (order.id === id ? { ...order, status: "REFUSED" as DashboardOrderStatus } : order))
        );
        if (token) {
            const refuse = async () => {
                try {
                    await apiRequest(`/orders/${id}/refuse`, "POST", {}, token);
                } catch {}
            };
            refuse();
        }
    };

    const markReady = (id: string) => {
        setOrders((prev) =>
            prev.map((order) => (order.id === id ? { ...order, status: "READY" as DashboardOrderStatus } : order))
        );
        if (token) {
            const ready = async () => {
                try {
                    await apiRequest(`/orders/${id}/ready`, "POST", undefined, token);
                } catch {}
            };
            ready();
        }
    };

    return (
        <RestaurantContext.Provider
            value={{ restaurant, dishes, orders, addDish, updateDish, deleteDish, getDish, updateRestaurant, acceptOrder, refuseOrder, markReady }}
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
