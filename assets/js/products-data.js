"use strict";

(function createProductsData() {
  const storeName =
    (window.STORE_CONFIG && window.STORE_CONFIG.name) || "رونق";

  const families = [
    {
      title: "سمو الليل",
      category: "العطور الشرقية الفاخرة",
      top: "الزعفران والهيل",
      heart: "الورد الدمشقي والعنبر",
      base: "العود والمسك الأبيض",
      mood: "حضور ملكي للمناسبات الراقية"
    },
    {
      title: "تاج العود",
      category: "العطور الخشبية الملكية",
      top: "الفلفل الوردي والبرغموت",
      heart: "خشب الغاياك والجلد الناعم",
      base: "عود هندي معتق وفانيلا داكنة",
      mood: "أناقة حاسمة في اللقاءات الرسمية"
    },
    {
      title: "همس الياسمين",
      category: "العطور الزهرية الراقية",
      top: "الياسمين والكمثرى",
      heart: "زهرة البرتقال والإيلنغ",
      base: "مسك حريري وخشب الصندل",
      mood: "رقي ناعم للإطلالات النهارية"
    },
    {
      title: "نسيم اللؤلؤ",
      category: "العطور المنعشة اليومية",
      top: "الليمون الأخضر والنعناع",
      heart: "لافندر وماء زهر",
      base: "أرز أبيض ومسك نقي",
      mood: "انتعاش فاخر يدوم طوال اليوم"
    },
    {
      title: "رحيق الذهب",
      category: "العطور الشرقية الفاخرة",
      top: "قشر البرتقال والزعفران",
      heart: "العسل الأبيض والسوسن",
      base: "باتشولي وعنبر ذهبي",
      mood: "دفء فاخر يلفت الانتباه"
    },
    {
      title: "موج العنبر",
      category: "العطور الشرقية الفاخرة",
      top: "نسيم بحري ومندرين",
      heart: "عنبر رمادي وورد أبيض",
      base: "طحلب السنديان والمسك",
      mood: "توازن بين الفخامة والانتعاش"
    },
    {
      title: "إرث الصندل",
      category: "العطور الخشبية الملكية",
      top: "هيل أخضر وبرغموت",
      heart: "خشب الصندل والكشمير",
      base: "فانيلا مدخنة وتونكا",
      mood: "عمق أنيق بطابع نبيل"
    },
    {
      title: "شفق الورد",
      category: "العطور الزهرية الراقية",
      top: "ورد تركي وتوت أحمر",
      heart: "فاوانيا وبنفسج",
      base: "موسك مخملي وخشب أبيض",
      mood: "أنوثة راقية بطابع فاخر"
    },
    {
      title: "هالة المسك",
      category: "العطور الزهرية الراقية",
      top: "ألدهيدات ناعمة وبرغموت",
      heart: "زنبق ومسك بودري",
      base: "عنبر أبيض وخشب الأرز",
      mood: "نظافة فاخرة مريحة للحواس"
    },
    {
      title: "صدى الزعفران",
      category: "العطور الشرقية الفاخرة",
      top: "زعفران وفلفل أسود",
      heart: "ورد طائفي وراتنج",
      base: "لبان وعود معتق",
      mood: "قوة فاخرة للمساء"
    },
    {
      title: "سر السحاب",
      category: "العطور المنعشة اليومية",
      top: "جريب فروت وزنجبيل",
      heart: "شاي أخضر وخزامى",
      base: "موس أبيض وأمبروكسان",
      mood: "خفّة عصرية بنكهة راقية"
    },
    {
      title: "عطر المخمل",
      category: "عطور المناسبات الخاصة",
      top: "كرز أسود وفلفل وردي",
      heart: "ورد داكن وقرفة",
      base: "فانيلا سوداء وعنبر كثيف",
      mood: "جاذبية حاضرة في السهرات"
    },
    {
      title: "نبض الفجر",
      category: "العطور المنعشة اليومية",
      top: "ليمون صقلي وتفاح أخضر",
      heart: "نيرولي وخزامى",
      base: "أخشاب فاتحة ومسك",
      mood: "طاقة متجددة لبداية اليوم"
    },
    {
      title: "وتر البنفسج",
      category: "العطور الزهرية الراقية",
      top: "بنفسج وإجاص",
      heart: "سوسن وفاوانيا",
      base: "خشب الأرز والعنبر",
      mood: "رهافة فنية بطابع مترف"
    },
    {
      title: "وقار الأرز",
      category: "العطور الخشبية الملكية",
      top: "عرعر وبرغموت",
      heart: "أرز أطلسي ومرمية",
      base: "باتشولي ومسك رمادي",
      mood: "شخصية واثقة ومتصالحة"
    },
    {
      title: "بريق الفانيلا",
      category: "عطور المناسبات الخاصة",
      top: "جوز الهند واليوسفي",
      heart: "فانيلا بوربون وياسمين",
      base: "سكر محروق ومسك كريمي",
      mood: "دفء جذاب بإحساس فاخر"
    },
    {
      title: "عاصمة الندى",
      category: "العطور المنعشة اليومية",
      top: "ريحان أخضر وليمون",
      heart: "ماغنوليا وشاي أبيض",
      base: "خشب كشمير ومسك نقي",
      mood: "نعومة منعشة مناسبة للعمل"
    },
    {
      title: "ديوان البخور",
      category: "العطور الشرقية الفاخرة",
      top: "لبان وورد مجفف",
      heart: "بخور عربي وعنبر",
      base: "عود كمبودي ومسك داكن",
      mood: "هيبة أصيلة بطابع خليجي"
    },
    {
      title: "روح الكشمير",
      category: "العطور الخشبية الملكية",
      top: "هال ناعم وبرغموت",
      heart: "كشميران وسوسن",
      base: "صندل وفانيلا خفيفة",
      mood: "فخامة هادئة للاستخدام اليومي"
    },
    {
      title: "قصر التوابل",
      category: "عطور المناسبات الخاصة",
      top: "قرنفل وقرفة",
      heart: "ورد أسود وجلد ناعم",
      base: "باتشولي وبنزوين",
      mood: "حضور دافئ للمواسم الباردة"
    }
  ];

  const editions = [
    {
      label: "إصدار النخبة",
      sizeMl: 75,
      concentration: "Eau de Parfum",
      priceBoost: 0
    },
    {
      label: "ليالي الخليج",
      sizeMl: 90,
      concentration: "Extrait de Parfum",
      priceBoost: 45
    },
    {
      label: "توقيع الحرير",
      sizeMl: 100,
      concentration: "Eau de Parfum Intense",
      priceBoost: 80
    },
    {
      label: "نسخة البريستيج",
      sizeMl: 120,
      concentration: "Royal Concentrate",
      priceBoost: 135
    }
  ];

  const badges = ["الأكثر طلبًا", "جديد", "إصدار حصري", "عرض خاص"];

  const products = [];
  let id = 1;

  families.forEach((family, familyIndex) => {
    editions.forEach((edition, editionIndex) => {
      const name = `${family.title} - ${edition.label}`;
      const basePrice = 285 + familyIndex * 18 + edition.priceBoost;
      const discountRate = 0.15 + ((familyIndex + editionIndex) % 4) * 0.04;
      const salePrice = Math.round(basePrice * (1 - discountRate));
      const originalPrice = Math.round(basePrice);
      const sku = `RNQ-${String(id).padStart(4, "0")}`;
      const badge = badges[(familyIndex + editionIndex) % badges.length];

      const description = [
        `عطر "${name}" يجسد فلسفة الفخامة الهادئة عبر افتتاحية من ${family.top} ثم قلب عطري متوازن من ${family.heart}، لينتهي بقاعدة ثابتة من ${family.base}.`,
        `تم تطوير هذه التركيبة لتقديم ${family.mood} مع ثبات عالٍ وفوحان متدرج يناسب أجواء السوق الخليجي سواء في الاجتماعات اليومية أو المناسبات المسائية.`,
        `يأتي هذا الإصدار بسعة ${edition.sizeMl} مل وتركيز ${edition.concentration}، ما يمنحك أداءً احترافيًا يدوم لساعات طويلة مع بصمة أنيقة لا تُنسى.`,
        `إذا كنت تبحث عن توقيع عطري يعكس الذوق الرفيع ويجمع بين الأصالة والحداثة، فهذا المنتج خيار مثالي ضمن تشكيلات ${storeName} الجاهزة للتشغيل الفوري.`
      ].join(" ");

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
        stockStatus: "متوفر",
        imageTone: (familyIndex + editionIndex) % 5
      });
      id += 1;
    });
  });

  window.PRODUCTS = Object.freeze(products);
})();
