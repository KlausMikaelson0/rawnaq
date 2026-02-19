window.DEFAULT_STORE_CONFIG = Object.freeze({
  // The buyer can fully rebrand from this file or from admin panel.
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
    // Ready for activation with provider credentials.
    provider: "gateway-ready",
    methods: ["card", "apple_pay", "mada"],
    secureBadges: ["SSL 256-bit", "3D Secure", "PCI DSS"]
  }
});
