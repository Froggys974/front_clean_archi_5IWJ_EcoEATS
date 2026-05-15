"use client";

import { useRef, useState, useEffect, KeyboardEvent } from "react";
import { useAddressAutocomplete } from "@/hooks/useAddressAutocomplete";
import { SelectedAddress } from "@/types/address";
import { MapPinIcon } from "@/components/icons";

export type AddressAutocompleteProps = {
  value: string;
  onChange: (rawInput: string) => void;
  onSelect: (address: SelectedAddress) => void;
  placeholder?: string;
  hasError?: boolean;
  className?: string;
};

export function AddressAutocomplete({
  value,
  onChange,
  onSelect,
  placeholder = "Entrez votre adresse",
  hasError = false,
  className = "",
}: AddressAutocompleteProps) {
  const { suggestions, isLoading } = useAddressAutocomplete(value);
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsOpen(suggestions.length > 0);
    setHighlightedIndex(-1);
  }, [suggestions]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (!isOpen) return;

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setHighlightedIndex((prev) => Math.min(prev + 1, suggestions.length - 1));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setHighlightedIndex((prev) => Math.max(prev - 1, 0));
    } else if (event.key === "Enter" && highlightedIndex >= 0) {
      event.preventDefault();
      selectSuggestion(suggestions[highlightedIndex]);
    } else if (event.key === "Escape") {
      setIsOpen(false);
    }
  }

  function selectSuggestion(address: SelectedAddress) {
    onChange(address.label);
    onSelect(address);
    setIsOpen(false);
  }

  const borderClass = hasError
    ? "border-red-300 focus-within:border-red-400"
    : "border-stone-200 focus-within:border-accent";

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <div className={`flex items-center gap-3 bg-white rounded-xl border px-4 py-3 transition-colors ${borderClass}`}>
        <MapPinIcon size={18} className="text-stone-400 shrink-0" />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="w-full bg-transparent outline-none text-sm text-stone-800 placeholder:text-stone-400"
          autoComplete="off"
        />
        {isLoading && (
          <span className="shrink-0 h-4 w-4 animate-spin rounded-full border-2 border-accent border-t-transparent" />
        )}
      </div>

      {isOpen && (
        <ul className="absolute z-50 mt-1 w-full rounded-xl border border-stone-100 bg-white shadow-lg overflow-hidden">
          {suggestions.map((suggestion, index) => (
            <li
              key={suggestion.label}
              onMouseDown={() => selectSuggestion(suggestion)}
              className={`flex items-start gap-3 px-4 py-3 cursor-pointer transition-colors text-sm ${
                index === highlightedIndex
                  ? "bg-accent/10 text-accent"
                  : "text-stone-700 hover:bg-stone-50"
              }`}
            >
              <MapPinIcon size={14} className="mt-0.5 shrink-0 text-stone-400" />
              <span>{suggestion.label}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
