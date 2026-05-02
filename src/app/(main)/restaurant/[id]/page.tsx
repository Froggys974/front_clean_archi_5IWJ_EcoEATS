"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { notFound } from "next/navigation";
import { Place, FoodItem, FoodCategory } from "@/types/food";
import RestaurantHero from "@/components/restaurant/RestaurantHero";
import RestaurantMenu from "@/components/restaurant/RestaurantMenu";
import RestaurantCart from "@/components/restaurant/RestaurantCart";
import MobileCartBarClient from "@/components/restaurant/MobileCartBar";
import { useApi } from "@/hooks/useApi";
import { RestaurantDto, DishDto, CategoryDto } from "@/types/api";

function mapRestaurant(r: RestaurantDto): Place {
    return {
        id: r.id,
        name: r.name,
        address: `${r.address.street}, ${r.address.city}`,
        city: r.address.city,
        rating: r.rating,
        image: r.imageUrl ?? `https://picsum.photos/400/300?random=${r.id}`,
        url: `/restaurant/${r.id}`,
        maxDeliveryTime: 30,
        highlighted: r.highlighted,
        isFast: false,
        OpeningHours: r.openingHours.map(oh => ({ day: oh.dayOfWeek, open: oh.openTime, close: oh.closeTime })),
        ownerId: r.ownerId,
    };
}

function mapDish(d: DishDto): FoodItem {
    return {
        id: d.id,
        name: d.name,
        description: d.description,
        price: d.price,
        image: d.imageUrl ?? `https://picsum.photos/200/150?random=${d.id}`,
        url: '',
        offerId: null,
        categoryId: d.category ?? 'default',
        placeId: d.restaurantId ?? '',
        allergens: d.allergens,
        dailyStock: d.availableStock,
        availableStock: d.availableStock,
    };
}

function mapCategory(c: CategoryDto): FoodCategory {
    return { id: c.id, name: c.name, description: '', visual: c.imageUrl ?? '', slug: c.slug };
}

export default function RestaurantPage() {
    const { id } = useParams<{ id: string }>();
    const { get } = useApi();
    const [restaurant, setRestaurant] = useState<Place | null>(null);
    const [sections, setSections] = useState<{ category: FoodCategory; items: FoodItem[] }[]>([]);
    const [notFound404, setNotFound404] = useState(false);

    useEffect(() => {
        if (!id) return;
        Promise.all([
            get<RestaurantDto>(`/restaurants/${id}`).catch(() => null),
            get<DishDto[]>(`/restaurants/${id}/dishes`).catch(() => [] as DishDto[]),
            get<CategoryDto[]>('/restaurants/categories').catch(() => [] as CategoryDto[]),
        ]).then(([r, d, c]) => {
            if (!r) { setNotFound404(true); return; }
            setRestaurant(mapRestaurant(r));
            const foods = d.map(mapDish);
            const cats = c.map(mapCategory);
            const categoryIds = [...new Set(foods.map(f => f.categoryId))];
            setSections(
                categoryIds
                    .map(catId => ({
                        category: cats.find(cat => cat.id === catId) ?? { id: catId, name: catId, description: '' },
                        items: foods.filter(f => f.categoryId === catId),
                    }))
                    .filter(s => s.items.length > 0)
            );
        });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    if (notFound404) notFound();
    if (!restaurant) return null;

    return (
        <div className="min-h-screen bg-stone-50">
            <RestaurantHero restaurant={restaurant} />

            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="flex gap-8 items-start">
                    <div className="flex-1 min-w-0">
                        <RestaurantMenu
                            sections={sections}
                            restaurantId={restaurant.id}
                            restaurantName={restaurant.name}
                        />
                    </div>
                    <div className="hidden lg:block w-80 xl:w-96 shrink-0 sticky top-28">
                        <RestaurantCart />
                    </div>
                </div>
            </div>

            <MobileCartBarClient />
        </div>
    );
}
