// src/hooks/useDeliveryAddress.ts
"use client";

import { useState, useEffect } from "react";

const STORAGE_KEY = "ecoEats.deliveryAddress";

type UseDeliveryAddress = {
    address: string;
    setAddress: (value: string) => void;
};

export function useDeliveryAddress(): UseDeliveryAddress {
    const [address, setAddressState] = useState<string>("");

    useEffect(() => {
        const stored = localStorage.getItem(STORAGE_KEY) ?? "";
        setAddressState(stored);
    }, []);

    const setAddress = (value: string): void => {
        setAddressState(value);
        localStorage.setItem(STORAGE_KEY, value);
    };

    return { address, setAddress };
}
