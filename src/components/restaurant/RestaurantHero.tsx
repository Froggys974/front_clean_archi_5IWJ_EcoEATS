import Image from "next/image";
import Link from "next/link";
import { ApiRestaurant } from "@/types/api";
import { MapPinIcon, ScooterIcon } from "@/components/icons";
import { getOpenState, getTodaySlots, DAY_NAMES } from "@/utils/openingHours";
import { OpeningHour } from "@/types/food";

interface RestaurantHeroProps {
    restaurant: ApiRestaurant;
}

export default function RestaurantHero({ restaurant }: RestaurantHeroProps) {
    const hours = restaurant.openingHours as unknown as OpeningHour[];
    const state = getOpenState(restaurant.status ?? "OPEN", hours);
    const isOpen = state === "open";
    const todaySlots = getTodaySlots(hours);
    const imgSrc = restaurant.imageUrl ?? "https://picsum.photos/400/300?random=1";

    return (
        <div className="w-full">
            <div className="relative w-full h-72 md:h-96 overflow-hidden bg-stone-200">
                <Image src={imgSrc} alt={restaurant.name} fill className="object-cover" />
                <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent" />

                <Link
                    href="/"
                    className="mt-15 absolute top-6 left-6 flex items-center gap-2 bg-white/90 backdrop-blur-sm text-stone-800 text-sm font-semibold px-4 py-2 rounded-full hover:bg-white transition-colors"
                >
                    ← Retour
                </Link>

                <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                    <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 drop-shadow">
                        {restaurant.name}
                    </h1>
                    <div className="flex flex-wrap items-center gap-4 text-white/90 text-sm">
                        <span className="flex items-center gap-1.5">
                            <MapPinIcon size={16} />
                            {restaurant.address.street}, {restaurant.address.city}
                        </span>
                        <span className="flex items-center gap-1.5">
                            <ScooterIcon size={16} />
                            {restaurant.cuisineType}
                        </span>
                        <span className="flex items-center gap-1 font-semibold">
                            <span className="text-yellow-400">★</span>
                            {restaurant.rating}
                        </span>
                    </div>
                </div>
            </div>

            <div className="w-full bg-white border-b border-stone-100 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 py-4 flex flex-wrap items-center gap-6">
                    <div className="flex items-center gap-2">
                        <div className={`w-2.5 h-2.5 rounded-full ${isOpen ? "bg-green-500" : state === "temporarily_closed" ? "bg-orange-400" : "bg-red-400"}`} />
                        <span className="text-sm font-semibold text-stone-800">
                            {isOpen ? "Ouvert" : state === "temporarily_closed" ? "Temporairement fermé" : "Fermé"}
                        </span>
                        {(isOpen || state === "closed_hours") && (
                            <span className="text-stone-400 text-sm">— {todaySlots}</span>
                        )}
                    </div>

                    {restaurant.openingHours.length > 0 && (
                        <details className="relative text-sm">
                            <summary className="cursor-pointer text-accent hover:underline select-none list-none">
                                Voir tous les horaires
                            </summary>
                            <div className="absolute z-20 top-full mt-2 left-0 bg-white border border-stone-100 rounded-xl shadow-lg p-4 grid grid-cols-2 gap-x-6 gap-y-1.5 text-sm min-w-[16rem]">
                                {DAY_NAMES.map((day, idx) => {
                                    const slots = restaurant.openingHours.filter((hour) => hour.dayOfWeek === idx);
                                    return (
                                        <div key={idx} className="contents">
                                            <span className="font-medium text-stone-700">{day}</span>
                                            <span className="text-stone-500">
                                                {slots.length === 0
                                                    ? "Fermé"
                                                    : slots.map((slot) => `${slot.openTime}–${slot.closeTime}`).join(", ")}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        </details>
                    )}

                    {restaurant.description && (
                        <p className="text-sm text-stone-500 ml-auto max-w-md text-right line-clamp-1">
                            {restaurant.description}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}
