"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { SelectedAddress } from "@/types/address";

const STORAGE_KEY = "ecoEats.deliveryAddress";

type DeliveryAddressContextType = {
  selectedAddress: SelectedAddress | null;
  setSelectedAddress: (address: SelectedAddress | null) => void;
};

const DeliveryAddressContext = createContext<DeliveryAddressContextType | null>(null);

function loadFromStorage(): SelectedAddress | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as SelectedAddress;
  } catch {
    return null;
  }
}

export function DeliveryAddressProvider({ children }: { children: React.ReactNode }) {
  const [selectedAddress, setSelectedAddressState] = useState<SelectedAddress | null>(null);

  useEffect(() => {
    setSelectedAddressState(loadFromStorage());
  }, []);

  const setSelectedAddress = (address: SelectedAddress | null): void => {
    setSelectedAddressState(address);
    if (address) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(address));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  return (
    <DeliveryAddressContext.Provider value={{ selectedAddress, setSelectedAddress }}>
      {children}
    </DeliveryAddressContext.Provider>
  );
}

export function useDeliveryAddress(): DeliveryAddressContextType {
  const ctx = useContext(DeliveryAddressContext);
  if (!ctx) throw new Error("useDeliveryAddress must be used within DeliveryAddressProvider");
  return ctx;
}
