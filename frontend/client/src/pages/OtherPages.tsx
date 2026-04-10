import { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import ProductCard from '../components/shared/ProductCard';
import { formatPrice } from '../data/products';

/* ===== ORDER SUCCESS ===== */
export function OrderSuccess() {
  const { orderNum, showPage } = useApp();
  return (
    <div style={{ maxWidth:'540px', margin:'60px auto', textAlign:'center', padding:'0 24px' }}>
      <div style={{ fontSize:'80px', marginBottom:'16px', animation:'float 2s ease-in-out infinite' }}>🎉</div>
      <h2 style={{ fontSize:'26px', fontWeight:900, marginBottom:'8px', color:'#145c22' }}>تم تأكيد طلبك!</h2>
      <p style={{ color:'#6b7280', marginBottom:'20px' }}>رقم الطلب: <strong style={{ color:'#1a7c2e', fontSize:'16px' }}>{orderNum}</strong></p>
      <div style={{ background:'#edf7f0', borderRadius:'14px', padding:'20px', marginBottom:'24px', border:'1px solid #c8e6c9', textAlign:'right' }}>
        {[
          { icon:'✅', title:'تم استلام الطلب', time:'الآن', done:true },
          { icon:'📦', title:'قيد التجهيز', time:'خلال 24 ساعة', done:false },
          { icon:'🚚', title:'في الطريق', time:'خلال 2-4 أيام', done:false },
        ].map((s,i) => (
          <div key={i} style={{ display:'flex', alignItems:'center', gap:'10px', marginBottom: i<2?'12px':0 }}>
            <div style={{ width:'32px', height:'32px', background: s.done?'#1a7c2e':'#dde1e7', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'14px', flexShrink:0 }}>{s.icon}</div>
            <div style={{ color: s.done?'#111827':'#6b7280' }}>
              <strong>{s.title}</strong>
              <div style={{ fontSize:'12px' }}>{s.time}</div>
            </div>
          </div>
        ))}
      </div>
      <div style={{ display:'flex', gap:'10px', justifyContent:'center' }}>
        <button onClick={() => showPage('account')} style={{ padding:'11px 24px', background:'#1a7c2e', color:'white', border:'none', borderRadius:'8px', fontFamily:'Cairo,sans-serif', fontSize:'14px', fontWeight:700, cursor:'pointer' }}>متابعة طلباتي</button>
        <button onClick={() => showPage('home')} style={{ padding:'11px 24px', background:'white', color:'#374151', border:'1px solid #dde1e7', borderRadius:'8px', fontFamily:'Cairo,sans-serif', fontSize:'14px', fontWeight:700, cursor:'pointer' }}>العودة للتسوق</button>
      </div>
      <style>{`@keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}`}</style>
    </div>
  );
}

/* ===== WISHLIST ===== */
export function Wishlist() {
  const { wishlist, showPage } = useApp();
  return (
    <div>
      <div style={{ padding:'14px 24px', background:'white', borderBottom:'1px solid #eef0f3' }}>
        <h1 style={{ fontSize:'18px', fontWeight:800 }}>❤️ المفضلة ({wishlist.length} منتج)</h1>
      </div>
      <div style={{ padding:'20px 24px' }}>
        {wishlist.length > 0 ? (
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(180px,1fr))', gap:'14px' }}>
            {wishlist.map((p,i) => <ProductCard key={p.id} product={p} idx={i} />)}
          </div>
        ) : (
          <div style={{ textAlign:'center', padding:'60px 0' }}>
            <div style={{ fontSize:'64px', marginBottom:'12px' }}>❤️</div>
            <div style={{ fontSize:'18px', fontWeight:700, marginBottom:'8px' }}>قائمة المفضلة فارغة</div>
            <button onClick={() => showPage('categories')} style={{ padding:'10px 24px', background:'#1a7c2e', color:'white', border:'none', borderRadius:'8px', fontFamily:'Cairo,sans-serif', fontSize:'13px', fontWeight:700, cursor:'pointer', marginTop:'8px' }}>تصفح المنتجات</button>
          </div>
        )}
      </div>
    </div>
  );
}

/* ===== ACCOUNT ===== */
export function Account() {
  const { showPage, showToast } = useApp();
  const [section, setSection] = useState('orders');

  const ORDERS = [
    { id:'TRS-2025-4821', status:'في الطريق', statusColor:'#0284c7', statusBg:'#dbeafe', date:'8 أبريل 2025', items:2, total:5400 },
    { id:'TRS-2025-3190', status:'تم التوصيل', statusColor:'#1a7c2e', statusBg:'#edf7f0', date:'1 أبريل 2025', items:1, total:2500 },
    { id:'TRS-2025-2847', status:'قيد التجهيز', statusColor:'#f59e0b', statusBg:'#fef3c7', date:'28 مارس 2025', items:3, total:12300 },
  ];

  const sections: Record<string, React.ReactNode> = {
    orders: (
      <div>
        <h2 style={{ fontSize:'17px', fontWeight:800, marginBottom:'16px' }}>📦 طلباتي</h2>
        {ORDERS.map(o => (
          <div key={o.id} style={{ background:'white', borderRadius:'12px', padding:'16px', marginBottom:'10px', border:'1px solid #eef0f3', display:'flex', alignItems:'center', gap:'14px' }}>
            <div style={{ width:'44px', height:'44px', background:o.statusBg, borderRadius:'10px', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'22px', flexShrink:0 }}>📦</div>
            <div style={{ flex:1 }}>
              <div style={{ fontWeight:700, fontSize:'14px' }}>{o.id}</div>
              <div style={{ fontSize:'12px', color:'#6b7280', marginTop:'2px' }}>{o.date} · {o.items} منتج</div>
            </div>
            <div style={{ textAlign:'left' }}>
              <span style={{ background:o.statusBg, color:o.statusColor, padding:'3px 10px', borderRadius:'99px', fontSize:'12px', fontWeight:700, display:'block', marginBottom:'4px' }}>{o.status}</span>
              <div style={{ fontSize:'15px', fontWeight:900, color:'#145c22' }}>{formatPrice(o.total)}</div>
            </div>
          </div>
        ))}
      </div>
    ),
    wishlist: (
      <div style={{ textAlign:'center', padding:'40px', color:'#6b7280' }}>
        <div style={{ fontSize:'48px', marginBottom:'12px' }}>❤️</div>
        <button onClick={() => showPage('wishlist')} style={{ padding:'10px 24px', background:'#1a7c2e', color:'white', border:'none', borderRadius:'8px', fontFamily:'Cairo,sans-serif', fontSize:'13px', fontWeight:700, cursor:'pointer' }}>عرض المفضلة</button>
      </div>
    ),
    wallet: (
      <div>
        <h2 style={{ fontSize:'17px', fontWeight:800, marginBottom:'16px' }}>💰 محفظتي</h2>
        <div style={{ background:'linear-gradient(135deg,#145c22,#1a7c2e)', borderRadius:'14px', padding:'32px', color:'white', marginBottom:'20px', textAlign:'center' }}>
          <div style={{ fontSize:'13px', opacity:0.8, marginBottom:'6px' }}>الرصيد المتاح</div>
          <div style={{ fontSize:'40px', fontWeight:900 }}>12,500 دج</div>
          <div style={{ display:'flex', gap:'12px', justifyContent:'center', marginTop:'16px' }}>
            <button onClick={() => showToast('إيداع قريباً','info')} style={{ background:'rgba(255,255,255,0.2)', border:'none', color:'white', padding:'9px 20px', borderRadius:'8px', fontFamily:'Cairo,sans-serif', fontSize:'13px', fontWeight:700, cursor:'pointer' }}>إيداع</button>
            <button onClick={() => showToast('سحب قريباً','info')} style={{ background:'rgba(255,255,255,0.2)', border:'none', color:'white', padding:'9px 20px', borderRadius:'8px', fontFamily:'Cairo,sans-serif', fontSize:'13px', fontWeight:700, cursor:'pointer' }}>سحب</button>
          </div>
        </div>
      </div>
    ),
    messages: (
      <div>
        <h2 style={{ fontSize:'17px', fontWeight:800, marginBottom:'16px' }}>💬 الرسائل</h2>
        {[
          { name:'StyleHub', av:'S', color:'#1565c0', msg:'شكراً لتسوقك معنا! كيف يمكنني مساعدتك؟', time:'10:30', unread:2 },
          { name:'TechStore DZ', av:'T', color:'#2e7d32', msg:'تم تأكيد طلبك وسيصل خلال يومين.', time:'أمس', unread:0 },
        ].map((m,i) => (
          <div key={i} style={{ background:'white', borderRadius:'12px', padding:'14px', marginBottom:'10px', border:'1px solid #eef0f3', display:'flex', alignItems:'center', gap:'14px', cursor:'pointer' }} onClick={() => showToast(`فتح محادثة ${m.name}`,'info')}>
            <div style={{ width:'44px', height:'44px', borderRadius:'50%', background:m.color, display:'flex', alignItems:'center', justifyContent:'center', color:'white', fontWeight:700, fontSize:'16px' }}>{m.av}</div>
            <div style={{ flex:1 }}>
              <div style={{ fontWeight:700 }}>{m.name}</div>
              <div style={{ fontSize:'12px', color:'#6b7280' }}>{m.msg}</div>
            </div>
            <div style={{ textAlign:'left' }}>
              <div style={{ fontSize:'11px', color:'#6b7280' }}>{m.time}</div>
              {m.unread > 0 && <div style={{ background:'#1a7c2e', color:'white', fontSize:'10px', fontWeight:700, borderRadius:'50%', width:'18px', height:'18px', display:'flex', alignItems:'center', justifyContent:'center', margin:'4px 0 0 auto' }}>{m.unread}</div>}
            </div>
          </div>
        ))}
      </div>
    ),
    notifications: (
      <div>
        <h2 style={{ fontSize:'17px', fontWeight:800, marginBottom:'16px' }}>🔔 الإشعارات</h2>
        {[
          { icon:'📦', text:'طلبك TRS-2025-4821 في الطريق إليك', time:'منذ ساعة', unread:true },
          { icon:'⭐', text:'قيّم طلبك الأخير', time:'أمس', unread:true },
          { icon:'🎁', text:'عرض حصري - خصم 20% على الإلكترونيات', time:'منذ يومين', unread:false },
        ].map((n,i) => (
          <div key={i} style={{ display:'flex', alignItems:'flex-start', gap:'14px', padding:'14px', background: n.unread?'#edf7f0':'white', border:'1px solid #eef0f3', borderRadius:'10px', marginBottom:'8px' }}>
            <span style={{ fontSize:'28px' }}>{n.icon}</span>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:'14px', fontWeight: n.unread?700:500 }}>{n.text}</div>
              <div style={{ fontSize:'12px', color:'#6b7280', marginTop:'3px' }}>{n.time}</div>
            </div>
          </div>
        ))}
      </div>
    ),
    addresses: (
      <div>
        <h2 style={{ fontSize:'17px', fontWeight:800, marginBottom:'16px' }}>📍 عناويني</h2>
        <div style={{ background:'white', borderRadius:'12px', padding:'16px', border:'1px solid #eef0f3' }}>
          <div style={{ display:'flex', alignItems:'center', gap:'8px', marginBottom:'10px' }}>
            <span style={{ fontSize:'20px' }}>🏠</span>
            <span style={{ fontWeight:700 }}>المنزل</span>
            <span style={{ background:'#edf7f0', color:'#1a7c2e', padding:'2px 8px', borderRadius:'99px', fontSize:'11px', fontWeight:700, marginRight:'auto' }}>افتراضي</span>
          </div>
          <p style={{ fontSize:'13px', color:'#6b7280', lineHeight:1.6 }}>حي المدينة الجديدة، شارع الاستقلال، الجزائر العاصمة</p>
          <button onClick={() => showToast('تعديل العنوان قريباً','info')} style={{ padding:'6px 12px', background:'#f4f6f8', border:'1px solid #dde1e7', borderRadius:'6px', cursor:'pointer', fontFamily:'Cairo,sans-serif', fontSize:'12px', marginTop:'10px' }}>تعديل</button>
        </div>
      </div>
    ),
    profile: (
      <div style={{ maxWidth:'440px' }}>
        <h2 style={{ fontSize:'17px', fontWeight:800, marginBottom:'16px' }}>✏️ تعديل الملف</h2>
        {[
          { label:'الاسم الكامل', type:'text', val:'أحمد بن علي' },
          { label:'البريد الإلكتروني', type:'email', val:'ahmed@gmail.com' },
          { label:'رقم الهاتف', type:'tel', val:'06 12 34 56 78' },
        ].map((f,i) => (
          <div key={i} style={{ marginBottom:'14px' }}>
            <label style={{ display:'block', fontSize:'13px', fontWeight:700, marginBottom:'6px', color:'#374151' }}>{f.label}</label>
            <input type={f.type} defaultValue={f.val} style={{ width:'100%', padding:'10px 12px', border:'1px solid #dde1e7', borderRadius:'8px', fontFamily:'Cairo,sans-serif', fontSize:'13px', outline:'none', boxSizing:'border-box' }} />
          </div>
        ))}
        <button onClick={() => showToast('تم حفظ التغييرات!','success')} style={{ width:'100%', padding:'11px', background:'#1a7c2e', color:'white', border:'none', borderRadius:'8px', fontFamily:'Cairo,sans-serif', fontSize:'14px', fontWeight:700, cursor:'pointer' }}>💾 حفظ التغييرات</button>
      </div>
    ),
  };

  const navItems = [
    { id:'orders', icon:'📦', label:'طلباتي', badge:'3' },
    { id:'wishlist', icon:'❤️', label:'المفضلة' },
    { id:'messages', icon:'💬', label:'الرسائل', badge:'2', red:true },
    { id:'wallet', icon:'💰', label:'محفظتي' },
    { id:'addresses', icon:'📍', label:'عناويني' },
    { id:'notifications', icon:'🔔', label:'الإشعارات' },
    { id:'profile', icon:'✏️', label:'تعديل الملف' },
  ];

  return (
    <div>
      <div style={{ padding:'14px 24px', background:'white', borderBottom:'1px solid #eef0f3' }}>
        <h1 style={{ fontSize:'18px', fontWeight:800 }}>👤 حسابي</h1>
      </div>
      <div style={{ display:'flex', gap:'20px', padding:'20px 24px', alignItems:'flex-start' }}>
        {/* الشريط الجانبي */}
        <div style={{ width:'240px', flexShrink:0 }}>
          <div style={{ background:'white', borderRadius:'12px', padding:'20px', textAlign:'center', marginBottom:'12px', border:'1px solid #eef0f3' }}>
            <div style={{ width:'64px', height:'64px', background:'#1a7c2e', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'28px', fontWeight:800, color:'white', margin:'0 auto 12px' }}>أ</div>
            <div style={{ fontWeight:800, fontSize:'16px' }}>أحمد بن علي</div>
            <div style={{ fontSize:'13px', color:'#6b7280', margin:'4px 0 8px' }}>ahmed@gmail.com</div>
            <div style={{ background:'#edf7f0', padding:'6px 12px', borderRadius:'99px', fontSize:'12px', color:'#1a7c2e', fontWeight:700, display:'inline-block' }}>🛡️ Trust Score: 4.8 / 5</div>
          </div>
          <div style={{ background:'white', borderRadius:'12px', overflow:'hidden', border:'1px solid #eef0f3' }}>
            {navItems.map(item => (
              <div key={item.id} onClick={() => setSection(item.id)} style={{ display:'flex', alignItems:'center', gap:'10px', padding:'12px 16px', cursor:'pointer', background: section===item.id?'#edf7f0':'white', color: section===item.id?'#1a7c2e':'#374151', fontWeight: section===item.id?700:500, borderRight:`3px solid ${section===item.id?'#1a7c2e':'transparent'}`, fontSize:'14px', transition:'all 0.2s' }}>
                <span>{item.icon}</span>
                <span style={{ flex:1 }}>{item.label}</span>
                {item.badge && <span style={{ background: item.red?'#fee2e2':'#edf7f0', color: item.red?'#d32f2f':'#1a7c2e', fontSize:'11px', fontWeight:800, padding:'2px 7px', borderRadius:'99px' }}>{item.badge}</span>}
              </div>
            ))}
            <div onClick={() => showToast('تم تسجيل الخروج','success')} style={{ display:'flex', alignItems:'center', gap:'10px', padding:'12px 16px', cursor:'pointer', color:'#d32f2f', fontWeight:500, fontSize:'14px', borderTop:'1px solid #eef0f3' }}>
              🚪 تسجيل الخروج
            </div>
          </div>
        </div>
        {/* المحتوى */}
        <div style={{ flex:1 }}>{sections[section] || sections['orders']}</div>
      </div>
    </div>
  );
}

/* ===== SELLER REGISTER ===== */
export function SellerRegister() {
  const { showPage, showToast } = useApp();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [form, setForm] = useState({ storeName:'', fullName:'', phone:'', email:'', category:'electronics', password:'' });

  const handleSubmit = async () => {
    if (!form.storeName || !form.email || !form.password) { showToast('يرجى ملء كل الحقول','warning'); return; }
    if (!form.email.includes('@')) { showToast('البريد الإلكتروني غير صحيح','error'); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 1200));
    setLoading(false);
    setSuccess(true);
    showToast('تم إرسال طلب التسجيل! سنتواصل خلال 24 ساعة','success','🎉');
    setTimeout(() => showPage('home'), 2500);
  };

  if (success) return (
    <div style={{ textAlign:'center', padding:'60px 24px' }}>
      <div style={{ fontSize:'72px', marginBottom:'16px' }}>🎉</div>
      <h2 style={{ fontSize:'24px', fontWeight:900, color:'#145c22', marginBottom:'8px' }}>تم التسجيل بنجاح!</h2>
      <p style={{ color:'#6b7280' }}>سنتواصل معك خلال 24 ساعة لتفعيل متجرك</p>
    </div>
  );

  return (
    <div>
      <div style={{ padding:'14px 24px', background:'white', borderBottom:'1px solid #eef0f3' }}>
        <h1 style={{ fontSize:'18px', fontWeight:800 }}>🏪 تسجيل كبائع</h1>
      </div>
      <div style={{ maxWidth:'600px', margin:'0 auto', padding:'24px' }}>
        <div style={{ background:'white', borderRadius:'14px', padding:'28px', border:'1px solid #eef0f3' }}>
          <div style={{ textAlign:'center', marginBottom:'24px' }}>
            <div style={{ fontSize:'56px', marginBottom:'12px' }}>🚀</div>
            <h2 style={{ fontSize:'22px', fontWeight:900, marginBottom:'6px' }}>ابدأ البيع على ترسترا</h2>
            <p style={{ color:'#6b7280', fontSize:'14px' }}>وصل لآلاف المشترين في الجزائر</p>
          </div>

          <div style={{ marginBottom:'14px' }}>
            <label style={{ display:'block', fontSize:'13px', fontWeight:700, marginBottom:'6px', color:'#374151' }}>اسم المتجر</label>
            <input type="text" placeholder="مثال: Tech Store DZ" value={form.storeName} onChange={e => setForm(f=>({...f,storeName:e.target.value}))} style={{ width:'100%', padding:'10px 12px', border:'1px solid #dde1e7', borderRadius:'8px', fontFamily:'Cairo,sans-serif', fontSize:'13px', outline:'none', boxSizing:'border-box' }} />
          </div>

          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'14px', marginBottom:'14px' }}>
            <div>
              <label style={{ display:'block', fontSize:'13px', fontWeight:700, marginBottom:'6px', color:'#374151' }}>الاسم الكامل</label>
              <input type="text" placeholder="اسمك الكامل" value={form.fullName} onChange={e => setForm(f=>({...f,fullName:e.target.value}))} style={{ width:'100%', padding:'10px 12px', border:'1px solid #dde1e7', borderRadius:'8px', fontFamily:'Cairo,sans-serif', fontSize:'13px', outline:'none', boxSizing:'border-box' }} />
            </div>
            <div>
              <label style={{ display:'block', fontSize:'13px', fontWeight:700, marginBottom:'6px', color:'#374151' }}>رقم الهاتف</label>
              <input type="tel" placeholder="06 XX XX XX XX" value={form.phone} onChange={e => setForm(f=>({...f,phone:e.target.value}))} style={{ width:'100%', padding:'10px 12px', border:'1px solid #dde1e7', borderRadius:'8px', fontFamily:'Cairo,sans-serif', fontSize:'13px', outline:'none', boxSizing:'border-box' }} />
            </div>
          </div>

          <div style={{ marginBottom:'14px' }}>
            <label style={{ display:'block', fontSize:'13px', fontWeight:700, marginBottom:'6px', color:'#374151' }}>البريد الإلكتروني</label>
            <input type="email" placeholder="email@example.com" value={form.email} onChange={e => setForm(f=>({...f,email:e.target.value}))} style={{ width:'100%', padding:'10px 12px', border:'1px solid #dde1e7', borderRadius:'8px', fontFamily:'Cairo,sans-serif', fontSize:'13px', outline:'none', boxSizing:'border-box' }} />
          </div>

          <div style={{ marginBottom:'14px' }}>
            <label style={{ display:'block', fontSize:'13px', fontWeight:700, marginBottom:'6px', color:'#374151' }}>قسم المنتجات</label>
            <select value={form.category} onChange={e => setForm(f=>({...f,category:e.target.value}))} style={{ width:'100%', padding:'10px 12px', border:'1px solid #dde1e7', borderRadius:'8px', fontFamily:'Cairo,sans-serif', fontSize:'13px', outline:'none', background:'white', boxSizing:'border-box' }}>
              <option value="electronics">إلكترونيات</option>
              <option value="fashion">أزياء</option>
              <option value="home">منزل</option>
              <option value="beauty">جمال</option>
              <option value="sports">رياضة</option>
              <option value="other">أخرى</option>
            </select>
          </div>

          <div style={{ marginBottom:'20px' }}>
            <label style={{ display:'block', fontSize:'13px', fontWeight:700, marginBottom:'6px', color:'#374151' }}>كلمة المرور</label>
            <input type="password" placeholder="••••••••" value={form.password} onChange={e => setForm(f=>({...f,password:e.target.value}))} style={{ width:'100%', padding:'10px 12px', border:'1px solid #dde1e7', borderRadius:'8px', fontFamily:'Cairo,sans-serif', fontSize:'13px', outline:'none', boxSizing:'border-box' }} />
          </div>

          <button onClick={handleSubmit} disabled={loading} style={{ width:'100%', padding:'13px', background: loading?'#6b7280':'#1a7c2e', color:'white', border:'none', borderRadius:'8px', fontFamily:'Cairo,sans-serif', fontSize:'15px', fontWeight:800, cursor: loading?'not-allowed':'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:'8px' }}>
            {loading ? '⏳ جاري التسجيل...' : '🏪 إنشاء حساب البائع'}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ===== NOT FOUND ===== */
export function NotFound() {
  const { showPage } = useApp();
  return (
    <div style={{ textAlign:'center', padding:'80px 24px' }}>
      <div style={{ fontSize:'80px', marginBottom:'16px' }}>🔍</div>
      <h1 style={{ fontSize:'32px', fontWeight:900, marginBottom:'8px', color:'#145c22' }}>404</h1>
      <p style={{ color:'#6b7280', marginBottom:'24px' }}>الصفحة التي تبحث عنها غير موجودة</p>
      <button onClick={() => showPage('home')} style={{ padding:'12px 32px', background:'#1a7c2e', color:'white', border:'none', borderRadius:'8px', fontFamily:'Cairo,sans-serif', fontSize:'14px', fontWeight:700, cursor:'pointer' }}>
        🏠 العودة للرئيسية
      </button>
    </div>
  );
}
