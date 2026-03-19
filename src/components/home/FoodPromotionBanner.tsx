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

const offersById = new Map(offerList.map((offer) => [offer.id, offer]));
const now = Date.now();

const foodWithActiveOffers: FoodWithActiveOffer[] = foods
    .filter((item): item is FoodWithOfferId => item.offerId !== null)
    .map((item) => {
        const offer = offersById.get(item.offerId);

        if (!offer || !isOfferActive(offer.startDate, offer.endDate, now)) {
            return null;
        }

        return {
            ...item,
            offer,
            remainingDays: getRemainingOfferDays(offer.endDate, now),
        };
    })
    .filter((item): item is FoodWithActiveOffer => item !== null);

export default function FoodPromotionBanner() {
    return (
        <div className="w-full flex flex-wrap gap-8 p-4 justify-center mx-auto">
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
    )
}