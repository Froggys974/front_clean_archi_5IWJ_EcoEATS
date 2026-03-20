import React from 'react';
import { FoodWithRelations } from "@/types/food";
import { MapPinIcon } from "@/components/icons";
import { H3 } from "@/components/ui/Typography";
import Button from "@/components/ui/Button";

interface FoodCarouselCardProps {
    food: FoodWithRelations;
}

export default function FoodCarouselCard({ food }: FoodCarouselCardProps) {
    return (
        <div className="flex flex-col bg-white ounded-md border border-stone-100 overflow-hidden group/card transition-all h-full">
            <div className="relative aspect-4/3 w-full overflow-hidden">
                <img 
                    src={food.image} 
                    alt={food.name} 
                    className="h-full w-full object-cover transition-transform duration-300 group-hover/card:scale-105"
                />
            </div>
            <div className="flex flex-col grow">
                <div className="p-4 flex flex-col justify-between items-start gap-4 mb-2">
                    <H3 className="text-lg line-clamp-1">{food.name}</H3>
                    <span className="text-accent font-bold whitespace-nowrap">{food.price}€</span>
                    <p className="text-sm line-clamp-1 flex items-center gap-1 text-accent"><MapPinIcon size={24} />{food.place.name}</p>
                </div>

                <div className="mt-auto">
                    <Button variant="accent" fullWidth className="rounded-none">
                        Commander maintenant
                    </Button>
                </div>
            </div>
        </div>
    );
}
