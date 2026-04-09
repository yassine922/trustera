import { useState, useEffect } from "react";

// ===== DATA =====
const PRODUCTS = [
  { id:1, name:"تيشيرت صيفي قطن 100%", cat:"fashion", catLabel:"أزياء", price:1800, oldPrice:2500, discount:28, seller:"StyleHub", sellerId:1, rating:4.6, reviews:238, stock:45, isNew:false, isFeatured:true, isFast:true, emoji:"👕", colors:["#212121","#ffffff","#1565c0","#2e7d32"], sizes:["S","M","L","XL","XXL"], desc:"تيشيرت صيفي مصنوع من أجود أنواع القطن الطبيعي 100%، يمنحك الراحة والأناقة.", bg:"gradient-pink", sold:1200 },
  { id:2, name:"سماعات بلوتوث لاسلكية Pro", cat:"electronics", catLabel:"إلكترونيات", price:2500, oldPrice:3800, discount:34, seller:"TechStore DZ", sellerId:2, rating:4.8, reviews:412, stock:23, isNew:true, isFeatured:true, isFast:true, emoji:"🎧", colors:["#212121","#c62828","#1565c0"], sizes:[], desc:"سماعات بلوتوث لاسلكية بجودة صوت استثنائية، إلغاء ضوضاء، وعمر بطارية 40 ساعة.", bg:"gradient-blue", sold:800 },
  { id:3, name:"حذاء رياضي أبيض كلاسيك", cat:"fashion", catLabel:"أزياء", price:3500, oldPrice:4500, discount:22, seller:"ShoesWorld", sellerId:3, rating:4.4, reviews:156, stock:12, isNew:false, isFeatured:true, isFast:false, emoji:"👟", colors:["#ffffff","#212121","#c62828"], sizes:["38","39","40","41","42","43","44"], desc:"حذاء رياضي كلاسيكي بتصميم عصري مناسب للرياضة والاستخدام اليومي.", bg:"gradient-green", sold:600 },
  { id:4, name:"ساعة ذكية Smart Watch Pro", cat:"electronics", catLabel:"إلكترونيات", price:8900, oldPrice:12000, discount:26, seller:"TechStore DZ", sellerId:2, rating:4.7, reviews:89, stock:8, isNew:true, isFeatured:true, isFast:true, emoji:"⌚", colors:["#212121","#b0bec5","#ffd54f"], sizes:[], desc:"ساعة ذكية بشاشة AMOLED، رصد الصحة، GPS مدمج، ومقاومة للماء.", bg:"gradient-yellow", sold:400 },
  { id:5, name:"هودي أخضر Premium", cat:"fashion", catLabel:"أزياء", price:3200, oldPrice:4000, discount:20, seller:"StyleHub", sellerId:1, rating:4.3, reviews:73, stock:30, isNew:true, isFeatured:false, isFast:false, emoji:"🧥", colors:["#2e7d32","#212121","#1565c0","#6a1b9a"], sizes:["S","M","L","XL","XXL"], desc:"هودي عالي الجودة من خليط القطن والبوليستر، مريح ومناسب للفصول الباردة.", bg:"gradient-teal", sold:300 },
  { id:6, name:"كاميرا رياضية 4K Ultra HD", cat:"electronics", catLabel:"إلكترونيات", price:15000, oldPrice:20000, discount:25, seller:"TechStore DZ", sellerId:2, rating:4.9, reviews:204, stock:5, isNew:true, isFeatured:false, isFast:true, emoji:"📷", colors:["#212121"], sizes:[], desc:"كاميرا رياضية 4K مقاومة للماء، استقرار فيديو متقدم.", bg:"gradient-blue", sold:200 },
  { id:7, name:"مجموعة عناية بالبشرة طبيعية", cat:"beauty", catLabel:"جمال وعناية", price:2800, oldPrice:3500, discount:20, seller:"BeautyZone", sellerId:4, rating:4.5, reviews:167, stock:40, isNew:false, isFeatured:true, isFast:false, emoji:"🧴", colors:[], sizes:[], desc:"مجموعة عناية شاملة تحتوي على غسول وكريم مرطب وسيروم بمكونات طبيعية.", bg:"gradient-purple", sold:500 },
  { id:8, name:"هاتف ذكي Android 256GB", cat:"electronics", catLabel:"إلكترونيات", price:45000, oldPrice:55000, discount:18, seller:"TechStore DZ", sellerId:2, rating:4.6, reviews:332, stock:15, isNew:true, isFeatured:true, isFast:true, emoji:"📱", colors:["#212121","#ffd54f","#1565c0"], sizes:["128GB","256GB","512GB"], desc:"هاتف ذكي بكاميرا 108MP، بطارية 5000mAh، شاشة AMOLED 6.7 بوصة.", bg:"gradient-blue", sold:1000 },
];

const SELLERS = [
  { id:1, name:"StyleHub", av:"S", avColor:"#1565c0", rating:4.8, reviews:1240, verified:true },
  { id:2, name:"TechStore DZ", av:"T", avColor:"#2e7d32", rating:4.9, reviews:3200, verified:true },
  { id:3, name:"ShoesWorld", av:"W", avColor:"#6a1b9a", rating:4.5, reviews:890, verified:true },
  { id:4, name:"BeautyZone", av:"B", avColor:"#c62828", rating:4.7, reviews:1100, verified:false },
  { id:5, name:"SportZone", av:"Z", avColor:"#e65100", rating:4.4, reviews:670, verified:true },
];

const CATEGORIES = [
  { id:"all", label:"الكل", emoji:"🛍️" },
  { id:"electronics", label:"إلكترونيات", emoji:"📱" },
  { id:"fashion", label:"أزياء", emoji:"👕" },
  { id:"beauty", label:"جمال", emoji:"🧴" },
  { id:"sports", label:"رياضة", emoji:"🏋️" },
  { id:"home", label:"منزل", emoji:"🏠" },
];

const bgMap: Record<string, string> = {
  "gradient-blue": "linear-gradient(135deg,#dbeafe,#bfdbfe)",
  "gradient-pink": "linear-gradient(135deg,#fce7f3,#fbcfe8)",
  "gradient-green": "linear-gradient(135deg,#dcfce7,#bbf7d0)",
  "gradient-yellow": "linear-gradient(135deg,#fef9c3,#fef08a)",
  "gradient-purple": "linear-gradient(135deg,#f3e8ff,#e9d5ff)",
  "gradient-teal": "linear-gradient(135deg,#ccfbf1,#99f6e4)",
};

function formatPrice(p: number) { return p.toLocaleString("ar-DZ") + " دج"; }
function stars(r: number) {
  return Array.from({length:5}).map((_,i) =>
    <span key={i} style={{color: i < Math.round(r) ? "#f59e0b" : "#d1d5db"}}>★</span>
  );
}

// ===== TOAST =====
function Toast({ toasts }: { toasts: {id:number,msg:string,type:string}[] }) {
  return (
    <div style={{position:"fixed",bottom:24,left:24,zIndex:9999,display:"flex",flexDirection:"column",gap:8}}>
      {toasts.map(t => (
        <div key={t.id} style={{
          background: t.type==="success"?"#1a7c2e":t.type==="error"?"#d32f2f":t.type==="warning"?"#f59e0b":"#0284c7",
          color:"white",padding:"10px 18px",borderRadius:10,fontSize:13,fontWeight:700,
          boxShadow:"0 4px 16px rgba(0,0,0,0.18)",display:"flex",alignItems:"center",gap:8,
          animation:"slideIn .2s ease"
        }}>
          {t.type==="success"?"✅":t.type==="error"?"❌":t.type==="warning"?"⚠️":"ℹ️"} {t.msg}
        </div>
      ))}
    </div>
  );
}

// ===== PRODUCT CARD =====
function ProductCard({ product, onAddToCart, onQuickView, onWishlist, wishlisted, onOpen }: any) {
  return (
    <div
      onClick={() => onOpen(product.id)}
      style={{
        background:"white",borderRadius:14,overflow:"hidden",
        boxShadow:"0 1px 3px rgba(0,0,0,0.08)",transition:"all .25s ease",
        border:"1px solid #eef0f3",cursor:"pointer",
      }}
      onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.boxShadow="0 8px 32px rgba(0,0,0,0.13)"; (e.currentTarget as HTMLDivElement).style.transform="translateY(-3px)"; }}
      onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.boxShadow="0 1px 3px rgba(0,0,0,0.08)"; (e.currentTarget as HTMLDivElement).style.transform="translateY(0)"; }}
    >
      <div style={{position:"relative",aspectRatio:"1",display:"flex",alignItems:"center",justifyContent:"center",background:bgMap[product.bg]||"#f4f6f8",fontSize:64}}>
        {product.emoji}
        <div style={{position:"absolute",top:8,left:8,display:"flex",flexDirection:"column",gap:4}}>
          <button onClick={e=>{e.stopPropagation();onWishlist(product.id);}} style={{width:32,height:32,borderRadius:"50%",background:"white",border:"none",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",fontSize:13,color:wishlisted?"#d32f2f":"#6b7280",boxShadow:"0 1px 3px rgba(0,0,0,0.1)"}}>♥</button>
          <button onClick={e=>{e.stopPropagation();onQuickView(product.id);}} style={{width:32,height:32,borderRadius:"50%",background:"white",border:"none",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",fontSize:13,color:"#6b7280",boxShadow:"0 1px 3px rgba(0,0,0,0.1)"}}>👁</button>
        </div>
        <div style={{position:"absolute",bottom:8,right:8,display:"flex",flexDirection:"column",gap:4,alignItems:"flex-end"}}>
          {product.discount > 0 && <span style={{background:"#d32f2f",color:"white",fontSize:11,fontWeight:700,padding:"2px 8px",borderRadius:99}}>-{product.discount}%</span>}
          {product.isNew && <span style={{background:"#edf7f0",color:"#1a7c2e",fontSize:11,fontWeight:700,padding:"2px 8px",borderRadius:99}}>جديد</span>}
          {product.isFast && <span style={{background:"#dbeafe",color:"#0284c7",fontSize:11,fontWeight:700,padding:"2px 8px",borderRadius:99}}>توصيل سريع</span>}
        </div>
      </div>
      <div style={{padding:"12px 12px 14px"}}>
        <div style={{fontSize:11,color:"#1a7c2e",fontWeight:600,marginBottom:4}}>{product.catLabel}</div>
        <div style={{fontSize:13.5,fontWeight:700,marginBottom:4,lineHeight:1.4,display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical",overflow:"hidden"}}>{product.name}</div>
        <div style={{fontSize:11.5,color:"#6b7280",marginBottom:6}}>🏪 {product.seller}</div>
        <div style={{display:"flex",alignItems:"center",gap:5,marginBottom:8}}>
          <span style={{fontSize:12}}>{stars(product.rating)}</span>
          <span style={{fontSize:12,fontWeight:700}}>{product.rating}</span>
          <span style={{fontSize:11,color:"#6b7280"}}>({product.reviews})</span>
        </div>
        <div style={{display:"flex",alignItems:"baseline",gap:8,flexWrap:"wrap"}}>
          <span style={{fontSize:16,fontWeight:900,color:"#145c22"}}>{formatPrice(product.price)}</span>
          {product.oldPrice && <span style={{fontSize:12,color:"#6b7280",textDecoration:"line-through"}}>{formatPrice(product.oldPrice)}</span>}
        </div>
        <div style={{fontSize:11,color:"#6b7280",marginTop:3}}>تم البيع: <span style={{color:"#1a7c2e",fontWeight:700}}>{(product.sold||0).toLocaleString()}</span> مرة</div>
        <button
          onClick={e=>{e.stopPropagation();onAddToCart(product);}}
          style={{width:"100%",marginTop:10,padding:8,background:"#edf7f0",color:"#1a7c2e",border:"1px solid #1a7c2e",borderRadius:7,fontFamily:"Cairo,sans-serif",fontSize:13,fontWeight:700,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:6,transition:"all .2s"}}
          onMouseEnter={e=>{(e.currentTarget as HTMLButtonElement).style.background="#1a7c2e";(e.currentTarget as HTMLButtonElement).style.color="white";}}
          onMouseLeave={e=>{(e.currentTarget as HTMLButtonElement).style.background="#edf7f0";(e.currentTarget as HTMLButtonElement).style.color="#1a7c2e";}}
        >🛒 أضف للسلة</button>
      </div>
    </div>
  );
}

// ===== QUICK VIEW MODAL =====
function QuickViewModal({ product, onClose, onAddToCart }: any) {
  if (!product) return null;
  return (
    <div onClick={onClose} style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.5)",zIndex:1000,display:"flex",alignItems:"center",justifyContent:"center",padding:16}}>
      <div onClick={e=>e.stopPropagation()} style={{background:"white",borderRadius:16,width:"100%",maxWidth:700,overflow:"hidden",boxShadow:"0 8px 32px rgba(0,0,0,0.2)"}}>
        <div style={{padding:"14px 20px",borderBottom:"1px solid #eef0f3",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <span style={{fontSize:16,fontWeight:800}}>عرض سريع</span>
          <button onClick={onClose} style={{background:"none",border:"none",fontSize:20,cursor:"pointer",color:"#6b7280"}}>✕</button>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:20,padding:20}}>
          <div style={{background:bgMap[product.bg]||"#f4f6f8",borderRadius:12,aspectRatio:"1",display:"flex",alignItems:"center",justifyContent:"center",fontSize:100}}>{product.emoji}</div>
          <div>
            <div style={{fontSize:12,color:"#1a7c2e",fontWeight:700,marginBottom:6}}>{product.catLabel}</div>
            <h3 style={{fontSize:18,fontWeight:900,marginBottom:8}}>{product.name}</h3>
            <div style={{marginBottom:8,display:"flex",alignItems:"center",gap:5}}>{stars(product.rating)} <span style={{fontSize:12,color:"#6b7280"}}>({product.reviews})</span></div>
            <div style={{fontSize:22,fontWeight:900,color:"#145c22",marginBottom:4}}>{formatPrice(product.price)} {product.oldPrice&&<span style={{fontSize:13,color:"#6b7280",textDecoration:"line-through"}}>{formatPrice(product.oldPrice)}</span>}</div>
            <p style={{fontSize:13,color:"#374151",lineHeight:1.6,marginBottom:14}}>{product.desc}</p>
            <div style={{display:"flex",gap:8}}>
              <button onClick={()=>{onAddToCart(product);onClose();}} style={{flex:1,padding:10,background:"#1a7c2e",color:"white",border:"none",borderRadius:8,fontFamily:"Cairo,sans-serif",fontSize:13,fontWeight:800,cursor:"pointer"}}>🛒 أضف للسلة</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ===== AUTH MODAL =====
function AuthModal({ onClose, onLogin }: any) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    setError("");
    if (!email || !password) { setError("يرجى ملء جميع الحقول"); return; }
    setLoading(true);
    try {
      const endpoint = isRegister ? "/auth/register" : "/auth/login";
      const body = isRegister ? { name, email, password } : { email, password };
      const res = await fetch(`${import.meta.env.VITE_API_URL}${endpoint}`, {
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.message || "حدث خطأ"); return; }
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      onLogin(data.user);
      onClose();
    } catch {
      setError("تعذر الاتصال بالخادم");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div onClick={onClose} style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.5)",zIndex:1000,display:"flex",alignItems:"center",justifyContent:"center",padding:16}}>
      <div onClick={e=>e.stopPropagation()} style={{background:"white",borderRadius:16,width:"100%",maxWidth:420,overflow:"hidden",boxShadow:"0 8px 32px rgba(0,0,0,0.2)"}}>
        <div style={{padding:"14px 20px",borderBottom:"1px solid #eef0f3",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <span style={{fontSize:16,fontWeight:800}}>{isRegister?"إنشاء حساب":"تسجيل الدخول"}</span>
          <button onClick={onClose} style={{background:"none",border:"none",fontSize:20,cursor:"pointer",color:"#6b7280"}}>✕</button>
        </div>
        <div style={{padding:20}}>
          {error && <div style={{background:"#fee2e2",color:"#d32f2f",padding:"10px 14px",borderRadius:8,marginBottom:12,fontSize:13}}>{error}</div>}
          {isRegister && (
            <div style={{marginBottom:12}}>
              <label style={{fontSize:13,fontWeight:700,display:"block",marginBottom:5}}>الاسم الكامل</label>
              <input value={name} onChange={e=>setName(e.target.value)} type="text" placeholder="اسمك الكامل" style={{width:"100%",padding:"10px 12px",border:"1px solid #dde1e7",borderRadius:8,fontFamily:"Cairo,sans-serif",fontSize:14,outline:"none"}} />
            </div>
          )}
          <div style={{marginBottom:12}}>
            <label style={{fontSize:13,fontWeight:700,display:"block",marginBottom:5}}>البريد الإلكتروني</label>
            <input value={email} onChange={e=>setEmail(e.target.value)} type="email" placeholder="email@example.com" style={{width:"100%",padding:"10px 12px",border:"1px solid #dde1e7",borderRadius:8,fontFamily:"Cairo,sans-serif",fontSize:14,outline:"none"}} />
          </div>
          <div style={{marginBottom:16}}>
            <label style={{fontSize:13,fontWeight:700,display:"block",marginBottom:5}}>كلمة المرور</label>
            <input value={password} onChange={e=>setPassword(e.target.value)} type="password" placeholder="••••••••" style={{width:"100%",padding:"10px 12px",border:"1px solid #dde1e7",borderRadius:8,fontFamily:"Cairo,sans-serif",fontSize:14,outline:"none"}} />
          </div>
          <button onClick={handleSubmit} disabled={loading} style={{width:"100%",padding:"12px",background:"#1a7c2e",color:"white",border:"none",borderRadius:8,fontFamily:"Cairo,sans-serif",fontSize:15,fontWeight:800,cursor:"pointer",opacity:loading?0.7:1}}>
            {loading?"جاري...":(isRegister?"إنشاء حساب":"دخول")}
          </button>
          <div style={{textAlign:"center",marginTop:14,fontSize:13,color:"#6b7280"}}>
            {isRegister?"لديك حساب؟":"ليس لديك حساب؟"}{" "}
            <span onClick={()=>setIsRegister(!isRegister)} style={{color:"#1a7c2e",fontWeight:700,cursor:"pointer"}}>{isRegister?"تسجيل الدخول":"إنشاء حساب"}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ===== MAIN HOME COMPONENT =====
export default function Home() {
  const [page, setPage] = useState<"home"|"categories"|"product"|"cart"|"wishlist"|"seller-register">("home");
  const [currentProduct, setCurrentProduct] = useState<any>(null);
  const [cart, setCart] = useState<any[]>([]);
  const [wishlist, setWishlist] = useState<number[]>([]);
  const [searchQ, setSearchQ] = useState("");
  const [currentCat, setCurrentCat] = useState("all");
  const [quickViewProduct, setQuickViewProduct] = useState<any>(null);
  const [showAuth, setShowAuth] = useState(false);
  const [user, setUser] = useState<any>(() => { try { return JSON.parse(localStorage.getItem("user")||"null"); } catch { return null; } });
  const [toasts, setToasts] = useState<{id:number,msg:string,type:string}[]>([]);
  const [countdown, setCountdown] = useState({h:"00",m:"00",s:"00"});
  const [trackInput, setTrackInput] = useState("TRS-2025-");

  // countdown
  useEffect(() => {
    const tick = () => {
      const now = new Date();
      const end = new Date(now.getFullYear(),now.getMonth(),now.getDate(),23,59,59);
      const diff = +end - +now;
      if(diff<=0) return;
      const h=Math.floor(diff/3600000), m=Math.floor((diff%3600000)/60000), s=Math.floor((diff%60000)/1000);
      setCountdown({h:String(h).padStart(2,"0"),m:String(m).padStart(2,"0"),s:String(s).padStart(2,"0")});
    };
    tick();
    const iv = setInterval(tick,1000);
    return ()=>clearInterval(iv);
  },[]);

  const showToast = (msg: string, type="success") => {
    const id = Date.now();
    setToasts(t=>[...t,{id,msg,type}]);
    setTimeout(()=>setToasts(t=>t.filter(x=>x.id!==id)),3200);
  };

  const addToCart = (product: any) => {
    setCart(prev => {
      const existing = prev.find(i=>i.id===product.id);
      if(existing) return prev.map(i=>i.id===product.id?{...i,qty:i.qty+1}:i);
      return [...prev,{...product,qty:1}];
    });
    showToast(`تمت إضافة ${product.name} للسلة`,"success");
  };

  const toggleWishlist = (id: number) => {
    setWishlist(prev => prev.includes(id) ? prev.filter(x=>x!==id) : [...prev,id]);
  };

  const openProduct = (id: number) => {
    const p = PRODUCTS.find(x=>x.id===id);
    if(p) { setCurrentProduct(p); setPage("product"); window.scrollTo({top:0,behavior:"smooth"}); }
  };

  const filteredProducts = currentCat==="all" ? PRODUCTS : PRODUCTS.filter(p=>p.cat===currentCat);
  const searchResults = searchQ ? PRODUCTS.filter(p=>p.name.includes(searchQ)||p.catLabel.includes(searchQ)||p.seller.includes(searchQ)) : [];

  const featured = PRODUCTS.filter(p=>p.isFeatured).slice(0,6);
  const newest = PRODUCTS.filter(p=>p.isNew).slice(0,6);

  const cartTotal = cart.reduce((s,i)=>s+i.price*i.qty,0);
  const cartCount = cart.reduce((s,i)=>s+i.qty,0);

  // ===== STYLES =====
  const S = {
    header: { position:"fixed" as const, top:0, right:0, left:0, zIndex:900, background:"#145c22", boxShadow:"0 2px 12px rgba(0,0,0,0.18)", fontFamily:"Cairo,sans-serif" },
    headerTop: { background:"#0f5120", padding:"6px 24px", display:"flex", alignItems:"center", justifyContent:"space-between", fontSize:12, color:"rgba(255,255,255,0.8)" },
    headerMain: { padding:"10px 24px", display:"flex", alignItems:"center", gap:16 },
    searchBar: { flex:1, display:"flex", alignItems:"center", background:"white", borderRadius:8, overflow:"hidden", maxWidth:680 },
    navBar: { background:"#1a7c2e", padding:"0 24px", display:"flex", alignItems:"center", overflowX:"auto" as const },
    navItem: (active:boolean) => ({ display:"flex",alignItems:"center",gap:7,padding:"10px 14px",color:active?"white":"rgba(255,255,255,0.85)",fontSize:13,fontWeight:600,cursor:"pointer",borderBottom:`3px solid ${active?"white":"transparent"}`,whiteSpace:"nowrap" as const,background:active?"rgba(255,255,255,0.08)":"transparent" }),
    sidebar: { width:210, flexShrink:0, background:"white", borderLeft:"1px solid #eef0f3", padding:"16px 0", position:"sticky" as const, top:112, height:"calc(100vh - 112px)", overflowY:"auto" as const },
    sidebarItem: (active:boolean) => ({ display:"flex",alignItems:"center",justifyContent:"space-between",padding:"10px 16px",cursor:"pointer",color:active?"#1a7c2e":"#374151",fontSize:13.5,fontWeight:600,background:active?"#edf7f0":"transparent",borderRight:`3px solid ${active?"#1a7c2e":"transparent"}` }),
    panel: { width:280, flexShrink:0, padding:16, borderRight:"1px solid #eef0f3" },
  };

  return (
    <div style={{fontFamily:"Cairo,sans-serif",direction:"rtl",background:"#f4f6f8",minHeight:"100vh"}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;500;600;700;800;900&display=swap');
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
        @keyframes slideIn { from{transform:translateX(20px);opacity:0} to{transform:translateX(0);opacity:1} }
        ::-webkit-scrollbar{width:5px} ::-webkit-scrollbar-thumb{background:#c5cad3;border-radius:10px}
        * { box-sizing: border-box; }
      `}</style>

      {/* HEADER */}
      <header style={S.header}>
        {/* Top bar */}
        <div style={S.headerTop}>
          <div style={{display:"flex",gap:20}}>
            <span>📞 دعم 24/7</span>
            <span>🚚 توصيل لجميع الولايات</span>
          </div>
          <div>🇩🇿 الجزائر | دج</div>
        </div>
        {/* Main bar */}
        <div style={S.headerMain}>
          <div onClick={()=>setPage("home")} style={{display:"flex",alignItems:"center",gap:10,cursor:"pointer",flexShrink:0}}>
            <div style={{width:38,height:38,background:"white",borderRadius:10,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,fontWeight:900,color:"#145c22"}}>ت</div>
            <span style={{fontSize:22,fontWeight:900,color:"white"}}>ترسترا</span>
          </div>
          <div style={S.searchBar}>
            <select style={{padding:"0 12px",height:42,border:"none",borderLeft:"1px solid #dde1e7",background:"#f4f6f8",fontSize:13,cursor:"pointer",fontFamily:"Cairo,sans-serif",fontWeight:600}}>
              {CATEGORIES.filter(c=>c.id!=="all").map(c=><option key={c.id}>{c.label}</option>)}
            </select>
            <input
              value={searchQ}
              onChange={e=>setSearchQ(e.target.value)}
              onKeyDown={e=>{if(e.key==="Enter"&&searchQ.trim()){setCurrentCat("all");setPage("categories");}}}
              type="text" placeholder="ابحث عن منتجات، بائعين..."
              style={{flex:1,height:42,border:"none",outline:"none",padding:"0 14px",fontFamily:"Cairo,sans-serif",fontSize:14}}
            />
            <button onClick={()=>{if(searchQ.trim()){setCurrentCat("all");setPage("categories");}}} style={{width:48,height:42,background:"#ff6b00",border:"none",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",color:"white",fontSize:16,flexShrink:0}}>🔍</button>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:6,flexShrink:0}}>
            <button onClick={()=>setPage("wishlist")} style={{display:"flex",flexDirection:"column",alignItems:"center",gap:2,padding:"6px 10px",border:"none",background:"transparent",cursor:"pointer",color:"rgba(255,255,255,0.85)",borderRadius:8}}>
              <span style={{fontSize:18}}>♥</span><span style={{fontSize:11,fontFamily:"Cairo,sans-serif",fontWeight:600}}>المفضلة</span>
            </button>
            <button onClick={()=>setPage("cart")} style={{display:"flex",flexDirection:"column",alignItems:"center",gap:2,padding:"6px 10px",border:"none",background:"transparent",cursor:"pointer",color:"rgba(255,255,255,0.85)",borderRadius:8,position:"relative"}}>
              {cartCount > 0 && <span style={{position:"absolute",top:2,right:4,background:"#ff6b00",color:"white",fontSize:10,fontWeight:800,width:18,height:18,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",border:"2px solid #145c22"}}>{cartCount}</span>}
              <span style={{fontSize:18}}>🛒</span><span style={{fontSize:11,fontFamily:"Cairo,sans-serif",fontWeight:600}}>السلة</span>
            </button>
            {user ? (
              <div style={{display:"flex",alignItems:"center",gap:8,padding:"6px 12px",background:"rgba(255,255,255,0.12)",borderRadius:8,cursor:"pointer",color:"white"}} onClick={()=>showToast("تم تسجيل الخروج","success")}>
                <div style={{width:32,height:32,borderRadius:"50%",background:"#ff6b00",display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,fontWeight:700}}>{user.name?.[0]||"م"}</div>
                <div>
                  <div style={{fontWeight:700,fontSize:13}}>{user.name}</div>
                  <div style={{color:"rgba(255,255,255,0.7)",fontSize:11}}>{user.email}</div>
                </div>
              </div>
            ) : (
              <button onClick={()=>setShowAuth(true)} style={{display:"flex",flexDirection:"column",alignItems:"center",gap:2,padding:"6px 10px",border:"none",background:"transparent",cursor:"pointer",color:"rgba(255,255,255,0.85)",borderRadius:8}}>
                <span style={{fontSize:18}}>👤</span><span style={{fontSize:11,fontFamily:"Cairo,sans-serif",fontWeight:600}}>دخول</span>
              </button>
            )}
          </div>
        </div>
        {/* Nav bar */}
        <nav style={S.navBar}>
          {[
            {id:"home",label:"🏠 الرئيسية"},
            {id:"categories",label:"🧩 الأقسام"},
            {id:"cart",label:"📦 طلباتي"},
            {id:"wishlist",label:"❤️ المفضلة"},
            {id:"seller-register",label:"🏪 سجّل كبائع",accent:true},
          ].map(n => (
            <div key={n.id} onClick={()=>setPage(n.id as any)} style={{...S.navItem(page===n.id),background:n.accent?"rgba(255,107,0,0.15)":S.navItem(page===n.id).background,color:n.accent?"#ffb060":S.navItem(page===n.id).color}}>
              {n.label}
            </div>
          ))}
        </nav>
      </header>

      {/* APP */}
      <div style={{paddingTop:112,minHeight:"100vh"}}>
        <div style={{display:"flex",minHeight:"calc(100vh - 112px)"}}>

          {/* SIDEBAR */}
          <aside style={S.sidebar}>
            <div style={{padding:"0 12px",marginBottom:10}}>
              <button onClick={()=>setPage("seller-register")} style={{width:"100%",padding:9,background:"#1a7c2e",color:"white",border:"none",borderRadius:10,fontFamily:"Cairo,sans-serif",fontSize:13,fontWeight:700,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:6}}>
                ➕ إضافة منتج
              </button>
            </div>
            {[
              {id:"home",label:"🏠 الرئيسية"},
              {id:"categories",label:"🧩 الأقسام"},
              {id:"cart",label:"📦 طلباتي",badge:cartCount||undefined},
              {id:"wishlist",label:"❤️ المفضلة",badge:wishlist.length||undefined},
            ].map(item => (
              <div key={item.id} onClick={()=>setPage(item.id as any)} style={S.sidebarItem(page===item.id)}>
                <span>{item.label}</span>
                {item.badge ? <span style={{background:"#1a7c2e",color:"white",fontSize:11,fontWeight:700,padding:"1px 7px",borderRadius:99}}>{item.badge}</span> : null}
              </div>
            ))}
            <div style={{margin:"12px 16px",height:1,background:"#eef0f3"}}/>
            <div style={{padding:"8px 16px",background:"#edf7f0",margin:"0 12px",borderRadius:10,border:"1px solid #c8e6c9"}}>
              <p style={{fontSize:12,color:"#374151",marginBottom:8}}>ابدأ البيع الآن ووصل لآلاف الزبائن</p>
              <button onClick={()=>setPage("seller-register")} style={{width:"100%",padding:"7px",background:"#1a7c2e",color:"white",border:"none",borderRadius:8,fontFamily:"Cairo,sans-serif",fontSize:12,fontWeight:700,cursor:"pointer"}}>🏪 تسجيل كبائع</button>
            </div>
          </aside>

          {/* MAIN */}
          <main style={{flex:1,minWidth:0}}>

            {/* ===== HOME PAGE ===== */}
            {page==="home" && (
              <div>
                {/* Hero */}
                <div style={{background:"linear-gradient(130deg,#0d4a1a 0%,#1a7c2e 50%,#2ea84a 100%)",padding:"40px 32px",color:"white",position:"relative",overflow:"hidden",minHeight:220,display:"flex",alignItems:"center"}}>
                  <div style={{flex:1,position:"relative",zIndex:1}}>
                    <div style={{display:"inline-flex",alignItems:"center",gap:6,background:"rgba(255,255,255,0.15)",borderRadius:99,padding:"4px 12px",fontSize:12,fontWeight:600,marginBottom:14,backdropFilter:"blur(4px)"}}>
                      ⚡ منصة جزائرية تجمع أفضل البائعين
                    </div>
                    <h1 style={{fontSize:32,fontWeight:900,lineHeight:1.25,marginBottom:10}}>تسوق بثقة.<br/><span style={{color:"#86efac"}}>بيع بسهولة.</span></h1>
                    <p style={{fontSize:14,color:"rgba(255,255,255,0.8)",marginBottom:22,maxWidth:400}}>اكتشف آلاف المنتجات بأفضل الأسعار مع ضمان الحماية الكاملة</p>
                    <div style={{display:"flex",gap:12}}>
                      <button onClick={()=>setPage("categories")} style={{padding:"11px 28px",background:"white",color:"#145c22",border:"none",borderRadius:8,fontFamily:"Cairo,sans-serif",fontSize:14,fontWeight:800,cursor:"pointer"}}>🛍️ تسوق الآن</button>
                      <button onClick={()=>setPage("seller-register")} style={{padding:"11px 28px",background:"rgba(255,255,255,0.15)",color:"white",border:"2px solid rgba(255,255,255,0.35)",borderRadius:8,fontFamily:"Cairo,sans-serif",fontSize:14,fontWeight:700,cursor:"pointer"}}>كيف تعمل المنصة؟</button>
                    </div>
                  </div>
                  <div style={{width:380,flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center",position:"relative",zIndex:1}}>
                    <div style={{width:200,height:200,borderRadius:"50%",background:"rgba(255,255,255,0.12)",border:"3px solid rgba(255,255,255,0.2)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:90,animation:"float 3s ease-in-out infinite"}}>🛍️</div>
                  </div>
                </div>
                {/* Trust badges */}
                <div style={{display:"flex",background:"rgba(0,0,0,0.2)",borderTop:"1px solid rgba(255,255,255,0.1)",background:"#0f5120"}}>
                  {[{icon:"🛡️",title:"دفع عند الاستلام",sub:"آمن 100%"},{icon:"⭐",title:"تقييمات موثوقة",sub:"من مشترين حقيقيين"},{icon:"🔄",title:"إرجاع مجاني",sub:"خلال 7 أيام"},{icon:"🎧",title:"دعم 24/7",sub:"دائماً معك"}].map((b,i)=>(
                    <div key={i} style={{flex:1,display:"flex",alignItems:"center",gap:10,padding:"12px 20px",borderLeft:i<3?"1px solid rgba(255,255,255,0.1)":"none",color:"rgba(255,255,255,0.85)",fontSize:12}}>
                      <span style={{fontSize:18,color:"#86efac"}}>{b.icon}</span>
                      <span>{b.title}<br/><strong style={{color:"white"}}>{b.sub}</strong></span>
                    </div>
                  ))}
                </div>

                {/* Top Products */}
                <div style={{padding:"24px 24px 0"}}>
                  <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:16}}>
                    <div style={{fontSize:17,fontWeight:800}}>🔥 الأكثر طلباً</div>
                    <span onClick={()=>setPage("categories")} style={{fontSize:13,color:"#1a7c2e",fontWeight:600,cursor:"pointer"}}>عرض الكل ›</span>
                  </div>
                  <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))",gap:14}}>
                    {featured.map((p,i) => (
                      <ProductCard key={i} product={p} onAddToCart={addToCart} onQuickView={id=>setQuickViewProduct(PRODUCTS.find(x=>x.id===id))} onWishlist={toggleWishlist} wishlisted={wishlist.includes(p.id)} onOpen={openProduct} />
                    ))}
                  </div>
                </div>

                {/* Deals Banner */}
                <div style={{margin:"24px 24px 0",background:"linear-gradient(130deg,#7c3aed,#4f46e5)",borderRadius:14,padding:"20px 28px",display:"flex",alignItems:"center",gap:16,color:"white"}}>
                  <span style={{fontSize:48}}>⚡</span>
                  <div style={{flex:1}}>
                    <div style={{fontSize:20,fontWeight:900,marginBottom:4}}>عروض اليوم — خصومات تصل إلى 40%</div>
                    <div style={{fontSize:13,color:"rgba(255,255,255,0.8)"}}>عروض حصرية على منتجات مختارة. لا تفوّتها!</div>
                    <div style={{display:"flex",gap:8,marginTop:10}}>
                      {[{val:countdown.h,label:"ساعة"},{val:countdown.m,label:"دقيقة"},{val:countdown.s,label:"ثانية"}].map((u,i)=>(
                        <div key={i} style={{background:"rgba(255,255,255,0.15)",borderRadius:8,padding:"6px 10px",textAlign:"center",minWidth:52}}>
                          <span style={{fontSize:20,fontWeight:900,display:"block"}}>{u.val}</span>
                          <span style={{fontSize:10,color:"rgba(255,255,255,0.7)"}}>{u.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <button onClick={()=>setPage("categories")} style={{padding:"10px 24px",background:"white",color:"#4f46e5",border:"none",borderRadius:8,fontFamily:"Cairo,sans-serif",fontSize:14,fontWeight:800,cursor:"pointer",whiteSpace:"nowrap"}}>🏷️ تصفح العروض</button>
                </div>

                {/* New Products */}
                <div style={{padding:"24px 24px 32px"}}>
                  <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:16}}>
                    <div style={{fontSize:17,fontWeight:800,display:"flex",alignItems:"center",gap:8}}><span style={{background:"#1a7c2e",color:"white",fontSize:11,padding:"2px 8px",borderRadius:99,fontWeight:700}}>NEW</span> منتجات جديدة</div>
                    <span onClick={()=>setPage("categories")} style={{fontSize:13,color:"#1a7c2e",fontWeight:600,cursor:"pointer"}}>عرض الكل ›</span>
                  </div>
                  <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))",gap:14}}>
                    {newest.map((p,i) => (
                      <ProductCard key={i} product={p} onAddToCart={addToCart} onQuickView={id=>setQuickViewProduct(PRODUCTS.find(x=>x.id===id))} onWishlist={toggleWishlist} wishlisted={wishlist.includes(p.id)} onOpen={openProduct} />
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ===== CATEGORIES PAGE ===== */}
            {page==="categories" && (
              <div style={{padding:24}}>
                <div style={{display:"flex",gap:8,marginBottom:20,flexWrap:"wrap"}}>
                  {CATEGORIES.map(c=>(
                    <button key={c.id} onClick={()=>setCurrentCat(c.id)} style={{padding:"7px 16px",borderRadius:99,border:`2px solid ${currentCat===c.id?"#1a7c2e":"#dde1e7"}`,background:currentCat===c.id?"#1a7c2e":"white",color:currentCat===c.id?"white":"#374151",fontFamily:"Cairo,sans-serif",fontSize:13,fontWeight:700,cursor:"pointer"}}>
                      {c.emoji} {c.label}
                    </button>
                  ))}
                </div>
                <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:16}}>
                  <div style={{fontSize:14,color:"#6b7280"}}>
                    {searchQ ? `نتائج "${searchQ}"` : CATEGORIES.find(c=>c.id===currentCat)?.label}
                    <span style={{marginRight:6,fontWeight:700,color:"#1a7c2e"}}>{(searchQ?searchResults:filteredProducts).length} منتج</span>
                  </div>
                </div>
                <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))",gap:14}}>
                  {(searchQ?searchResults:filteredProducts).length > 0 ? (searchQ?searchResults:filteredProducts).map((p,i)=>(
                    <ProductCard key={i} product={p} onAddToCart={addToCart} onQuickView={id=>setQuickViewProduct(PRODUCTS.find(x=>x.id===id))} onWishlist={toggleWishlist} wishlisted={wishlist.includes(p.id)} onOpen={openProduct} />
                  )) : (
                    <div style={{gridColumn:"1/-1",textAlign:"center",padding:60}}>
                      <div style={{fontSize:48,marginBottom:12}}>🔍</div>
                      <div style={{fontSize:18,fontWeight:700}}>لا توجد نتائج</div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ===== PRODUCT DETAIL PAGE ===== */}
            {page==="product" && currentProduct && (
              <div>
                <div style={{padding:"12px 24px",borderBottom:"1px solid #eef0f3",fontSize:12,color:"#6b7280",display:"flex",alignItems:"center",gap:6}}>
                  <span onClick={()=>setPage("home")} style={{color:"#1a7c2e",cursor:"pointer"}}>الرئيسية</span> ›
                  <span onClick={()=>setPage("categories")} style={{color:"#1a7c2e",cursor:"pointer"}}>{currentProduct.catLabel}</span> ›
                  <span>{currentProduct.name}</span>
                </div>
                <div style={{display:"flex",gap:24,padding:"20px 24px",flexWrap:"wrap"}}>
                  <div style={{width:400,flexShrink:0}}>
                    <div style={{background:bgMap[currentProduct.bg]||"#f4f6f8",borderRadius:14,aspectRatio:"1",display:"flex",alignItems:"center",justifyContent:"center",fontSize:130,border:"1px solid #eef0f3"}}>{currentProduct.emoji}</div>
                    <div style={{display:"flex",gap:8,marginTop:10,flexWrap:"wrap"}}>
                      {[0,1,2,3].map(i=>(
                        <div key={i} style={{width:72,height:72,borderRadius:8,border:"2px solid #dde1e7",background:bgMap[currentProduct.bg]||"#f4f6f8",display:"flex",alignItems:"center",justifyContent:"center",fontSize:28,cursor:"pointer"}}>{currentProduct.emoji}</div>
                      ))}
                    </div>
                  </div>
                  <div style={{flex:1,minWidth:0}}>
                    <h1 style={{fontSize:22,fontWeight:900,marginBottom:12,lineHeight:1.3}}>{currentProduct.name}</h1>
                    <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:14,flexWrap:"wrap"}}>
                      <span>{stars(currentProduct.rating)}</span>
                      <strong>{currentProduct.rating}</strong>
                      <span style={{color:"#6b7280",fontSize:13}}>({currentProduct.reviews} تقييم)</span>
                      {currentProduct.isNew && <span style={{background:"#edf7f0",color:"#1a7c2e",fontSize:11,fontWeight:700,padding:"2px 8px",borderRadius:99}}>جديد</span>}
                    </div>
                    <div style={{background:"#f4f6f8",borderRadius:10,padding:16,marginBottom:18,border:"1px solid #eef0f3"}}>
                      <div style={{display:"flex",alignItems:"baseline",gap:12,flexWrap:"wrap"}}>
                        <span style={{fontSize:28,fontWeight:900,color:"#145c22"}}>{formatPrice(currentProduct.price)}</span>
                        {currentProduct.oldPrice && <span style={{fontSize:16,color:"#6b7280",textDecoration:"line-through"}}>{formatPrice(currentProduct.oldPrice)}</span>}
                        {currentProduct.discount > 0 && <span style={{fontSize:11,fontWeight:700,color:"#d32f2f",background:"#fee2e2",padding:"2px 6px",borderRadius:99}}>خصم {currentProduct.discount}%</span>}
                      </div>
                      <div style={{fontSize:12,color:"#374151",marginTop:8,display:"flex",gap:16,flexWrap:"wrap"}}>
                        <span>🚚 توصيل: 2-5 أيام عمل</span>
                        <span>💵 دفع عند الاستلام</span>
                        <span>🔄 إرجاع مجاني 7 أيام</span>
                      </div>
                    </div>
                    <p style={{fontSize:13,color:"#374151",lineHeight:1.6,marginBottom:18}}>{currentProduct.desc}</p>
                    <div style={{display:"flex",gap:10,marginBottom:14}}>
                      <button onClick={()=>addToCart(currentProduct)} style={{flex:1,padding:13,background:"#1a7c2e",color:"white",border:"none",borderRadius:8,fontFamily:"Cairo,sans-serif",fontSize:15,fontWeight:800,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>🛒 أضف للسلة</button>
                      <button onClick={()=>toggleWishlist(currentProduct.id)} style={{flex:1,padding:13,background:"white",color:"#1a7c2e",border:`2px solid #1a7c2e`,borderRadius:8,fontFamily:"Cairo,sans-serif",fontSize:15,fontWeight:800,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>{wishlist.includes(currentProduct.id)?"❤️":"🤍"} المفضلة</button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ===== CART PAGE ===== */}
            {page==="cart" && (
              <div style={{padding:24}}>
                <h2 style={{fontSize:18,fontWeight:800,marginBottom:16}}>🛒 سلة المشتريات</h2>
                {cart.length===0 ? (
                  <div style={{textAlign:"center",padding:60}}>
                    <div style={{fontSize:64,marginBottom:12}}>🛒</div>
                    <div style={{fontSize:18,fontWeight:700,marginBottom:8}}>سلتك فارغة</div>
                    <button onClick={()=>setPage("categories")} style={{padding:"10px 24px",background:"#1a7c2e",color:"white",border:"none",borderRadius:8,fontFamily:"Cairo,sans-serif",fontSize:14,fontWeight:700,cursor:"pointer"}}>تسوق الآن</button>
                  </div>
                ) : (
                  <div style={{display:"grid",gridTemplateColumns:"1fr 300px",gap:24}}>
                    <div>
                      {cart.map((item,i)=>(
                        <div key={i} style={{background:"white",borderRadius:12,padding:16,marginBottom:10,border:"1px solid #eef0f3",display:"flex",alignItems:"center",gap:14}}>
                          <div style={{width:80,height:80,borderRadius:10,background:bgMap[item.bg]||"#f4f6f8",display:"flex",alignItems:"center",justifyContent:"center",fontSize:40}}>{item.emoji}</div>
                          <div style={{flex:1}}>
                            <div style={{fontWeight:700,marginBottom:4}}>{item.name}</div>
                            <div style={{fontSize:12,color:"#6b7280"}}>🏪 {item.seller}</div>
                            <div style={{fontSize:15,fontWeight:900,color:"#145c22",marginTop:4}}>{formatPrice(item.price)}</div>
                          </div>
                          <div style={{display:"flex",alignItems:"center",gap:8}}>
                            <button onClick={()=>setCart(c=>c.map(x=>x.id===item.id?{...x,qty:Math.max(1,x.qty-1)}:x))} style={{width:30,height:30,border:"1px solid #dde1e7",borderRadius:6,background:"#f4f6f8",cursor:"pointer",fontSize:16}}>−</button>
                            <span style={{fontWeight:700,minWidth:20,textAlign:"center"}}>{item.qty}</span>
                            <button onClick={()=>setCart(c=>c.map(x=>x.id===item.id?{...x,qty:x.qty+1}:x))} style={{width:30,height:30,border:"1px solid #dde1e7",borderRadius:6,background:"#f4f6f8",cursor:"pointer",fontSize:16}}>+</button>
                          </div>
                          <button onClick={()=>setCart(c=>c.filter(x=>x.id!==item.id))} style={{background:"none",border:"none",color:"#d32f2f",cursor:"pointer",fontSize:18}}>🗑️</button>
                        </div>
                      ))}
                    </div>
                    <div style={{background:"white",borderRadius:12,padding:20,border:"1px solid #eef0f3",height:"fit-content"}}>
                      <div style={{fontSize:16,fontWeight:800,marginBottom:14}}>ملخص الطلب</div>
                      <div style={{display:"flex",justifyContent:"space-between",marginBottom:8,fontSize:14}}>
                        <span>المنتجات</span><span>{formatPrice(cartTotal)}</span>
                      </div>
                      <div style={{display:"flex",justifyContent:"space-between",marginBottom:12,fontSize:14}}>
                        <span>التوصيل</span><span>400 دج</span>
                      </div>
                      <div style={{height:1,background:"#eef0f3",marginBottom:12}}/>
                      <div style={{display:"flex",justifyContent:"space-between",marginBottom:16,fontSize:16,fontWeight:900}}>
                        <span>المجموع</span><span style={{color:"#145c22"}}>{formatPrice(cartTotal+400)}</span>
                      </div>
                      <button onClick={()=>showToast("سيتم تفعيل الدفع قريباً","info")} style={{width:"100%",padding:"12px",background:"#1a7c2e",color:"white",border:"none",borderRadius:8,fontFamily:"Cairo,sans-serif",fontSize:15,fontWeight:800,cursor:"pointer"}}>✅ تأكيد الطلب</button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ===== WISHLIST PAGE ===== */}
            {page==="wishlist" && (
              <div style={{padding:24}}>
                <h2 style={{fontSize:18,fontWeight:800,marginBottom:16}}>❤️ المفضلة</h2>
                {wishlist.length===0 ? (
                  <div style={{textAlign:"center",padding:60}}>
                    <div style={{fontSize:64,marginBottom:12}}>❤️</div>
                    <div style={{fontSize:18,fontWeight:700}}>قائمة المفضلة فارغة</div>
                  </div>
                ) : (
                  <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))",gap:14}}>
                    {PRODUCTS.filter(p=>wishlist.includes(p.id)).map((p,i)=>(
                      <ProductCard key={i} product={p} onAddToCart={addToCart} onQuickView={id=>setQuickViewProduct(PRODUCTS.find(x=>x.id===id))} onWishlist={toggleWishlist} wishlisted={true} onOpen={openProduct} />
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ===== SELLER REGISTER PAGE ===== */}
            {page==="seller-register" && (
              <div style={{maxWidth:600,margin:"0 auto",padding:24}}>
                <div style={{background:"white",borderRadius:16,padding:28,border:"1px solid #eef0f3"}}>
                  <div style={{textAlign:"center",marginBottom:24}}>
                    <div style={{fontSize:56,marginBottom:12}}>🚀</div>
                    <h2 style={{fontSize:22,fontWeight:900,marginBottom:6}}>ابدأ البيع على ترسترا</h2>
                    <p style={{color:"#6b7280",fontSize:14}}>وصل لآلاف المشترين في الجزائر</p>
                  </div>
                  {[{label:"اسم المتجر",type:"text",ph:"مثال: Tech Store DZ"},{label:"الاسم الكامل",type:"text",ph:"اسمك الكامل"},{label:"رقم الهاتف",type:"tel",ph:"06 XX XX XX XX"},{label:"البريد الإلكتروني",type:"email",ph:"email@example.com"},{label:"كلمة المرور",type:"password",ph:"••••••••"}].map((f,i)=>(
                    <div key={i} style={{marginBottom:14}}>
                      <label style={{fontSize:13,fontWeight:700,display:"block",marginBottom:5}}>{f.label}</label>
                      <input type={f.type} placeholder={f.ph} style={{width:"100%",padding:"10px 12px",border:"1px solid #dde1e7",borderRadius:8,fontFamily:"Cairo,sans-serif",fontSize:14,outline:"none"}} />
                    </div>
                  ))}
                  <button onClick={()=>{showToast("تم إرسال طلب التسجيل! سنتواصل خلال 24 ساعة","success");setTimeout(()=>setPage("home"),2000);}} style={{width:"100%",padding:"12px",background:"#1a7c2e",color:"white",border:"none",borderRadius:8,fontFamily:"Cairo,sans-serif",fontSize:15,fontWeight:800,cursor:"pointer",marginTop:6}}>
                    🏪 إنشاء حساب البائع
                  </button>
                </div>
              </div>
            )}

          </main>

          {/* RIGHT PANEL */}
          <aside style={S.panel}>
            {/* Track order */}
            <div style={{background:"white",borderRadius:12,padding:16,marginBottom:12,border:"1px solid #eef0f3"}}>
              <div style={{fontSize:13,fontWeight:700,marginBottom:10,display:"flex",alignItems:"center",gap:6}}>📍 تتبع طلبك</div>
              <div style={{display:"flex",gap:6}}>
                <input value={trackInput} onChange={e=>setTrackInput(e.target.value)} type="text" placeholder="رقم الطلب..." style={{flex:1,padding:"8px 10px",border:"1px solid #dde1e7",borderRadius:7,fontFamily:"Cairo,sans-serif",fontSize:13,outline:"none"}} />
                <button onClick={()=>showToast(`تتبع الطلب: ${trackInput}`,"success")} style={{padding:"8px 14px",background:"#1a7c2e",color:"white",border:"none",borderRadius:7,fontFamily:"Cairo,sans-serif",fontSize:13,fontWeight:700,cursor:"pointer"}}>تتبع</button>
              </div>
            </div>
            {/* Best sellers */}
            <div style={{background:"white",borderRadius:12,padding:16,marginBottom:12,border:"1px solid #eef0f3"}}>
              <div style={{fontSize:13,fontWeight:700,marginBottom:10}}>👑 أفضل البائعين</div>
              {[...SELLERS].sort((a,b)=>b.reviews-a.reviews).slice(0,5).map((s,i)=>(
                <div key={i} style={{display:"flex",alignItems:"center",gap:10,padding:"8px 0",borderBottom:i<4?"1px solid #f4f6f8":"none"}}>
                  <div style={{width:24,height:24,borderRadius:"50%",background:i===0?"#f59e0b":i===1?"#94a3b8":i===2?"#b45309":"#e5e7eb",display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:800,color:"white",flexShrink:0}}>{i+1}</div>
                  <div style={{width:36,height:36,borderRadius:10,background:s.avColor||"#1a7c2e",display:"flex",alignItems:"center",justifyContent:"center",color:"white",fontWeight:700,fontSize:14,flexShrink:0}}>{s.av}</div>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{fontSize:13,fontWeight:700}}>{s.name} {s.verified&&<span style={{color:"#1a7c2e",fontSize:11}}>✓</span>}</div>
                    <div style={{fontSize:11,color:"#6b7280"}}>⭐ {s.rating} · {s.reviews.toLocaleString()} تقييم</div>
                  </div>
                </div>
              ))}
            </div>
            {/* Platform stats */}
            <div style={{background:"white",borderRadius:12,padding:16,marginBottom:12,border:"1px solid #eef0f3"}}>
              <div style={{fontSize:13,fontWeight:700,marginBottom:10}}>📊 إحصائيات المنصة</div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8}}>
                {[{val:"+50K",label:"مستخدم"},{val:"+3K",label:"بائع"},{val:"+100K",label:"طلب"}].map((s,i)=>(
                  <div key={i} style={{background:"#f4f6f8",borderRadius:8,padding:"10px 6px",textAlign:"center"}}>
                    <div style={{fontSize:16,fontWeight:900,color:"#145c22"}}>{s.val}</div>
                    <div style={{fontSize:10,color:"#6b7280",marginTop:2}}>{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
            {/* Support */}
            <div style={{background:"#edf7f0",borderRadius:12,padding:16,border:"1px solid #c8e6c9",textAlign:"center"}}>
              <div style={{fontSize:28,marginBottom:6}}>🎧</div>
              <div style={{fontSize:13,fontWeight:700,marginBottom:4}}>مساعدة؟</div>
              <div style={{fontSize:11,color:"#6b7280",marginBottom:10}}>فريق الدعم متاح 24/7</div>
              <button onClick={()=>showToast("جاري الاتصال بفريق الدعم...","info")} style={{width:"100%",padding:8,background:"#1a7c2e",color:"white",border:"none",borderRadius:8,fontFamily:"Cairo,sans-serif",fontSize:12,fontWeight:700,cursor:"pointer"}}>🎧 تواصل معنا</button>
            </div>
          </aside>

        </div>
      </div>

      {/* MODALS */}
      {quickViewProduct && <QuickViewModal product={quickViewProduct} onClose={()=>setQuickViewProduct(null)} onAddToCart={addToCart} />}
      {showAuth && <AuthModal onClose={()=>setShowAuth(false)} onLogin={(u:any)=>{setUser(u);showToast(`مرحباً ${u.name}!`,"success");}} />}
      <Toast toasts={toasts} />
    </div>
  );
}