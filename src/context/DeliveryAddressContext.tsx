"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

const STORAGE_KEY = "ecoEats.deliveryAddress";

type DeliveryAddressContextType = {
    address: string;
    setAddress: (value: string) => void;
};

const DeliveryAddressContext = createContext<DeliveryAddressContextType | null>(null);

export function DeliveryAddressProvider({ children }: { children: React.ReactNode }) {
    const [address, setAddressState] = useState<string>("");

    useEffect(() => {
        const stored = localStorage.getItem(STORAGE_KEY) ?? "";
        setAddressState(stored);
    }, []);

    const setAddress = (value: string): void => {
        setAddressState(value);
        localStorage.setItem(STORAGE_KEY, value);
    };

    return (
        <DeliveryAddressContext.Provider value={{ address, setAddress }}>
            {children}
        </DeliveryAddressContext.Provider>
    );
}

export function useDeliveryAddress(): DeliveryAddressContextType {
    const ctx = useContext(DeliveryAddressContext);
    if (!ctx) throw new Error("useDeliveryAddress must be used within DeliveryAddressProvider");
    return ctx;
}
