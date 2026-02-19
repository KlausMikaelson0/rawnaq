function buildStoreSettings() {
  return {
    name: {
      ar: "رونق",
      en: "Rawnaq"
    },
    tagline: {
      ar: "عطور فاخرة بصياغة خليجية تليق بذوقك",
      en: "Luxury perfumes crafted for refined Gulf taste"
    },
    currency: {
      ar: "ريال",
      en: "SAR"
    },
    contact: {
      email: "sales@rawnaq-store.com",
      phone: "+966 55 123 4567",
      whatsapp: "https://wa.me/966551234567",
      location: {
        ar: "الرياض - المملكة العربية السعودية",
        en: "Riyadh - Saudi Arabia"
      }
    },
    business: {
      shippingNote: {
        ar: "شحن سريع إلى جميع مدن الخليج خلال 2-5 أيام عمل",
        en: "Fast GCC delivery within 2-5 business days"
      },
      paymentNote: {
        ar: "دفع آمن عبر بوابات موثوقة",
        en: "Secure checkout via trusted payment gateways"
      },
      qualityNote: {
        ar: "ضمان جودة واسترجاع مرن خلال 7 أيام",
        en: "Quality guarantee with a flexible 7-day return window"
      }
    },
    payment: {
      provider: "gateway-ready",
      methods: ["card", "apple_pay", "mada"],
      secureBadges: ["SSL 256-bit", "3D Secure", "PCI DSS"]
    }
  };
}

function buildFaqs() {
  return [
    {
      question_ar: "هل المتجر جاهز للتشغيل الفوري؟",
      answer_ar:
        "نعم. المتجر مكتمل الصفحات والمنتجات والمحتوى القانوني والتسويقي، ويمكن تشغيله مباشرة بعد رفع الملفات وإعداد قاعدة البيانات.",
      question_en: "Is the store ready for immediate launch?",
      answer_en:
        "Yes. The storefront includes complete pages, products, legal content, and sales copy, and can go live immediately after deployment.",
      sort_order: 1
    },
    {
      question_ar: "هل يمكن تغيير اسم المتجر بعد الشراء؟",
      answer_ar:
        "نعم، يمكن تغيير الاسم من الإعدادات بسهولة، كما يمكن استبدال الشعار والهوية بالكامل.",
      question_en: "Can the buyer rebrand the store after purchase?",
      answer_en:
        "Yes. The buyer can update the store name, contact details, and full branding setup with ease.",
      sort_order: 2
    },
    {
      question_ar: "هل يدعم المتجر العربية والإنجليزية؟",
      answer_ar:
        "نعم، المتجر يدعم اللغتين مع تبديل سريع ونسخة محتوى احترافية لكل لغة.",
      question_en: "Does the store support both Arabic and English?",
      answer_en:
        "Yes. The storefront is fully bilingual with a fast language switch and professionally written content in both languages.",
      sort_order: 3
    },
    {
      question_ar: "ما طرق الدفع المهيأة في المتجر؟",
      answer_ar:
        "بطاقات بنكية، Apple Pay، ومدى. التكامل الحقيقي يتم ربطه لاحقًا من قبل المالك الجديد.",
      question_en: "Which payment methods are prepared?",
      answer_en:
        "Bank cards, Apple Pay, and mada are prepared technically. Live provider credentials can be connected later by the buyer.",
      sort_order: 4
    },
    {
      question_ar: "هل توجد لوحة تحكم سهلة للمبتدئين؟",
      answer_ar:
        "نعم، توجد لوحة تحكم مستقلة لإدارة المنتجات والطلبات والعملاء والإعدادات.",
      question_en: "Is there a beginner-friendly admin panel?",
      answer_en:
        "Yes. A standalone admin panel is included to manage products, orders, customers, and settings.",
      sort_order: 5
    },
    {
      question_ar: "هل يمكن نقل الملكية الكاملة دون اعتماد على المطور؟",
      answer_ar:
        "نعم، يتم تسليم ملفات الموقع وقاعدة البيانات وبيانات الدخول ليصبح المشتري المالك الكامل.",
      question_en: "Can full ownership be transferred without developer dependency?",
      answer_en:
        "Yes. The buyer receives the full website files, database, and credentials to own and operate the business independently.",
      sort_order: 6
    }
  ];
}

function generateProducts() {
  const storeNameAr = "رونق";
  const storeNameEn = "Rawnaq";

  const families = [
    {
      title: { ar: "سمو الليل", en: "Nocturnal Majesty" },
      category: { ar: "العطور الشرقية الفاخرة", en: "Luxury Oriental Perfumes" },
      top: { ar: "الزعفران والهيل", en: "saffron and cardamom" },
      heart: { ar: "الورد الدمشقي والعنبر", en: "Damask rose and amber" },
      base: { ar: "العود والمسك الأبيض", en: "aged oud and white musk" },
      mood: { ar: "حضور ملكي للمناسبات الراقية", en: "a regal aura for refined occasions" }
    },
    {
      title: { ar: "تاج العود", en: "Crown Oud" },
      category: { ar: "العطور الخشبية الملكية", en: "Royal Woody Perfumes" },
      top: { ar: "الفلفل الوردي والبرغموت", en: "pink pepper and bergamot" },
      heart: { ar: "خشب الغاياك والجلد الناعم", en: "guaiac wood and soft leather" },
      base: { ar: "عود هندي معتق وفانيلا داكنة", en: "mature Indian oud and dark vanilla" },
      mood: { ar: "أناقة حاسمة في اللقاءات الرسمية", en: "decisive elegance for formal meetings" }
    },
    {
      title: { ar: "همس الياسمين", en: "Jasmine Whisper" },
      category: { ar: "العطور الزهرية الراقية", en: "Refined Floral Perfumes" },
      top: { ar: "الياسمين والكمثرى", en: "jasmine and pear" },
      heart: { ar: "زهرة البرتقال والإيلنغ", en: "orange blossom and ylang-ylang" },
      base: { ar: "مسك حريري وخشب الصندل", en: "silky musk and sandalwood" },
      mood: { ar: "رقي ناعم للإطلالات النهارية", en: "soft sophistication for daytime wear" }
    },
    {
      title: { ar: "نسيم اللؤلؤ", en: "Pearl Breeze" },
      category: { ar: "العطور المنعشة اليومية", en: "Fresh Everyday Perfumes" },
      top: { ar: "الليمون الأخضر والنعناع", en: "lime and mint" },
      heart: { ar: "لافندر وماء زهر", en: "lavender and orange flower water" },
      base: { ar: "أرز أبيض ومسك نقي", en: "white cedar and clean musk" },
      mood: { ar: "انتعاش فاخر يدوم طوال اليوم", en: "lasting freshness with a premium touch" }
    },
    {
      title: { ar: "رحيق الذهب", en: "Golden Nectar" },
      category: { ar: "العطور الشرقية الفاخرة", en: "Luxury Oriental Perfumes" },
      top: { ar: "قشر البرتقال والزعفران", en: "orange zest and saffron" },
      heart: { ar: "العسل الأبيض والسوسن", en: "white honey and iris" },
      base: { ar: "باتشولي وعنبر ذهبي", en: "patchouli and golden amber" },
      mood: { ar: "دفء فاخر يلفت الانتباه", en: "a luxurious warmth that turns heads" }
    },
    {
      title: { ar: "موج العنبر", en: "Amber Tide" },
      category: { ar: "العطور الشرقية الفاخرة", en: "Luxury Oriental Perfumes" },
      top: { ar: "نسيم بحري ومندرين", en: "marine breeze and mandarin" },
      heart: { ar: "عنبر رمادي وورد أبيض", en: "ambergris and white rose" },
      base: { ar: "طحلب السنديان والمسك", en: "oakmoss and musk" },
      mood: { ar: "توازن بين الفخامة والانتعاش", en: "balanced between richness and freshness" }
    },
    {
      title: { ar: "إرث الصندل", en: "Sandal Legacy" },
      category: { ar: "العطور الخشبية الملكية", en: "Royal Woody Perfumes" },
      top: { ar: "هيل أخضر وبرغموت", en: "green cardamom and bergamot" },
      heart: { ar: "خشب الصندل والكشمير", en: "sandalwood and cashmere wood" },
      base: { ar: "فانيلا مدخنة وتونكا", en: "smoked vanilla and tonka bean" },
      mood: { ar: "عمق أنيق بطابع نبيل", en: "noble depth with elegant character" }
    },
    {
      title: { ar: "شفق الورد", en: "Rose Dusk" },
      category: { ar: "العطور الزهرية الراقية", en: "Refined Floral Perfumes" },
      top: { ar: "ورد تركي وتوت أحمر", en: "Turkish rose and red berries" },
      heart: { ar: "فاوانيا وبنفسج", en: "peony and violet" },
      base: { ar: "موسك مخملي وخشب أبيض", en: "velvet musk and white woods" },
      mood: { ar: "أنوثة راقية بطابع فاخر", en: "refined femininity with luxurious depth" }
    },
    {
      title: { ar: "هالة المسك", en: "Musk Aura" },
      category: { ar: "العطور الزهرية الراقية", en: "Refined Floral Perfumes" },
      top: { ar: "ألدهيدات ناعمة وبرغموت", en: "soft aldehydes and bergamot" },
      heart: { ar: "زنبق ومسك بودري", en: "lily and powdery musk" },
      base: { ar: "عنبر أبيض وخشب الأرز", en: "white amber and cedarwood" },
      mood: { ar: "نظافة فاخرة مريحة للحواس", en: "clean luxury with soothing softness" }
    },
    {
      title: { ar: "صدى الزعفران", en: "Saffron Echo" },
      category: { ar: "العطور الشرقية الفاخرة", en: "Luxury Oriental Perfumes" },
      top: { ar: "زعفران وفلفل أسود", en: "saffron and black pepper" },
      heart: { ar: "ورد طائفي وراتنج", en: "Taif rose and resins" },
      base: { ar: "لبان وعود معتق", en: "frankincense and aged oud" },
      mood: { ar: "قوة فاخرة للمساء", en: "a bold luxury profile for evenings" }
    },
    {
      title: { ar: "سر السحاب", en: "Cloud Secret" },
      category: { ar: "العطور المنعشة اليومية", en: "Fresh Everyday Perfumes" },
      top: { ar: "جريب فروت وزنجبيل", en: "grapefruit and ginger" },
      heart: { ar: "شاي أخضر وخزامى", en: "green tea and lavender" },
      base: { ar: "موس أبيض وأمبروكسان", en: "white moss and ambroxan" },
      mood: { ar: "خفّة عصرية بنكهة راقية", en: "modern lightness with a premium signature" }
    },
    {
      title: { ar: "عطر المخمل", en: "Velvet Veil" },
      category: { ar: "عطور المناسبات الخاصة", en: "Special Occasion Perfumes" },
      top: { ar: "كرز أسود وفلفل وردي", en: "black cherry and pink pepper" },
      heart: { ar: "ورد داكن وقرفة", en: "dark rose and cinnamon" },
      base: { ar: "فانيلا سوداء وعنبر كثيف", en: "black vanilla and dense amber" },
      mood: { ar: "جاذبية حاضرة في السهرات", en: "a magnetic presence for evening events" }
    },
    {
      title: { ar: "نبض الفجر", en: "Dawn Pulse" },
      category: { ar: "العطور المنعشة اليومية", en: "Fresh Everyday Perfumes" },
      top: { ar: "ليمون صقلي وتفاح أخضر", en: "Sicilian lemon and green apple" },
      heart: { ar: "نيرولي وخزامى", en: "neroli and lavender" },
      base: { ar: "أخشاب فاتحة ومسك", en: "light woods and musk" },
      mood: { ar: "طاقة متجددة لبداية اليوم", en: "renewed energy for the start of the day" }
    },
    {
      title: { ar: "وتر البنفسج", en: "Violet Chord" },
      category: { ar: "العطور الزهرية الراقية", en: "Refined Floral Perfumes" },
      top: { ar: "بنفسج وإجاص", en: "violet and pear" },
      heart: { ar: "سوسن وفاوانيا", en: "iris and peony" },
      base: { ar: "خشب الأرز والعنبر", en: "cedarwood and amber" },
      mood: { ar: "رهافة فنية بطابع مترف", en: "an artistic floral profile with upscale elegance" }
    },
    {
      title: { ar: "وقار الأرز", en: "Cedar Prestige" },
      category: { ar: "العطور الخشبية الملكية", en: "Royal Woody Perfumes" },
      top: { ar: "عرعر وبرغموت", en: "juniper and bergamot" },
      heart: { ar: "أرز أطلسي ومرمية", en: "Atlas cedar and sage" },
      base: { ar: "باتشولي ومسك رمادي", en: "patchouli and grey musk" },
      mood: { ar: "شخصية واثقة ومتصالحة", en: "a confident and composed personality" }
    },
    {
      title: { ar: "بريق الفانيلا", en: "Vanilla Radiance" },
      category: { ar: "عطور المناسبات الخاصة", en: "Special Occasion Perfumes" },
      top: { ar: "جوز الهند واليوسفي", en: "coconut and mandarin" },
      heart: { ar: "فانيلا بوربون وياسمين", en: "Bourbon vanilla and jasmine" },
      base: { ar: "سكر محروق ومسك كريمي", en: "burnt sugar and creamy musk" },
      mood: { ar: "دفء جذاب بإحساس فاخر", en: "warm allure with luxurious comfort" }
    },
    {
      title: { ar: "عاصمة الندى", en: "Dew Capital" },
      category: { ar: "العطور المنعشة اليومية", en: "Fresh Everyday Perfumes" },
      top: { ar: "ريحان أخضر وليمون", en: "green basil and lemon" },
      heart: { ar: "ماغنوليا وشاي أبيض", en: "magnolia and white tea" },
      base: { ar: "خشب كشمير ومسك نقي", en: "cashmere wood and pure musk" },
      mood: { ar: "نعومة منعشة مناسبة للعمل", en: "fresh smoothness ideal for daily business wear" }
    },
    {
      title: { ar: "ديوان البخور", en: "Incense Majlis" },
      category: { ar: "العطور الشرقية الفاخرة", en: "Luxury Oriental Perfumes" },
      top: { ar: "لبان وورد مجفف", en: "frankincense and dried rose" },
      heart: { ar: "بخور عربي وعنبر", en: "Arabic incense and amber" },
      base: { ar: "عود كمبودي ومسك داكن", en: "Cambodian oud and dark musk" },
      mood: { ar: "هيبة أصيلة بطابع خليجي", en: "authentic prestige with a Gulf-inspired soul" }
    },
    {
      title: { ar: "روح الكشمير", en: "Cashmere Soul" },
      category: { ar: "العطور الخشبية الملكية", en: "Royal Woody Perfumes" },
      top: { ar: "هال ناعم وبرغموت", en: "soft cardamom and bergamot" },
      heart: { ar: "كشميران وسوسن", en: "cashmeran and iris" },
      base: { ar: "صندل وفانيلا خفيفة", en: "sandalwood and soft vanilla" },
      mood: { ar: "فخامة هادئة للاستخدام اليومي", en: "quiet luxury suitable for daily wear" }
    },
    {
      title: { ar: "قصر التوابل", en: "Spice Palace" },
      category: { ar: "عطور المناسبات الخاصة", en: "Special Occasion Perfumes" },
      top: { ar: "قرنفل وقرفة", en: "clove and cinnamon" },
      heart: { ar: "ورد أسود وجلد ناعم", en: "dark rose and smooth leather" },
      base: { ar: "باتشولي وبنزوين", en: "patchouli and benzoin" },
      mood: { ar: "حضور دافئ للمواسم الباردة", en: "a warm signature for cooler seasons" }
    }
  ];

  const editions = [
    {
      label: { ar: "إصدار النخبة", en: "Elite Edition" },
      size_ml: 75,
      concentration: { ar: "أو دو بارفان", en: "Eau de Parfum" },
      price_boost: 0
    },
    {
      label: { ar: "ليالي الخليج", en: "Gulf Nights" },
      size_ml: 90,
      concentration: { ar: "إكستريت دو بارفان", en: "Extrait de Parfum" },
      price_boost: 45
    },
    {
      label: { ar: "توقيع الحرير", en: "Silk Signature" },
      size_ml: 100,
      concentration: { ar: "أو دو بارفان إنتنس", en: "Eau de Parfum Intense" },
      price_boost: 80
    },
    {
      label: { ar: "نسخة البريستيج", en: "Prestige Reserve" },
      size_ml: 120,
      concentration: { ar: "تركيز ملكي", en: "Royal Concentrate" },
      price_boost: 135
    }
  ];

  const badges = [
    { ar: "الأكثر طلبًا", en: "Best Seller" },
    { ar: "جديد", en: "New Arrival" },
    { ar: "إصدار حصري", en: "Exclusive Edition" },
    { ar: "عرض خاص", en: "Limited Offer" }
  ];

  const products = [];
  let id = 1;

  families.forEach((family, familyIndex) => {
    editions.forEach((edition, editionIndex) => {
      const basePrice = 285 + familyIndex * 18 + edition.price_boost;
      const discountRate = 0.15 + ((familyIndex + editionIndex) % 4) * 0.04;
      const salePrice = Math.round(basePrice * (1 - discountRate));
      const originalPrice = Math.round(basePrice);
      const sku = `RNQ-${String(id).padStart(4, "0")}`;
      const badge = badges[(familyIndex + editionIndex) % badges.length];

      const nameAr = `${family.title.ar} - ${edition.label.ar}`;
      const nameEn = `${family.title.en} - ${edition.label.en}`;

      const descriptionAr = [
        `عطر "${nameAr}" يجسد فلسفة الفخامة الهادئة عبر افتتاحية من ${family.top.ar} ثم قلب عطري متوازن من ${family.heart.ar}، لينتهي بقاعدة ثابتة من ${family.base.ar}.`,
        `تم تطوير هذه التركيبة لتقديم ${family.mood.ar} مع ثبات عالٍ وفوحان متدرج يناسب أجواء السوق الخليجي سواء في الاجتماعات اليومية أو المناسبات المسائية.`,
        `يأتي هذا الإصدار بسعة ${edition.size_ml} مل وتركيز ${edition.concentration.ar}، ما يمنحك أداءً احترافيًا يدوم لساعات طويلة مع بصمة أنيقة لا تُنسى.`,
        `إذا كنت تبحث عن توقيع عطري يعكس الذوق الرفيع ويجمع بين الأصالة والحداثة، فهذا المنتج خيار مثالي ضمن تشكيلات ${storeNameAr} الجاهزة للتشغيل الفوري.`
      ].join(" ");

      const descriptionEn = [
        `"${nameEn}" represents quiet luxury, opening with ${family.top.en}, moving into a balanced heart of ${family.heart.en}, and settling into a long-lasting base of ${family.base.en}.`,
        `The blend is crafted to deliver ${family.mood.en}, with strong longevity and refined diffusion suited to both daytime business and evening occasions across the Gulf market.`,
        `This release comes in ${edition.size_ml} ml at ${edition.concentration.en} strength, delivering a polished performance and a memorable scent trail.`,
        `If you are building a signature fragrance wardrobe that blends heritage with modern elegance, this scent is a premium choice from the ${storeNameEn} collection.`
      ].join(" ");

      products.push({
        id,
        sku,
        name_ar: nameAr,
        name_en: nameEn,
        category_ar: family.category.ar,
        category_en: family.category.en,
        badge_ar: badge.ar,
        badge_en: badge.en,
        description_ar: descriptionAr,
        description_en: descriptionEn,
        concentration_ar: edition.concentration.ar,
        concentration_en: edition.concentration.en,
        volume_ml: edition.size_ml,
        original_price: originalPrice,
        sale_price: salePrice,
        discount_percent: Math.round((1 - salePrice / originalPrice) * 100),
        stock_status_ar: "متوفر",
        stock_status_en: "In Stock",
        image_tone: (familyIndex + editionIndex) % 5
      });
      id += 1;
    });
  });

  const marketProducts = [
    {
      name_ar: "أرماف كلوب دي نايت إنتنس مان",
      name_en: "Armaf Club de Nuit Intense Man",
      category_ar: "عطور دبي الأصلية",
      category_en: "Authentic Dubai Perfumes",
      concentration_ar: "أو دو تواليت",
      concentration_en: "Eau de Toilette",
      volume_ml: 105,
      original_price: 289,
      sale_price: 239,
      image_tone: 0,
      top_ar: "الليمون والأناناس والبرغموت",
      heart_ar: "الباتشولي والياسمين والبتولا",
      base_ar: "المسك والطحلب والعنبر",
      top_en: "lemon, pineapple, and bergamot",
      heart_en: "patchouli, jasmine, and birch",
      base_en: "musk, oakmoss, and amber",
      supplier_ar: "Armaf Perfumes Wholesale",
      supplier_en: "Armaf Perfumes Wholesale"
    },
    {
      name_ar: "أرماف كلوب دي نايت سيلاج",
      name_en: "Armaf Club de Nuit Sillage",
      category_ar: "عطور دبي الأصلية",
      category_en: "Authentic Dubai Perfumes",
      concentration_ar: "أو دو بارفان",
      concentration_en: "Eau de Parfum",
      volume_ml: 105,
      original_price: 319,
      sale_price: 269,
      image_tone: 1,
      top_ar: "البرغموت والليمون الأسود والبنفسج",
      heart_ar: "السوسن والورد",
      base_ar: "المسك وخشب الصندل",
      top_en: "bergamot, black lemon, and violet leaf",
      heart_en: "iris and rose",
      base_en: "musk and sandalwood",
      supplier_ar: "Armaf Perfumes Wholesale",
      supplier_en: "Armaf Perfumes Wholesale"
    },
    {
      name_ar: "أرماف كلوب دي نايت مايلستون",
      name_en: "Armaf Club de Nuit Milestone",
      category_ar: "عطور دبي الأصلية",
      category_en: "Authentic Dubai Perfumes",
      concentration_ar: "أو دو بارفان",
      concentration_en: "Eau de Parfum",
      volume_ml: 105,
      original_price: 315,
      sale_price: 259,
      image_tone: 2,
      top_ar: "ملاحظات بحرية وتوت أحمر",
      heart_ar: "البنفسج وخشب الصندل",
      base_ar: "المسك والأخشاب المالحة",
      top_en: "marine accord and red berries",
      heart_en: "violet and sandalwood",
      base_en: "musk and salty woods",
      supplier_ar: "Salsabeel Perfumes",
      supplier_en: "Salsabeel Perfumes"
    },
    {
      name_ar: "أرماف كلوب دي نايت وومان",
      name_en: "Armaf Club de Nuit Woman",
      category_ar: "عطور دبي الأصلية",
      category_en: "Authentic Dubai Perfumes",
      concentration_ar: "أو دو بارفان",
      concentration_en: "Eau de Parfum",
      volume_ml: 105,
      original_price: 275,
      sale_price: 229,
      image_tone: 3,
      top_ar: "البرتقال والبرغموت والجريب فروت",
      heart_ar: "الورد والياسمين والخوخ",
      base_ar: "الفانيلا والمسك والباتشولي",
      top_en: "orange, bergamot, and grapefruit",
      heart_en: "rose, jasmine, and peach",
      base_en: "vanilla, musk, and patchouli",
      supplier_ar: "Mousa Perfume",
      supplier_en: "Mousa Perfume"
    },
    {
      name_ar: "أرماف أوديسي هوم",
      name_en: "Armaf Odyssey Homme",
      category_ar: "عطور رجالية رائجة",
      category_en: "Popular Men's Perfumes",
      concentration_ar: "أو دو بارفان",
      concentration_en: "Eau de Parfum",
      volume_ml: 100,
      original_price: 279,
      sale_price: 229,
      image_tone: 4,
      top_ar: "الفانيلا والعنبر",
      heart_ar: "التوابل الدافئة",
      base_ar: "الأخشاب والمسك",
      top_en: "vanilla and amber",
      heart_en: "warm spices",
      base_en: "woods and musk",
      supplier_ar: "Perfumes Wholesale Dubai",
      supplier_en: "Perfumes Wholesale Dubai"
    },
    {
      name_ar: "أرماف أوديسي ميغا",
      name_en: "Armaf Odyssey Mega",
      category_ar: "عطور رجالية رائجة",
      category_en: "Popular Men's Perfumes",
      concentration_ar: "أو دو بارفان",
      concentration_en: "Eau de Parfum",
      volume_ml: 100,
      original_price: 289,
      sale_price: 235,
      image_tone: 0,
      top_ar: "البرتقال والليمون والنعناع",
      heart_ar: "الزنجبيل واللافندر",
      base_ar: "خشب الأرز والمسك",
      top_en: "orange, lemon, and mint",
      heart_en: "ginger and lavender",
      base_en: "cedarwood and musk",
      supplier_ar: "SOB Fragrance",
      supplier_en: "SOB Fragrance"
    },
    {
      name_ar: "أرماف تريس نوي",
      name_en: "Armaf Tres Nuit",
      category_ar: "عطور رجالية رائجة",
      category_en: "Popular Men's Perfumes",
      concentration_ar: "أو دو بارفان",
      concentration_en: "Eau de Parfum",
      volume_ml: 100,
      original_price: 265,
      sale_price: 219,
      image_tone: 1,
      top_ar: "الليمون والليمون الحامض",
      heart_ar: "الخزامى والبنفسج",
      base_ar: "العنبر وخشب الصندل",
      top_en: "lemon and verbena",
      heart_en: "lavender and violet",
      base_en: "amber and sandalwood",
      supplier_ar: "Armaf Perfumes Wholesale",
      supplier_en: "Armaf Perfumes Wholesale"
    },
    {
      name_ar: "لطافة خمره",
      name_en: "Lattafa Khamrah",
      category_ar: "عطور شرقية شهيرة",
      category_en: "Best-Selling Oriental Perfumes",
      concentration_ar: "أو دو بارفان",
      concentration_en: "Eau de Parfum",
      volume_ml: 100,
      original_price: 269,
      sale_price: 219,
      image_tone: 2,
      top_ar: "القرفة وجوزة الطيب",
      heart_ar: "التمر والبرالين",
      base_ar: "الفانيلا والعنبر وخشب العود",
      top_en: "cinnamon and nutmeg",
      heart_en: "dates and praline",
      base_en: "vanilla, amber, and oud wood",
      supplier_ar: "Salsabeel Perfumes",
      supplier_en: "Salsabeel Perfumes"
    },
    {
      name_ar: "لطافة خمره قهوة",
      name_en: "Lattafa Khamrah Qahwa",
      category_ar: "عطور شرقية شهيرة",
      category_en: "Best-Selling Oriental Perfumes",
      concentration_ar: "أو دو بارفان",
      concentration_en: "Eau de Parfum",
      volume_ml: 100,
      original_price: 279,
      sale_price: 229,
      image_tone: 3,
      top_ar: "القهوة المحمصة والتوابل",
      heart_ar: "التمر والقرفة",
      base_ar: "الفانيلا والعنبر",
      top_en: "roasted coffee and spices",
      heart_en: "dates and cinnamon",
      base_en: "vanilla and amber",
      supplier_ar: "Mousa Perfume",
      supplier_en: "Mousa Perfume"
    },
    {
      name_ar: "لطافة أسد",
      name_en: "Lattafa Asad",
      category_ar: "عطور رجالية رائجة",
      category_en: "Popular Men's Perfumes",
      concentration_ar: "أو دو بارفان",
      concentration_en: "Eau de Parfum",
      volume_ml: 100,
      original_price: 249,
      sale_price: 205,
      image_tone: 4,
      top_ar: "الفلفل الأسود والتبغ",
      heart_ar: "القهوة والباتشولي",
      base_ar: "الفانيلا والعنبر",
      top_en: "black pepper and tobacco",
      heart_en: "coffee and patchouli",
      base_en: "vanilla and amber",
      supplier_ar: "Makazn",
      supplier_en: "Makazn"
    },
    {
      name_ar: "لطافة بديع العود - عود فور غلوري",
      name_en: "Lattafa Badee Al Oud - Oud for Glory",
      category_ar: "عطور العود الفاخرة",
      category_en: "Premium Oud Perfumes",
      concentration_ar: "أو دو بارفان",
      concentration_en: "Eau de Parfum",
      volume_ml: 100,
      original_price: 299,
      sale_price: 245,
      image_tone: 0,
      top_ar: "الزعفران وجوزة الطيب",
      heart_ar: "العود والباتشولي",
      base_ar: "المسك والعنبر",
      top_en: "saffron and nutmeg",
      heart_en: "oud and patchouli",
      base_en: "musk and amber",
      supplier_ar: "Perfumes Wholesale Dubai",
      supplier_en: "Perfumes Wholesale Dubai"
    },
    {
      name_ar: "لطافة فخر بلاك",
      name_en: "Lattafa Fakhar Black",
      category_ar: "عطور رجالية رائجة",
      category_en: "Popular Men's Perfumes",
      concentration_ar: "أو دو بارفان",
      concentration_en: "Eau de Parfum",
      volume_ml: 100,
      original_price: 259,
      sale_price: 209,
      image_tone: 1,
      top_ar: "التفاح والزنجبيل والبرغموت",
      heart_ar: "الخزامى والمريمية",
      base_ar: "الأمبروكسان وخشب الأرز",
      top_en: "apple, ginger, and bergamot",
      heart_en: "lavender and sage",
      base_en: "ambroxan and cedarwood",
      supplier_ar: "SOB Fragrance",
      supplier_en: "SOB Fragrance"
    },
    {
      name_ar: "أفنان 9 بي إم",
      name_en: "Afnan 9PM",
      category_ar: "عطور المساء الأكثر مبيعًا",
      category_en: "Best-Selling Evening Perfumes",
      concentration_ar: "أو دو بارفان",
      concentration_en: "Eau de Parfum",
      volume_ml: 100,
      original_price: 269,
      sale_price: 219,
      image_tone: 2,
      top_ar: "التفاح والقرفة",
      heart_ar: "زهر البرتقال والخزامى",
      base_ar: "الفانيلا والتونكا",
      top_en: "apple and cinnamon",
      heart_en: "orange blossom and lavender",
      base_en: "vanilla and tonka bean",
      supplier_ar: "Makazn",
      supplier_en: "Makazn"
    },
    {
      name_ar: "أفنان سوبريماسي نوت أونلي إنتنس",
      name_en: "Afnan Supremacy Not Only Intense",
      category_ar: "عطور المساء الأكثر مبيعًا",
      category_en: "Best-Selling Evening Perfumes",
      concentration_ar: "أكستريت دي بارفان",
      concentration_en: "Extrait de Parfum",
      volume_ml: 100,
      original_price: 339,
      sale_price: 279,
      image_tone: 3,
      top_ar: "البرغموت والتفاح الأسود",
      heart_ar: "البتولا والباتشولي",
      base_ar: "العنبر والمسك والطحلب",
      top_en: "bergamot and black currant apple accord",
      heart_en: "birch and patchouli",
      base_en: "amber, musk, and moss",
      supplier_ar: "Salsabeel Perfumes",
      supplier_en: "Salsabeel Perfumes"
    },
    {
      name_ar: "سويس أربيان شغف عود",
      name_en: "Swiss Arabian Shaghaf Oud",
      category_ar: "عطور العود الفاخرة",
      category_en: "Premium Oud Perfumes",
      concentration_ar: "أو دو بارفان",
      concentration_en: "Eau de Parfum",
      volume_ml: 75,
      original_price: 359,
      sale_price: 299,
      image_tone: 4,
      top_ar: "الزعفران والورد",
      heart_ar: "العود والبرالين",
      base_ar: "الفانيلا والعنبر",
      top_en: "saffron and rose",
      heart_en: "oud and praline",
      base_en: "vanilla and amber",
      supplier_ar: "Mousa Perfume",
      supplier_en: "Mousa Perfume"
    },
    {
      name_ar: "سويس أربيان شغف عود أسود",
      name_en: "Swiss Arabian Shaghaf Oud Aswad",
      category_ar: "عطور العود الفاخرة",
      category_en: "Premium Oud Perfumes",
      concentration_ar: "أو دو بارفان",
      concentration_en: "Eau de Parfum",
      volume_ml: 75,
      original_price: 369,
      sale_price: 309,
      image_tone: 0,
      top_ar: "الزعفران والزعتر",
      heart_ar: "الورد والعود",
      base_ar: "الجلد والعنبر",
      top_en: "saffron and thyme",
      heart_en: "rose and oud",
      base_en: "leather and amber",
      supplier_ar: "SOB Fragrance",
      supplier_en: "SOB Fragrance"
    },
    {
      name_ar: "رصاصي هواس للرجال",
      name_en: "Rasasi Hawas for Him",
      category_ar: "عطور رجالية رائجة",
      category_en: "Popular Men's Perfumes",
      concentration_ar: "أو دو بارفان",
      concentration_en: "Eau de Parfum",
      volume_ml: 100,
      original_price: 319,
      sale_price: 269,
      image_tone: 1,
      top_ar: "التفاح والبرغموت والقرفة",
      heart_ar: "زهر البرتقال والهيل",
      base_ar: "المسك والعنبر",
      top_en: "apple, bergamot, and cinnamon",
      heart_en: "orange blossom and cardamom",
      base_en: "musk and amber",
      supplier_ar: "Haraj Perfumes",
      supplier_en: "Haraj Perfumes"
    },
    {
      name_ar: "أجمل أمبر وود",
      name_en: "Ajmal Amber Wood",
      category_ar: "عطور نيش خليجية",
      category_en: "GCC Niche Signatures",
      concentration_ar: "أو دو بارفان",
      concentration_en: "Eau de Parfum",
      volume_ml: 100,
      original_price: 479,
      sale_price: 399,
      image_tone: 2,
      top_ar: "التفاح والبهارات البيضاء",
      heart_ar: "العنبر والأخشاب",
      base_ar: "الفانيلا والمسك",
      top_en: "apple and white spices",
      heart_en: "amber and woods",
      base_en: "vanilla and musk",
      supplier_ar: "Makazn",
      supplier_en: "Makazn"
    },
    {
      name_ar: "الحرمين أمبر عود جولد إيديشن",
      name_en: "Al Haramain Amber Oud Gold Edition",
      category_ar: "عطور نيش خليجية",
      category_en: "GCC Niche Signatures",
      concentration_ar: "أو دو بارفان",
      concentration_en: "Eau de Parfum",
      volume_ml: 120,
      original_price: 429,
      sale_price: 359,
      image_tone: 3,
      top_ar: "البرغموت والملاحظات الخضراء",
      heart_ar: "الأناناس والبطيخ",
      base_ar: "الفانيلا والمسك والعنبر",
      top_en: "bergamot and green notes",
      heart_en: "pineapple and melon",
      base_en: "vanilla, musk, and amber",
      supplier_ar: "Smart Projects Co.",
      supplier_en: "Smart Projects Co."
    },
    {
      name_ar: "ميزون الحمراء بورتو نيرولي",
      name_en: "Maison Alhambra Porto Neroli",
      category_ar: "عطور حمضية صيفية",
      category_en: "Fresh Citrus Summer Perfumes",
      concentration_ar: "أو دو بارفان",
      concentration_en: "Eau de Parfum",
      volume_ml: 80,
      original_price: 229,
      sale_price: 189,
      image_tone: 4,
      top_ar: "النيرولي والبرغموت",
      heart_ar: "زهر البرتقال والياسمين",
      base_ar: "المسك الأبيض والعنبر الخفيف",
      top_en: "neroli and bergamot",
      heart_en: "orange blossom and jasmine",
      base_en: "white musk and light amber",
      supplier_ar: "Perfumes Wholesale Dubai",
      supplier_en: "Perfumes Wholesale Dubai"
    }
  ];

  const marketBadges = [
    { ar: "منتج حقيقي", en: "Authentic Product" },
    { ar: "الأكثر طلبًا", en: "Top Seller" },
    { ar: "جاهز للشحن", en: "Ready to Ship" },
    { ar: "سعر جملة", en: "Wholesale Value" }
  ];

  marketProducts.forEach((entry, index) => {
    const sku = `RNQ-${String(id).padStart(4, "0")}`;
    const badge = marketBadges[index % marketBadges.length];
    const discountPercent = Math.max(
      0,
      Math.round((1 - entry.sale_price / entry.original_price) * 100)
    );
    const descriptionAr = [
      `منتج "${entry.name_ar}" من العطور الحقيقية المتداولة في سوق الخليج، بتركيبة تبدأ بـ ${entry.top_ar} ثم قلب عطري من ${entry.heart_ar} وتنتهي بقاعدة من ${entry.base_ar}.`,
      `تم اختيار هذا المنتج ضمن تشكيلة ${storeNameAr} ليمنح العميل خيارًا معروفًا في السوق مع تسعير تنافسي مناسب للبيع السريع وحملات العروض.`,
      `يأتي بحجم ${entry.volume_ml} مل بتركيز ${entry.concentration_ar}، مع مستوى ثبات وفوحان مناسب للاستخدام اليومي والمناسبات.`,
      `يتم توريده عبر قنوات جملة موثوقة مثل ${entry.supplier_ar}، ما يعزز ثقة العميل النهائي بأن المتجر يقدم خيارات حقيقية وليست تجريبية.`
    ].join(" ");

    const descriptionEn = [
      `"${entry.name_en}" is a real market-recognized fragrance in GCC demand, opening with ${entry.top_en}, developing into ${entry.heart_en}, and settling on ${entry.base_en}.`,
      `This product was added to the ${storeNameEn} collection to provide commercially proven options with pricing that supports fast turnover and campaign-based selling.`,
      `It comes in ${entry.volume_ml} ml at ${entry.concentration_en} concentration, offering strong day-to-evening usability for broad customer segments.`,
      `Supply confidence is strengthened through wholesale-oriented channels such as ${entry.supplier_en}, helping position the storefront as a ready-to-trade business asset.`
    ].join(" ");

    products.push({
      id,
      sku,
      name_ar: entry.name_ar,
      name_en: entry.name_en,
      category_ar: entry.category_ar,
      category_en: entry.category_en,
      badge_ar: badge.ar,
      badge_en: badge.en,
      description_ar: descriptionAr,
      description_en: descriptionEn,
      concentration_ar: entry.concentration_ar,
      concentration_en: entry.concentration_en,
      volume_ml: entry.volume_ml,
      original_price: entry.original_price,
      sale_price: entry.sale_price,
      discount_percent: discountPercent,
      stock_status_ar: "متوفر",
      stock_status_en: "In Stock",
      image_tone: entry.image_tone
    });
    id += 1;
  });

  return products;
}

module.exports = {
  buildStoreSettings,
  buildFaqs,
  generateProducts
};
