import { useState } from 'react';
import { SELLERS } from '../../data/products';
import { useApp } from '../../contexts/AppContext';

export default function RightPanel() {
  const { showToast } = useApp();
  const [trackVal, setTrackVal] = useState('TRS-2025-');
  const sorted = [...SELLERS].sort((a, b) => b.reviews - a.reviews).slice(0, 5);
  const ranks = ['🥇', '🥈', '🥉', '4️⃣', '5️⃣'];

  return (
    <aside className="w-70 flex-shrink-0 bg-white border-r border-gray-100 px-3 py-4 sticky top-28 h-[calc(100vh-112px)] overflow-y-auto">

      {/* تتبع الطلب */}
      <div className="mb-5">
        <div className="text-xs font-black text-gray-900 mb-3 flex items-center gap-1.5">
          📍 تتبع طلبك
        </div>
        <div className="flex gap-1.5">
          <input
            value={trackVal}
            onChange={e => setTrackVal(e.target.value)}
            className="flex-1 px-2.5 py-2 border border-gray-300 rounded-lg font-cairo text-xs outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
            placeholder="رقم الطلب..."
          />
          <button 
            onClick={() => showToast(`تتبع الطلب: ${trackVal}`, 'success', '📍')} 
            className="px-3 py-2 bg-primary text-white border-0 rounded-lg font-cairo text-xs font-bold cursor-pointer hover:bg-primary-dark transition"
          >
            تتبع
          </button>
        </div>
      </div>

      {/* أفضل البائعين */}
      <div className="mb-5">
        <div className="text-xs font-black text-gray-900 mb-3 flex items-center gap-1.5">
          👑 أفضل البائعين
          <button 
            onClick={() => showToast('قريباً', 'info')} 
            className="text-xs text-primary font-semibold cursor-pointer ml-auto hover:underline"
          >
            عرض الكل
          </button>
        </div>
        {sorted.map((s, i) => (
          <div 
            key={s.id} 
            onClick={() => showToast(`متجر ${s.name}`, 'info')} 
            className="flex items-center gap-2.5 px-1.5 py-2 rounded-lg cursor-pointer transition-colors hover:bg-gray-50"
          >
            <span className="text-base">{ranks[i]}</span>
            <div 
              className="w-8.5 h-8.5 rounded-full flex items-center justify-center text-sm font-black text-white flex-shrink-0" 
              style={{ backgroundColor: s.avColor }}
            >
              {s.av}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-bold">{s.name} {s.verified && '✅'}</div>
              <div className="text-xs text-gray-500">⭐ {s.rating} · {s.reviews.toLocaleString()} تقييم</div>
            </div>
          </div>
        ))}
      </div>

      {/* إحصائيات المنصة */}
      <div className="mb-5">
        <div className="text-xs font-black text-gray-900 mb-3">📊 إحصائيات المنصة</div>
        <div className="grid grid-cols-3 gap-2">
          {[{ val: '+50K', label: 'مستخدم' }, { val: '+3K', label: 'بائع' }, { val: '+100K', label: 'طلب' }].map((s, i) => (
            <div key={i} className="bg-gray-50 rounded-lg p-2.5 text-center">
              <div className="text-base font-black text-primary-dark">{s.val}</div>
              <div className="text-xs text-gray-500 mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* الدعم */}
      <div className="bg-primary-bg rounded-lg p-3.5 text-center border border-green-200">
        <div className="text-2xl mb-1.5">🎧</div>
        <div className="text-sm font-bold mb-1">مساعدة؟</div>
        <div className="text-xs text-gray-500 mb-2.5">فريق الدعم متاح 24/7</div>
        <button 
          onClick={() => showToast('جاري الاتصال بفريق الدعم...', 'info')} 
          className="w-full py-2 bg-primary text-white border-0 rounded-lg font-cairo text-xs font-bold cursor-pointer hover:bg-primary-dark transition"
        >
          🎧 تواصل معنا
        </button>
      </div>
    </aside>
  );
}
