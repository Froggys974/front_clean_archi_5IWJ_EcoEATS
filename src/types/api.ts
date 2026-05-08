export type ApiOpeningHour = {
  dayOfWeek: number;
  openTime: string;
  closeTime: string;
};

export type ApiRestaurant = {
  id: string;
  ownerId: string;
  name: string;
  description: string;
  address: {
    street: string;
    city: string;
    postalCode: string;
    country: string;
    coordinates: { latitude: number; longitude: number };
  };
  phone: string;
  cuisineType: string;
  openingHours: ApiOpeningHour[];
  status: string;
  imageUrl: string | null;
  rating: number;
  highlighted: boolean;
  createdAt: string;
};

export type ApiDish = {
  id: string;
  restaurantId: string | null;
  name: string;
  description: string;
  price: number;
  currency: string;
  allergens: string[];
  dailyStock: number;
  availableStock: number;
  imageUrl: string | null;
  category: string | null;
  isAvailable: boolean;
};

export type ApiCategory = {
  id: string;
  name: string;
  slug: string;
  imageUrl: string | null;
};

export type ApiOffer = {
  id: string;
  restaurantId: string;
  label: string;
  discountPercent: number;
  imageUrl: string | null;
};

export type CarouselItem = {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string | null;
  restaurantId: string;
  restaurantName: string;
};
