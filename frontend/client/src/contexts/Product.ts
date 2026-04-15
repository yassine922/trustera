export interface Product {
  id?: string | number;
  _id?: string;

  name: string;
  price: number;

  category?: string;
  cat?: string;

  image?: string;
  emoji?: string;

  rating?: number;
  reviews?: number;

  seller?: string;
  sellerId?: string | number | null; // السماح بقيمة null

  stock?: number;
  isNew?: boolean;
  isFeatured?: boolean;

  originalPrice?: number;
  discount?: number;

  qty?: number;
}