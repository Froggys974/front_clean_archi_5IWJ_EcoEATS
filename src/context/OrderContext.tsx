"use client";

import React, { createContext, useContext, useState } from "react";
import { CartItem } from "@/context/CartContext";

export type OrderStatus = "PENDING" | "ACCEPTED" | "PREPARING" | "READY" | "DELIVERING" | "DELIVERED";

export type OrderAddress = {
    street: string;
    city: string;
    zip: string;
    instructions?: string;
};

export type Order = {
    id: string;
    restaurantId: string;
    restaurantName: string;
    items: CartItem[];
    address: OrderAddress;
    subtotal: number;
    deliveryFee: number;
    serviceFee: number;
    total: number;
    status: OrderStatus;
    createdAt: Date;
};

type OrderContextType = {
    orders: Order[];
    currentOrder: Order | null;
    createOrder: (data: Omit<Order, "id" | "status" | "createdAt">) => Order;
    updateStatus: (id: string, status: OrderStatus) => void;
    getOrder: (id: string) => Order | null;
};

const OrderContext = createContext<OrderContextType | null>(null);

export function OrderProvider({ children }: { children: React.ReactNode }) {
    const [orders, setOrders] = useState<Order[]>([]);

    const createOrder = (data: Omit<Order, "id" | "status" | "createdAt">): Order => {
        const order: Order = {
            ...data,
            id: `order-${Date.now()}`,
            status: "PENDING",
            createdAt: new Date(),
        };
        setOrders((prev) => [...prev, order]);
        return order;
    };

    const updateStatus = (id: string, status: OrderStatus) => {
        setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));
    };

    const getOrder = (id: string): Order | null =>
        orders.find((o) => o.id === id) ?? null;

    const currentOrder = orders.length > 0 ? orders[orders.length - 1] : null;

    return (
        <OrderContext.Provider value={{ orders, currentOrder, createOrder, updateStatus, getOrder }}>
            {children}
        </OrderContext.Provider>
    );
}

export function useOrder(): OrderContextType {
    const ctx = useContext(OrderContext);
    if (!ctx) throw new Error("useOrder must be used within OrderProvider");
    return ctx;
}
