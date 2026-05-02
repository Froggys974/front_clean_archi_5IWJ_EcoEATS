"use client";

import { useEffect, useState } from "react";
import { Place } from "@/types/food";
import RestaurantsClient from "@/components/restaurants/RestaurantsClient";
import { useApi } from "@/hooks/useApi";
import { RestaurantDto } from "@/types/api";

function mapRestaurant(r: RestaurantDto): Place {
    return {
        id: r.id,
        name: r.name,
        address: `${r.address.street}, ${r.address.city}`,
        city: r.address.city,
        rating: r.rating,
        image: r.imageUrl ?? `https://picsum.photos/400/300?random=${r.id}`,
        url: `/restaurant/${r.id}`,
        maxDeliveryTime: 30,
        highlighted: r.highlighted,
        isFast: false,
        OpeningHours: r.openingHours.map(oh => ({ day: oh.dayOfWeek, open: oh.openTime, close: oh.closeTime })),
        ownerId: r.ownerId,
    };
}

export default function RestaurantsPage() {
    const { get } = useApi();
    const [restaurants, setRestaurants] = useState<Place[]>([]);

    useEffect(() => {
        get<RestaurantDto[]>('/restaurants')
            .then(data => setRestaurants(data.map(mapRestaurant)))
            .catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return <RestaurantsClient restaurants={restaurants} />;
}
