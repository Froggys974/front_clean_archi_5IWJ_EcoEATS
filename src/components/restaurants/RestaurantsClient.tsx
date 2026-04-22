"use client";

import { useState, useMemo } from "react";
import { Place } from "@/types/food";
import RestaurantCard from "@/components/home/RestaurantCard";
import { SearchIcon } from "@/components/icons";

type SortKey = "rating" | "delivery" | "name";

interface RestaurantsClientProps {
    restaurants: Place[];
}

function isOpenNow(openingHours?: Place["OpeningHours"]): boolean {
    if (!openingHours || openingHours.length === 0) return true;
    const now = new Date();
    const day = now.getDay();
    const time = now.getHours() * 60 + now.getMinutes();
    return openingHours
        .filter((h) => h.day === day)
        .some((h) => {
            const [oh, om] = h.open.split(":").map(Number);
            const [ch, cm] = h.close.split(":").map(Number);
            const openT = oh * 60 + om;
            const closeT = ch * 60 + cm;
            return closeT < openT ? time >= openT || time < closeT : time >= openT && time < closeT;
        });
}

export default function RestaurantsClient({ restaurants }: RestaurantsClientProps) {
    const [search, setSearch] = useState("");
    const [city, setCity] = useState("all");
    const [onlyFast, setOnlyFast] = useState(false);
    const [onlyOffers, setOnlyOffers] = useState(false);
    const [sort, setSort] = useState<SortKey>("rating");

    const cities = useMemo(
        () => ["all", ...Array.from(new Set(restaurants.map((r) => r.city))).sort()],
        [restaurants]
    );

    const filtered = useMemo(() => {
        let list = restaurants;

        if (search.trim()) {
            const q = search.trim().toLowerCase();
            list = list.filter((r) => r.name.toLowerCase().includes(q));
        }
        if (city !== "all") list = list.filter((r) => r.city === city);
        if (onlyFast) list = list.filter((r) => r.isFast);
        if (onlyOffers) list = list.filter((r) => r.offer);

        return [...list].sort((a, b) => {
            if (sort === "rating") return b.rating - a.rating;
            if (sort === "delivery") return a.maxDeliveryTime - b.maxDeliveryTime;
            return a.name.localeCompare(b.name);
        });
    }, [restaurants, search, city, onlyFast, onlyOffers, sort]);

    const openCount = filtered.filter((r) => isOpenNow(r.OpeningHours)).length;

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
                        {cities.slice(1).map((c) => (
                            <option key={c} value={c}>{c}</option>
                        ))}
                    </select>
                    <div className="flex items-center gap-2 flex-wrap">
                        <FilterChip
                            label="Livraison rapide"
                            active={onlyFast}
                            onClick={() => setOnlyFast((v) => !v)}
                        />
                        <FilterChip
                            label="Avec offre"
                            active={onlyOffers}
                            onClick={() => setOnlyOffers((v) => !v)}
                        />
                    </div>
                    <select
                        value={sort}
                        onChange={(e) => setSort(e.target.value as SortKey)}
                        className="text-sm border border-stone-200 rounded-xl px-3 py-2.5 outline-none focus:border-accent bg-white cursor-pointer text-stone-700 ml-auto"
                    >
                        <option value="rating">Mieux notés</option>
                        <option value="delivery">Livraison rapide</option>
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
                            onClick={() => { setSearch(""); setCity("all"); setOnlyFast(false); setOnlyOffers(false); }}
                            className="cursor-pointer text-accent text-sm font-semibold hover:underline"
                        >
                            Réinitialiser les filtres
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filtered.map((r) => (
                            <RestaurantCard key={r.id} restaurant={r} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

function FilterChip({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
    return (
        <button
            onClick={onClick}
            className={`cursor-pointer text-sm font-semibold px-4 py-2 rounded-full border transition-all duration-150 ${
                active
                    ? "bg-accent text-white border-accent"
                    : "bg-white text-stone-600 border-stone-200 hover:border-accent hover:text-accent"
            }`}
        >
            {label}
        </button>
    );
}
