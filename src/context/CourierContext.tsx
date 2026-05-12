"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { apiRequest } from "@/services/api";

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

type ApiDelivery = {
    id: string;
    orderId: string;
    restaurantId: string;
    courierId: string | null;
    status: string;
    deliveryFee: number;
    tipAmount: number;
    distanceKm: number;
    createdAt: string;
};

type ApiWallet = {
    balance: number;
};

function apiDeliveryToDelivery(d: ApiDelivery): Delivery {
    return {
        id: d.id,
        restaurantName: `Restaurant`,
        restaurantAddress: "",
        customerName: `Commande #${d.orderId.slice(-6)}`,
        customerAddress: "",
        items: [],
        subtotal: 0,
        distance: d.distanceKm,
        fee: d.deliveryFee,
        tip: d.tipAmount,
        status: d.status as DeliveryStatus,
        createdAt: new Date(d.createdAt),
    };
}

const CourierContext = createContext<CourierContextType | null>(null);

export function CourierProvider({ children }: { children: React.ReactNode }) {
    const { token, user, isLoading: authLoading } = useAuth();
    const isCourier = !authLoading && !!token && (user?.roles?.includes("COURIER") ?? false);

    const [isAvailable, setIsAvailableState] = useState(true);
    const [pendingDeliveries, setPendingDeliveries] = useState<Delivery[]>([]);
    const [activeDelivery, setActiveDelivery] = useState<Delivery | null>(null);
    const [history, setHistory] = useState<Delivery[]>([]);
    const [walletBalance, setWalletBalance] = useState(0);

    useEffect(() => {
        if (!isCourier || !token) return;

        apiRequest<ApiDelivery[]>("/deliveries/available", "GET", undefined, token)
            .then((list) => setPendingDeliveries(list.map(apiDeliveryToDelivery)))
            .catch(() => {});

        apiRequest<ApiDelivery[]>("/deliveries/mine", "GET", undefined, token)
            .then((list) => {
                const delivered = list.filter((delivery) => delivery.status === "DELIVERED");
                const active = list.find((delivery) => delivery.status === "ACCEPTED" || delivery.status === "PICKED_UP");
                setHistory(delivered.map(apiDeliveryToDelivery));
                if (active) setActiveDelivery(apiDeliveryToDelivery(active));
            })
            .catch(() => {});

        apiRequest<ApiWallet>("/wallet/mine", "GET", undefined, token)
            .then((wallet) => setWalletBalance(wallet.balance))
            .catch(() => {});
    }, [isCourier, token]);

    const setAvailable = (v: boolean) => {
        setIsAvailableState(v);
        if (token) {
            apiRequest("/deliveries/availability", "PATCH", { available: v }, token).catch(() => {});
        }
    };

    const acceptDelivery = (id: string) => {
        const delivery = pendingDeliveries.find((d) => d.id === id);
        if (!delivery) return;
        setPendingDeliveries((prev) => prev.filter((pendingDelivery) => pendingDelivery.id !== id));
        setActiveDelivery({ ...delivery, status: "ACCEPTED" });
        if (token) {
            apiRequest<ApiDelivery>(`/deliveries/${id}/accept`, "POST", undefined, token)
                .then((apiDelivery) => setActiveDelivery(apiDeliveryToDelivery(apiDelivery)))
                .catch(() => {});
        }
    };

    const refuseDelivery = (id: string) => {
        setPendingDeliveries((prev) => prev.filter((delivery) => delivery.id !== id));
    };

    const pickupDelivery = (id: string) => {
        if (activeDelivery?.id === id) {
            setActiveDelivery({ ...activeDelivery, status: "PICKED_UP" });
            if (token) {
                apiRequest<ApiDelivery>(`/deliveries/${id}/pickup`, "POST", undefined, token)
                    .then((apiDelivery) => setActiveDelivery(apiDeliveryToDelivery(apiDelivery)))
                    .catch(() => {});
            }
        }
    };

    const completeDelivery = (id: string) => {
        if (!activeDelivery || activeDelivery.id !== id) return;
        const completed: Delivery = { ...activeDelivery, status: "DELIVERED" };
        setHistory((prev) => [completed, ...prev]);
        setWalletBalance((prev) => prev + completed.fee + completed.tip);
        setActiveDelivery(null);
        if (token) {
            apiRequest<ApiDelivery>(`/deliveries/${id}/complete`, "POST", undefined, token)
                .then(() => {
                    apiRequest<ApiWallet>("/wallet/mine", "GET", undefined, token)
                        .then((wallet) => setWalletBalance(wallet.balance))
                        .catch(() => {});
                })
                .catch(() => {});
        }
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
