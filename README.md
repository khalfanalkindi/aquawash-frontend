# AquaWash Frontend

واجهة تطبيق الويب لنظام أكواواش.

## النشر على ريلواي

### ١. متغيرات البناء (مهمة جداً)

هذه المتغيرات تُضبط **وقت البناء** وليس التشغيل فقط:

| المتغير | مثال |
|---------|------|
| `NEXT_PUBLIC_API_URL` | `https://your-backend.up.railway.app/api` |
| `NEXT_PUBLIC_USE_API` | `true` |

في ريلواي: **الإعدادات ← Variables ← أضفها كـ Build Variable** أو في قسم Docker build args.

### ٢. ربط المستودع

1. أنشئ مشروعاً جديداً في ريلواي
2. اربط مستودع `aquawash-frontend`
3. ريلواي يكتشف `Dockerfile` و `railway.toml` تلقائياً
4. اضبط متغيرات البناء أعلاه
5. انشر

### ٣. اختبار محلي بالدوكر

```bash
docker build \
  --build-arg NEXT_PUBLIC_API_URL=http://localhost:8000/api \
  --build-arg NEXT_PUBLIC_USE_API=true \
  -t aquawash-frontend .

docker run -p 3000:3000 aquawash-frontend
```

## الصلاحيات

ملف `lib/permission-registry.generated.ts` مولَّد مسبقاً ويُرفع مع الكود.

عند تعديل الصلاحيات في الخادم:

```bash
pnpm sync:permissions   # يحتاج مجلد aquawash-backend بجانب الواجهة
git add lib/permission-registry.generated.ts
git commit && git push
```

لا حاجة لتشغيل المزامنة داخل دوكر البناء — الملف موجود مسبقاً.
