"use client";

import React, { createContext, useContext, useState } from "react";
import { FoodItem, Place } from "@/types/food";
import allDishes from "@/data/food.json";
import allPlaces from "@/data/place.json";

export type DashboardOrderStatus = "PENDING" | "ACCEPTED" | "REFUSED" | "READY" | "DELIVERED";

export type DashboardOrderItem = {
    foodId: number;
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
    updateDish: (id: number, updates: Partial<FoodItem>) => void;
    deleteDish: (id: number) => void;
    getDish: (id: number) => FoodItem | undefined;
    acceptOrder: (id: string, estimatedMinutes: number) => void;
    refuseOrder: (id: string) => void;
    markReady: (id: string) => void;
};

const RestaurantContext = createContext<RestaurantContextType | null>(null);

const DEMO_ORDERS: DashboardOrder[] = [
    {
        id: "demo-1",
        customerName: "Sophie Martin",
        items: [
            { foodId: 1, name: "Pizza Margherita", price: 8.99, quantity: 2 },
            { foodId: 5, name: "Chocolate Lava Cake", price: 5.99, quantity: 1 },
        ],
        total: 26.47,
        status: "PENDING",
        createdAt: new Date(Date.now() - 1000 * 60 * 3),
        address: "45 rue de Rivoli, Paris",
    },
    {
        id: "demo-2",
        customerName: "Marc Dubois",
        items: [
            { foodId: 7, name: "Pasta Carbonara", price: 11.99, quantity: 1 },
        ],
        total: 15.49,
        status: "ACCEPTED",
        createdAt: new Date(Date.now() - 1000 * 60 * 12),
        estimatedMinutes: 20,
        address: "8 avenue de l'Opéra, Paris",
    },
    {
        id: "demo-3",
        customerName: "Claire Legrand",
        items: [
            { foodId: 1, name: "Pizza Margherita", price: 8.99, quantity: 1 },
            { foodId: 3, name: "Caesar Salad", price: 6.99, quantity: 1 },
        ],
        total: 18.48,
        status: "READY",
        createdAt: new Date(Date.now() - 1000 * 60 * 25),
        estimatedMinutes: 15,
        address: "12 rue du Louvre, Paris",
    },
];

export function RestaurantProvider({
    children,
    userId,
}: {
    children: React.ReactNode;
    userId: string | undefined;
}) {
    const places = allPlaces as Place[];
    const restaurant =
        places.find((p) => p.ownerId === userId) ?? places[0] ?? null;

    const initialDishes = (allDishes as FoodItem[]).filter(
        (d) => d.placeId === restaurant?.id
    );

    const [dishes, setDishes] = useState<FoodItem[]>(initialDishes);
    const [orders, setOrders] = useState<DashboardOrder[]>(DEMO_ORDERS);
    const [nextId, setNextId] = useState(1000);

    const addDish = (dish: Omit<FoodItem, "id" | "url" | "placeId">) => {
        const newDish: FoodItem = {
            ...dish,
            id: nextId,
            url: "",
            placeId: restaurant?.id ?? 1,
        };
        setDishes((prev) => [...prev, newDish]);
        setNextId((n) => n + 1);
    };

    const updateDish = (id: number, updates: Partial<FoodItem>) => {
        setDishes((prev) => prev.map((d) => (d.id === id ? { ...d, ...updates } : d)));
    };

    const deleteDish = (id: number) => {
        setDishes((prev) => prev.filter((d) => d.id !== id));
    };

    const getDish = (id: number) => dishes.find((d) => d.id === id);

    const acceptOrder = (id: string, estimatedMinutes: number) => {
        setOrders((prev) =>
            prev.map((o) => (o.id === id ? { ...o, status: "ACCEPTED", estimatedMinutes } : o))
        );
    };

    const refuseOrder = (id: string) => {
        setOrders((prev) =>
            prev.map((o) => (o.id === id ? { ...o, status: "REFUSED" } : o))
        );
    };

    const markReady = (id: string) => {
        setOrders((prev) =>
            prev.map((o) => (o.id === id ? { ...o, status: "READY" } : o))
        );
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
