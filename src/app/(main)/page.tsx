import Header from "@/components/home/Header";
import FoodPromotionBanner from "@/components/home/FoodPromotionBanner";
import IconExplanationSection from "@/components/home/IconExplanationSection";
import { RingIcon, MapPinIcon, DonutIcon, PaymentIcon } from "@/components/icons";
import FoodCarousel from "@/components/home/FoodCarousel";
import HighlightedRestaurants from "@/components/home/HighlightedRestaurants";
import { ApiRestaurant, ApiDish, ApiCategory, CarouselItem } from "@/types/api";
import SearchPerFood from "@/components/home/SearchPerFood";
import BestOffersSection from "@/components/home/BestOffersSection";
import ReadyToOrder from "@/components/home/ReadyToOrder";
import ApplicationOnTheWay from "@/components/home/ApplicationOnTheWay";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

async function fetchJson<T>(url: string, fallback: T): Promise<T> {
    try {
        const res = await fetch(url, { cache: "no-store" });
        if (!res.ok) return fallback;
        return (await res.json()) as T;
    } catch {
        return fallback;
    }
}

export default async function Home() {
    const [restaurants, dishes, categories] = await Promise.all([
        fetchJson<ApiRestaurant[]>(`${API_URL}/restaurants`, []),
        fetchJson<ApiDish[]>(`${API_URL}/restaurants/dishes`, []),
        fetchJson<ApiCategory[]>(`${API_URL}/restaurants/categories`, []),
    ]);

    const restaurantsById = new Map(restaurants.map((restaurant) => [restaurant.id, restaurant]));

    const carouselItems: CarouselItem[] = dishes.slice(0, 12).map((dish) => ({
        id: dish.id,
        name: dish.name,
        description: dish.description,
        price: dish.price,
        imageUrl: dish.imageUrl,
        restaurantId: dish.restaurantId ?? "",
        restaurantName: restaurantsById.get(dish.restaurantId ?? "")?.name ?? "Restaurant",
    }));

    const highlightedRestaurants = restaurants.filter((restaurant) => restaurant.highlighted);

    const sections = [
        { id: "1", icon: <MapPinIcon size={70} />, text: "Choisissez votre adresse", subtext: "Où vous voulez que votre repas vous soit livré." },
        { id: "2", icon: <RingIcon size={70} />, text: "Passez votre commande", subtext: "Parmis une grande variété de menus disponibles." },
        { id: "3", icon: <PaymentIcon size={70} />, text: "Choisissez votre méthode de paiement", subtext: "Simple et efficace, choisissez parmis nos moyens de paiements." },
        { id: "4", icon: <DonutIcon size={70} />, text: "Dégustez !", subtext: "Votre commande est préparée et livrée directement." },
    ];

    return (
        <main className="flex w-full flex-col gap-16">
            <Header title="Une petite faim ?" subtitle="En quelques clics, trouvez des repas proches de chez vous" />
            <FoodPromotionBanner />
            <IconExplanationSection title="Comment ça marche ?" sections={sections} gradient={true} />
            <FoodCarousel title="Populaires" foods={carouselItems} />
            <HighlightedRestaurants title="Restaurants mis en avant" restaurants={highlightedRestaurants} />
            <SearchPerFood title="Recherche par nourriture" categories={categories} />
            <ApplicationOnTheWay />
            <BestOffersSection />
            <ReadyToOrder />
        </main>
    );
}
