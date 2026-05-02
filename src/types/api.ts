// DTOs réseau — formes renvoyées par le back

export type RestaurantDto = {
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
  openingHours: { dayOfWeek: number; openTime: string; closeTime: string }[];
  status: 'OPEN' | 'CLOSED' | 'TEMPORARILY_CLOSED';
  imageUrl: string | null;
  rating: number;
  highlighted: boolean;
  createdAt: string;
};

export type DishDto = {
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

export type CategoryDto = {
  id: string;
  name: string;
  slug: string;
  imageUrl: string | null;
};

export type OfferDto = {
  id: string;
  restaurantId: string;
  label: string;
  discountPercent: number;
  imageUrl: string | null;
};

export type CartItemDto = {
  id: string;
  dishId: string;
  dishName: string;
  dishPrice: number;
  quantity: number;
  totalPrice: number;
  specialInstructions: string | null;
};

export type CartDto = {
  id: string;
  clientId: string;
  restaurantId: string | null;
  isCheckedOut: boolean;
  items: CartItemDto[];
  totalPrice: number;
  totalItems: number;
  updatedAt: string;
};

export type OrderItemDto = {
  id: string;
  dishId: string;
  dishName: string;
  dishPrice: number;
  quantity: number;
  totalPrice: number;
  specialInstructions: string | null;
};

export type OrderDto = {
  id: string;
  clientId: string;
  restaurantId: string;
  status: string;
  isPaid: boolean;
  items: OrderItemDto[];
  deliveryAddress: { street: string; city: string; postalCode: string; country: string };
  itemsTotal: number;
  deliveryFee: number;
  serviceFee: number;
  totalPrice: number;
  preparationTimeMinutes: number | null;
  estimatedDeliveryTime: string | null;
  createdAt: string;
  updatedAt: string;
};

export type DeliveryDto = {
  id: string;
  orderId: string;
  restaurantId: string;
  courierId: string | null;
  status: string;
  deliveryFee: number;
  tipAmount: number;
  distanceKm: number;
  createdAt: string;
  updatedAt: string;
};

export type WalletTransactionDto = {
  id: string;
  type: string;
  amount: number;
  description: string;
  deliveryId: string | null;
  createdAt: string;
};

export type WalletDto = {
  id: string;
  courierId: string;
  balance: number;
  currency: string;
  totalEarnings: number;
  transactions: WalletTransactionDto[];
};

// ── Body types (request payloads) ──────────────────────────────────────────

export type AddDishBody = {
  name: string;
  description: string;
  priceAmount: number;
  allergens?: string[];
  dailyStock: number;
  imageUrl?: string;
  category?: string;
};

export type AddOfferBody = {
  label: string;
  discountPercent: number;
  imageUrl?: string;
};

export type UpdateRestaurantBody = {
  name?: string;
  description?: string;
  cuisineType?: string;
  imageUrl?: string;
  openingHours?: { dayOfWeek: number; openTime: string; closeTime: string }[];
  status?: 'OPEN' | 'CLOSED' | 'TEMPORARILY_CLOSED';
};

export type AddItemBody = {
  dishId: string;
  restaurantId: string;
  quantity: number;
  specialInstructions?: string;
};

export type CheckoutBody = {
  cartId: string;
  deliveryStreet: string;
  deliveryCity: string;
  deliveryPostalCode: string;
  deliveryCountry: string;
};
