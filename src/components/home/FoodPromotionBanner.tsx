import Image from "next/image";
import Link from "next/link";
import { FoodItem, Offer, Place } from "@/types/food";

interface FoodPromotionBannerProps {
    foods?: FoodItem[];
    offers?: Offer[];
    places?: Place[];
}

export default function FoodPromotionBanner({ foods = [], offers = [], places = [] }: FoodPromotionBannerProps) {
    const offersById = new Map(offers.map(o => [o.id, o]));
    const placesById = new Map(places.map(p => [p.id, p]));

    const promoFoods = foods
        .filter(f => f.offerId !== null && offersById.has(f.offerId!))
        .slice(0, 6);

    if (promoFoods.length === 0) return null;

    return (
        <div className="w-full max-w-7xl mx-auto px-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                {promoFoods.map(item => {
                    const offer = offersById.get(item.offerId!)!;
                    const place = placesById.get(item.placeId);
                    return (
                        <Link
                            key={item.id}
                            href={`/restaurant/${item.placeId}`}
                            className="group flex flex-col bg-white rounded-2xl border border-stone-100 overflow-hidden hover:shadow-md hover:border-accent/20 transition-all duration-200"
                        >
                            <div className="relative aspect-square w-full overflow-hidden bg-stone-100">
                                <Image
                                    src={item.image}
                                    alt={item.name}
                                    fill
                                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                                />
                                <span className="absolute top-2 right-2 bg-accent text-white text-[11px] font-bold px-2 py-0.5 rounded-full shadow">
                                    -{offer.discountPercent}%
                                </span>
                            </div>
                            <div className="px-3 py-2 flex flex-col gap-0.5">
                                <p className="text-xs font-bold text-stone-900 line-clamp-1">{item.name}</p>
                                {place && <p className="text-[11px] text-stone-400 line-clamp-1">{place.name}</p>}
                                <p className="text-[11px] font-semibold text-accent">{offer.discountPercent}% off</p>
                            </div>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
