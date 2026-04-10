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
        <span key={i} style={{ color: i <= Math.floor(rating) ? '#f59e0b' : '#d1d5db', fontSize: '12px' }}>★</span>
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
      style={{
        background: 'white', borderRadius: '14px', overflow: 'hidden',
        boxShadow: '0 1px 3px rgba(0,0,0,0.08)', transition: 'all 0.25s ease',
        cursor: 'pointer', border: '1px solid #eef0f3',
        animationDelay: `${idx * 0.05}s`,
      }}
      className="product-card"
    >
      {/* صورة المنتج */}
      <div style={{
        position: 'relative', aspectRatio: '1', overflow: 'hidden',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: gradients[product.bg] || gradients['gradient-1'], fontSize: '64px',
      }}>
        <span>{product.emoji}</span>

        {/* أزرار العمليات */}
        <div className="card-actions" style={{
          position: 'absolute', top: '8px', left: '8px',
          display: 'flex', flexDirection: 'column', gap: '4px',
          opacity: 0, transition: 'all 0.2s ease',
        }}>
          <button
            onClick={e => { e.stopPropagation(); toggleWish(product); }}
            style={{
              width: '32px', height: '32px', borderRadius: '50%', background: 'white',
              border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', fontSize: '14px', color: inWish ? '#d32f2f' : '#6b7280',
              boxShadow: '0 1px 3px rgba(0,0,0,0.15)',
            }}
          >
            {inWish ? '❤️' : '🤍'}
          </button>
        </div>

        {/* الشارات */}
        <div style={{ position: 'absolute', bottom: '8px', right: '8px', display: 'flex', flexDirection: 'column', gap: '4px', alignItems: 'flex-end' }}>
          {product.isNew && <span style={{ background: '#edf7f0', color: '#1a7c2e', padding: '3px 8px', borderRadius: '99px', fontSize: '11px', fontWeight: 700 }}>جديد</span>}
          {product.isFeatured && <span style={{ background: '#fee2e2', color: '#d32f2f', padding: '3px 8px', borderRadius: '99px', fontSize: '11px', fontWeight: 700 }}>🔥 رائج</span>}
          {product.isFast && <span style={{ background: '#dbeafe', color: '#0284c7', padding: '3px 8px', borderRadius: '99px', fontSize: '11px', fontWeight: 700 }}>⚡ سريع</span>}
          {product.stock <= 5 && <span style={{ background: '#fef3c7', color: '#b45309', padding: '3px 8px', borderRadius: '99px', fontSize: '11px', fontWeight: 700 }}>آخر {product.stock}</span>}
        </div>

        {product.discount && (
          <div style={{ position: 'absolute', top: '8px', right: '8px', background: '#d32f2f', color: 'white', fontSize: '11px', fontWeight: 700, padding: '3px 7px', borderRadius: '99px' }}>
            -{product.discount}%
          </div>
        )}
      </div>

      {/* معلومات المنتج */}
      <div style={{ padding: '12px 12px 14px' }}>
        <div style={{ fontSize: '11px', color: '#1a7c2e', fontWeight: 600, marginBottom: '4px' }}>
          🏷️ {product.catLabel}
        </div>
        <div style={{ fontSize: '13.5px', fontWeight: 700, marginBottom: '4px', lineHeight: 1.4, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {product.name}
        </div>
        <div style={{ fontSize: '11.5px', color: '#6b7280', marginBottom: '6px' }}>
          🏪 {product.seller}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '8px' }}>
          <Stars rating={product.rating} />
          <span style={{ fontSize: '12px', fontWeight: 700 }}>{product.rating}</span>
          <span style={{ fontSize: '11px', color: '#6b7280' }}>({product.reviews})</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '16px', fontWeight: 900, color: '#145c22' }}>{formatPrice(product.price)}</span>
          {product.oldPrice && <span style={{ fontSize: '12px', color: '#6b7280', textDecoration: 'line-through' }}>{formatPrice(product.oldPrice)}</span>}
          {product.discount && <span style={{ fontSize: '11px', fontWeight: 700, color: '#d32f2f', background: '#fee2e2', padding: '2px 6px', borderRadius: '99px' }}>-{product.discount}%</span>}
        </div>
        <div style={{ fontSize: '11px', color: '#6b7280', marginTop: '3px' }}>
          تم البيع: <span style={{ color: '#1a7c2e', fontWeight: 700 }}>{product.sold.toLocaleString()}</span> مرة
        </div>
        <button
          onClick={e => { e.stopPropagation(); addToCart(product); }}
          style={{
            width: '100%', marginTop: '10px', padding: '8px',
            background: '#edf7f0', color: '#1a7c2e', border: '1px solid #1a7c2e',
            borderRadius: '7px', fontFamily: 'Cairo, sans-serif', fontSize: '13px',
            fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center',
            justifyContent: 'center', gap: '6px', transition: 'all 0.2s',
          }}
          className="add-btn"
        >
          🛒 أضف للسلة
        </button>
      </div>

      <style>{`
        .product-card:hover { box-shadow: 0 8px 32px rgba(0,0,0,0.13) !important; transform: translateY(-3px); }
        .product-card:hover .card-actions { opacity: 1 !important; }
        .add-btn:hover { background: #1a7c2e !important; color: white !important; }
      `}</style>
    </div>
  );
}
