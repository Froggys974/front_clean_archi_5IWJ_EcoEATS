import React from "react";
import Image from "next/image";
import { CarouselItem } from "@/types/api";
import { MapPinIcon } from "@/components/icons";
import Button from "@/components/ui/Button";

interface FoodCarouselCardProps {
    food: CarouselItem;
}

export default function FoodCarouselCard({ food }: FoodCarouselCardProps) {
    const imgSrc = food.imageUrl ?? "https://picsum.photos/200/150?random=99";

    return (
        <div className="flex flex-col bg-white rounded-xl border border-stone-100 overflow-hidden group/card transition-all hover:shadow-md h-full">
            <div className="relative aspect-4/3 w-full overflow-hidden bg-stone-100">
                <Image src={imgSrc} alt={food.name} fill className="object-cover transition-transform duration-300 group-hover/card:scale-105" />
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
                    {food.restaurantName}
                </p>

                <div className="mt-auto pt-3">
                    <Button variant="accent" fullWidth href={`/restaurant/${food.restaurantId}`}>
                        Commander
                    </Button>
                </div>
            </div>
        </div>
    );
}
