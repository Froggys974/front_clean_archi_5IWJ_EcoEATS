import React from 'react';
import Image from "next/image";
import { Place } from "@/types/food";
import Button from "@/components/ui/Button";
import { isOpenNow } from "@/utils/openingHours";

interface RestaurantCardProps {
    restaurant: Place;
}

export default function RestaurantCard({ restaurant }: RestaurantCardProps) {
    const open = isOpenNow(restaurant.OpeningHours);

    return (
        <div className="flex flex-col bg-white rounded-xl border border-stone-100 overflow-hidden group/card transition-all hover:shadow-md h-full">
            <div className="relative aspect-video w-full overflow-hidden bg-stone-100">
                <Image src={restaurant.image} alt={restaurant.name} fill className="object-cover transition-transform duration-300 group-hover/card:scale-105" />
                {restaurant.offer && (
                    <span className="absolute top-3 left-0 bg-accent text-white px-3 py-1 rounded-r-full text-xs font-bold shadow-sm">
                        {restaurant.offer}
                    </span>
                )}
                {restaurant.isFast && (
                    <span className="absolute bottom-3 right-0 bg-white text-accent px-3 py-1 rounded-l-full text-xs font-bold shadow-sm">
                        Livraison rapide
                    </span>
                )}
                {!open && (
                    <div className="absolute inset-0 bg-stone-900/40 flex items-center justify-center">
                        <span className="bg-white/90 text-stone-700 text-xs font-bold px-3 py-1.5 rounded-full">
                            Fermé
                        </span>
                    </div>
                )}
            </div>

            <div className="p-4 flex flex-col flex-1">
                <div className="flex justify-between items-start mb-1">
                    <h3 className="text-base font-semibold text-stone-900 line-clamp-1 flex-1 pr-2">
                        {restaurant.name}
                    </h3>
                    <div className="flex items-center gap-1 bg-stone-50 px-2 py-0.5 rounded text-xs font-semibold text-stone-600 shrink-0">
                        <span className="text-yellow-500">★</span>
                        {restaurant.rating}
                    </div>
                </div>

                <p className="text-stone-500 text-xs mb-4">
                    max {restaurant.maxDeliveryTime} min
                </p>

                <div className="mt-auto">
                    {open ? (
                        <Button variant="accent" fullWidth className="rounded-none" href={`/restaurant/${restaurant.id}`}>
                            Commander
                        </Button>
                    ) : (
                        <div className="w-full py-2.5 text-center text-sm font-semibold text-stone-400 bg-stone-100 rounded-none">
                            Fermé pour le moment
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
