"use client";

import { useEffect, useState } from "react";
import Header from "@/components/home/Header";
import FoodPromotionBanner from "@/components/home/FoodPromotionBanner";
import IconExplanationSection from "@/components/home/IconExplanationSection";
import { RingIcon, MapPinIcon, DonutIcon, PaymentIcon } from "@/components/icons";
import FoodCarousel from "@/components/home/FoodCarousel";
import HighlightedRestaurants from "@/components/home/HighlightedRestaurants";
import { FoodItem, Offer, FoodWithRelations, Place, FoodCategory } from "@/types/food";
import SearchPerFood from "@/components/home/SearchPerFood";
import BestOffersSection from "@/components/home/BestOffersSection";
import ReadyToOrder from "@/components/home/ReadyToOrder";
import ApplicationOnTheWay from "@/components/home/ApplicationOnTheWay";
import { useApi } from "@/hooks/useApi";
import { RestaurantDto, DishDto, CategoryDto, OfferDto } from "@/types/api";

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

function mapDish(d: DishDto, offerByRestaurant: Map<string, string> = new Map()): FoodItem {
    return {
        id: d.id,
        name: d.name,
        description: d.description,
        price: d.price,
        image: d.imageUrl ?? `https://picsum.photos/200/150?random=${d.id}`,
        url: '',
        offerId: offerByRestaurant.get(d.restaurantId ?? '') ?? null,
        categoryId: d.category ?? 'cat-1',
        placeId: d.restaurantId ?? '',
        popular: true,
        allergens: d.allergens,
        dailyStock: d.dailyStock,
        availableStock: d.availableStock,
    };
}

function mapCategory(c: CategoryDto): FoodCategory {
    return { id: c.id, name: c.name, description: '', visual: c.imageUrl ?? '', slug: c.slug };
}

function mapOffer(o: OfferDto): Offer {
    return { id: o.id, discountPercent: o.discountPercent, startDate: '2025-01-01', endDate: '2027-12-31' };
}

const sections = [
    { id: "1", icon: <MapPinIcon size={70} />, text: "Choisissez votre adresse", subtext: "Où vous voulez que votre repas vous soit livré." },
    { id: "2", icon: <RingIcon size={70} />, text: "Passez votre commande", subtext: "Parmis une grande variété de menus disponibles." },
    { id: "3", icon: <PaymentIcon size={70} />, text: "Choisissez votre méthode de paiement", subtext: "Simple et efficace, choisissez parmis nos moyens de paiements." },
    { id: "4", icon: <DonutIcon size={70} />, text: "Dégustez !", subtext: "Votre commande est préparée et livrée directement." },
];

export default function Home() {
    const { get } = useApi();
    const [places, setPlaces] = useState<Place[]>([]);
    const [foods, setFoods] = useState<FoodItem[]>([]);
    const [categories, setCategories] = useState<FoodCategory[]>([]);
    const [offers, setOffers] = useState<Offer[]>([]);

    useEffect(() => {
        Promise.all([
            get<RestaurantDto[]>('/restaurants').catch(() => [] as RestaurantDto[]),
            get<DishDto[]>('/restaurants/dishes').catch(() => [] as DishDto[]),
            get<CategoryDto[]>('/restaurants/categories').catch(() => [] as CategoryDto[]),
            get<OfferDto[]>('/restaurants/offers').catch(() => [] as OfferDto[]),
        ]).then(([r, d, c, o]) => {
            const offerByRestaurant = new Map(o.map(off => [off.restaurantId, off.id]));
            setPlaces(r.map(mapRestaurant));
            setFoods(d.map(dish => mapDish(dish, offerByRestaurant)));
            setCategories(c.map(mapCategory));
            setOffers(o.map(mapOffer));
        });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const offersById = new Map<string, Offer>(offers.map(o => [o.id, o]));

    // Plats déjà dans la bannière promo (avec offre) — exclus du carousel pour éviter duplication
    const promoFoodIds = new Set(foods.filter(f => f.offerId !== null).slice(0, 6).map(f => f.id));

    const carouselFoods: FoodWithRelations[] = foods
        .filter(f => !promoFoodIds.has(f.id))
        .slice(0, 8)
        .map(f => ({
            ...f,
            offer: offersById.get(f.offerId ?? '') ?? { id: '', discountPercent: 0, startDate: '', endDate: '' },
            category: categories.find(c => c.id === f.categoryId) ?? { id: '', name: 'Autre', description: '' },
            place: places.find(p => p.id === f.placeId) ?? { id: '', name: 'Restaurant', address: '', city: '', rating: 0, image: '', url: '', maxDeliveryTime: 30 },
        }));

    const highlightedRestaurants = places.filter(p => p.highlighted).slice(0, 4);

    return (
        <main className="flex w-full flex-col gap-16">
            <Header title="Une petite faim ?" subtitle="En quelques clics, trouvez des repas proches de chez vous" />
            <FoodPromotionBanner foods={foods} offers={offers} places={places} />
            <IconExplanationSection title="Comment ça marche ?" sections={sections} gradient={true} />
            <FoodCarousel title="Populaires" foods={carouselFoods} />
            <HighlightedRestaurants title="Restaurants mis en avant" restaurants={highlightedRestaurants} />
            <SearchPerFood title="Recherche par nourriture" categories={categories} />
            <ApplicationOnTheWay />
            <BestOffersSection />
            <ReadyToOrder />
        </main>
    );
}
