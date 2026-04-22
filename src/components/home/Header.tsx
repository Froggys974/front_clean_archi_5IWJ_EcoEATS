import Picture from "@/components/other/Picture";
import { H1 } from "@/components/ui/Typography";
import QuickSearch from "@/components/home/QuickSearch";

type HeaderProps = {
    title: string;
    subtitle: string;
}

export default function Header({ title, subtitle }: HeaderProps) {
    return (
        <header
            className="relative w-full mt-18 overflow-hidden"
            style={{ background: 'linear-gradient(to bottom, var(--primary) 0%, var(--primary) 75%, var(--accent) 100%)' }}
        >
            <div className="max-w-7xl mx-auto px-6 flex items-end" style={{ minHeight: '41rem' }}>
                {/* Text + search — capped width prevents overlap with image */}
                <div className="flex-1 flex flex-col gap-6 py-20 lg:max-w-[56%] relative z-10">
                    <H1>{title}</H1>
                    <p className="text-xl text-white/90 font-medium">{subtitle}</p>
                    <QuickSearch />
                </div>

                {/* Hero image — bottom-aligned, desktop only */}
                <div className="hidden lg:block shrink-0 self-end pointer-events-none select-none">
                    <Picture
                        alt="Illustration livraison"
                        desktop="images/header@lg.webp"
                        tablet="images/header@md.webp"
                        mobile="images/header@sm.png"
                        width={500}
                    />
                </div>
            </div>
        </header>
    );
}
