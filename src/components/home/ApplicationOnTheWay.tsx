import {AppleStoreIcon, GooglePlayIcon, MapPinIcon, PaymentIcon, RingIcon} from "../icons";
import {H2, H3} from "../ui/Typography";
import Picture from "@/components/other/Picture";

const infos: { id: number, icon: React.ReactNode, text: string }[] = [
    {
        id: 1,
        icon: <MapPinIcon size={70} />,
        text: "Promos journalières",
    },
    {
        id: 2,
        icon: <RingIcon size={70} />,
        text: "Suivi en direct",
    },
    {
        id: 3,
        icon: <PaymentIcon size={70} />,
        text: "Livraison rapide",
    }
]

export default function ApplicationOnTheWay() {
    return (
        <section className="w-full bg-primary/30 -translate-y-20 flex flex-col items-center justify-center gap-12 relative">

            {/*SVG for decoration*/}
            <div className="absolute w-full h-50 bottom-0 text-accent/80">
                <svg
                    viewBox="0 0 100 100"
                    preserveAspectRatio="none"
                    className="w-full h-full fill-current"
                >
                    <path d="M 0 0 Q 70 80 100 0 L 100 100 L 0 100 Z" />
                </svg>
            </div>

            <div className="z-1 mt-12 grid grid-cols-1 max-w-7xl mx-auto w-full px-4 py-12 md:grid-cols-2 lg:grid-cols-3 gap-4 bg-white rounded-2xl p-8">
                {infos.map((info) => (
                    <div key={info.id} className="flex gap-6 items-center text-center p-6 text-accent">
                        {info.icon}
                        <H3 variant="accent" align="center" className="max-w-35 text-left" >{info.text}</H3>
                    </div>
                ))}
            </div>

            <div className="z-1 grid grid-cols-2 max-w-7xl" >
                <Picture
                    alt={"Application mobile EcoEats"}
                    desktop={"/images/applicationOnTheWay@lg.webp"}
                    tablet={"/images/applicationOnTheWay@md.webp"}
                    mobile={"/images/applicationOnTheWay@sm.webp"}
                    width={500}
                />
                <div className="flex flex-col gap-4" >
                    <H2 className="text-nowrap" variant={"accent"} >L'application arrive bientôt !</H2>
                    <p className="text-lg leading-tight" >Ce n’a jamais été aussi facile de commander de la nourriture. Cherchez les meilleures réductions et vous serez perdu dans un monde de mets délicieux.</p>
                    <div className="flex gap-4">
                        <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-md text-accent">
                            <GooglePlayIcon size={35} />
                            <div className="flex flex-col text-black" >
                                <small className="text-md" >Get it on</small>
                                <span className="font-bold text-lg" >Google Play</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-md text-accent">
                            <AppleStoreIcon size={35} />
                            <div className="flex flex-col text-black" >
                                <small className="text-md" >Download on the</small>
                                <span className="font-bold text-lg" >App Store</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}