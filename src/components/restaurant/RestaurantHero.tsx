import Link from "next/link";
import { Place, OpeningHour } from "@/types/food";
import { MapPinIcon, ScooterIcon } from "@/components/icons";

const DAY_NAMES = ["Dim.", "Lun.", "Mar.", "Mer.", "Jeu.", "Ven.", "Sam."];

function getTodaySlots(openingHours: OpeningHour[] = []): string {
    const day = new Date().getDay();
    const slots = openingHours.filter((h) => h.day === day);
    if (slots.length === 0) return "Fermé aujourd'hui";
    return slots.map((s) => `${s.open} – ${s.close}`).join(", ");
}

function isOpenNow(openingHours: OpeningHour[] = []): boolean {
    const now = new Date();
    const day = now.getDay();
    const time = now.getHours() * 60 + now.getMinutes();
    return openingHours
        .filter((h) => h.day === day)
        .some((h) => {
            const [oh, om] = h.open.split(":").map(Number);
            const [ch, cm] = h.close.split(":").map(Number);
            const open = oh * 60 + om;
            const close = ch * 60 + cm;
            return close < open ? time >= open || time < close : time >= open && time < close;
        });
}

interface RestaurantHeroProps {
    restaurant: Place;
}

export default function RestaurantHero({ restaurant }: RestaurantHeroProps) {
    const open = isOpenNow(restaurant.OpeningHours);
    const todaySlots = getTodaySlots(restaurant.OpeningHours);

    return (
        <div className="w-full">
            {/* Banner image */}
            <div className="relative w-full h-72 md:h-96 overflow-hidden bg-stone-200">
                <img
                    src={restaurant.image}
                    alt={restaurant.name}
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                {/* Back link */}
                <Link
                    href="/"
                    className="absolute top-6 left-6 flex items-center gap-2 bg-white/90 backdrop-blur-sm text-stone-800 text-sm font-semibold px-4 py-2 rounded-full hover:bg-white transition-colors"
                >
                    ← Retour
                </Link>

                {/* Badges */}
                <div className="absolute top-6 right-6 flex gap-2">
                    {restaurant.isFast && (
                        <span className="bg-primary text-black text-xs font-bold px-3 py-1.5 rounded-full">
                            ⚡ Livraison rapide
                        </span>
                    )}
                    {restaurant.offer && (
                        <span className="bg-accent text-white text-xs font-bold px-3 py-1.5 rounded-full">
                            {restaurant.offer}
                        </span>
                    )}
                </div>

                {/* Restaurant name overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                    <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 drop-shadow">
                        {restaurant.name}
                    </h1>
                    <div className="flex flex-wrap items-center gap-4 text-white/90 text-sm">
                        <span className="flex items-center gap-1.5">
                            <MapPinIcon size={16} />
                            {restaurant.address}, {restaurant.city}
                        </span>
                        <span className="flex items-center gap-1.5">
                            <ScooterIcon size={16} />
                            max {restaurant.maxDeliveryTime} min
                        </span>
                        <span className="flex items-center gap-1.5">
                            <span className="text-yellow-400">★</span>
                            {restaurant.rating}
                        </span>
                    </div>
                </div>
            </div>

            {/* Info bar */}
            <div className="w-full bg-white border-b border-stone-100 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 py-4 flex flex-wrap items-center gap-6">
                    <div className="flex items-center gap-2">
                        <div className={`w-2.5 h-2.5 rounded-full ${open ? "bg-green-500" : "bg-red-500"}`} />
                        <span className="text-sm font-semibold">{open ? "Ouvert" : "Fermé"}</span>
                        <span className="text-stone-400 text-sm">— {todaySlots}</span>
                    </div>

                    {restaurant.OpeningHours && restaurant.OpeningHours.length > 0 && (
                        <details className="text-sm">
                            <summary className="cursor-pointer text-accent hover:underline select-none">
                                Voir tous les horaires
                            </summary>
                            <div className="absolute z-20 mt-2 bg-white border border-stone-100 rounded-xl shadow-lg p-4 grid grid-cols-2 gap-x-6 gap-y-1 text-sm">
                                {DAY_NAMES.map((day, idx) => {
                                    const slots = restaurant.OpeningHours!.filter((h) => h.day === idx);
                                    return (
                                        <div key={idx} className="contents">
                                            <span className="font-medium text-stone-700">{day}</span>
                                            <span className="text-stone-500">
                                                {slots.length === 0
                                                    ? "Fermé"
                                                    : slots.map((s) => `${s.open}–${s.close}`).join(", ")}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        </details>
                    )}
                </div>
            </div>
        </div>
    );
}
