import { Product, formatPrice } from '../../data/products';
import { useApp } from '../../contexts/AppContext';

const gradients: Record<string, string> = {
  'gradient-1': 'linear-gradient(135deg,#dbeafe,#bfdbfe)',
  'gradient-2': 'linear-gradient(135deg,#fce7f3,#fbcfe8)',
  'gradient-3': 'linear-gradient(135deg,#dcfce7,#bbf7d0)',
  'gradient-4': 'linear-gradient(135deg,#fef9c3,#fef08a)',
  'gradient-5': 'linear-gradient(135deg,#f3e8ff,#e9d5ff)',
  'gradient-6': 'linear-gradient(135deg,#ccfbf1,#99f6e4)',
};

function Stars({ rating }: { rating: number }) {
  return (
    <span>
      {[1,2,3,4,5].map(i => (
        <span key={i} className={`text-xs ${i <= Math.floor(rating) ? 'text-warning' : 'text-gray-300'}`}>★</span>
      ))}
    </span>
  );
}

export default function ProductCard({ product, idx = 0 }: { product: Product; idx?: number }) {
  const { addToCart, toggleWish, wishlist, setCurrentProduct, showPage } = useApp();
  const inWish = wishlist.some(w => w.id === product.id);

  const openProduct = () => {
    setCurrentProduct(product);
    showPage('product');
  };

  return (
    <div
      onClick={openProduct}
      className="bg-white rounded-lg overflow-hidden shadow-sm transition-all duration-250 cursor-pointer border border-gray-100 hover:shadow-lg hover:-translate-y-0.75 product-card"
      style={{ animationDelay: `${idx * 0.05}s` }}
    >
      {/* صورة المنتج */}
      <div 
        className="relative aspect-square overflow-hidden flex items-center justify-center text-8xl"
        style={{ background: gradients[product.bg] || gradients['gradient-1'] }}
      >
        <span>{product.emoji}</span>

        {/* أزرار العمليات */}
        <div className="card-actions absolute top-2 left-2 flex flex-col gap-1 opacity-0 transition-all duration-200">
          <button
            onClick={e => { e.stopPropagation(); toggleWish(product); }}
            className="w-8 h-8 rounded-full bg-white border-0 flex items-center justify-center cursor-pointer text-sm shadow-md hover:scale-110 transition"
            style={{ color: inWish ? '#d32f2f' : '#6b7280' }}
          >
            {inWish ? '❤️' : '🤍'}
          </button>
        </div>

        {/* الشارات */}
        <div className="absolute bottom-2 right-2 flex flex-col gap-1 items-end">
          {product.isNew && <span className="bg-primary-bg text-primary px-2 py-0.5 rounded-full text-xs font-bold">جديد</span>}
          {product.isFeatured && <span className="bg-red-100 text-danger px-2 py-0.5 rounded-full text-xs font-bold">🔥 رائج</span>}
          {product.isFast && <span className="bg-blue-100 text-info px-2 py-0.5 rounded-full text-xs font-bold">⚡ سريع</span>}
          {product.stock <= 5 && <span className="bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full text-xs font-bold">آخر {product.stock}</span>}
        </div>

        {product.discount && (
          <div className="absolute top-2 right-2 bg-danger text-white text-xs font-bold px-1.75 py-0.75 rounded-full">
            -{product.discount}%
          </div>
        )}
      </div>

      {/* معلومات المنتج */}
      <div className="px-3 py-3.5">
        <div className="text-xs text-primary font-semibold mb-1">
          🏷️ {product.catLabel}
        </div>
        <div className="text-sm font-bold mb-1 leading-tight line-clamp-2">
          {product.name}
        </div>
        <div className="text-xs text-gray-500 mb-1.5">
          🏪 {product.seller}
        </div>
        <div className="flex items-center gap-1.25 mb-2">
          <Stars rating={product.rating} />
          <span className="text-xs font-bold">{product.rating}</span>
          <span className="text-xs text-gray-500">({product.reviews})</span>
        </div>
        <div className="flex items-baseline gap-2 flex-wrap">
          <span className="text-lg font-black text-primary-dark">{formatPrice(product.price)}</span>
          {product.oldPrice && <span className="text-xs text-gray-500 line-through">{formatPrice(product.oldPrice)}</span>}
          {product.discount && <span className="text-xs font-bold text-danger bg-red-100 px-1.5 py-0.5 rounded-full">-{product.discount}%</span>}
        </div>
        <div className="text-xs text-gray-500 mt-0.75">
          تم البيع: <span className="text-primary font-bold">{product.sold.toLocaleString()}</span> مرة
        </div>
        <button
          onClick={e => { e.stopPropagation(); addToCart(product); }}
          className="w-full mt-2.5 py-2 bg-primary-bg text-primary border border-primary rounded-lg font-cairo text-sm font-bold cursor-pointer flex items-center justify-center gap-1.5 transition-all hover:bg-primary hover:text-white add-btn"
        >
          🛒 أضف للسلة
        </button>
      </div>

      <style>{`
        .product-card:hover .card-actions { opacity: 1 !important; }
      `}</style>
    </div>
  );
}
