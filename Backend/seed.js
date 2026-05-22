// seed.js — ملف لإضافة منتجات حقيقية للداتا بيز
// تشغيل: node seed.js

import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/halfEcommerce";

console.log("Connecting to database at:", MONGO_URI);
await mongoose.connect(MONGO_URI);
console.log("✅ اتصال بالداتا بيز ناجح");

// ─── سكيما المستخدم والمنتج ─────────────────────────────────
const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: "user" },
  isConfirmed: { type: Boolean, default: true }
});

const UserModel = mongoose.models.User || mongoose.model("User", userSchema);

const productSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, unique: true, trim: true },
    description: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    quantity: { type: Number, required: true, min: 0 },
    image: { type: String, required: true },
    isActive: { type: Boolean, default: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
  },
  { timestamps: true }
);

const ProductModel = mongoose.models.Product || mongoose.model("Product", productSchema);

// ─── إعداد مستخدم افتراضي كمنشئ للمنتجات ──────────────────────
let creatorId;
try {
  let adminUser = await UserModel.findOne({ role: "admin" });
  if (!adminUser) {
    adminUser = await UserModel.findOne();
  }
  
  if (!adminUser) {
    console.log("Creating default seed admin user...");
    adminUser = await UserModel.create({
      username: "admin",
      email: "admin@purplestore.com",
      password: "adminpassword123",
      role: "admin",
      isConfirmed: true
    });
    console.log("Created seed admin user:", adminUser.email);
  }
  
  creatorId = adminUser._id;
  console.log("Assigning products ownership to creator ID:", creatorId);
} catch (error) {
  console.error("Error setting up creator user:", error.message);
  process.exit(1);
}

// ─── بيانات المنتجات ──────────────────────────────────────────
const products = [
  // 📱 إلكترونيات
  {
    title: "iPhone 15 Pro Max",
    description: "أحدث هاتف من آبل بشاشة 6.7 بوصة Super Retina XDR، كاميرا 48MP، ومعالج A17 Pro الأقوى في السوق.",
    price: 1299,
    quantity: 25,
    image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&q=80",
    createdBy: creatorId
  },
  {
    title: "Samsung Galaxy S24 Ultra",
    description: "هاتف سامسونج الفلاجشيب بقلم S Pen مدمج، كاميرا 200MP، وشاشة Dynamic AMOLED 2X.",
    price: 1199,
    quantity: 30,
    image: "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=800&q=80",
    createdBy: creatorId
  },
  {
    title: "MacBook Pro 14 M3",
    description: 'لابتوب آبل بشاشة Liquid Retina XDR 14.2"، معالج M3 Pro، ذاكرة 18GB، وبطارية تدوم 18 ساعة.',
    price: 1999,
    quantity: 15,
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&q=80",
    createdBy: creatorId
  },
  {
    title: "iPad Pro 12.9 M2",
    description: "تابلت آبل الأقوى بشاشة Mini-LED 12.9 بوصة، معالج M2، ودعم Apple Pencil الجيل الثاني.",
    price: 1099,
    quantity: 20,
    image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800&q=80",
    createdBy: creatorId
  },
  {
    title: "Sony WH-1000XM5",
    description: "سماعات لاسلكية بخاصية إلغاء الضوضاء الرائدة في السوق، بطارية 30 ساعة، وجودة صوت استثنائية.",
    price: 349,
    quantity: 50,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80",
    createdBy: creatorId
  },
  {
    title: "AirPods Pro الجيل الثاني",
    description: "سماعات آبل اللاسلكية بإلغاء ضوضاء نشط، صوت مكاني شخصي، وبطارية تصل إلى 30 ساعة مع الحافظة.",
    price: 249,
    quantity: 60,
    image: "https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=800&q=80",
    createdBy: creatorId
  },
  {
    title: "Apple Watch Ultra 2",
    description: "ساعة آبل الأكثر متانة بهيكل تيتانيوم، GPS دقيق، مقاومة للماء حتى 100 متر، وشاشة مشرقة للغاية.",
    price: 799,
    quantity: 18,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80",
    createdBy: creatorId
  },
  {
    title: 'Dell UltraSharp 27" 4K',
    description: "شاشة احترافية بدقة 4K UHD، ألوان دقيقة 100% sRGB، ومنافذ Thunderbolt 4 لإنتاجية عالية.",
    price: 699,
    quantity: 12,
    image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&q=80",
    createdBy: creatorId
  },
  {
    title: "Logitech MX Master 3S",
    description: "ماوس لاسلكي احترافي بعجلة تمرير MagSpeed، 8000 DPI، وبطارية تدوم 70 يوماً.",
    price: 99,
    quantity: 80,
    image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800&q=80",
    createdBy: creatorId
  },
  {
    title: "Canon EOS R6 Mark II",
    description: "كاميرا ميرورليس احترافية بدقة 24.2MP، تصوير بالفيديو 6K RAW، وتتبع موضوع بالذكاء الاصطناعي.",
    price: 2499,
    quantity: 8,
    image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&q=80",
    createdBy: creatorId
  },

  // 👟 ملابس وأكسسوارات
  {
    title: "Nike Air Max 270",
    description: "حذاء رياضي بتقنية Air Max الأيقونية، وسادة هوائية 270 درجة للراحة القصوى طوال اليوم.",
    price: 150,
    quantity: 100,
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80",
    createdBy: creatorId
  },
  {
    title: "Adidas Ultraboost 23",
    description: "حذاء جري بوسادة Boost الفائقة، جزء علوي Primeknit، ومقبس Continental للإمساك بالأرض.",
    price: 190,
    quantity: 85,
    image: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=800&q=80",
    createdBy: creatorId
  },
  {
    title: "Levi's 501 Original Jeans",
    description: "بنطلون جينز كلاسيكي بقصة مستقيمة، قماش 100% قطن، في الألوان الأكثر مبيعاً.",
    price: 89,
    quantity: 150,
    image: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=800&q=80",
    createdBy: creatorId
  },
  {
    title: "Leather Bifold Wallet",
    description: "محفظة جلد طبيعي بتصميم رفيع، 8 جيوب للبطاقات، وحماية RFID لأمان بياناتك.",
    price: 49,
    quantity: 200,
    image: "https://images.unsplash.com/photo-1627123424574-724758594e93?w=800&q=80",
    createdBy: creatorId
  },
  {
    title: "Ray-Ban Classic Aviator",
    description: "نظارة شمسية أيقونية بإطار معدني ذهبي وعدسات زجاجية G-15، UV400 Protection.",
    price: 179,
    quantity: 60,
    image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800&q=80",
    createdBy: creatorId
  },
  {
    title: "The North Face Puffer Jacket",
    description: "جاكيت شتوي بحشو 550-fill down، واجهة مضادة للماء، ودفء استثنائي في درجات الحرارة المنخفضة.",
    price: 280,
    quantity: 40,
    image: "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=800&q=80",
    createdBy: creatorId
  },
  {
    title: "Casio G-Shock GA-2100",
    description: "ساعة G-Shock بهيكل Carbon Core Guard، مقاومة للصدمات والماء حتى 200 متر، بتصميم عصري.",
    price: 119,
    quantity: 75,
    image: "https://images.unsplash.com/photo-1622434641406-a158123450f9?w=800&q=80",
    createdBy: creatorId
  },
  {
    title: "Herschel Little America Backpack",
    description: 'حقيبة ظهر 30L بجيب للابتوب حتى 15 Rally، قماش متين، وتصميم عصري يناسب الجامعة والسفر.',
    price: 110,
    quantity: 90,
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80",
    createdBy: creatorId
  },

  // 🏠 أثاث ومنزل
  {
    title: "Ergonomic Office Chair",
    description: "كرسي مكتب بدعم قطني قابل للضبط، مسند ذراعين 4D، وإطار ألومنيوم لمدة جلوس مريحة حتى 12 ساعة.",
    price: 499,
    quantity: 20,
    image: "https://images.unsplash.com/photo-1589384267710-7a170981ca78?w=800&q=80",
    createdBy: creatorId
  },
  {
    title: "Standing Desk Electric",
    description: "مكتب كهربائي قابل للرفع من 71 إلى 121 سم، ذاكرة 4 أوضاع، وسطح خشبي 160x80 سم.",
    price: 649,
    quantity: 10,
    image: "https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=800&q=80",
    createdBy: creatorId
  },
  {
    title: "Philips Hue Starter Kit",
    description: "مجموعة إضاءة ذكية 4 لمبات ملونة + جهاز Hue Bridge، تحكم عن بعد عبر التطبيق، 16 مليون لون.",
    price: 199,
    quantity: 35,
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
    createdBy: creatorId
  },
  {
    title: "Nespresso Vertuo Pop",
    description: "ماكينة قهوة بتقنية Centrifusion، تصنع 5 أحجام من الكابسولات، سخونة فورية في 30 ثانية.",
    price: 149,
    quantity: 45,
    image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&q=80",
    createdBy: creatorId
  },
  {
    title: "Dyson V15 Detect",
    description: "مكنسة كهربائية لاسلكية بليزر يكشف الغبار الخفي، شاشة LCD، وقوة شفط 240 AW.",
    price: 749,
    quantity: 12,
    image: "https://images.unsplash.com/photo-1558317374-067fb5f30001?w=800&q=80",
    createdBy: creatorId
  },
  {
    title: "IKEA KALLAX Shelf Unit",
    description: "وحدة رفوف متعددة الاستخدام، 4x4 مربعات، قابلة للتعليق أفقياً أو عمودياً، أبيض مطفي.",
    price: 179,
    quantity: 25,
    image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80",
    createdBy: creatorId
  },
  {
    title: "Scented Soy Candle Set",
    description: "طقم 3 شموع عطرية من الصويا، نكهات الفانيليا والخشب العربي والياسمين، تدوم 45 ساعة لكل شمعة.",
    price: 39,
    quantity: 120,
    image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=800&q=80",
    createdBy: creatorId
  },

  // 💪 رياضة ولياقة
  {
    title: "Adjustable Dumbbell 25kg",
    description: "دمبل قابل للضبط من 2.5 إلى 25 كيلو بنظام ديال سريع، يغني عن 9 أوزان مختلفة.",
    price: 299,
    quantity: 30,
    image: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&q=80",
    createdBy: creatorId
  },
  {
    title: "Yoga Mat Premium 6mm",
    description: "حصيرة يوجا مضادة للانزلاق، سمك 6 مم للراحة المثالية، مادة TPE صديقة للبيئة.",
    price: 59,
    quantity: 100,
    image: "https://images.unsplash.com/photo-1599058945522-28d584b6f0ff?w=800&q=80",
    createdBy: creatorId
  },
  {
    title: "Pull-Up Bar Doorway",
    description: "بار شد الجسم للأبواب بدون مسامير، يتحمل حتى 150 كيلو، مع ألواح إسفنجية مريحة.",
    price: 45,
    quantity: 80,
    image: "https://images.unsplash.com/photo-1598971457999-ca4ef48a9a71?w=800&q=80",
    createdBy: creatorId
  },
  {
    title: "Resistance Bands Set (5 levels)",
    description: "طقم 5 مطاطات مقاومة بمستويات مختلفة (10-50 كيلو)، مع مقابض وحقيبة، مثالي لتمارين المنزل.",
    price: 35,
    quantity: 150,
    image: "https://images.unsplash.com/photo-1517344368193-41552b6ad3f5?w=800&q=80",
    createdBy: creatorId
  },
  {
    title: "Whey Protein Isolate 2kg",
    description: "بروتين مصل اللبن عالي النقاء، 27g بروتين لكل وجبة، نكهة شوكولاتة، بدون سكر مضاف.",
    price: 79,
    quantity: 60,
    image: "https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=800&q=80",
    createdBy: creatorId
  },
  {
    title: "Foam Roller Deep Tissue",
    description: "رول إسفنجي لتدليك العضلات العميقة، نقاط ارتكاز بارزة لتحرير التوترات، 33 سم.",
    price: 29,
    quantity: 90,
    image: "https://images.unsplash.com/photo-1620188526357-8d26bd4c3dc4?w=800&q=80",
    createdBy: creatorId
  },
  {
    title: "Jump Rope Speed Cable",
    description: "حبل قفز احترافي كابل سريع من الألومنيوم، قابل لضبط الطول، مثالي للكروسفيت والبوكسينج.",
    price: 25,
    quantity: 120,
    image: "https://images.unsplash.com/photo-1434608519344-49d77a699e1d?w=800&q=80",
    createdBy: creatorId
  },

  // 📚 كتب وتعلم
  {
    title: "Clean Code — Robert Martin",
    description: "الكتاب الأشهر في كتابة كود نظيف ومحترف، مع أمثلة Java عملية وقواعد لا غنى عنها لأي مطور.",
    price: 45,
    quantity: 200,
    image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800&q=80",
    createdBy: creatorId
  },
  {
    title: "The Pragmatic Programmer",
    description: "دليل المبرمج العملي لبناء أنظمة قابلة للصيانة والتطوير، من الطبعة المحدثة 20th Anniversary.",
    price: 49,
    quantity: 150,
    image: "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=800&q=80",
    createdBy: creatorId
  },
  {
    title: "Atomic Habits — James Clear",
    description: "الكتاب الأكثر مبيعاً عن بناء العادات الصغيرة التي تحدث تغييراً جذرياً، مترجم لـ 50 لغة.",
    price: 22,
    quantity: 300,
    image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=800&q=80",
    createdBy: creatorId
  },

  // 🎮 ألعاب وترفيه
  {
    title: "PlayStation 5 Slim",
    description: "أحدث إصدار من PS5 بتصميم أنحف، درايف ديسك، أداء 4K 120fps، وتحميل فائق السرعة.",
    price: 499,
    quantity: 15,
    image: "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=800&q=80",
    createdBy: creatorId
  },
  {
    title: "Nintendo Switch OLED",
    description: "نينتندو سويتش بشاشة OLED 7 بوصة، حامل مُحسَّن، ذاكرة داخلية 64GB، وصوت أوضح.",
    price: 349,
    quantity: 22,
    image: "https://images.unsplash.com/photo-1578303512597-81e6cc155b3e?w=800&q=80",
    createdBy: creatorId
  },
  {
    title: "Xbox Series X Controller",
    description: "يد تحكم Xbox الأحدث بمقبض هجين، زناد رجعي، وبلوتوث + USB-C للتوافق الشامل.",
    price: 69,
    quantity: 50,
    image: "https://images.unsplash.com/photo-1592840496694-26d035b52b48?w=800&q=80",
    createdBy: creatorId
  },
  {
    title: "LEGO Technic Bugatti 42151",
    description: "مجموعة LEGO Technic سيارة Bugatti Bolide، 905 قطعة، تفاصيل محرك W16 متحركة.",
    price: 129,
    quantity: 35,
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
    createdBy: creatorId
  },

  // 🍳 مطبخ وطعام
  {
    title: "KitchenAid Stand Mixer 4.8L",
    description: "خلاط كيتشن إيد الأيقوني بمحرك 275 واط، وعاء ستيل 4.8 لتر، و10 سرعات، متوفر بألوان كثيرة.",
    price: 499,
    quantity: 15,
    image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80",
    createdBy: creatorId
  },
  {
    title: "Instant Pot Duo 7-in-1",
    description: "قدر ضغط كهربائي 7 وظائف: ضغط، طبخ بطيء، أرز، يوغرت، طهي بالبخار، وإبقاء الطعام دافئاً.",
    price: 99,
    quantity: 40,
    image: "https://images.unsplash.com/photo-1585515320310-259814833e62?w=800&q=80",
    createdBy: creatorId
  },
  {
    title: "Carbon Steel Chef Knife 20cm",
    description: "سكينة طاهٍ احترافية من الفولاذ الكربوني الياباني، حدة استثنائية، ومقبض خشب الغاف.",
    price: 89,
    quantity: 70,
    image: "https://images.unsplash.com/photo-1593618998160-e34014e67546?w=800&q=80",
    createdBy: creatorId
  },
  {
    title: "Vitamix 5200 Blender",
    description: "خلاط Vitamix الأشهر بمحرك 1380 واط، عرفت بثباتها وقدرتها على تحويل أي شيء لعصير ناعم.",
    price: 449,
    quantity: 18,
    image: "https://images.unsplash.com/photo-1570197788417-0e82375c9371?w=800&q=80",
    createdBy: creatorId
  },

  // 🌿 عناية شخصية
  {
    title: "Ordinary Skincare Set",
    description: "طقم عناية بالبشرة يحتوي على Niacinamide, Hyaluronic Acid, و Retinol — روتين كامل بسعر معقول.",
    price: 55,
    quantity: 80,
    image: "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=800&q=80",
    createdBy: creatorId
  },
  {
    title: "Braun Series 9 Pro Shaver",
    description: "ماكينة حلاقة كهربائية بـ 5 رؤوس مرنة، تقنية AutoSense، وشحن لمدة ساعة بثمانية أسابيع حلاقة.",
    price: 299,
    quantity: 25,
    image: "https://images.unsplash.com/photo-1621607512214-68297480165e?w=800&q=80",
    createdBy: creatorId
  },
  {
    title: "Dyson Airwrap Complete",
    description: "جهاز تصفيف الشعر الثوري بتقنية Coanda، يجفف ويجعد ويفرد بدون حرارة مرتفعة.",
    price: 599,
    quantity: 12,
    image: "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=800&q=80",
    createdBy: creatorId
  },
  {
    title: "Natural Wooden Comb Set",
    description: "طقم أمشاط خشب طبيعي 4 قطع لأنواع مختلفة من الشعر، لطيف على فروة الرأس وبدون شحنة كهربائية.",
    price: 19,
    quantity: 150,
    image: "https://images.unsplash.com/photo-1522338242992-e1a54906a8da?w=800&q=80",
    createdBy: creatorId
  }
];

// ─── حذف المنتجات القديمة وإضافة الجديدة ──────────────────────
try {
  await ProductModel.deleteMany({});
  console.log("🗑️  حذف المنتجات القديمة");

  const inserted = await ProductModel.insertMany(products);
  console.log(`✅ تم إضافة ${inserted.length} منتج بنجاح`);

  console.log("\n📋 ملخص الكاتيجوريز:");
  console.log("  📱 إلكترونيات   → 10 منتجات");
  console.log("  👟 ملابس         → 8 منتجات");
  console.log("  🏠 أثاث ومنزل   → 6 منتجات");
  console.log("  💪 رياضة         → 7 منتجات");
  console.log("  📚 كتب           → 3 منتجات");
  console.log("  🎮 ألعاب         → 4 منتجات");
  console.log("  🍳 مطبخ          → 4 منتجات");
  console.log("  🌿 عناية شخصية  → 4 منتجات");
  console.log("\n🎉 الـ Seed اشتغل بنجاح!");
} catch (error) {
  console.error("❌ خطأ:", error.message);
} finally {
  await mongoose.disconnect();
  console.log("🔌 انقطع الاتصال بالداتا بيز");
}
