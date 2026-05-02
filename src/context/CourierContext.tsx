"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useApi } from "@/hooks/useApi";
import { DeliveryDto, WalletDto } from "@/types/api";

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
    setAvailable: (v: boolean) => Promise<void>;
    activeDelivery: Delivery | null;
    pendingDeliveries: Delivery[];
    history: Delivery[];
    walletBalance: number;
    isLoading: boolean;
    acceptDelivery: (id: string) => Promise<void>;
    refuseDelivery: (id: string) => void;
    pickupDelivery: (id: string) => Promise<void>;
    completeDelivery: (id: string) => Promise<void>;
};

const CourierContext = createContext<CourierContextType | null>(null);

function mapDelivery(d: DeliveryDto): Delivery {
    return {
        id: d.id,
        restaurantName: `Restaurant ${d.restaurantId.slice(-4)}`,
        restaurantAddress: 'Paris', customerName: 'Client', customerAddress: 'Paris',
        items: [], subtotal: 0,
        distance: d.distanceKm, fee: d.deliveryFee, tip: d.tipAmount,
        status: d.status as DeliveryStatus,
        createdAt: new Date(d.createdAt),
    };
}

export function CourierProvider({ children }: { children: React.ReactNode }) {
    const { get, post, patch } = useApi();
    const { token, isLoading: isAuthLoading } = useAuth();
    const [isAvailable, setIsAvailable] = useState(true);
    const [pendingDeliveries, setPendingDeliveries] = useState<Delivery[]>([]);
    const [activeDelivery, setActiveDelivery] = useState<Delivery | null>(null);
    const [history, setHistory] = useState<Delivery[]>([]);
    const [walletBalance, setWalletBalance] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (isAuthLoading) {
            return;
        }

        if (!token) {
            setIsLoading(false);
            setPendingDeliveries([]);
            setActiveDelivery(null);
            setHistory([]);
            setWalletBalance(0);
            return;
        }

        setIsLoading(true);
        Promise.all([
            get<DeliveryDto[]>('/deliveries/available').catch(() => [] as DeliveryDto[]),
            get<DeliveryDto[]>('/deliveries/mine').catch(() => [] as DeliveryDto[]),
            get<WalletDto>('/deliveries/wallet').catch(() => ({ balance: 0 } as WalletDto)),
        ]).then(([available, mine, wallet]) => {
            setPendingDeliveries(available.map(mapDelivery));
            setHistory(mine.filter(d => d.status === 'DELIVERED').map(mapDelivery));
            const active = mine.find(d => d.status === 'ACCEPTED' || d.status === 'PICKED_UP');
            if (active) setActiveDelivery(mapDelivery(active));
            setWalletBalance(wallet.balance);
        }).finally(() => setIsLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isAuthLoading, token]);

    const setAvailable = async (v: boolean) => {
        await patch<{ available: boolean }>('/deliveries/availability', { available: v });
        setIsAvailable(v);
    };

    const acceptDelivery = async (id: string) => {
        const updated = await post<DeliveryDto>(`/deliveries/${id}/accept`);
        setPendingDeliveries(prev => prev.filter(d => d.id !== id));
        setActiveDelivery({ ...mapDelivery(updated), status: 'ACCEPTED' });
    };

    const refuseDelivery = (id: string) => {
        setPendingDeliveries(prev => prev.filter(d => d.id !== id));
    };

    const pickupDelivery = async (id: string) => {
        if (activeDelivery?.id !== id) return;
        const updated = await post<DeliveryDto>(`/deliveries/${id}/pickup`);
        setActiveDelivery({ ...mapDelivery(updated), status: 'PICKED_UP' });
    };

    const completeDelivery = async (id: string) => {
        if (!activeDelivery || activeDelivery.id !== id) return;
        await post<void>(`/deliveries/${id}/complete`);
        const completed: Delivery = { ...activeDelivery, status: 'DELIVERED' };
        setHistory(prev => [completed, ...prev]);
        setWalletBalance(prev => prev + completed.fee + completed.tip);
        setActiveDelivery(null);
    };

    return (
        <CourierContext.Provider value={{
            isAvailable, setAvailable, activeDelivery, pendingDeliveries,
            history, walletBalance, isLoading, acceptDelivery, refuseDelivery,
            pickupDelivery, completeDelivery,
        }}>
            {children}
        </CourierContext.Provider>
    );
}

export function useCourier(): CourierContextType {
    const ctx = useContext(CourierContext);
    if (!ctx) throw new Error("useCourier must be used within CourierProvider");
    return ctx;
}
