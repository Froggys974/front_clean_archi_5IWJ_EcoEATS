"use client";

import React from "react";
import { FoodWithRelations } from "@/types/food";
import FoodCarouselCard from "./FoodCarouselCard";
import Carousel from "@/components/ui/Carousel";

interface FoodCarouselProps {
    title: string;
    foods: FoodWithRelations[];
}

export default function FoodCarousel({ title, foods }: FoodCarouselProps) {
    return (
        <Carousel
            title={title}
            items={foods}
            keyExtractor={(food) => food.id}
            renderItem={(food) => <FoodCarouselCard food={food} />}
        />
    );
}