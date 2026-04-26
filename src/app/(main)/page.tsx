import Header from "@/components/home/Header";
import FoodPromotionBanner from "@/components/home/FoodPromotionBanner";
import IconExplanationSection from "@/components/home/IconExplanationSection";
import {RingIcon, MapPinIcon, DonutIcon, PaymentIcon} from "@/components/icons";
import FoodCarousel from "@/components/home/FoodCarousel";
import HighlightedRestaurants from "@/components/home/HighlightedRestaurants";
import foodData from "@/data/food.json";
import offerData from "@/data/offer.json";
import placeData from "@/data/place.json";
import { FoodItem, Offer, FoodWithRelations, Place } from "@/types/food";
import SearchPerFood from "@/components/home/SearchPerFood";
import BestOffersSection from "@/components/home/BestOffersSection";
import ReadyToOrder from "@/components/home/ReadyToOrder";
import ApplicationOnTheWay from "@/components/home/ApplicationOnTheWay";

export default function Home() {
    const foods = foodData as FoodItem[];
    const offers = offerData as Offer[];
    const places = placeData as Place[];
    
    const placesById = new Map(places.map(p => [p.id, p]));
    const offersById = new Map(offers.map(o => [o.id, o]));

    const carouselFoods: FoodWithRelations[] = foods
        .filter(f => f.popular)
        .map(f => ({
            ...f,
            offer: offersById.get(f.offerId || 0) || { id: 0, discountPercent: 0, startDate: "", endDate: "" },
            category: { id: f.categoryId, name: "Autre", description: "" }, // Categories simplified for now
            place: placesById.get(f.placeId) || { id: f.placeId, name: "Restaurant", address: "", city: "", rating: 0, image: "", url: "", maxDeliveryTime: 0 }
        }));

    const highlightedRestaurants = places.filter(p => p.highlighted);

    const sections = [
        {
            id: "1",
            icon: <MapPinIcon size={70} />,
            text: "Choisissez votre adresse",
            subtext: "Où vous voulez que votre repas vous soit livré."
        },
        {
            id: "2",
            icon: <RingIcon size={70} />,
            text: "Passez votre commande",
            subtext: "Parmis une grande variété de menus disponibles."
        },
        {
            id: "3",
            icon: <PaymentIcon size={70} />,
            text: "Choisissez votre méthode de paiement",
            subtext: "Simple et efficace, choisissez parmis nos moyens de paiements."
        },
        {
            id: "4",
            icon: <DonutIcon size={70} />,
            text: "Dégustez !",
            subtext: "Votre commande est préparée et livrée directement."
        }
    ];

    return (
        <main className="flex w-full flex-col gap-16">
            <Header title="Une petite faim ?" subtitle="En quelques clics, trouvez des repas proches de chez vous" />
            <FoodPromotionBanner />
            <IconExplanationSection title="Comment ça marche ?" sections={sections} gradient={true} />
            <FoodCarousel title="Populaires" foods={carouselFoods} />
            <HighlightedRestaurants title="Restaurants mis en avant" restaurants={highlightedRestaurants} />
            <SearchPerFood title="Recherche par nourriture" />
            <ApplicationOnTheWay />
            <BestOffersSection />
            <ReadyToOrder />
        </main>
    );
}

