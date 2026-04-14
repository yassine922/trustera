import { useApp } from '../../contexts/AppContext';
import { useLocation } from 'wouter';
import { formatPrice } from '../../data/products';

interface ProductCardProps {
  product: any;
  idx?: number;
}

export default function ProductCard({ product: p, idx }: ProductCardProps) {
  const { addToCart, showToast } = useApp();
  const [, setLocation] = useLocation();

  return (
    <div
      onClick={() => setLocation(`/product/${p._id || p.id}`)}
      className="group relative bg-white rounded-premium p-3 transition-all duration-500 hover:shadow-premium border border-transparent hover:border-gray-50 cursor-pointer flex flex-col h-full"
    >
      {/* Image Container - Premium Look */}
      <div className="relative aspect-[4/5] mb-4 overflow-hidden rounded-[20px] bg-[#fdfdfd] flex items-center justify-center">
        <div className="text-6xl transition-transform duration-1000 group-hover:scale-110">
          {p.image ? (
            <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
          ) : (
            <span className="filter grayscale group-hover:grayscale-0 transition-all">{p.emoji || '📦'}</span>
          )}
        </div>

        {/* Elegant Badges */}
        {p.isNew && (
          <div className="absolute top-3 right-3 bg-primary text-white text-[8px] font-black tracking-[0.2em] uppercase px-2.5 py-1 rounded-full shadow-lg">
            New
          </div>
        )}
        
        {/* Quick Action Overlay */}
        <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end justify-center p-4">
           <button
            onClick={(e) => {
              e.stopPropagation();
              addToCart({ ...p, qty: 1 });
              showToast('أضيف إلى سلتك الحصرية', 'success');
            }}
            className="w-full bg-white/90 backdrop-blur-md text-primary-dark py-3 rounded-xl text-[10px] font-black tracking-widest uppercase shadow-xl transform translate-y-2 group-hover:translate-y-0 transition-all duration-500 hover:bg-primary hover:text-white"
           >
             + إضافة سريعة
           </button>
        </div>
      </div>

      {/* Info Section */}
      <div className="px-1 flex-1 flex flex-col">
        <div className="flex justify-between items-center mb-1.5">
          <span className="text-[9px] tracking-[0.15em] text-accent font-black uppercase opacity-80">{p.category || 'Luxury Collection'}</span>
          {p.rating && <span className="text-[10px] font-bold text-gray-400 flex items-center gap-1"> <span className="text-amber-400">★</span> {p.rating}</span>}
        </div>

        <h3 className="text-[13px] font-bold text-primary-dark mb-3 line-clamp-1 leading-tight group-hover:text-primary transition-colors">
          {p.name}
        </h3>

        <div className="mt-auto flex items-center justify-between">
          <div className="flex items-baseline gap-1.5">
            <span className="text-base font-medium text-primary tracking-tight">
              {formatPrice(p.price)} <small className="text-[9px] font-bold">دج</small>
            </span>
            {p.originalPrice && (
              <span className="text-[11px] text-gray-300 line-through font-light">
                {formatPrice(p.originalPrice)}
              </span>
            )}
          </div>
          <div className="w-1.5 h-1.5 rounded-full bg-accent/30 group-hover:bg-accent transition-colors"></div>
        </div>
      </div>
    </div>
  );
}