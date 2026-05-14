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
    completeDelivery: (id: string, deliveryCode: string) => Promise<void>;
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
    restaurantAddress?: string;
    deliveryAddress?: string;
    createdAt: string;
};

type ApiWallet = {
    balance: number;
};

function apiDeliveryToDelivery(d: ApiDelivery): Delivery {
    return {
        id: d.id,
        restaurantName: `Restaurant #${d.restaurantId.slice(-6)}`,
        restaurantAddress: d.restaurantAddress ?? "",
        customerName: `Commande #${d.orderId.slice(-6)}`,
        customerAddress: d.deliveryAddress ?? "",
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

        const syncAvailability = async () => {
            try {
                await apiRequest("/deliveries/availability", "PATCH", { available: isAvailable }, token);
            } catch {}
        };
        syncAvailability();

        const pollDeliveries = async () => {
            try {
                const list = await apiRequest<ApiDelivery[]>("/deliveries/available", "GET", undefined, token);
                setPendingDeliveries(list.map(apiDeliveryToDelivery));
            } catch {}

            try {
                const list = await apiRequest<ApiDelivery[]>("/deliveries/mine", "GET", undefined, token);
                const delivered = list.filter((d) => d.status === "DELIVERED");
                const active = list.find((d) => d.status === "ACCEPTED" || d.status === "PICKED_UP");
                setHistory(delivered.map(apiDeliveryToDelivery));
                setActiveDelivery(active ? apiDeliveryToDelivery(active) : null);
            } catch {}
        };

        pollDeliveries();
        const interval = setInterval(pollDeliveries, 5000);

        const fetchWallet = async () => {
            try {
                const wallet = await apiRequest<ApiWallet>("/wallet/mine", "GET", undefined, token);
                setWalletBalance(wallet.balance);
            } catch {}
        };
        fetchWallet();

        return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isCourier, token]);

    const setAvailable = (v: boolean) => {
        setIsAvailableState(v);
        if (token) {
            const update = async () => {
                try {
                    await apiRequest("/deliveries/availability", "PATCH", { available: v }, token);
                } catch {}
            };
            update();
        }
    };

    const acceptDelivery = (id: string) => {
        const delivery = pendingDeliveries.find((d) => d.id === id);
        if (!delivery) return;
        setPendingDeliveries((prev) => prev.filter((pendingDelivery) => pendingDelivery.id !== id));
        setActiveDelivery({ ...delivery, status: "ACCEPTED" });
        if (token) {
            const accept = async () => {
                try {
                    const apiDelivery = await apiRequest<ApiDelivery>(`/deliveries/${id}/accept`, "POST", undefined, token);
                    setActiveDelivery(apiDeliveryToDelivery(apiDelivery));
                } catch {}
            };
            accept();
        }
    };

    const refuseDelivery = (id: string) => {
        setPendingDeliveries((prev) => prev.filter((delivery) => delivery.id !== id));
    };

    const pickupDelivery = (id: string) => {
        if (activeDelivery?.id === id) {
            setActiveDelivery({ ...activeDelivery, status: "PICKED_UP" });
            if (token) {
                const pickup = async () => {
                    try {
                        const apiDelivery = await apiRequest<ApiDelivery>(`/deliveries/${id}/pickup`, "POST", undefined, token);
                        setActiveDelivery(apiDeliveryToDelivery(apiDelivery));
                    } catch {}
                };
                pickup();
            }
        }
    };

    const completeDelivery = async (id: string, deliveryCode: string): Promise<void> => {
        if (!activeDelivery || activeDelivery.id !== id || !token) return;
        await apiRequest<ApiDelivery>(`/deliveries/${id}/complete`, "POST", { deliveryCode }, token);
        const completed: Delivery = { ...activeDelivery, status: "DELIVERED" };
        setHistory((prev) => [completed, ...prev]);
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
