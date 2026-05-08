"use client";

import { useState, useMemo } from "react";
import { ApiRestaurant } from "@/types/api";
import { OpeningHour } from "@/types/food";
import { isOpenNow } from "@/utils/openingHours";
import RestaurantCard from "@/components/home/RestaurantCard";
import { SearchIcon } from "@/components/icons";

type SortKey = "rating" | "name";

interface RestaurantsClientProps {
    restaurants: ApiRestaurant[];
}

export default function RestaurantsClient({ restaurants }: RestaurantsClientProps) {
    const [search, setSearch] = useState("");
    const [city, setCity] = useState("all");
    const [sort, setSort] = useState<SortKey>("rating");

    const cities = useMemo(
        () => ["all", ...Array.from(new Set(restaurants.map((restaurant) => restaurant.address.city))).sort()],
        [restaurants]
    );

    const filtered = useMemo(() => {
        let list = restaurants;

        if (search.trim()) {
            const q = search.trim().toLowerCase();
            list = list.filter((restaurant) => restaurant.name.toLowerCase().includes(q));
        }
        if (city !== "all") list = list.filter((restaurant) => restaurant.address.city === city);

        return [...list].sort((restaurantA, restaurantB) => {
            if (sort === "rating") return restaurantB.rating - restaurantA.rating;
            return restaurantA.name.localeCompare(restaurantB.name);
        });
    }, [restaurants, search, city, sort]);

    const openCount = filtered.filter((restaurant) =>
        isOpenNow(restaurant.openingHours as unknown as OpeningHour[])
    ).length;

    return (
        <div className="min-h-screen bg-stone-50">
            <div
                className="w-full pt-28 pb-12 px-4"
                style={{ background: "linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%)" }}
            >
                <div className="max-w-7xl mx-auto">
                    <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">Tous les restaurants</h1>
                    <p className="text-white/80 text-base">
                        {restaurants.length} restaurants disponibles · {openCount} ouverts maintenant
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-4 mb-8 flex flex-col sm:flex-row flex-wrap gap-3 items-start sm:items-center">
                    <div className="flex items-center gap-2 bg-stone-100 rounded-xl px-4 py-2.5 flex-1 min-w-[180px]">
                        <SearchIcon size={18} className="text-stone-400 shrink-0" />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Rechercher un restaurant…"
                            className="bg-transparent outline-none text-sm placeholder:text-stone-400 w-full"
                        />
                    </div>
                    <select
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="text-sm border border-stone-200 rounded-xl px-3 py-2.5 outline-none focus:border-accent bg-white cursor-pointer text-stone-700"
                    >
                        <option value="all">Toutes les villes</option>
                        {cities.slice(1).map((cityName) => (
                            <option key={cityName} value={cityName}>{cityName}</option>
                        ))}
                    </select>
                    <select
                        value={sort}
                        onChange={(e) => setSort(e.target.value as SortKey)}
                        className="text-sm border border-stone-200 rounded-xl px-3 py-2.5 outline-none focus:border-accent bg-white cursor-pointer text-stone-700 ml-auto"
                    >
                        <option value="rating">Mieux notés</option>
                        <option value="name">A – Z</option>
                    </select>
                </div>
                <p className="text-sm text-stone-400 mb-5 font-medium">
                    {filtered.length} résultat{filtered.length !== 1 ? "s" : ""}
                    {search.trim() ? ` pour "${search.trim()}"` : ""}
                </p>
                {filtered.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
                        <p className="text-stone-500 font-medium">Aucun restaurant ne correspond à vos critères.</p>
                        <button
                            onClick={() => { setSearch(""); setCity("all"); }}
                            className="cursor-pointer text-accent text-sm font-semibold hover:underline"
                        >
                            Réinitialiser les filtres
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filtered.map((restaurant) => (
                            <RestaurantCard key={restaurant.id} restaurant={restaurant} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
