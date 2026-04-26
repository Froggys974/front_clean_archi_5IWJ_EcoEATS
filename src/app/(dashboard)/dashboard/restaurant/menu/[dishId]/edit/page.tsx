"use client";

import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { useRestaurant } from "@/context/RestaurantContext";
import DishForm, { DishFormData } from "@/components/dashboard/DishForm";

export default function EditDishPage() {
    const { dishId } = useParams<{ dishId: string }>();
    const { getDish, updateDish } = useRestaurant();
    const router = useRouter();

    const dish = getDish(Number(dishId));

    const handleSubmit = (data: DishFormData) => {
        updateDish(Number(dishId), data);
        router.push("/dashboard/restaurant/menu");
    };

    if (!dish) {
        return (
            <div className="flex flex-col gap-4 max-w-xl">
                <Link href="/dashboard/restaurant/menu" className="text-stone-400 hover:text-accent text-sm transition-colors">
                    ← Menu
                </Link>
                <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-10 text-center">
                    <p className="text-stone-500 font-semibold">Plat introuvable.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-xl flex flex-col gap-6">
            <div>
                <Link href="/dashboard/restaurant/menu" className="text-stone-400 hover:text-accent text-sm transition-colors">
                    ← Menu
                </Link>
                <h1 className="text-2xl font-bold text-stone-900 mt-2">Modifier : {dish.name}</h1>
            </div>

            <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-6">
                <DishForm
                    initial={{
                        name: dish.name,
                        description: dish.description,
                        price: dish.price,
                        allergens: dish.allergens ?? [],
                        dailyStock: dish.dailyStock ?? 10,
                        categoryId: dish.categoryId,
                        image: dish.image,
                    }}
                    onSubmit={handleSubmit}
                    onCancel={() => router.push("/dashboard/restaurant/menu")}
                    submitLabel="Enregistrer les modifications"
                />
            </div>
        </div>
    );
}
