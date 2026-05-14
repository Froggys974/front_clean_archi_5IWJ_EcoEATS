"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { CartItem } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { apiRequest } from "@/services/api";
import { DELIVERY_FEE, SERVICE_FEE } from "@/constants/fees";

export type OrderStatus = "PENDING" | "ACCEPTED" | "PREPARING" | "READY" | "DELIVERING" | "DELIVERED" | "REFUSED";

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
    deliveryCode: string;
};

type CreateOrderData = {
    cartId: string | null;
    address: OrderAddress;
    restaurantName: string;
    tipAmount?: number;
};

type OrderContextType = {
    orders: Order[];
    currentOrder: Order | null;
    createOrder: (data: CreateOrderData) => Promise<Order>;
    updateStatus: (id: string, status: OrderStatus) => void;
    getOrder: (id: string) => Order | null;
    refreshOrder: (id: string) => Promise<void>;
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
    deliveryCode?: string;
    createdAt: string;
};

type SerializedOrder = Omit<Order, "createdAt"> & { createdAt: string };

const ORDERS_STORAGE_KEY = "ecoEats.orders";

function generateDeliveryCode(): string {
    return Math.floor(1000 + Math.random() * 9000).toString();
}

function serializeOrders(orders: Order[]): string {
    return JSON.stringify(
        orders.map((o): SerializedOrder => ({ ...o, createdAt: o.createdAt.toISOString() }))
    );
}

function deserializeOrders(json: string): Order[] {
    const raw: SerializedOrder[] = JSON.parse(json);
    return raw.map((o) => ({ ...o, createdAt: new Date(o.createdAt) }));
}

function loadOrdersFromStorage(): Order[] {
    if (typeof window === "undefined") return [];
    try {
        const stored = localStorage.getItem(ORDERS_STORAGE_KEY);
        return stored ? deserializeOrders(stored) : [];
    } catch {
        return [];
    }
}

function normalizeOrderStatus(apiStatus: string): OrderStatus {
    switch (apiStatus) {
        case "PAID": return "PENDING";
        case "READY_FOR_PICKUP": return "READY";
        case "CANCELLED": return "REFUSED";
        default: return apiStatus as OrderStatus;
    }
}

function apiOrderToOrder(apiOrder: ApiOrder, restaurantName = "", fallbackCode = ""): Order {
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
        status: normalizeOrderStatus(apiOrder.status),
        createdAt: new Date(apiOrder.createdAt),
        deliveryCode: apiOrder.deliveryCode ?? fallbackCode,
    };
}

const OrderContext = createContext<OrderContextType | null>(null);

export function OrderProvider({ children }: { children: React.ReactNode }) {
    const { token, user, isLoading: authLoading } = useAuth();
    const isClient = !authLoading && !!token && (user?.roles?.includes("CLIENT") ?? false);

    const [orders, setOrders] = useState<Order[]>(loadOrdersFromStorage);

    useEffect(() => {
        localStorage.setItem(ORDERS_STORAGE_KEY, serializeOrders(orders));
    }, [orders]);

    useEffect(() => {
        if (!isClient || !token) return;
        const syncOrders = async () => {
            try {
                const list = await apiRequest<ApiOrder[]>("/orders/mine", "GET", undefined, token);
                setOrders((prev) => {
                    const localById = new Map(prev.map((o) => [o.id, o]));
                    const apiOrders = list.map((apiOrder) => {
                        const local = localById.get(apiOrder.id);
                        return apiOrderToOrder(apiOrder, local?.restaurantName ?? "", local?.deliveryCode ?? "");
                    });
                    const apiIds = new Set(list.map((o) => o.id));
                    const localOnlyOrders = prev.filter((o) => !apiIds.has(o.id));
                    return [...apiOrders, ...localOnlyOrders];
                });
            } catch (error) {
                console.error("[OrderContext] Failed to sync orders from API:", error);
            }
        };
        syncOrders();
    }, [isClient, token]);

    const createOrder = async (data: CreateOrderData): Promise<Order> => {
        const deliveryCode = generateDeliveryCode();

        if (isClient && token && data.cartId) {
            const checkoutBody: Record<string, unknown> = {
                cartId: data.cartId,
                deliveryStreet: data.address.street,
                deliveryCity: data.address.city,
                deliveryPostalCode: data.address.zip,
                deliveryCountry: "France",
            };
            if (data.tipAmount !== undefined && data.tipAmount > 0) {
                checkoutBody.tipAmount = data.tipAmount;
            }
            const apiOrder = await apiRequest<ApiOrder>("/orders/checkout", "POST", checkoutBody, token);
            const order = apiOrderToOrder(apiOrder, data.restaurantName, deliveryCode);
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
            deliveryFee: DELIVERY_FEE,
            serviceFee: SERVICE_FEE,
            total: DELIVERY_FEE + SERVICE_FEE,
            status: "PENDING",
            createdAt: new Date(),
            deliveryCode,
        };
        setOrders((prev) => [...prev, order]);
        return order;
    };

    const updateStatus = (id: string, status: OrderStatus) => {
        setOrders((prev) => prev.map((order) => (order.id === id ? { ...order, status } : order)));
    };

    const getOrder = (id: string): Order | null =>
        orders.find((order) => order.id === id) ?? null;

    const refreshOrder = async (id: string): Promise<void> => {
        if (!token) return;
        try {
            const apiOrder = await apiRequest<ApiOrder>(`/orders/${id}`, "GET", undefined, token);
            setOrders((prev) => prev.map((order) => {
                if (order.id !== id) return order;
                return apiOrderToOrder(apiOrder, order.restaurantName, order.deliveryCode);
            }));
        } catch {}
    };

    const currentOrder = orders.length > 0 ? orders[orders.length - 1] : null;

    return (
        <OrderContext.Provider value={{ orders, currentOrder, createOrder, updateStatus, getOrder, refreshOrder }}>
            {children}
        </OrderContext.Provider>
    );
}

export function useOrder(): OrderContextType {
    const ctx = useContext(OrderContext);
    if (!ctx) throw new Error("useOrder must be used within OrderProvider");
    return ctx;
}
