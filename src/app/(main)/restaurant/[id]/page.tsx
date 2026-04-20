import { notFound } from "next/navigation";
import placesData from "@/data/place.json";
import foodData from "@/data/food.json";
import categoriesData from "@/data/foodCategory.json";
import { Place, FoodItem, FoodCategory } from "@/types/food";
import RestaurantHero from "@/components/restaurant/RestaurantHero";
import RestaurantMenu from "@/components/restaurant/RestaurantMenu";
import RestaurantCart from "@/components/restaurant/RestaurantCart";

interface PageProps {
    params: Promise<{ id: string }>;
}

export default async function RestaurantPage({ params }: PageProps) {
    const { id } = await params;
    const restaurantId = parseInt(id, 10);

    const restaurant = (placesData as Place[]).find((p) => p.id === restaurantId);
    if (!restaurant) notFound();

    const foods = (foodData as FoodItem[]).filter((f) => f.placeId === restaurantId);
    const categories = categoriesData as FoodCategory[];

    const categoryIds = [...new Set(foods.map((f) => f.categoryId))];
    const sections = categoryIds
        .map((catId) => ({
            category: categories.find((c) => c.id === catId) ?? { id: catId, name: "Autre", description: "" },
            items: foods.filter((f) => f.categoryId === catId),
        }))
        .filter((s) => s.items.length > 0);

    return (
        <div className="min-h-screen bg-stone-50">
            <RestaurantHero restaurant={restaurant} />

            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="flex gap-8 items-start">
                    {/* Menu — takes all available space */}
                    <div className="flex-1 min-w-0">
                        <RestaurantMenu
                            sections={sections}
                            restaurantId={restaurant.id}
                            restaurantName={restaurant.name}
                        />
                    </div>

                    {/* Cart — sticky sidebar */}
                    <div className="hidden lg:block w-80 xl:w-96 shrink-0 sticky top-28">
                        <RestaurantCart />
                    </div>
                </div>
            </div>

            {/* Mobile floating cart button — shown when cart has items */}
            <MobileCartBar />
        </div>
    );
}

function MobileCartBar() {
    return <MobileCartBarClient />;
}

// Extracted to keep the server component clean
import MobileCartBarClient from "@/components/restaurant/MobileCartBar";
