import { useEffect, useState } from "react";
import { SelectedAddress } from "@/types/address";

const GEO_API_URL = "https://api-adresse.data.gouv.fr/search/";
const DEBOUNCE_DELAY_MS = 300;
const MIN_QUERY_LENGTH = 3;
const MAX_SUGGESTIONS = 5;

type GeoFeature = {
  properties: {
    label: string;
    name: string;
    city: string;
    postcode: string;
  };
  geometry: {
    coordinates: [number, number]; // [longitude & latitude]
  };
};

type GeoApiResponse = {
  features: GeoFeature[];
};

function featureToSelectedAddress(feature: GeoFeature): SelectedAddress {
  return {
    label: feature.properties.label,
    street: feature.properties.name,
    city: feature.properties.city,
    postalCode: feature.properties.postcode,
    lat: feature.geometry.coordinates[1],
    lng: feature.geometry.coordinates[0],
  };
}

export function useAddressAutocomplete(query: string): {
  suggestions: SelectedAddress[];
  isLoading: boolean;
} {
  const [suggestions, setSuggestions] = useState<SelectedAddress[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (query.length < MIN_QUERY_LENGTH) {
      setSuggestions([]);
      return;
    }

    const controller = new AbortController();

    const timer = setTimeout(async () => {
      setIsLoading(true);
      try {
        const url = `${GEO_API_URL}?q=${encodeURIComponent(query)}&limit=${MAX_SUGGESTIONS}`;
        const response = await fetch(url, { signal: controller.signal });
        const data: GeoApiResponse = await response.json();
        setSuggestions(data.features.map(featureToSelectedAddress));
      } catch {
        setSuggestions([]);
      } finally {
        setIsLoading(false);
      }
    }, DEBOUNCE_DELAY_MS);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [query]);

  return { suggestions, isLoading };
}
