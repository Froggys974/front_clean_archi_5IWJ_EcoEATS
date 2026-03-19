import React from 'react';
import { Place } from "@/types/food";
import { ScooterIcon, UserIcon } from "@/components/icons";
import { H3 } from "@/components/ui/Typography";

interface RestaurantCardProps {
    restaurant: Place;
}

export default function RestaurantCard({ restaurant }: RestaurantCardProps) {
    const isOpened = (openingHours?: any[]) => {
        if (!openingHours) return true;
        const now = new Date();
        const day = now.getDay();
        const time = now.getHours() * 60 + now.getMinutes();
        
        const todayHours = openingHours.filter(h => h.day === day);
        if (todayHours.length === 0) return false;

        return todayHours.some(h => {
            const [openH, openM] = h.open.split(':').map(Number);
            const [closeH, closeM] = h.close.split(':').map(Number);
            const openTime = openH * 60 + openM;
            const closeTime = closeH * 60 + closeM;
            
            // Handle cases where closing time is after midnight
            if (closeTime < openTime) {
                return time >= openTime || time < closeTime;
            }
            return time >= openTime && time < closeTime;
        });
    };

    const open = isOpened(restaurant.OpeningHours);

    return (
        <div className="flex flex-col bg-white rounded-xl border border-stone-100 overflow-hidden group/card transition-all hover:shadow-md h-full">
            <div className="relative aspect-video w-full overflow-hidden">
                <img 
                    src={restaurant.image} 
                    alt={restaurant.name} 
                    className="h-full w-full object-cover transition-transform duration-300 group-hover/card:scale-105"
                />
                {restaurant.offer && (
                    <div className="absolute top-3 left-0 bg-accent text-white px-3 py-1 rounded-r-full text-sm font-bold shadow-sm">
                        {restaurant.offer}
                    </div>
                )}
                {restaurant.isFast && (
                    <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-sm p-1.5 rounded-full shadow-sm text-accent">
                        <ScooterIcon size={20} />
                    </div>
                )}
            </div>
            
            <div className="p-4 flex flex-col grow">
                <div className="flex justify-between items-start mb-1">
                    <H3 className="text-lg line-clamp-1">{restaurant.name}</H3>
                    <div className="flex items-center gap-1 bg-stone-50 px-2 py-0.5 rounded text-sm font-medium text-stone-600">
                        <span className="text-yellow-500">★</span>
                        {restaurant.rating}
                    </div>
                </div>

                <div className="flex items-center gap-2 text-stone-500 text-sm mb-4">
                    <div className={`w-2 h-2 rounded-full ${open ? 'bg-green-500' : 'bg-red-500'}`}></div>
                    <span>{open ? 'Ouvert' : 'Fermé'}</span>
                    <span>•</span>
                    <span>{restaurant.maxDeliveryTime} min</span>
                </div>

                <div className="mt-auto pt-4 border-t border-stone-50 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-stone-400">
                        <UserIcon size={18} />
                        <span className="text-xs">Populaire</span>
                    </div>
                    <button className="text-accent text-sm font-bold hover:underline cursor-pointer">
                        Voir menu
                    </button>
                </div>
            </div>
        </div>
    );
}
