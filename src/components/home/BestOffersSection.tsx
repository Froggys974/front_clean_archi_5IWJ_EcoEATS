import { H2, H3 } from "@/components/ui/Typography";
import Button from "@/components/ui/Button";

type OfferCard = {
    id: number;
    title: string;
    description: string;
    ctaLabel: string;
    ctaHref: string;
    image?: string;
};

const defaultOffers: OfferCard[] = [
    {
        id: 1,
        title: "Burgers artisanaux",
        description: "Des burgers préparés avec des produits frais et locaux, livrés chauds à votre porte.",
        ctaLabel: "Découvrir",
        ctaHref: "/",
        image: "",
    },
    {
        id: 2,
        title: "Pizzas du chef",
        description: "Pâte maison, ingrédients de saison et cuisson au feu de bois pour une expérience unique.",
        ctaLabel: "Commander",
        ctaHref: "/",
        image: "",
    },
    {
        id: 3,
        title: "Salades fraîches",
        description: "Compositions légères et équilibrées, parfaites pour un repas sain sans sacrifier le goût.",
        ctaLabel: "Explorer",
        ctaHref: "/",
        image: "",
    },
];

interface BestOffersSectionProps {
    title?: string;
    offers?: OfferCard[];
}

export default function BestOffersSection({
    title = "Nos meilleures offres",
    offers = defaultOffers,
}: BestOffersSectionProps) {
    return (
        <section className="w-full py-12">
            <div className="max-w-7xl mx-auto px-4">
                <H2 className="mb-10">{title}</H2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {offers.map((offer) => (
                        <div
                            key={offer.id}
                            className="flex flex-col bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 group"
                        >
                            {/* Image area — object-cover regardless of source dimensions */}
                            <div className="relative aspect-[4/3] w-full overflow-hidden bg-stone-100">
                                {offer.image ? (
                                    <img
                                        src={offer.image}
                                        alt={offer.title}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-accent/20">
                                        <span className="text-stone-400 text-sm font-medium">Image à venir</span>
                                    </div>
                                )}
                            </div>

                            {/* Content */}
                            <div className="flex flex-col flex-1 gap-3 p-6">
                                <H3 variant="stone">{offer.title}</H3>
                                <p className="text-stone-500 text-sm leading-relaxed flex-1">{offer.description}</p>
                                <div className="mt-2">
                                    <Button variant="accent" href={offer.ctaHref} size="md">
                                        {offer.ctaLabel}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
