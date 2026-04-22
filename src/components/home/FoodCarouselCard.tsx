import React from 'react';
import { FoodWithRelations } from "@/types/food";
import { MapPinIcon } from "@/components/icons";
import Button from "@/components/ui/Button";

interface FoodCarouselCardProps {
    food: FoodWithRelations;
}

export default function FoodCarouselCard({ food }: FoodCarouselCardProps) {
    return (
        <div className="flex flex-col bg-white rounded-xl border border-stone-100 overflow-hidden group/card transition-all hover:shadow-md h-full">
            <div className="relative aspect-4/3 w-full overflow-hidden bg-stone-100">
                <img
                    src={food.image}
                    alt={food.name}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover/card:scale-105"
                />
                {food.offer && food.offer.discountPercent > 0 && (
                    <span className="absolute top-3 left-3 bg-accent text-white text-xs font-bold px-2.5 py-1 rounded-full">
                        -{food.offer.discountPercent}%
                    </span>
                )}
            </div>

            <div className="flex flex-col flex-1 p-4 gap-2">
                <div className="flex items-start justify-between gap-2">
                    <h3 className="text-sm font-semibold text-stone-900 line-clamp-1 flex-1">
                        {food.name}
                    </h3>
                    <span className="text-accent font-bold text-sm shrink-0">
                        {food.price.toFixed(2)} €
                    </span>
                </div>

                <p className="text-xs text-stone-400 flex items-center gap-1">
                    <MapPinIcon size={12} />
                    {food.place.name}
                </p>

                <div className="mt-auto pt-3">
                    <Button variant="accent" fullWidth href={`/restaurant/${food.placeId}`}>
                        Commander
                    </Button>
                </div>
            </div>
        </div>
    );
}
