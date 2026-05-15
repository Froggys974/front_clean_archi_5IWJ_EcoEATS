"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ScooterIcon, BagIcon, SearchIcon } from "@/components/icons";
import { useDeliveryAddress } from "@/hooks/useDeliveryAddress";
import { AddressAutocomplete } from "@/components/ui/AddressAutocomplete";
import { SelectedAddress } from "@/types/address";

type DeliveryOption = {
  name: string;
  icon: React.ReactNode;
  value: string;
};

const DELIVERY_OPTIONS: DeliveryOption[] = [
  { name: "Livraison", icon: <ScooterIcon size={20} />, value: "delivery" },
  { name: "Pickup", icon: <BagIcon size={20} />, value: "pickup" },
];

export default function QuickSearch() {
  const [selectedOption, setSelectedOption] = useState("delivery");
  const [inputValue, setInputValue] = useState("");
  const { setSelectedAddress } = useDeliveryAddress();
  const router = useRouter();

  function handleAddressSelect(address: SelectedAddress) {
    setSelectedAddress(address);
    router.push("/restaurants");
  }

  function handleSearch() {
    router.push("/restaurants");
  }

  return (
    <div className="bg-white rounded-4xl shadow-[0_10px_40px_rgba(255,174,103,0.3)] w-full max-w-200 overflow-hidden">
      <div className="flex gap-8 px-8 pt-6 pb-4">
        {DELIVERY_OPTIONS.map((option) => (
          <button
            key={option.value}
            onClick={() => setSelectedOption(option.value)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all font-semibold cursor-pointer ${
              selectedOption === option.value
                ? "bg-accent/10 text-accent"
                : "text-stone-500 hover:bg-stone-50"
            }`}
          >
            <span>{option.icon}</span>
            {option.name}
          </button>
        ))}
      </div>

      <div className="h-px bg-stone-100 w-full" />

      <div className="flex flex-col md:flex-row items-center gap-4 p-6">
        <AddressAutocomplete
          value={inputValue}
          onChange={setInputValue}
          onSelect={handleAddressSelect}
          placeholder="Entrez votre adresse"
          className="flex-1 w-full"
        />

        <button
          onClick={handleSearch}
          className="cursor-pointer text-white px-8 py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 w-full md:w-auto hover:shadow-lg hover:scale-[1.02] active:scale-95 transition-all"
          style={{ background: "linear-gradient(to right, var(--primary), var(--accent))" }}
        >
          <SearchIcon size={20} />
          Je cherche
        </button>
      </div>
    </div>
  );
}
