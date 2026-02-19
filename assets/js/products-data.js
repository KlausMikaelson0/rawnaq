"use strict";

(function createProductsData() {
  function pickLocalized(value, lang) {
    if (value && typeof value === "object" && !Array.isArray(value)) {
      return value[lang] || value.ar || value.en || "";
    }
    return value || "";
  }

  const defaultConfig = window.DEFAULT_STORE_CONFIG || {};
  const storeNameAr = pickLocalized(defaultConfig.name, "ar") || "رونق";
  const storeNameEn = pickLocalized(defaultConfig.name, "en") || "Rawnaq";

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
      sizeMl: 75,
      concentration: { ar: "أو دو بارفان", en: "Eau de Parfum" },
      priceBoost: 0
    },
    {
      label: { ar: "ليالي الخليج", en: "Gulf Nights" },
      sizeMl: 90,
      concentration: { ar: "إكستريت دو بارفان", en: "Extrait de Parfum" },
      priceBoost: 45
    },
    {
      label: { ar: "توقيع الحرير", en: "Silk Signature" },
      sizeMl: 100,
      concentration: { ar: "أو دو بارفان إنتنس", en: "Eau de Parfum Intense" },
      priceBoost: 80
    },
    {
      label: { ar: "نسخة البريستيج", en: "Prestige Reserve" },
      sizeMl: 120,
      concentration: { ar: "تركيز ملكي", en: "Royal Concentrate" },
      priceBoost: 135
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
      const name = {
        ar: `${family.title.ar} - ${edition.label.ar}`,
        en: `${family.title.en} - ${edition.label.en}`
      };
      const basePrice = 285 + familyIndex * 18 + edition.priceBoost;
      const discountRate = 0.15 + ((familyIndex + editionIndex) % 4) * 0.04;
      const salePrice = Math.round(basePrice * (1 - discountRate));
      const originalPrice = Math.round(basePrice);
      const sku = `RNQ-${String(id).padStart(4, "0")}`;
      const badge = badges[(familyIndex + editionIndex) % badges.length];

      const description = {
        ar: [
          `عطر "${name.ar}" يجسد فلسفة الفخامة الهادئة عبر افتتاحية من ${family.top.ar} ثم قلب عطري متوازن من ${family.heart.ar}، لينتهي بقاعدة ثابتة من ${family.base.ar}.`,
          `تم تطوير هذه التركيبة لتقديم ${family.mood.ar} مع ثبات عالٍ وفوحان متدرج يناسب أجواء السوق الخليجي سواء في الاجتماعات اليومية أو المناسبات المسائية.`,
          `يأتي هذا الإصدار بسعة ${edition.sizeMl} مل وتركيز ${edition.concentration.ar}، ما يمنحك أداءً احترافيًا يدوم لساعات طويلة مع بصمة أنيقة لا تُنسى.`,
          `إذا كنت تبحث عن توقيع عطري يعكس الذوق الرفيع ويجمع بين الأصالة والحداثة، فهذا المنتج خيار مثالي ضمن تشكيلات ${storeNameAr} الجاهزة للتشغيل الفوري.`
        ].join(" "),
        en: [
          `"${name.en}" represents quiet luxury, opening with ${family.top.en}, moving into a balanced heart of ${family.heart.en}, and settling into a long-lasting base of ${family.base.en}.`,
          `The blend is crafted to deliver ${family.mood.en}, with strong longevity and refined diffusion suited to both daytime business and evening occasions across the Gulf market.`,
          `This release comes in ${edition.sizeMl} ml at ${edition.concentration.en} strength, delivering a polished performance and a memorable scent trail.`,
          `If you are building a signature fragrance wardrobe that blends heritage with modern elegance, this scent is a premium choice from the ${storeNameEn} collection.`
        ].join(" ")
      };

      products.push({
        id,
        sku,
        name,
        category: family.category,
        description,
        topNotes: family.top,
        heartNotes: family.heart,
        baseNotes: family.base,
        volumeMl: edition.sizeMl,
        concentration: edition.concentration,
        badge,
        originalPrice,
        salePrice,
        discountPercent: Math.round((1 - salePrice / originalPrice) * 100),
        stockStatus: { ar: "متوفر", en: "In Stock" },
        imageTone: (familyIndex + editionIndex) % 5
      });
      id += 1;
    });
  });

  window.DEFAULT_PRODUCTS = Object.freeze(products);
})();
