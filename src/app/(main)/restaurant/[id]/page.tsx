import { notFound } from "next/navigation";
import { ApiRestaurant, ApiDish } from "@/types/api";
import RestaurantHero from "@/components/restaurant/RestaurantHero";
import RestaurantMenu from "@/components/restaurant/RestaurantMenu";
import RestaurantCart from "@/components/restaurant/RestaurantCart";
import MobileCartBarClient from "@/components/restaurant/MobileCartBar";
import { getOpenState } from "@/utils/openingHours";
import { OpeningHour } from "@/types/food";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

interface PageProps {
    params: Promise<{ id: string }>;
}

export default async function RestaurantPage({ params }: PageProps) {
    const { id } = await params;

    const [restaurantRes, dishesRes] = await Promise.all([
        fetch(`${API_URL}/restaurants/${id}`, { cache: "no-store" }),
        fetch(`${API_URL}/restaurants/${id}/dishes`, { cache: "no-store" }),
    ]);

    if (!restaurantRes.ok) notFound();

    const restaurant: ApiRestaurant = await restaurantRes.json();
    const dishes: ApiDish[] = dishesRes.ok ? await dishesRes.json() : [];

    const hours = restaurant.openingHours as unknown as OpeningHour[];
    const openState = getOpenState(restaurant.status ?? "OPEN", hours);
    const isOpen = openState === "open";

    const categoryMap = new Map<string, ApiDish[]>();
    for (const dish of dishes) {
        const cat = dish.category ?? "Autre";
        const existing = categoryMap.get(cat) ?? [];
        existing.push(dish);
        categoryMap.set(cat, existing);
    }

    const sections = Array.from(categoryMap.entries()).map(([cat, items]) => ({
        category: { id: cat, name: cat },
        items,
    }));

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
                            isOpen={isOpen}
                            restaurantStatus={restaurant.status}
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
