export interface FoodCardType {
    visual: string;
    offer: number;
    name: string;
    remainingDays: number;
    url: string;
}

export interface FoodItem {
    id: string;
    name: string;
    description: string;
    price: number;
    image: string;
    url: string;
    offerId: string | null;
    categoryId: string;
    placeId: string;
    popular?: boolean;
    allergens?: string[];
    dailyStock?: number;
    availableStock?: number;
}

export interface Offer {
    id: string;
    discountPercent: number;
    startDate: string;
    endDate: string;
}

export interface FoodCategory {
    id: string;
    name: string;
    description: string;
    visual?: string;
    slug?: string;
}

export interface OpeningHour {
    day: number;
    open: string;
    close: string;
}

export interface Place {
    id: string;
    name: string;
    address: string;
    city: string;
    rating: number;
    image: string;
    url: string;
    maxDeliveryTime: number;
    highlighted?: boolean;
    isFast?: boolean;
    offer?: string;
    OpeningHours?: OpeningHour[];
    ownerId?: string;
}

export interface FoodWithRelations extends FoodItem {
    offer: Offer;
    category: FoodCategory;
    place: Place;
}
