"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useRestaurant } from "@/context/RestaurantContext";
import DishForm, { DishFormData } from "@/components/dashboard/DishForm";

export default function NewDishPage() {
    const { addDish } = useRestaurant();
    const router = useRouter();

    const handleSubmit = (data: DishFormData) => {
        addDish({ ...data, offerId: null, popular: false });
        router.push("/dashboard/restaurant/menu");
    };

    return (
        <div className="max-w-xl flex flex-col gap-6">
            <div>
                <Link href="/dashboard/restaurant/menu" className="text-stone-400 hover:text-accent text-sm transition-colors">
                    ← Menu
                </Link>
                <h1 className="text-2xl font-bold text-stone-900 mt-2">Ajouter un plat</h1>
            </div>

            <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-6">
                <DishForm
                    onSubmit={handleSubmit}
                    onCancel={() => router.push("/dashboard/restaurant/menu")}
                    submitLabel="Ajouter au menu"
                />
            </div>
        </div>
    );
}
