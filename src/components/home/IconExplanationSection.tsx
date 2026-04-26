import React from "react";
import { H2, H3 } from "@/components/ui/Typography";

type Section = {
    id: string
    icon: React.ReactNode
    text: string
    subtext: string
}

type IconExplanationSectionProps = {
    title: string
    sections: Section[]
    gradient?: boolean
}

export default function IconExplanationSection({title, sections, gradient}: IconExplanationSectionProps) {
    const sectionClasses = `w-full mx-auto px-4 py-12 ${gradient ? "bg-gradient-to-b from-accent/5 to-white" : ""}`;

    return (
        <section className={sectionClasses}>
            <H2 variant="accent" className="mb-12">{title}</H2>
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {sections.map((section) => (
                    <div key={section.id} className="flex flex-col items-center text-center p-6">
                        <div className="flex items-center justify-center text-accent mb-6">
                            {section.icon}
                        </div>
                        <H3 variant="stone" align="center" className="mb-2">{section.text}</H3>
                        <p className="text-stone-500">{section.subtext}</p>
                    </div>
                ))}
            </div>
        </section>
    )
}