import { ApiRestaurant } from "@/types/api";
import RestaurantsClient from "@/components/restaurants/RestaurantsClient";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

export default async function RestaurantsPage() {
    let restaurants: ApiRestaurant[] = [];
    try {
        const res = await fetch(`${API_URL}/restaurants`, { cache: "no-store" });
        if (res.ok) restaurants = await res.json();
    } catch { /* API unavailable */ }

    return <RestaurantsClient restaurants={restaurants} />;
}
