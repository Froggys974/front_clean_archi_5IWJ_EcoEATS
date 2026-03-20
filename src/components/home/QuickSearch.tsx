"use client";

import { useState } from "react";
import { ScooterIcon, BagIcon, MapPinIcon, SearchIcon } from "@/components/icons";

type OptionProps = {
    name: string;
    icon: React.ReactNode;
    value: string;
}

const options: OptionProps[] = [
    {
        name: 'Livraison',
        icon: <ScooterIcon size={20} />,
        value: 'delivery',
    },
    {
        name: 'Pickup',
        icon: <BagIcon size={20} />,
        value: 'pickup',
    },
]

export default function QuickSearch() {
    const [selectedOption, setSelectedOption] = useState('delivery');

    return (
        <div className="bg-white rounded-4xl shadow-[0_10px_40px_rgba(255,174,103,0.3)] w-full max-w-200 overflow-hidden">
            <div className="flex gap-8 px-8 pt-6 pb-4">
                {options.map((option) => (
                    <button
                        key={option.value}
                        onClick={() => setSelectedOption(option.value)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all font-semibold cursor-pointer ${
                            selectedOption === option.value
                                ? "bg-[#FFF2EB] text-[#FF6B35]"
                                : "text-[#7B7B7B] hover:bg-gray-50"
                        }`}
                    >
                        <span>
                            {option.icon}
                        </span>
                        {option.name}
                    </button>
                ))}
            </div>

            <div className="h-px bg-gray-100 w-full" />

            <div className="flex flex-col md:flex-row items-center gap-4 p-6">
                <div className="flex-1 flex items-center gap-3 bg-[#F7F7F7] rounded-xl px-4 py-3.5 w-full">
                    <MapPinIcon size={24} />
                    <input
                        type="text"
                        placeholder="Entrez votre adresse"
                        className="bg-transparent border-none outline-none  placeholder:text-[#ADADAD] w-full text-lg"
                    />
                </div>
                
                <button className="cursor-pointer bg-linear-to-r from-[#FF7E5F] to-[#FF6B35] text-white px-8 py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 w-full md:w-auto hover:shadow-lg transition-shadow">
                    <SearchIcon size={20} />
                    Je cherche
                </button>
            </div>
        </div>
    )
}