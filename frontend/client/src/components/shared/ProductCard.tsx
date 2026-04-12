import { Product, formatPrice } from '../../data/products';
import { useApp } from '../../contexts/AppContext';

// ===== الثوابت =====
const GRADIENTS: Record<string, string> = {
  'gradient-1': 'linear-gradient(135deg,#dbeafe,#bfdbfe)',
  'gradient-2': 'linear-gradient(135deg,#fce7f3,#fbcfe8)',
  'gradient-3': 'linear-gradient(135deg,#dcfce7,#bbf7d0)',
  'gradient-4': 'linear-gradient(135deg,#fef9c3,#fef08a)',
  'gradient-5': 'linear-gradient(135deg,#f3e8ff,#e9d5ff)',
  'gradient-6': 'linear-gradient(135deg,#ccfbf1,#99f6e4)',
};

const BADGES = {
  new: { bg: 'bg-primary-bg', text: 'text-primary', label: 'جديد' },
  featured: { bg: 'bg-red-100', text: 'text-danger', label: '🔥 رائج' },
  fast: { bg: 'bg-blue-100', text: 'text-info', label: '⚡ سريع' },
  lowStock: { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'آخر' },
} as const;

// ===== المكونات المساعدة =====

function Stars({ rating }: { rating: number }) {
  return (
    <span className="flex">
      {[1, 2, 3, 4, 5].map((i) => (
        <span
          key={i}
          className={`text-xs ${
            i <= Math.floor(rating) ? 'text-warning' : 'text-gray-300'
          }`}
        >
          ★
        </span>
      ))}
    </span>
  );
}

function Badge({ type, value }: { type: keyof typeof BADGES; value?: number }) {
  const config = BADGES[type];
  return (
    <span
      className={`${config.bg} ${config.text} px-2 py-0.5 rounded-full text-xs font-bold`}
    >
      {type === 'lowStock' ? `${config.label} ${value}` : config.label}
    </span>
  );
}

function DiscountBadge({ discount }: { discount: number }) {
  return (
    <div className="absolute top-2 right-2 bg-danger text-white text-xs font-bold px-2 py-1 rounded-full">
      -{discount}%
    </div>
  );
}

// ===== المكون الرئيسي =====

interface ProductCardProps {
  product: Product;
  idx?: number;
}

// ✅ إضافة: دالة لإنشاء SKU تلقائي
const generateSKU = (product: Product): string => {
  if (product.sku) return product.sku;
  const catCode = product.category?.substring(0, 3).toUpperCase() || 'GEN';
  const idStr = typeof product.id === 'number' 
    ? String(product.id).padStart(3, '0') 
    : String(product.id).replace(/\D/g, '').padStart(3, '0') || '000';
  return `TR-${idStr}-${catCode}`;
};

// ✅ إضافة: دالة لتحديد إذا كان المنتج حقيقي
const checkIsReal = (product: Product): boolean => {
  // حقيقي إذا كان: له SKU مسبق، أو ID نصي، أو علامة isReal
  return !!product.sku || typeof product.id === 'string' || !!(product as any).isReal;
};

export default function ProductCard({ product, idx = 0 }: ProductCardProps) {
  const { addToCart, toggleWish, wishlist, setCurrentProduct, showPage } = useApp();
  const inWish = wishlist.some((w) => w.id === product.id);

  const handleOpen = () => {
    // ✅ إضافة: تجهيز المنتج قبل العرض
    const enhancedProduct = {
      ...product,
      sku: generateSKU(product),
      isReal: checkIsReal(product)
    };
    setCurrentProduct(enhancedProduct);
    showPage('product');
  };

  const handleWish = (e: React.MouseEvent) => {
    e.stopPropagation();
    // ✅ إضافة: تجهيز المنتج للمفضلة
    const enhancedProduct = {
      ...product,
      sku: generateSKU(product),
      isReal: checkIsReal(product)
    };
    toggleWish(enhancedProduct);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    // ✅ إضافة: تجهيز المنتج قبل الإضافة للسلة
    const enhancedProduct: Product & { sku: string; isReal: boolean } = {
      ...product,
      sku: generateSKU(product),
      isReal: checkIsReal(product)
    };
    addToCart(enhancedProduct);
  };

  const bgStyle = GRADIENTS[product.bg] || GRADIENTS['gradient-1'];

  return (
    <article
      onClick={handleOpen}
      className="group bg-white rounded-lg overflow-hidden shadow-sm border border-gray-100 cursor-pointer transition-all duration-200 hover:shadow-lg hover:-translate-y-1"
      style={{ animationDelay: `${idx * 0.05}s` }}
    >
      {/* ===== صورة المنتج ===== */}
      <div
        className="relative aspect-square overflow-hidden flex items-center justify-center text-6xl sm:text-7xl md:text-8xl"
        style={{ background: bgStyle }}
      >
        <span className="select-none">{product.emoji}</span>

        {/* زر المفضلة */}
        <button
          onClick={handleWish}
          className="absolute top-2 left-2 w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center text-sm opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-110 active:scale-95"
          style={{ color: inWish ? '#d32f2f' : '#6b7280' }}
          aria-label={inWish ? 'إزالة من المفضلة' : 'إضافة للمفضلة'}
        >
          {inWish ? '❤️' : '🤍'}
        </button>

        {/* الشارات */}
        <div className="absolute bottom-2 right-2 flex flex-col gap-1 items-end">
          {product.isNew && <Badge type="new" />}
          {product.isFeatured && <Badge type="featured" />}
          {product.isFast && <Badge type="fast" />}
          {product.stock <= 5 && <Badge type="lowStock" value={product.stock} />}
        </div>

        {/* خصم */}
        {product.discount && <DiscountBadge discount={product.discount} />}
      </div>

      {/* ===== معلومات المنتج ===== */}
      <div className="p-3">
        {/* التصنيف */}
        <div className="text-xs text-primary font-semibold mb-1 truncate">
          🏷️ {product.catLabel}
        </div>

        {/* الاسم */}
        <h3 className="text-sm font-bold mb-1 leading-tight line-clamp-2 min-h-[2.5em]">
          {product.name}
        </h3>

        {/* البائع */}
        <div className="text-xs text-gray-500 mb-1.5 truncate">
          🏪 {product.seller}
        </div>

        {/* التقييم */}
        <div className="flex items-center gap-1 mb-2">
          <Stars rating={product.rating} />
          <span className="text-xs font-bold">{product.rating}</span>
          <span className="text-xs text-gray-500">({product.reviews})</span>
        </div>

        {/* السعر */}
        <div className="flex items-baseline gap-2 flex-wrap mb-1">
          <span className="text-base sm:text-lg font-black text-primary-dark">
            {formatPrice(product.price)}
          </span>
          {product.oldPrice && (
            <span className="text-xs text-gray-500 line-through">
              {formatPrice(product.oldPrice)}
            </span>
          )}
          {product.discount && (
            <span className="text-xs font-bold text-danger bg-red-100 px-1.5 py-0.5 rounded-full">
              -{product.discount}%
            </span>
          )}
        </div>

        {/* المبيعات */}
        <div className="text-xs text-gray-500 mb-2.5">
          تم البيع:{' '}
          <span className="text-primary font-bold">
            {product.sold.toLocaleString()}
          </span>{' '}
          مرة
        </div>

        {/* زر الإضافة */}
        <button
          onClick={handleAddToCart}
          className="w-full py-2 bg-primary-bg text-primary border border-primary rounded-lg text-sm font-bold flex items-center justify-center gap-1.5 transition-all hover:bg-primary hover:text-white active:scale-95 touch-manipulation"
        >
          🛒 أضف للسلة
        </button>
      </div>
    </article>
  );
}
