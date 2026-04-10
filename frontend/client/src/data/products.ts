export interface Product {
  id: number; name: string; cat: string; catLabel: string;
  price: number; oldPrice?: number; discount?: number;
  seller: string; sellerId: number; rating: number; reviews: number;
  stock: number; isNew: boolean; isFeatured: boolean; isFast: boolean;
  emoji: string; colors: string[]; sizes: string[];
  desc: string; bg: string; sold: number;
}
export interface Seller {
  id: number; name: string; av: string; avColor: string;
  rating: number; reviews: number; sales: string; responseRate: number; verified: boolean;
}
export interface Review {
  id: number; pid: number; name: string; initials: string; color: string;
  rating: number; date: string; verified: boolean; text: string; helpful: number;
}

export const PRODUCTS: Product[] = [
  { id:1, name:"تيشيرت صيفي قطن 100%", cat:"fashion", catLabel:"أزياء", price:1800, oldPrice:2500, discount:28, seller:"StyleHub", sellerId:1, rating:4.6, reviews:238, stock:45, isNew:false, isFeatured:true, isFast:true, emoji:"👕", colors:["#212121","#ffffff","#1565c0","#2e7d32"], sizes:["S","M","L","XL","XXL"], desc:"تيشيرت صيفي مصنوع من أجود أنواع القطن الطبيعي 100%، يمنحك الراحة والأناقة.", bg:"gradient-2", sold:1200 },
  { id:2, name:"سماعات بلوتوث لاسلكية Pro", cat:"electronics", catLabel:"إلكترونيات", price:2500, oldPrice:3800, discount:34, seller:"TechStore DZ", sellerId:2, rating:4.8, reviews:412, stock:23, isNew:true, isFeatured:true, isFast:true, emoji:"🎧", colors:["#212121","#c62828","#1565c0"], sizes:[], desc:"سماعات بلوتوث لاسلكية بجودة صوت استثنائية، إلغاء ضوضاء، وعمر بطارية 40 ساعة.", bg:"gradient-1", sold:800 },
  { id:3, name:"حذاء رياضي أبيض كلاسيك", cat:"fashion", catLabel:"أزياء", price:3500, oldPrice:4500, discount:22, seller:"ShoesWorld", sellerId:3, rating:4.4, reviews:156, stock:12, isNew:false, isFeatured:true, isFast:false, emoji:"👟", colors:["#ffffff","#212121","#c62828"], sizes:["38","39","40","41","42","43","44"], desc:"حذاء رياضي كلاسيكي بتصميم عصري مناسب للرياضة والاستخدام اليومي.", bg:"gradient-3", sold:600 },
  { id:4, name:"ساعة ذكية Smart Watch Pro", cat:"electronics", catLabel:"إلكترونيات", price:8900, oldPrice:12000, discount:26, seller:"TechStore DZ", sellerId:2, rating:4.7, reviews:89, stock:8, isNew:true, isFeatured:true, isFast:true, emoji:"⌚", colors:["#212121","#b0bec5","#ffd54f"], sizes:[], desc:"ساعة ذكية بشاشة AMOLED، رصد الصحة، GPS مدمج، ومقاومة للماء.", bg:"gradient-4", sold:400 },
  { id:5, name:"هودي أخضر Premium", cat:"fashion", catLabel:"أزياء", price:3200, oldPrice:4000, discount:20, seller:"StyleHub", sellerId:1, rating:4.3, reviews:73, stock:30, isNew:true, isFeatured:false, isFast:false, emoji:"🧥", colors:["#2e7d32","#212121","#1565c0","#6a1b9a"], sizes:["S","M","L","XL","XXL"], desc:"هودي عالي الجودة من خليط القطن والبوليستر، مريح ومناسب للفصول الباردة.", bg:"gradient-5", sold:300 },
  { id:6, name:"كاميرا رياضية 4K Ultra HD", cat:"electronics", catLabel:"إلكترونيات", price:15000, oldPrice:20000, discount:25, seller:"TechStore DZ", sellerId:2, rating:4.9, reviews:204, stock:5, isNew:true, isFeatured:false, isFast:true, emoji:"📷", colors:["#212121"], sizes:[], desc:"كاميرا رياضية 4K مقاومة للماء، استقرار فيديو متقدم.", bg:"gradient-1", sold:200 },
  { id:7, name:"مجموعة عناية بالبشرة طبيعية", cat:"beauty", catLabel:"جمال وعناية", price:2800, oldPrice:3500, discount:20, seller:"BeautyZone", sellerId:4, rating:4.5, reviews:167, stock:40, isNew:false, isFeatured:true, isFast:false, emoji:"🧴", colors:[], sizes:[], desc:"مجموعة عناية شاملة بمكونات طبيعية.", bg:"gradient-6", sold:500 },
  { id:8, name:"هاتف ذكي Android 256GB", cat:"electronics", catLabel:"إلكترونيات", price:45000, oldPrice:55000, discount:18, seller:"TechStore DZ", sellerId:2, rating:4.6, reviews:332, stock:15, isNew:true, isFeatured:true, isFast:true, emoji:"📱", colors:["#212121","#ffd54f","#1565c0"], sizes:["128GB","256GB","512GB"], desc:"هاتف ذكي بكاميرا 108MP، بطارية 5000mAh، شاشة AMOLED 6.7 بوصة.", bg:"gradient-1", sold:1000 },
  { id:9, name:"نظارات شمسية UV400 إيطالي", cat:"fashion", catLabel:"أزياء", price:1500, oldPrice:2000, discount:25, seller:"StyleHub", sellerId:1, rating:4.1, reviews:45, stock:60, isNew:false, isFeatured:false, isFast:true, emoji:"🕶️", colors:["#212121","#795548","#880e4f"], sizes:[], desc:"نظارات UV400 بإطار خفيف بتصميم إيطالي عصري.", bg:"gradient-3", sold:250 },
  { id:10, name:"جهاز تمرين متعدد الوظائف", cat:"sports", catLabel:"رياضة", price:25000, oldPrice:32000, discount:22, seller:"SportZone", sellerId:6, rating:4.5, reviews:134, stock:7, isNew:true, isFeatured:true, isFast:false, emoji:"🏋️", colors:["#212121"], sizes:[], desc:"جهاز تمرين منزلي متعدد الوظائف يتيح تمارين كامل الجسم.", bg:"gradient-2", sold:150 },
  { id:11, name:"عطر رجالي Ocean Breeze", cat:"beauty", catLabel:"جمال وعناية", price:3500, oldPrice:4500, discount:22, seller:"BeautyZone", sellerId:4, rating:4.6, reviews:189, stock:35, isNew:false, isFeatured:true, isFast:true, emoji:"🌊", colors:[], sizes:["50ml","100ml","150ml"], desc:"عطر رجالي فاخر بعبق البحر.", bg:"gradient-6", sold:450 },
  { id:12, name:"دراجة هوائية جبلية 27 سرعة", cat:"sports", catLabel:"رياضة", price:35000, oldPrice:45000, discount:22, seller:"SportZone", sellerId:6, rating:4.7, reviews:67, stock:3, isNew:true, isFeatured:false, isFast:false, emoji:"🚲", colors:["#212121","#c62828","#1565c0"], sizes:[], desc:"دراجة جبلية 27 سرعة، هيكل ألومنيوم خفيف.", bg:"gradient-3", sold:100 },
  { id:13, name:"طقم مطبخ ستانلس ستيل 12 قطعة", cat:"home", catLabel:"منزل ومطبخ", price:7500, oldPrice:9000, discount:17, seller:"HomeDecor", sellerId:5, rating:4.4, reviews:78, stock:20, isNew:false, isFeatured:false, isFast:false, emoji:"🍳", colors:[], sizes:[], desc:"طقم مطبخ متكامل 12 قطعة من ستانلس ستيل.", bg:"gradient-4", sold:200 },
  { id:14, name:"مكيف هوائي سبليت إنفرتر", cat:"home", catLabel:"منزل ومطبخ", price:85000, oldPrice:100000, discount:15, seller:"HomeDecor", sellerId:5, rating:4.3, reviews:56, stock:4, isNew:false, isFeatured:false, isFast:false, emoji:"❄️", colors:["#ffffff"], sizes:["12000","18000","24000"], desc:"مكيف سبليت بتقنية إنفرتر موفر للطاقة.", bg:"gradient-1", sold:80 },
  { id:15, name:"كريم ترطيب ليلي فاخر", cat:"beauty", catLabel:"جمال وعناية", price:1800, oldPrice:2400, discount:25, seller:"BeautyZone", sellerId:4, rating:4.6, reviews:215, stock:80, isNew:true, isFeatured:false, isFast:true, emoji:"🌙", colors:[], sizes:["30ml","50ml","100ml"], desc:"كريم ليلي بمكونات طبيعية لتجديد البشرة.", bg:"gradient-6", sold:600 },
  { id:16, name:"سكوتر كهربائي قابل للطي", cat:"sports", catLabel:"رياضة", price:28000, oldPrice:35000, discount:20, seller:"SportZone", sellerId:6, rating:4.4, reviews:54, stock:6, isNew:true, isFeatured:true, isFast:false, emoji:"🛴", colors:["#212121","#c62828"], sizes:[], desc:"سكوتر كهربائي سرعة 25كم/س، مدى 35كم بشحنة واحدة.", bg:"gradient-3", sold:120 },
];

export const SELLERS: Seller[] = [
  { id:1, name:"StyleHub", av:"S", avColor:"#1565c0", rating:4.8, reviews:1240, sales:"10K+", responseRate:98, verified:true },
  { id:2, name:"TechStore DZ", av:"T", avColor:"#2e7d32", rating:4.9, reviews:3560, sales:"25K+", responseRate:99, verified:true },
  { id:3, name:"ShoesWorld", av:"W", avColor:"#c62828", rating:4.5, reviews:890, sales:"5K+", responseRate:95, verified:true },
  { id:4, name:"BeautyZone", av:"B", avColor:"#7b1fa2", rating:4.7, reviews:2100, sales:"12K+", responseRate:97, verified:true },
  { id:5, name:"HomeDecor", av:"H", avColor:"#e65100", rating:4.4, reviews:675, sales:"4K+", responseRate:93, verified:false },
  { id:6, name:"SportZone", av:"Z", avColor:"#00838f", rating:4.6, reviews:445, sales:"3K+", responseRate:96, verified:true },
];

export const REVIEWS: Review[] = [
  { id:1, pid:1, name:"أحمد بن علي", initials:"أ", color:"#1565c0", rating:5, date:"منذ 3 أيام", verified:true, text:"منتج ممتاز جداً! الجودة أفضل مما توقعت، القطن ناعم ومريح. التوصيل كان سريعاً.", helpful:24 },
  { id:2, pid:1, name:"فاطمة الزهراء", initials:"ف", color:"#c62828", rating:4, date:"منذ أسبوع", verified:true, text:"جيد بشكل عام، المقاس مطابق والجودة معقولة. التوصيل استغرق 4 أيام.", helpful:12 },
  { id:3, pid:1, name:"محمد أمين", initials:"م", color:"#2e7d32", rating:5, date:"منذ أسبوعين", verified:true, text:"اشتريت 3 قطع وكلها ممتازة! الألوان لا تبهت بعد الغسيل. أنصح به بشدة.", helpful:31 },
  { id:4, pid:2, name:"كريم بوعلام", initials:"ك", color:"#7b1fa2", rating:5, date:"منذ يوم", verified:true, text:"أفضل سماعات اشتريتها! الصوت رائع وإلغاء الضوضاء مذهل.", helpful:18 },
  { id:5, pid:2, name:"سارة مزياني", initials:"س", color:"#e65100", rating:4, date:"منذ 5 أيام", verified:true, text:"جودة ممتازة، البطارية تدوم طويلاً. التغليف أنيق جداً.", helpful:9 },
  { id:6, pid:3, name:"يوسف خالد", initials:"ي", color:"#00838f", rating:5, date:"منذ أسبوع", verified:true, text:"الحذاء مريح جداً ومقاسه دقيق. أنصح بالشراء بدون تردد!", helpful:15 },
  { id:7, pid:4, name:"نور الهدى", initials:"ن", color:"#1565c0", rating:5, date:"منذ يومين", verified:true, text:"الساعة رائعة، GPS دقيق وشاشة واضحة. تستحق الثمن.", helpful:22 },
  { id:8, pid:8, name:"عمر بلقاسم", initials:"ع", color:"#2e7d32", rating:4, date:"منذ أسبوع", verified:true, text:"هاتف ممتاز بسعر معقول، الكاميرا احترافية والبطارية تدوم يومين.", helpful:27 },
];

export const formatPrice = (p: number) => p.toLocaleString('ar-DZ') + ' دج';
export const getById = (id: number) => PRODUCTS.find(p => p.id === id);
export const getSellerById = (id: number) => SELLERS.find(s => s.id === id);
export const getByCategory = (cat: string) => cat === 'all' ? PRODUCTS : PRODUCTS.filter(p => p.cat === cat);
export const getFeatured = () => PRODUCTS.filter(p => p.isFeatured).slice(0, 8);
export const getNew = () => PRODUCTS.filter(p => p.isNew).slice(0, 8);
export const getReviewsByProduct = (pid: number) => REVIEWS.filter(r => r.pid === pid);
