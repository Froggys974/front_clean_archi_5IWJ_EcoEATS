import React from "react";
import { ApiRestaurant } from "@/types/api";
import SectionGrid from "@/components/ui/SectionGrid";
import RestaurantCard from "./RestaurantCard";

interface HighlightedRestaurantsProps {
    title: string;
    restaurants: ApiRestaurant[];
}

export default function HighlightedRestaurants({ title, restaurants }: HighlightedRestaurantsProps) {
    return (
        <SectionGrid
            title={title}
            items={restaurants}
            keyExtractor={(restaurant) => restaurant.id}
            renderItem={(restaurant) => <RestaurantCard restaurant={restaurant} />}
            cols="1-2-4"
            emptyMessage="Aucun restaurant mis en avant pour le moment."
        />
    );
}
