"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { FoodItem, Place } from "@/types/food";
import { useApi } from "@/hooks/useApi";
import { DishDto, OrderDto, RestaurantDto, AddDishBody, OfferDto, AddOfferBody, UpdateRestaurantBody } from "@/types/api";

export type DashboardOrderStatus = "PENDING" | "ACCEPTED" | "REFUSED" | "READY" | "DELIVERED";

export type DashboardOrderItem = { foodId: string; name: string; price: number; quantity: number };

export type DashboardOrder = {
    id: string;
    customerName: string;
    items: DashboardOrderItem[];
    total: number;
    status: DashboardOrderStatus;
    createdAt: Date;
    estimatedMinutes?: number;
    address: string;
};

export type DashboardOffer = {
    id: string;
    label: string;
    discountPercent: number;
    imageUrl: string | null;
};

type RestaurantContextType = {
    restaurant: Place | null;
    dishes: FoodItem[];
    orders: DashboardOrder[];
    offers: DashboardOffer[];
    isLoading: boolean;
    addDish: (dish: Omit<FoodItem, "id" | "url" | "placeId">) => Promise<void>;
    updateDish: (id: string, updates: Partial<FoodItem>) => Promise<void>;
    deleteDish: (id: string) => Promise<void>;
    getDish: (id: string) => FoodItem | undefined;
    addOffer: (offer: { label: string; discountPercent: number; imageUrl?: string }) => Promise<void>;
    updateRestaurant: (updates: {
        name?: string;
        description?: string;
        cuisineType?: string;
        imageUrl?: string;
        status?: 'OPEN' | 'CLOSED' | 'TEMPORARILY_CLOSED';
        openingHours?: { day: number; open: string; close: string }[];
    }) => Promise<void>;
    acceptOrder: (id: string, estimatedMinutes: number) => Promise<void>;
    refuseOrder: (id: string) => Promise<void>;
    markReady: (id: string) => Promise<void>;
};

const RestaurantContext = createContext<RestaurantContextType | null>(null);

function mapRestaurant(r: RestaurantDto): Place {
    return {
        id: r.id, name: r.name,
        address: `${r.address.street}, ${r.address.city}`,
        city: r.address.city, rating: r.rating,
        image: r.imageUrl ?? `https://picsum.photos/400/300?random=${r.id}`,
        url: `/restaurant/${r.id}`, maxDeliveryTime: 30,
        OpeningHours: r.openingHours.map(oh => ({ day: oh.dayOfWeek, open: oh.openTime, close: oh.closeTime })),
        ownerId: r.ownerId,
    };
}

function mapDish(d: DishDto): FoodItem {
    return {
        id: d.id, name: d.name, description: d.description, price: d.price,
        image: d.imageUrl ?? `https://picsum.photos/200/150?random=${d.id}`,
        url: '', offerId: null, categoryId: d.category ?? 'default',
        placeId: d.restaurantId ?? '', allergens: d.allergens,
        dailyStock: d.dailyStock, availableStock: d.availableStock,
    };
}

function mapStatusFromApi(status: string): DashboardOrderStatus {
    const map: Record<string, DashboardOrderStatus> = {
        PENDING: 'PENDING', PAID: 'PENDING', ACCEPTED: 'ACCEPTED', REFUSED: 'REFUSED',
        PREPARING: 'ACCEPTED', READY_FOR_PICKUP: 'READY',
        PICKED_UP: 'DELIVERED', DELIVERING: 'DELIVERED', DELIVERED: 'DELIVERED',
    };
    return map[status] ?? 'PENDING';
}

function mapOrder(o: OrderDto): DashboardOrder {
    return {
        id: o.id, customerName: `Client ${o.clientId.slice(-4)}`,
        items: o.items.map(i => ({ foodId: i.dishId, name: i.dishName, price: i.dishPrice, quantity: i.quantity })),
        total: o.totalPrice, status: mapStatusFromApi(o.status),
        createdAt: new Date(o.createdAt),
        estimatedMinutes: o.preparationTimeMinutes ?? undefined,
        address: `${o.deliveryAddress.street}, ${o.deliveryAddress.city}`,
    };
}

function mapOffer(o: OfferDto): DashboardOffer {
    return {
        id: o.id,
        label: o.label,
        discountPercent: o.discountPercent,
        imageUrl: o.imageUrl,
    };
}

export function RestaurantProvider({ children, userId }: { children: React.ReactNode; userId: string | undefined }) {
    const { get, post, patch, del } = useApi();
    const [restaurant, setRestaurant] = useState<Place | null>(null);
    const [dishes, setDishes] = useState<FoodItem[]>([]);
    const [orders, setOrders] = useState<DashboardOrder[]>([]);
    const [offers, setOffers] = useState<DashboardOffer[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!userId) { setIsLoading(false); return; }
        setIsLoading(true);
        Promise.all([
            get<RestaurantDto>('/restaurants/me/restaurant').catch(() => null),
            get<DishDto[]>('/restaurants/me/dishes').catch(() => [] as DishDto[]),
            get<OfferDto[]>('/restaurants/me/offers').catch(() => [] as OfferDto[]),
            get<OrderDto[]>('/orders/restaurant').catch(() => [] as OrderDto[]),
        ]).then(([r, d, offersResult, o]) => {
            if (r) setRestaurant(mapRestaurant(r));
            setDishes(d.map(mapDish));
            setOffers(offersResult.map(mapOffer));
            setOrders(o.map(mapOrder));
        }).finally(() => setIsLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userId]);

    const addDish = async (dish: Omit<FoodItem, "id" | "url" | "placeId">) => {
        const body: AddDishBody = {
            name: dish.name, description: dish.description, priceAmount: dish.price,
            allergens: dish.allergens, dailyStock: dish.dailyStock ?? 10,
            imageUrl: dish.image, category: dish.categoryId,
        };
        const created = await post<DishDto>('/restaurants/me/dishes', body);
        setDishes(prev => [...prev, mapDish(created)]);
    };

    const updateDish = async (id: string, updates: Partial<FoodItem>) => {
        const updated = await patch<DishDto>(`/restaurants/me/dishes/${id}`, {
            name: updates.name, description: updates.description,
            priceAmount: updates.price, allergens: updates.allergens,
            dailyStock: updates.dailyStock, imageUrl: updates.image,
            category: updates.categoryId,
        });
        setDishes(prev => prev.map(d => d.id === id ? mapDish(updated) : d));
    };

    const deleteDish = async (id: string) => {
        await del<void>(`/restaurants/me/dishes/${id}`);
        setDishes(prev => prev.filter(d => d.id !== id));
    };

    const getDish = (id: string) => dishes.find(d => d.id === id);

    const addOffer = async (offer: { label: string; discountPercent: number; imageUrl?: string }) => {
        const body: AddOfferBody = {
            label: offer.label,
            discountPercent: offer.discountPercent,
            imageUrl: offer.imageUrl,
        };
        const created = await post<OfferDto>('/restaurants/me/offers', body);
        setOffers(prev => [mapOffer(created), ...prev]);
    };

    const updateRestaurant = async (updates: {
        name?: string;
        description?: string;
        cuisineType?: string;
        imageUrl?: string;
        status?: 'OPEN' | 'CLOSED' | 'TEMPORARILY_CLOSED';
        openingHours?: { day: number; open: string; close: string }[];
    }) => {
        const body: UpdateRestaurantBody = {
            name: updates.name,
            description: updates.description,
            cuisineType: updates.cuisineType,
            imageUrl: updates.imageUrl,
            status: updates.status,
            openingHours: updates.openingHours?.map((slot) => ({
                dayOfWeek: slot.day,
                openTime: slot.open,
                closeTime: slot.close,
            })),
        };

        const updated = await patch<RestaurantDto>('/restaurants/me/restaurant', body);
        setRestaurant(mapRestaurant(updated));
    };

    const acceptOrder = async (id: string, estimatedMinutes: number) => {
        const updated = await post<OrderDto>(`/orders/${id}/accept`, { preparationTimeMinutes: estimatedMinutes });
        setOrders(prev => prev.map(o => o.id === id ? mapOrder(updated) : o));
    };

    const refuseOrder = async (id: string) => {
        const updated = await post<OrderDto>(`/orders/${id}/refuse`);
        setOrders(prev => prev.map(o => o.id === id ? mapOrder(updated) : o));
    };

    const markReady = async (id: string) => {
        const updated = await post<OrderDto>(`/orders/${id}/ready`);
        setOrders(prev => prev.map(o => o.id === id ? mapOrder(updated) : o));
    };

    return (
        <RestaurantContext.Provider value={{
            restaurant,
            dishes,
            orders,
            offers,
            isLoading,
            addDish,
            updateDish,
            deleteDish,
            getDish,
            addOffer,
            updateRestaurant,
            acceptOrder,
            refuseOrder,
            markReady,
        }}>
            {children}
        </RestaurantContext.Provider>
    );
}

export function useRestaurant(): RestaurantContextType {
    const ctx = useContext(RestaurantContext);
    if (!ctx) throw new Error("useRestaurant must be used within RestaurantProvider");
    return ctx;
}
