import Link from "next/link";
import Picture from "@/components/other/Picture";
import QuickSearch from "@/components/home/QuickSearch";

type HeaderProps = {
    title: string;
    subtitle: string;
}

export default function Header({title, subtitle}: HeaderProps) {
    return (
        <header className="relative w-full h-164 mt-18" style={{ background: 'linear-gradient(to bottom, var(--primary) 0%, var(--primary) 75%, var(--accent) 100%)' }}>
            <div className="max-w-7xl h-full flex flex-col gap-4 justify-center">
                <div className="ml-55 h-full flex flex-col gap-4 justify-center">
                    <h1 className="text-white text-6xl font-bold">{title}</h1>
                    <p className="text-xl" >{subtitle}</p>
                    <QuickSearch />
                </div>
                <Picture
                    alt={"header image"}
                    desktop={"images/header@lg.webp"}
                    tablet={"images/header@md.webp"}
                    mobile={"images/header@sm.png"}
                    width={500}
                    className="absolute bottom-0 right-1/7"
                />
            </div>
        </header>
    );
}