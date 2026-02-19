# Deployment Guide (Production)

هذا الدليل يشرح نشر متجر **رونق** على استضافة حقيقية (VPS/Linux) بطريقة احترافية.

---

## 1) متطلبات السيرفر

- Ubuntu 22.04+ (أو أي Linux مشابه)
- Node.js 20+ و npm
- Nginx (اختياري لكنه موصى به)
- PM2 لإدارة عملية Node

---

## 2) نسخ المشروع وتثبيت الاعتمادات

```bash
git clone <YOUR_REPO_URL> rawnaq-store
cd rawnaq-store
npm install
cp .env.example .env
```

عدّل `.env` حسب بيئتك:

```env
PORT=3000
DB_PATH=./data/store.db
SESSION_TTL_HOURS=24
ADMIN_USERNAME=owner@yourbrand.com
ADMIN_PASSWORD=StrongPassword123!
```

---

## 3) تهيئة قاعدة البيانات

```bash
npm run db:init
```

هذا الأمر ينشئ الجداول ويزرع البيانات الأساسية والمنتجات الافتراضية.

---

## 4) تشغيل الإنتاج

### خيار مباشر

```bash
npm start
```

### خيار احترافي عبر PM2 (موصى به)

```bash
npm install -g pm2
pm2 start npm --name rawnaq-store -- start
pm2 save
pm2 startup
```

---

## 5) ربط Nginx (Reverse Proxy)

مثال ملف إعداد:

`/etc/nginx/sites-available/rawnaq-store`

```nginx
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

تفعيل الموقع:

```bash
sudo ln -s /etc/nginx/sites-available/rawnaq-store /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

---

## 6) SSL (HTTPS)

موصى به عبر Let's Encrypt:

```bash
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d your-domain.com -d www.your-domain.com
```

---

## 7) النسخ الاحتياطي

الملفات المهمة للنسخ الدوري:

- `data/store.db`
- `.env`
- كامل ملفات المشروع

مثال سريع:

```bash
tar -czf rawnaq-backup-$(date +%F).tar.gz . --exclude=node_modules --exclude=.git
```

---

## 8) تحديث الإصدار

```bash
git pull
npm install
npm run db:init
pm2 restart rawnaq-store
```

> `db:init` آمن للتشغيل المتكرر لأنه يضيف البيانات الأساسية فقط عند الحاجة.
