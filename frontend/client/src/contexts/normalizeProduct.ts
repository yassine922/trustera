import { Product } from './Product';

export function normalizeProduct(p: any): Product {
  return {
    ...p,
    id: p._id || p.id,
    _id: p._id || p.id,
    name: p.name || '',
    price: Number(p.price) || 0,
    category: p.category || p.cat || 'general',
    qty: p.qty || 1,
    sellerId: p.sellerId || p.seller?._id || null
  };
}

export const getProductId = (p: Product | any): string => {
  const id = p._id || p.id;
  return String(id);
};