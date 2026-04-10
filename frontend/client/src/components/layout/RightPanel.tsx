import { useState } from 'react';
import { SELLERS } from '../../data/products';
import { useApp } from '../../contexts/AppContext';

export default function RightPanel() {
  const { showToast } = useApp();
  const [trackVal, setTrackVal] = useState('TRS-2025-');
  const sorted = [...SELLERS].sort((a, b) => b.reviews - a.reviews).slice(0, 5);
  const ranks = ['🥇', '🥈', '🥉', '4️⃣', '5️⃣'];

  return (
    <aside style={{ width: '280px', flexShrink: 0, background: 'white', borderRight: '1px solid #eef0f3', padding: '16px 12px', position: 'sticky', top: '112px', height: 'calc(100vh - 112px)', overflowY: 'auto' }}>

      {/* تتبع الطلب */}
      <div style={{ marginBottom: '20px' }}>
        <div style={{ fontSize: '13px', fontWeight: 800, color: '#111827', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
          📍 تتبع طلبك
        </div>
        <div style={{ display: 'flex', gap: '6px' }}>
          <input
            value={trackVal}
            onChange={e => setTrackVal(e.target.value)}
            style={{ flex: 1, padding: '8px 10px', border: '1px solid #dde1e7', borderRadius: '7px', fontFamily: 'Cairo, sans-serif', fontSize: '12px', outline: 'none' }}
            placeholder="رقم الطلب..."
          />
          <button onClick={() => showToast(`تتبع الطلب: ${trackVal}`, 'success', '📍')} style={{ padding: '8px 12px', background: '#1a7c2e', color: 'white', border: 'none', borderRadius: '7px', fontFamily: 'Cairo, sans-serif', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}>
            تتبع
          </button>
        </div>
      </div>

      {/* أفضل البائعين */}
      <div style={{ marginBottom: '20px' }}>
        <div style={{ fontSize: '13px', fontWeight: 800, color: '#111827', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
          👑 أفضل البائعين
          <span onClick={() => showToast('قريباً', 'info')} style={{ fontSize: '11px', color: '#1a7c2e', fontWeight: 600, cursor: 'pointer', marginRight: 'auto' }}>عرض الكل</span>
        </div>
        {sorted.map((s, i) => (
          <div key={s.id} onClick={() => showToast(`متجر ${s.name}`, 'info')} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 6px', borderRadius: '8px', cursor: 'pointer', transition: 'background 0.2s' }} className="seller-row">
            <span style={{ fontSize: '16px' }}>{ranks[i]}</span>
            <div style={{ width: '34px', height: '34px', borderRadius: '50%', background: s.avColor, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: 800, color: 'white', flexShrink: 0 }}>{s.av}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: '12.5px', fontWeight: 700 }}>{s.name} {s.verified && '✅'}</div>
              <div style={{ fontSize: '11px', color: '#6b7280' }}>⭐ {s.rating} · {s.reviews.toLocaleString()} تقييم</div>
            </div>
          </div>
        ))}
      </div>

      {/* إحصائيات المنصة */}
      <div style={{ marginBottom: '20px' }}>
        <div style={{ fontSize: '13px', fontWeight: 800, color: '#111827', marginBottom: '12px' }}>📊 إحصائيات المنصة</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
          {[{ val: '+50K', label: 'مستخدم' }, { val: '+3K', label: 'بائع' }, { val: '+100K', label: 'طلب' }].map((s, i) => (
            <div key={i} style={{ background: '#f4f6f8', borderRadius: '8px', padding: '10px 6px', textAlign: 'center' }}>
              <div style={{ fontSize: '16px', fontWeight: 900, color: '#145c22' }}>{s.val}</div>
              <div style={{ fontSize: '10px', color: '#6b7280', marginTop: '2px' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* الدعم */}
      <div style={{ background: '#edf7f0', borderRadius: '10px', padding: '14px', textAlign: 'center', border: '1px solid #c8e6c9' }}>
        <div style={{ fontSize: '28px', marginBottom: '6px' }}>🎧</div>
        <div style={{ fontSize: '13px', fontWeight: 700, marginBottom: '4px' }}>مساعدة؟</div>
        <div style={{ fontSize: '11px', color: '#6b7280', marginBottom: '10px' }}>فريق الدعم متاح 24/7</div>
        <button onClick={() => showToast('جاري الاتصال بفريق الدعم...', 'info')} style={{ width: '100%', padding: '8px', background: '#1a7c2e', color: 'white', border: 'none', borderRadius: '8px', fontFamily: 'Cairo, sans-serif', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}>
          🎧 تواصل معنا
        </button>
      </div>

      <style>{`.seller-row:hover { background: #f4f6f8; }`}</style>
    </aside>
  );
}
