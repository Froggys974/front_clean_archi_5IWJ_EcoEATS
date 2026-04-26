import food from "../../data/food.json"
import offers from "../../data/offer.json"
import FoodCard from "@/components/food/FoodCard";
import { FoodItem, Offer } from "@/types/food";
import { getRemainingOfferDays, isOfferActive } from "@/utils/food-formatters";

type FoodWithOfferId = FoodItem & { offerId: number };
type FoodWithActiveOffer = FoodWithOfferId & {
    offer: Offer;
    remainingDays: number;
};

const foods = food as FoodItem[];
const offerList = offers as Offer[];
const NOW = Date.now();

export default function FoodPromotionBanner() {
    const offersById = new Map(offerList.map((offer) => [offer.id, offer]));
    const foodWithActiveOffers: FoodWithActiveOffer[] = foods
        .filter((item): item is FoodWithOfferId => item.offerId !== null)
        .map((item) => {
            const offer = offersById.get(item.offerId);
            if (!offer || !isOfferActive(offer.startDate, offer.endDate, NOW)) return null;
            return { ...item, offer, remainingDays: getRemainingOfferDays(offer.endDate, NOW) };
        })
        .filter((item): item is FoodWithActiveOffer => item !== null);

    if (foodWithActiveOffers.length === 0) return null;

    return (
        <div className="w-full max-w-7xl mx-auto px-4">
            <div className="flex flex-wrap gap-6 justify-center">
                {foodWithActiveOffers.map((item) => (
                    <FoodCard
                        key={item.id}
                        visual={item.image}
                        offer={item.offer.discountPercent}
                        name={item.name}
                        remainingDays={item.remainingDays}
                        url={item.url}
                    />
                ))}
            </div>
        </div>
    );
}