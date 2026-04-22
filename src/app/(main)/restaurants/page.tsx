import placeData from "@/data/place.json";
import { Place } from "@/types/food";
import RestaurantsClient from "@/components/restaurants/RestaurantsClient";

export default function RestaurantsPage() {
    const restaurants = placeData as Place[];
    return <RestaurantsClient restaurants={restaurants} />;
}
