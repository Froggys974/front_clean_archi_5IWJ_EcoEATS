export interface FoodCardType {
    visual: string;
    offer: number;
    name: string;
    remainingDays: number;
    url: string;
}

export interface FoodItem {
    id: number;
    name: string;
    description: string;
    price: number;
    image: string;
    url: string;
    offerId: number | null;
    categoryId: number;
    placeId: number;
    popular?: boolean;
    allergens?: string[];
    dailyStock?: number;
}

export interface Offer {
    id: number;
    discountPercent: number;
    startDate: string;
    endDate: string;
}

export interface FoodCategory {
    id: number;
    name: string;
    description: string;
}

export interface OpeningHour {
    day: number;
    open: string;
    close: string;
}

export interface Place {
    id: number;
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
