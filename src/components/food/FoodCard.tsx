import {FoodCardType} from "@/types/food";
import { formatOfferPercent, formatRemainingDays } from "@/utils/food-formatters";
import { H3 } from "@/components/ui/Typography";

export default function FoodCard({
    visual,
    offer,
    name,
    remainingDays,
    url,
}: FoodCardType) {
    const formattedOffer = offer ? formatOfferPercent(offer) : null;
    const [percent, text] = formattedOffer ? formattedOffer.split(" ") : ["", ""];

    return (
        <a href={url} className="flex flex-col w-full max-w-87.5 group">
            <article className="flex flex-col w-full">
                <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-primary">
                    <img src={visual} alt={name} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105 block" />
                    {offer && (
                        <div className="absolute -bottom-1 -left-1 bg-primary px-6 py-4 rounded-tr-4xl rounded-bl-2xl flex items-center gap-2 text-white h-21 w-45 ring-1 ring-primary">
                            <span className="text-6xl font-black tracking-tighter">{percent.replace("%", "")}</span>
                            <div className="flex flex-col gap-2">
                                <span className="text-2xl font-bold leading-[0.8]">%</span>
                                <span className="font-bold leading-[0.8]">{text}</span>
                            </div>
                        </div>
                    )}
                </div>
                <div className="mt-5 space-y-4 px-1">
                    <H3 className="text-2xl">{name}</H3>
                    <div className="inline-flex items-center px-5 py-3 bg-[#FEE2D5] rounded-2xl">
                        <span className="text-xl font-semibold text-accent">
                            {formatRemainingDays(remainingDays)}
                        </span>
                    </div>
                </div>
            </article>
        </a>
    )
}