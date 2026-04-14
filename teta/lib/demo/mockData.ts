// Mock data for demo mode
// All data is designed to be realistic for Beirut, Lebanon

export interface DemoCook {
  id: string;
  user_id: string;
  name: string;
  bio: string;
  avatar_url: string;
  address_hint: string;
  specialties: string[];
  avg_rating: number;
  total_reviews: number;
  accepts_orders: boolean;
  latitude: number;
  longitude: number;
  delivery_radius_km: number;
}

export interface DemoListing {
  id: string;
  cook_id: string;
  name: string;
  description: string;
  price_usd: number;
  portions_available: number;
  prep_time_mins: number;
  category: string;
  allergens: string[];
  dietary_tags: string[];
  is_active: boolean;
  is_free: boolean;
}

export interface DemoOrder {
  id: string;
  customer_id: string;
  cook_id: string;
  listing_id: string;
  status: "pending" | "confirmed" | "preparing" | "ready" | "delivered" | "cancelled";
  total_price_usd: number;
  delivery_address: string;
  created_at: string;
}

// Beirut coordinates (approximate center)
const BEIRUT_LAT = 33.3157;
const BEIRUT_LNG = 35.4772;

export const DEMO_COOKS: DemoCook[] = [
  {
    id: "cook-1",
    user_id: "demo-cook",
    name: "Teta Maryam",
    bio: "Traditional Lebanese home cook with 25 years of experience. Specializing in authentic family recipes passed down through generations.",
    avatar_url: "👩‍🍳",
    address_hint: "Achrafieh, Beirut",
    specialties: ["Kibbeh", "Fattoush", "Warak Enab", "Tabbouleh"],
    avg_rating: 4.8,
    total_reviews: 127,
    accepts_orders: true,
    latitude: BEIRUT_LAT + 0.01,
    longitude: BEIRUT_LNG + 0.01,
    delivery_radius_km: 5,
  },
  {
    id: "cook-2",
    user_id: "user-2",
    name: "Um Khalil",
    bio: "Expert in mezze and seafood dishes. Fresh ingredients sourced daily from local markets.",
    avatar_url: "🧑‍🍳",
    address_hint: "Gemmayze, Beirut",
    specialties: ["Hummus", "Baba Ghanoush", "Sayadieh", "Mixed Grill"],
    avg_rating: 4.7,
    total_reviews: 94,
    accepts_orders: true,
    latitude: BEIRUT_LAT - 0.005,
    longitude: BEIRUT_LNG + 0.015,
    delivery_radius_km: 4,
  },
  {
    id: "cook-3",
    user_id: "user-3",
    name: "Teta Nadia",
    bio: "Sweet treats and pastries specialist. All homemade with love and premium ingredients.",
    avatar_url: "👵",
    address_hint: "Hamra, Beirut",
    specialties: ["Knefeh", "Baklava", "Basbousa", "Manoushe"],
    avg_rating: 4.9,
    total_reviews: 156,
    accepts_orders: true,
    latitude: BEIRUT_LAT + 0.008,
    longitude: BEIRUT_LNG - 0.008,
    delivery_radius_km: 6,
  },
];

export const DEMO_LISTINGS: DemoListing[] = [
  // Teta Maryam's dishes
  {
    id: "listing-1",
    cook_id: "cook-1",
    name: "Kibbeh Nayyeh",
    description: "Raw lamb kibbeh with bulgur wheat, finely minced and mixed with spices",
    price_usd: 8.5,
    portions_available: 5,
    prep_time_mins: 15,
    category: "Appetizers",
    allergens: ["lamb"],
    dietary_tags: ["gluten-free"],
    is_active: true,
    is_free: false,
  },
  {
    id: "listing-2",
    cook_id: "cook-1",
    name: "Fattoush Salad",
    description: "Mixed greens with tomatoes, cucumbers, radishes, and crispy pita chips in lemon vinaigrette",
    price_usd: 6.5,
    portions_available: 8,
    prep_time_mins: 20,
    category: "Salads",
    allergens: [],
    dietary_tags: ["vegetarian", "vegan"],
    is_active: true,
    is_free: false,
  },
  {
    id: "listing-3",
    cook_id: "cook-1",
    name: "Warak Enab",
    description: "Grape leaves stuffed with rice, tomatoes, and herbs, rolled and steamed to perfection",
    price_usd: 7.0,
    portions_available: 10,
    prep_time_mins: 30,
    category: "Main Dishes",
    allergens: [],
    dietary_tags: ["vegetarian"],
    is_active: true,
    is_free: false,
  },
  {
    id: "listing-4",
    cook_id: "cook-1",
    name: "Tabbouleh",
    description: "Fresh parsley salad with cracked wheat, tomatoes, onions, lemon, and olive oil",
    price_usd: 6.0,
    portions_available: 6,
    prep_time_mins: 15,
    category: "Salads",
    allergens: ["gluten"],
    dietary_tags: ["vegetarian", "vegan"],
    is_active: true,
    is_free: false,
  },
  {
    id: "listing-5",
    cook_id: "cook-1",
    name: "Freekeh with Chicken",
    description: "Smoky roasted green wheat with tender chicken pieces and vegetables",
    price_usd: 9.5,
    portions_available: 4,
    prep_time_mins: 45,
    category: "Main Dishes",
    allergens: ["gluten"],
    dietary_tags: [],
    is_active: true,
    is_free: false,
  },
  // Um Khalil's dishes
  {
    id: "listing-6",
    cook_id: "cook-2",
    name: "Hummus bi Tahini",
    description: "Smooth chickpea puree with tahini, lemon juice, and garlic",
    price_usd: 5.5,
    portions_available: 12,
    prep_time_mins: 10,
    category: "Appetizers",
    allergens: ["sesame"],
    dietary_tags: ["vegetarian", "vegan", "gluten-free"],
    is_active: true,
    is_free: false,
  },
  {
    id: "listing-7",
    cook_id: "cook-2",
    name: "Baba Ghanoush",
    description: "Roasted eggplant puree with tahini, lemon, and garlic",
    price_usd: 5.5,
    portions_available: 10,
    prep_time_mins: 25,
    category: "Appetizers",
    allergens: ["sesame"],
    dietary_tags: ["vegetarian", "vegan", "gluten-free"],
    is_active: true,
    is_free: false,
  },
  {
    id: "listing-8",
    cook_id: "cook-2",
    name: "Sayadieh",
    description: "Fish fillet served on a bed of fragrant rice with caramelized onions",
    price_usd: 12.0,
    portions_available: 6,
    prep_time_mins: 50,
    category: "Seafood",
    allergens: ["fish"],
    dietary_tags: ["gluten-free"],
    is_active: true,
    is_free: false,
  },
  {
    id: "listing-9",
    cook_id: "cook-2",
    name: "Mixed Grill Platter",
    description: "Selection of grilled lamb, chicken, and beef with garlic sauce and bread",
    price_usd: 15.0,
    portions_available: 3,
    prep_time_mins: 60,
    category: "Main Dishes",
    allergens: [],
    dietary_tags: [],
    is_active: true,
    is_free: false,
  },
  // Teta Nadia's dishes
  {
    id: "listing-10",
    cook_id: "cook-3",
    name: "Knefeh",
    description: "Shredded phyllo layered with cheese, topped with pistachios, and soaked in simple syrup",
    price_usd: 7.5,
    portions_available: 8,
    prep_time_mins: 35,
    category: "Desserts",
    allergens: ["dairy", "nuts"],
    dietary_tags: ["vegetarian"],
    is_active: true,
    is_free: false,
  },
  {
    id: "listing-11",
    cook_id: "cook-3",
    name: "Baklava",
    description: "Crispy phyllo pastry with walnuts and pistachios, drizzled with honey",
    price_usd: 6.0,
    portions_available: 12,
    prep_time_mins: 20,
    category: "Desserts",
    allergens: ["nuts"],
    dietary_tags: ["vegetarian", "vegan"],
    is_active: true,
    is_free: false,
  },
  {
    id: "listing-12",
    cook_id: "cook-3",
    name: "Manoushe Za'atar",
    description: "Flatbread brushed with olive oil and covered in za'atar spice blend",
    price_usd: 3.5,
    portions_available: 15,
    prep_time_mins: 25,
    category: "Breads",
    allergens: ["gluten"],
    dietary_tags: ["vegetarian", "vegan"],
    is_active: true,
    is_free: false,
  },
];

export const DEMO_ORDERS: DemoOrder[] = [
  {
    id: "order-1",
    customer_id: "demo-user",
    cook_id: "cook-1",
    listing_id: "listing-1",
    status: "delivered",
    total_price_usd: 8.5,
    delivery_address: "123 Hamra St, Beirut",
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "order-2",
    customer_id: "demo-user",
    cook_id: "cook-2",
    listing_id: "listing-6",
    status: "ready",
    total_price_usd: 5.5,
    delivery_address: "123 Hamra St, Beirut",
    created_at: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
  },
  {
    id: "order-3",
    customer_id: "demo-user",
    cook_id: "cook-3",
    listing_id: "listing-10",
    status: "confirmed",
    total_price_usd: 7.5,
    delivery_address: "123 Hamra St, Beirut",
    created_at: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
  },
];
