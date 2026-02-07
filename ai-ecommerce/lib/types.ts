export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  productCount: number;
  emoji: string;
}

export interface Brand {
  id: string;
  name: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  brand: string;
  categoryId: string;
  price: number;
  originalPrice: number | null;
  discount: number | null;
  rating: number;
  reviewCount: number;
  image: string;
  specs: Record<string, string>;
  badges: string[];
  inStock: boolean;
  freeShipping: boolean;
  deliveryEstimate: string;
}
