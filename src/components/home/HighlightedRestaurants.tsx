import React from "react";
import { Place } from "@/types/food";
import SectionGrid from "@/components/ui/SectionGrid";
import RestaurantCard from "./RestaurantCard";

interface HighlightedRestaurantsProps {
    title: string;
    restaurants: Place[];
}

export default function HighlightedRestaurants({ title, restaurants }: HighlightedRestaurantsProps) {
    return (
        <SectionGrid
            title={title}
            items={restaurants}
            keyExtractor={(r) => r.id}
            renderItem={(r) => <RestaurantCard restaurant={r} />}
            cols="1-2-4"
            emptyMessage="Aucun restaurant mis en avant pour le moment."
        />
    );
}
