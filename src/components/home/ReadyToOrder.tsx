import Button from "@/components/ui/Button";

interface ReadyToOrderProps {
    title?: string;
    subtitle?: string;
    ctaLabel?: string;
    ctaHref?: string;
}

export default function ReadyToOrder({
    title = "Prêt à commander avec les meilleures offres ?",
    subtitle = "Profitez de réductions exclusives chaque jour et faites-vous livrer en quelques minutes.",
    ctaLabel = "Je commence",
    ctaHref = "/",
}: ReadyToOrderProps) {
    return (
        <section
            className="w-full py-20 relative overflow-hidden"
            style={{ background: "linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%)" }}
        >
            {/* Decorative blobs */}
            <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-white/10 blur-2xl pointer-events-none" />
            <div className="absolute -bottom-16 -left-16 w-80 h-80 rounded-full bg-white/10 blur-2xl pointer-events-none" />

            <div className="relative max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="flex flex-col gap-4 max-w-xl">
                    <h2 className="text-3xl md:text-4xl font-bold text-white leading-tight">
                        {title}
                    </h2>
                    <p className="text-white/85 text-lg leading-relaxed">{subtitle}</p>
                </div>

                <div className="shrink-0">
                    <Button
                        href={ctaHref}
                        variant="white"
                        size="lg"
                        className="rounded-xl font-bold text-accent shadow-lg hover:scale-105"
                    >
                        {ctaLabel}
                    </Button>
                </div>
            </div>
        </section>
    );
}
