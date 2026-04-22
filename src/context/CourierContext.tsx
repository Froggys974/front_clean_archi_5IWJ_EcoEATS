"use client";

import React, { createContext, useContext, useState } from "react";

export type DeliveryStatus = "PENDING" | "ACCEPTED" | "PICKED_UP" | "DELIVERED" | "REFUSED";

export type Delivery = {
    id: string;
    restaurantName: string;
    restaurantAddress: string;
    customerName: string;
    customerAddress: string;
    items: { name: string; quantity: number }[];
    subtotal: number;
    distance: number;
    fee: number;
    tip: number;
    status: DeliveryStatus;
    createdAt: Date;
};

type CourierContextType = {
    isAvailable: boolean;
    setAvailable: (v: boolean) => void;
    activeDelivery: Delivery | null;
    pendingDeliveries: Delivery[];
    history: Delivery[];
    walletBalance: number;
    acceptDelivery: (id: string) => void;
    refuseDelivery: (id: string) => void;
    pickupDelivery: (id: string) => void;
    completeDelivery: (id: string) => void;
};

const CourierContext = createContext<CourierContextType | null>(null);

const DEMO_PENDING: Delivery[] = [
    {
        id: "dlv-1",
        restaurantName: "Luigi's Kitchen",
        restaurantAddress: "12 rue de la Paix, Paris",
        customerName: "Sophie Martin",
        customerAddress: "45 boulevard Haussmann, Paris",
        items: [{ name: "Pizza Margherita", quantity: 2 }, { name: "Tiramisu", quantity: 1 }],
        subtotal: 24.97,
        distance: 1.8,
        fee: 5.20,
        tip: 2.00,
        status: "PENDING",
        createdAt: new Date(Date.now() - 1000 * 60 * 2),
    },
    {
        id: "dlv-2",
        restaurantName: "Sushi Paradise",
        restaurantAddress: "8 rue du Temple, Paris",
        customerName: "Marc Dupont",
        customerAddress: "22 avenue de la République, Paris",
        items: [{ name: "Plateau sushi 24 pièces", quantity: 1 }],
        subtotal: 38.00,
        distance: 2.4,
        fee: 6.80,
        tip: 3.00,
        status: "PENDING",
        createdAt: new Date(Date.now() - 1000 * 60 * 5),
    },
];

const DEMO_HISTORY: Delivery[] = [
    {
        id: "dlv-h1",
        restaurantName: "Burger House",
        restaurantAddress: "5 rue Montmartre, Paris",
        customerName: "Claire Leroy",
        customerAddress: "18 rue des Martyrs, Paris",
        items: [{ name: "Double Cheese Burger", quantity: 2 }],
        subtotal: 28.00,
        distance: 1.2,
        fee: 4.50,
        tip: 1.50,
        status: "DELIVERED",
        createdAt: new Date(Date.now() - 1000 * 60 * 45),
    },
    {
        id: "dlv-h2",
        restaurantName: "Tacos Palace",
        restaurantAddress: "30 rue Oberkampf, Paris",
        customerName: "Thomas Bernard",
        customerAddress: "9 rue de la Roquette, Paris",
        items: [{ name: "Tacos XL", quantity: 3 }],
        subtotal: 34.50,
        distance: 0.9,
        fee: 3.80,
        tip: 2.50,
        status: "DELIVERED",
        createdAt: new Date(Date.now() - 1000 * 60 * 120),
    },
];

const DEMO_WALLET = 42.30;

export function CourierProvider({ children }: { children: React.ReactNode }) {
    const [isAvailable, setIsAvailable] = useState(true);
    const [pendingDeliveries, setPendingDeliveries] = useState<Delivery[]>(DEMO_PENDING);
    const [activeDelivery, setActiveDelivery] = useState<Delivery | null>(null);
    const [history, setHistory] = useState<Delivery[]>(DEMO_HISTORY);
    const [walletBalance, setWalletBalance] = useState(DEMO_WALLET);

    const setAvailable = (v: boolean) => setIsAvailable(v);

    const acceptDelivery = (id: string) => {
        const delivery = pendingDeliveries.find((d) => d.id === id);
        if (!delivery) return;
        setPendingDeliveries((prev) => prev.filter((d) => d.id !== id));
        setActiveDelivery({ ...delivery, status: "ACCEPTED" });
    };

    const refuseDelivery = (id: string) => {
        setPendingDeliveries((prev) => prev.filter((d) => d.id !== id));
    };

    const pickupDelivery = (id: string) => {
        if (activeDelivery?.id === id) {
            setActiveDelivery({ ...activeDelivery, status: "PICKED_UP" });
        }
    };

    const completeDelivery = (id: string) => {
        if (!activeDelivery || activeDelivery.id !== id) return;
        const completed: Delivery = { ...activeDelivery, status: "DELIVERED" };
        setHistory((prev) => [completed, ...prev]);
        setWalletBalance((prev) => prev + completed.fee + completed.tip);
        setActiveDelivery(null);
    };

    return (
        <CourierContext.Provider
            value={{
                isAvailable,
                setAvailable,
                activeDelivery,
                pendingDeliveries,
                history,
                walletBalance,
                acceptDelivery,
                refuseDelivery,
                pickupDelivery,
                completeDelivery,
            }}
        >
            {children}
        </CourierContext.Provider>
    );
}

export function useCourier(): CourierContextType {
    const ctx = useContext(CourierContext);
    if (!ctx) throw new Error("useCourier must be used within CourierProvider");
    return ctx;
}
