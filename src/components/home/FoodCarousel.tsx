"use client";

import React from "react";
import { CarouselItem } from "@/types/api";
import FoodCarouselCard from "./FoodCarouselCard";
import Carousel from "@/components/ui/Carousel";

interface FoodCarouselProps {
    title: string;
    foods: CarouselItem[];
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
