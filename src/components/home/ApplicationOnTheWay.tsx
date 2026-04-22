import { AppleStoreIcon, GooglePlayIcon, MapPinIcon, PaymentIcon, RingIcon } from "../icons";
import { H2, H3 } from "../ui/Typography";
import Picture from "@/components/other/Picture";

const infos: { id: number; icon: React.ReactNode; text: string }[] = [
    { id: 1, icon: <MapPinIcon size={48} />, text: "Promos journalières" },
    { id: 2, icon: <RingIcon size={48} />, text: "Suivi en direct" },
    { id: 3, icon: <PaymentIcon size={48} />, text: "Livraison rapide" },
];

export default function ApplicationOnTheWay() {
    return (
        <section className="w-full bg-primary/30 overflow-hidden">
            {/* Info badges row */}
            <div className="max-w-7xl mx-auto w-full px-4 pt-14 pb-10">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-white rounded-2xl p-6 md:p-8 shadow-sm">
                    {infos.map((info) => (
                        <div key={info.id} className="flex items-center gap-4 text-accent p-4">
                            <div className="shrink-0">{info.icon}</div>
                            <H3 variant="accent" className="text-base leading-snug">
                                {info.text}
                            </H3>
                        </div>
                    ))}
                </div>
            </div>

            {/* Image + text */}
            <div className="max-w-7xl mx-auto px-4 pb-14 grid grid-cols-1 md:grid-cols-2 items-center gap-8 md:gap-12">
                <div className="flex justify-center md:justify-start">
                    <Picture
                        alt="Application mobile EcoEats"
                        desktop="/images/applicationOnTheWay@lg.webp"
                        tablet="/images/applicationOnTheWay@md.webp"
                        mobile="/images/applicationOnTheWay@sm.webp"
                        width={380}
                        className="max-w-[280px] sm:max-w-[340px] md:max-w-none"
                    />
                </div>

                <div className="flex flex-col gap-5">
                    <H2 variant="accent" align="left">
                        L'application arrive bientôt !
                    </H2>
                    <p className="text-stone-700 text-base leading-relaxed">
                        Ce n'a jamais été aussi facile de commander de la nourriture. Cherchez les meilleures
                        réductions et vous serez perdu dans un monde de mets délicieux.
                    </p>
                    <div className="flex flex-wrap gap-3">
                        <div className="flex items-center gap-3 bg-white px-4 py-2.5 rounded-xl text-accent shadow-sm border border-stone-100 hover:shadow-md transition-shadow cursor-pointer">
                            <GooglePlayIcon size={30} />
                            <div className="flex flex-col text-stone-900 leading-tight">
                                <small className="text-xs text-stone-400">Get it on</small>
                                <span className="font-bold text-sm">Google Play</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 bg-white px-4 py-2.5 rounded-xl text-accent shadow-sm border border-stone-100 hover:shadow-md transition-shadow cursor-pointer">
                            <AppleStoreIcon size={30} />
                            <div className="flex flex-col text-stone-900 leading-tight">
                                <small className="text-xs text-stone-400">Download on the</small>
                                <span className="font-bold text-sm">App Store</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
