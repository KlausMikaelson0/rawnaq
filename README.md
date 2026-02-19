# رونق | Rawnaq - متجر عطور فاخر كامل (Custom Code)

حل تجارة إلكترونية متكامل مبني بالكامل بالكود (بدون Shopify / سلة / زد)، جاهز للبيع التجاري ونقل الملكية الكاملة إلى المشتري.

---

## 1) المميزات التجارية والتقنية

- واجهة **Minimal Luxury** (أسود ملكي + ذهبي هادئ + أبيض)
- دعم لغتين كامل: **العربية + الإنجليزية**
- كتالوج **100 منتج** عطري (يشمل تشكيلة حقيقية رائجة + تشكيلة تسويقية احترافية)
- سلة مشتريات + صفحة إتمام طلب + تخزين الطلبات في قاعدة بيانات
- طرق دفع مهيأة تقنيًا:
  - بطاقات بنكية
  - Apple Pay
  - مدى
- لوحة تحكم مستقلة لإدارة:
  - المنتجات
  - الطلبات
  - العملاء
  - الإعدادات
- قاعدة بيانات حقيقية: **SQLite**
- جاهز للنشر على استضافة حقيقية وتشغيل فوري

---

## 2) البنية المعمارية

### Frontend

- HTML/CSS/JS مخصص بالكامل
- صفحات عربية + صفحات إنجليزية داخل `en/`
- تصميم Mobile-First عالي الأداء

### Backend

- Node.js + Express
- REST API عامة + API إدارة محمية بالتوكن
- قاعدة بيانات SQLite في:
  - `data/store.db`

### أهم مجلدات المشروع

- `server/` منطق السيرفر وواجهات API
- `scripts/` سكربتات التهيئة والإدارة
- `assets/` ملفات الواجهة
- `en/` النسخة الإنجليزية للصفحات

---

## 3) الصفحات

### العربية

- `index.html`
- `products.html`
- `cart.html`
- `checkout.html`
- `faq.html`
- `about.html`
- `privacy.html`
- `terms.html`
- `returns.html`
- `contact.html`
- `admin.html`

### الإنجليزية

- `en/index.html`
- `en/products.html`
- `en/cart.html`
- `en/checkout.html`
- `en/faq.html`
- `en/about.html`
- `en/privacy.html`
- `en/terms.html`
- `en/returns.html`
- `en/contact.html`
- `en/admin.html`

---

## 4) التشغيل المحلي

### المتطلبات

- Node.js 18+ (مفضل 20+)
- npm

### الخطوات

```bash
npm install
cp .env.example .env
npm run db:init
npm start
```

بعد التشغيل:

- المتجر: `http://localhost:3000`
- لوحة الإدارة: `http://localhost:3000/admin.html`

---

## 5) بيانات الإدارة الافتراضية

- Username: `admin@rawnaq.local`
- Password: `Rawnaq@2026`

> مهم جدًا: غيّر بيانات الدخول قبل البيع/الإطلاق عبر:

```bash
npm run admin:reset -- --username=owner@brand.com --password=StrongPass123!
```

---

## 6) سكربتات npm

- `npm start` تشغيل السيرفر (مع تهيئة قاعدة البيانات)
- `npm run dev` تشغيل مراقب أثناء التطوير
- `npm run db:init` إنشاء/تهيئة القاعدة + بيانات أولية
- `npm run db:reset` إعادة إنشاء القاعدة من الصفر
- `npm run admin:reset` إعادة ضبط بيانات دخول الإدارة

---

## 7) النشر على استضافة حقيقية

مذكور تفصيليًا في الملف:

- `DEPLOYMENT.md`

يشمل:

- إعداد البيئة
- تشغيل الإنتاج
- إعداد reverse proxy (Nginx)
- إدارة العملية (PM2)

---

## 8) نقل الملكية الكاملة

مذكور تفصيليًا في الملف:

- `OWNERSHIP_TRANSFER.md`

ويشمل تسليم:

- ملفات الموقع كاملة
- قاعدة البيانات `data/store.db`
- ملف البيئة `.env` (أو نسخة آمنة منه)
- بيانات دخول الإدارة

ليصبح المشتري مالكًا كاملًا للنظام بدون أي اعتماد على المطور.
