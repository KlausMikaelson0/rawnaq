"use strict";

(function initI18n() {
  const LANGUAGE_KEY = "rawnaq_lang";
  const STRINGS = Object.freeze({
    ar: {
      nav: {
        home: "الرئيسية",
        products: "المنتجات",
        cart: "السلة",
        faq: "الأسئلة الشائعة",
        about: "من نحن",
        contact: "تواصل معنا",
        checkout: "الدفع"
      },
      header: {
        menuAria: "فتح القائمة",
        homeAria: "العودة إلى الرئيسية",
        shopNow: "تسوق الآن",
        switchLanguage: "EN"
      },
      footer: {
        aboutTitle: "عن {store}",
        aboutText:
          "متجر عطور فاخر جاهز للتشغيل الفوري في السوق الخليجي، بتجربة شراء راقية وهوية بصرية احترافية قابلة لنقل الملكية بالكامل.",
        linksTitle: "روابط مهمة",
        contactTitle: "بيانات التواصل",
        privacy: "سياسة الخصوصية",
        terms: "الشروط والأحكام",
        returns: "سياسة الاسترجاع",
        contact: "تواصل معنا",
        checkout: "الدفع الآمن",
        faq: "الأسئلة الشائعة",
        cart: "السلة",
        admin: "لوحة التحكم",
        email: "البريد",
        phone: "الهاتف",
        city: "المدينة",
        whatsapp: "واتساب مباشر",
        rights: "© {year} {store}. جميع الحقوق محفوظة."
      },
      common: {
        inStock: "متوفر",
        orderNow: "اطلب الآن",
        buyNow: "اشترِ الآن",
        askBeforeOrder: "استفسر قبل الطلب",
        sku: "SKU",
        concentration: "التركيز",
        size: "الحجم",
        longevity: "الثبات",
        high: "عالي",
        ml: "مل",
        discount: "خصم {value}%",
        resultCount: "{count} منتج",
        noResultsTitle: "لا توجد نتائج مطابقة",
        noResultsDesc:
          "غيّر كلمات البحث أو اختر تصنيفًا مختلفًا لعرض منتجات أخرى.",
        allCategories: "الكل",
        contactSuccess:
          "تم استلام رسالتك بنجاح. سيتواصل معك فريق {store} خلال وقت قصير."
      },
      checkout: {
        card: "بطاقات بنكية",
        cardDesc: "فيزا، ماستركارد، وأمريكان إكسبرس مع طبقة حماية 3D Secure.",
        applePay: "Apple Pay",
        applePayDesc: "دفع سريع وآمن عبر أجهزة Apple المتوافقة.",
        mada: "مدى",
        madaDesc: "قبول كامل لبطاقات مدى بما يلائم السوق السعودي.",
        qty: "الكمية",
        subtotal: "الإجمالي الفرعي",
        total: "الإجمالي",
        payNow: "إتمام الدفع الآن",
        success:
          "تم إرسال الطلب بنجاح عبر قناة دفع آمنة. سيتم التواصل معك لتأكيد الشحن.",
        secureInfo:
          "قنوات دفع مشفّرة ومعايير حماية معتمدة لبناء الثقة عند إتمام الطلب."
      },
      cart: {
        add: "أضف للسلة",
        added: "تمت إضافة المنتج إلى السلة.",
        openCart: "عرض السلة",
        totalItems: "عدد القطع",
        lineTotal: "الإجمالي",
        remove: "حذف من السلة",
        emptyTitle: "السلة فارغة",
        emptyDesc: "أضف منتجات من صفحة المنتجات لبدء الطلب.",
        goShopping: "تصفح المنتجات"
      },
      admin: {
        savedSettings: "تم حفظ إعدادات المتجر بنجاح.",
        resetSettings: "تمت إعادة إعدادات المتجر للوضع الافتراضي.",
        savedProduct: "تم حفظ بيانات المنتج بنجاح.",
        resetProducts: "تمت إعادة المنتجات إلى النسخة الافتراضية.",
        imported: "تم استيراد النسخة الاحتياطية بنجاح.",
        importFailed: "فشل الاستيراد. تأكد من صحة ملف النسخة الاحتياطية.",
        exported: "تم تصدير نسخة احتياطية كاملة."
      }
    },
    en: {
      nav: {
        home: "Home",
        products: "Products",
        cart: "Cart",
        faq: "FAQ",
        about: "About",
        contact: "Contact",
        checkout: "Checkout"
      },
      header: {
        menuAria: "Open navigation",
        homeAria: "Back to homepage",
        shopNow: "Shop Now",
        switchLanguage: "AR"
      },
      footer: {
        aboutTitle: "About {store}",
        aboutText:
          "A luxury perfume storefront ready for immediate launch in the GCC market, with premium UX and full ownership transferability.",
        linksTitle: "Quick Links",
        contactTitle: "Contact Details",
        privacy: "Privacy Policy",
        terms: "Terms & Conditions",
        returns: "Return Policy",
        contact: "Contact Us",
        checkout: "Secure Checkout",
        faq: "FAQ",
        cart: "Cart",
        admin: "Admin Panel",
        email: "Email",
        phone: "Phone",
        city: "City",
        whatsapp: "WhatsApp",
        rights: "© {year} {store}. All rights reserved."
      },
      common: {
        inStock: "In Stock",
        orderNow: "Order Now",
        buyNow: "Buy Now",
        askBeforeOrder: "Ask Before Ordering",
        sku: "SKU",
        concentration: "Concentration",
        size: "Size",
        longevity: "Longevity",
        high: "High",
        ml: "ml",
        discount: "{value}% OFF",
        resultCount: "{count} products",
        noResultsTitle: "No matching results",
        noResultsDesc: "Try a different keyword or choose another category.",
        allCategories: "All",
        contactSuccess:
          "Your message has been received. The {store} team will contact you shortly."
      },
      checkout: {
        card: "Bank Cards",
        cardDesc: "Visa, Mastercard, and American Express with 3D Secure protection.",
        applePay: "Apple Pay",
        applePayDesc: "Fast, secure checkout on compatible Apple devices.",
        mada: "mada",
        madaDesc: "Full mada card support tailored for Saudi customers.",
        qty: "Quantity",
        subtotal: "Subtotal",
        total: "Total",
        payNow: "Complete Secure Payment",
        success:
          "Your order has been submitted through a secure payment flow. Our team will confirm shipment shortly.",
        secureInfo:
          "Encrypted payment channels and certified protection standards to build checkout trust."
      },
      cart: {
        add: "Add to Cart",
        added: "Product added to cart.",
        openCart: "View Cart",
        totalItems: "Items",
        lineTotal: "Line Total",
        remove: "Remove",
        emptyTitle: "Your cart is empty",
        emptyDesc: "Add products from the catalog to continue checkout.",
        goShopping: "Browse Products"
      },
      admin: {
        savedSettings: "Store settings were saved successfully.",
        resetSettings: "Store settings were reset to defaults.",
        savedProduct: "Product data was saved successfully.",
        resetProducts: "Products were reset to their default catalog.",
        imported: "Backup imported successfully.",
        importFailed: "Import failed. Please use a valid backup file.",
        exported: "Full backup was exported."
      }
    }
  });

  function pathGet(object, keyPath) {
    return keyPath.split(".").reduce((acc, part) => {
      if (acc && Object.prototype.hasOwnProperty.call(acc, part)) {
        return acc[part];
      }
      return undefined;
    }, object);
  }

  function readStoredLanguage() {
    try {
      const stored = localStorage.getItem(LANGUAGE_KEY);
      if (stored === "ar" || stored === "en") {
        return stored;
      }
    } catch (_error) {
      // ignore
    }
    return null;
  }

  function isEnglishPath() {
    return window.location.pathname.split("/").filter(Boolean).includes("en");
  }

  function getCurrentLanguage() {
    const htmlLang = (document.documentElement.lang || "").toLowerCase();
    if (htmlLang.startsWith("en")) return "en";
    if (htmlLang.startsWith("ar")) return "ar";
    const stored = readStoredLanguage();
    if (stored) return stored;
    return isEnglishPath() ? "en" : "ar";
  }

  function setLanguagePreference(lang) {
    if (lang !== "ar" && lang !== "en") return;
    try {
      localStorage.setItem(LANGUAGE_KEY, lang);
    } catch (_error) {
      // ignore
    }
  }

  function interpolate(template, variables) {
    if (typeof template !== "string") return "";
    return Object.keys(variables || {}).reduce((result, key) => {
      return result.replaceAll(`{${key}}`, String(variables[key]));
    }, template);
  }

  function t(keyPath, variables, forcedLanguage) {
    const lang = forcedLanguage || getCurrentLanguage();
    const value = pathGet(STRINGS[lang], keyPath) ?? pathGet(STRINGS.ar, keyPath);
    if (typeof value !== "string") return "";
    return interpolate(value, variables || {});
  }

  function localize(value, forcedLanguage) {
    const lang = forcedLanguage || getCurrentLanguage();
    if (value && typeof value === "object" && !Array.isArray(value)) {
      if (typeof value[lang] === "string") return value[lang];
      if (typeof value.ar === "string") return value.ar;
      if (typeof value.en === "string") return value.en;
      return "";
    }
    if (value === null || value === undefined) return "";
    return String(value);
  }

  function getLanguageSwitchHref(targetLanguage) {
    const lang = targetLanguage || (getCurrentLanguage() === "ar" ? "en" : "ar");
    const segments = window.location.pathname.split("/").filter(Boolean);
    const fileName =
      segments.length && segments[segments.length - 1].includes(".")
        ? segments[segments.length - 1]
        : "index.html";

    if (lang === "en") {
      return (
        (isEnglishPath() ? fileName : `en/${fileName}`) +
        `${window.location.search || ""}${window.location.hash || ""}`
      );
    }
    return (
      (isEnglishPath() ? `../${fileName}` : fileName) +
      `${window.location.search || ""}${window.location.hash || ""}`
    );
  }

  window.I18N = Object.freeze({
    t,
    localize,
    getCurrentLanguage,
    setLanguagePreference,
    isEnglishPath,
    getLanguageSwitchHref
  });
})();
