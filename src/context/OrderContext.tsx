"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { CartItem } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { apiRequest } from "@/services/api";

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

type CreateOrderData = {
    cartId: string | null;
    address: OrderAddress;
    restaurantName: string;
};

type OrderContextType = {
    orders: Order[];
    currentOrder: Order | null;
    createOrder: (data: CreateOrderData) => Promise<Order>;
    updateStatus: (id: string, status: OrderStatus) => void;
    getOrder: (id: string) => Order | null;
};

type ApiOrderItem = {
    dishId: string;
    dishName: string;
    dishPrice: number;
    quantity: number;
};

type ApiOrder = {
    id: string;
    restaurantId: string;
    status: string;
    items: ApiOrderItem[];
    deliveryAddress: { street: string; city: string; postalCode: string; country: string };
    itemsTotal: number;
    deliveryFee: number;
    serviceFee: number;
    totalPrice: number;
    createdAt: string;
};

function apiOrderToOrder(apiOrder: ApiOrder, restaurantName = ""): Order {
    return {
        id: apiOrder.id,
        restaurantId: apiOrder.restaurantId,
        restaurantName,
        items: apiOrder.items.map((item) => ({
            foodId: item.dishId,
            name: item.dishName,
            price: item.dishPrice,
            quantity: item.quantity,
            image: "",
        })),
        address: {
            street: apiOrder.deliveryAddress.street,
            city: apiOrder.deliveryAddress.city,
            zip: apiOrder.deliveryAddress.postalCode,
        },
        subtotal: apiOrder.itemsTotal,
        deliveryFee: apiOrder.deliveryFee,
        serviceFee: apiOrder.serviceFee,
        total: apiOrder.totalPrice,
        status: apiOrder.status as OrderStatus,
        createdAt: new Date(apiOrder.createdAt),
    };
}

const OrderContext = createContext<OrderContextType | null>(null);

export function OrderProvider({ children }: { children: React.ReactNode }) {
    const { token, user, isLoading: authLoading } = useAuth();
    const isClient = !authLoading && !!token && (user?.roles?.includes("CLIENT") ?? false);

    const [orders, setOrders] = useState<Order[]>([]);

    useEffect(() => {
        if (!isClient || !token) return;
        apiRequest<ApiOrder[]>("/orders/mine", "GET", undefined, token)
            .then((list) => setOrders(list.map((apiOrder) => apiOrderToOrder(apiOrder))))
            .catch(() => {});
    }, [isClient, token]);

    const createOrder = async (data: CreateOrderData): Promise<Order> => {
        if (isClient && token && data.cartId) {
            const apiOrder = await apiRequest<ApiOrder>("/orders/checkout", "POST", {
                cartId: data.cartId,
                deliveryStreet: data.address.street,
                deliveryCity: data.address.city,
                deliveryPostalCode: data.address.zip,
                deliveryCountry: "France",
            }, token);
            const order = apiOrderToOrder(apiOrder, data.restaurantName);
            setOrders((prev) => [...prev, order]);
            return order;
        }

        const order: Order = {
            id: `order-${Date.now()}`,
            restaurantId: "",
            restaurantName: data.restaurantName,
            items: [],
            address: data.address,
            subtotal: 0,
            deliveryFee: 2.5,
            serviceFee: 0.5,
            total: 3,
            status: "PENDING",
            createdAt: new Date(),
        };
        setOrders((prev) => [...prev, order]);
        return order;
    };

    const updateStatus = (id: string, status: OrderStatus) => {
        setOrders((prev) => prev.map((order) => (order.id === id ? { ...order, status } : order)));
    };

    const getOrder = (id: string): Order | null =>
        orders.find((order) => order.id === id) ?? null;

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
