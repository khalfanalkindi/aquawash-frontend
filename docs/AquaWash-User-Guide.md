# AquaWash — دليل المستخدم | User Guide

**نظام إدارة المغاسل الاحترافي | Professional Laundry Management System**

| | |
|---|---|
| **الإصدار / Version** | 1.1 |
| **التاريخ / Date** | 18 يوليو 2026 / 18 July 2026 |
| **البيئة / Environment** | نسخة تجريبية سحابية / Cloud Trial |
| **إعداد / Prepared by** | AquaWash Team |

> **رابط النظام | System URL:**
> [https://aquawash-frontend-production.up.railway.app/ar](https://aquawash-frontend-production.up.railway.app/ar)

---

## فهرس المحتويات | Table of Contents

1. [نظرة عامة](#1-نظرة-عامة--overview)
2. [المميزات](#2-المميزات--features)
3. [لماذا AquaWash؟](#3-لماذا-aquawash--why-aquawash)
4. [الأدوار والصلاحيات](#4-الأدوار-والصلاحيات--user-roles)
5. [البدء السريع](#5-البدء-السريع--quick-start)
6. [شرح الشاشات](#6-شرح-الشاشات--screen-guide)
7. [متطلبات النظام](#7-متطلبات-النظام--system-requirements)
8. [الأسئلة الشائعة](#8-الأسئلة-الشائعة--faq)
9. [التواصل والدعم](#9-التواصل-والدعم--contact--support)

---

## 1. نظرة عامة | Overview

### العربية

**AquaWash (أكواواش)** هو نظام متكامل لإدارة مغاسل الملابس وخدمات الغسيل والكي. يجمع بين **لوحة إدارة شاملة** للحاسوب والأجهزة اللوحية، و**نقطة بيع محمولة (Holder POS)** للاستخدام السريع على الهاتف أو الجهاز اللوحي عند نقطة الاستلام.

يدعم النظام **اللغتين العربية والإنجليزية**، و**تعدد الفروع**، و**إدارة العملاء والعقود والمخزون**، مع **صلاحيات مرنة** لكل مستخدم (مدير، كاشير، holder).

**الفئات المستهدفة:** مغاسل الملابس، مغاسل الفنادق، شركات الغسيل، ومحلات الخدمات التي تحتاج فواتير وإيصالات وتقارير يومية.

---

### English

**AquaWash** is an integrated laundry and dry-cleaning management system. It combines a **full admin panel** for desktop and tablet use with a **lightweight Holder POS** for fast checkout on mobile devices at the counter.

The system supports **Arabic and English**, **multi-branch operations**, **customer and contract management**, **inventory tracking**, and **role-based access control** (Admin, Manager, Cashier, Holder).

**Target users:** laundry shops, hotel laundry services, corporate laundry providers, and any business that needs invoicing, receipts, and daily sales reporting.

---

## 2. المميزات | Features

### العربية

| المجال | المميزات |
|--------|----------|
| **نقطة البيع (POS)** | اختيار نوع القطعة والخدمة، سلة مشتريات، خصم بنسبة مئوية (عام أو لكل صنف)، ربط العميل أو walk-in، رقم طلب (Order Tag)، طرق دفع (نقدي / بطاقة / تحويل)، طباعة وتحميل الإيصال |
| **العملاء** | أفراد وشركات، رقم عميل مخصص (Custom ID) للبحث السريع، هاتف وبيانات اتصال كاملة |
| **الفواتير** | سجل كامل، بحث وتصفية، تغيير الحالة، تصدير CSV، عرض تفاصيل الفاتورة والإيصال |
| **الكتالوج** | أنواع الملابس (Entities)، الخدمات (غسيل، كي، …)، المنتجات والأسعار، تفعيل/إيقاف المنتجات في POS |
| **لوحة التحكم والتقارير** | ملخص المبيعات والأداء (حسب الصلاحيات) |
| **الفروع** | إدارة مواقع متعددة، ربط المستخدمين بالفروع، اختيار الفرع النشط في POS |
| **المخزون** | أصناف (معدات، مواد استهلاكية، قطع غيار)، كميات لكل فرع |
| **أصحاب المصلحة** | موردون، سائقون، شركاء — منفصلون عن العملاء |
| **العقود** | عقود غسيل مع العملاء، أو توريد وصيانة وخدمات لوجستية مع أصحاب المصلحة |
| **المستخدمون والصلاحيات** | أدوار (Admin, Manager, Cashier, Holder)، صلاحيات على مستوى الدور أو المستخدم |
| **الإعدادات** | اسم المحل، العملة (OMR)، تذييل الإيصال، الوضع الداكن، تغيير كلمة المرور |
| **Holder POS** | واجهة خفيفة: POS + الفواتير + تفعيل المنتجات |

---

### English

| Area | Features |
|------|----------|
| **Point of Sale (POS)** | Garment type + service selection, cart, percentage discounts (global or per line), customer or walk-in, order tag, payment methods (cash / card / transfer), print & download receipt |
| **Customers** | Individuals & companies, custom customer ID for fast POS lookup, full contact details |
| **Invoices** | Full history, search & filters, status updates, CSV export, invoice & receipt details |
| **Catalog** | Garment entities, laundry services, products & pricing, enable/disable products on POS |
| **Dashboard & Reports** | Sales overview and performance metrics (permission-based) |
| **Branches** | Multiple locations, user–branch assignment, active branch switcher for POS |
| **Inventory** | Stock items (equipment, consumables, spare parts), quantities per branch |
| **Stakeholders** | Suppliers, drivers, partners — separate from laundry customers |
| **Contracts** | Laundry agreements with customers; supply/maintenance/logistics with stakeholders |
| **Users & Permissions** | Roles (Admin, Manager, Cashier, Holder), role-level and user-level permissions |
| **Settings** | Shop name, currency (OMR), receipt footer, dark mode, password change |
| **Holder POS** | Lightweight portal: POS + invoices + product availability toggle |

---

## 3. لماذا AquaWash؟ | Why AquaWash?

### العربية

1. **مصمم للمغاسل** — الكتالوج مبني على (نوع القطعة + الخدمة + السعر)، وليس نظام POS عام.
2. **واجهتان في نظام واحد** — إدارة كاملة + POS محمول للكاشير في المحل.
3. **عربي وإنجليزي** — واجهة ثنائية اللغة مع تبديل فوري للموظفين والإدارة.
4. **فروع متعددة** — كل فرع له فواتير ومخزون ومستخدمون معزولون حسب الصلاحية.
5. **صلاحيات دقيقة** — الكاشير يرى ما يحتاجه فقط؛ المدير يتحكم بالعمليات والحسابات.
6. **إيصالات احترافية** — فاتورة برقم طلب، فرع، عميل، خصومات، وجاهزة للطباعة 80mm أو PNG.
7. **عملاء B2B** — فنادق وشركات، عقود شهرية، وأرقام عملاء مخصصة.
8. **جاهز للسحابة** — يعمل محلياً أو على استضافة (مثل Railway) للتجربة والإنتاج.

---

### English

1. **Built for laundry** — Catalog is entity + service + price, not a generic retail POS.
2. **Two portals, one system** — Full admin plus mobile Holder POS for floor staff.
3. **Arabic & English** — Instant language switch for staff and management.
4. **Multi-branch** — Per-branch invoices, inventory, and scoped user access.
5. **Fine-grained permissions** — Cashiers see only what they need; managers control operations.
6. **Professional receipts** — Order tag, branch, customer, discounts; print-ready 80mm or PNG download.
7. **B2B ready** — Hotels and companies, monthly contracts, custom customer IDs.
8. **Cloud-ready** — Runs locally or on hosted staging/production environments.

---

## 4. الأدوار والصلاحيات | User Roles

### العربية

| الدور | بوابة الإدارة | بوابة Holder | الصلاحيات الأساسية |
|-------|---------------|---------------|-------------------|
| **Admin** | نعم | نعم | وصول كامل لجميع وظائف النظام، بما فيها المستخدمون، الأدوار، الصلاحيات، الفروع، المخزون، العقود، التقارير، الكتالوج، الفواتير ونقطة البيع |
| **Manager** | نعم | نعم | لوحة التحكم، إدارة وعرض الخدمات، إنشاء وتعديل الفواتير، التقارير والتصدير، عرض المستخدمين، نقطة البيع والخصومات |
| **Cashier** | نعم، بصلاحيات محدودة | نعم | عرض الخدمات، إنشاء وعرض وطباعة الفواتير، واستخدام نقطة البيع دون صلاحيات الإدارة أو الخصم |
| **Holder** | لا | نعم فقط | نقطة البيع المحمولة، عرض وإنشاء وطباعة الفواتير، وعرض وتفعيل أو إيقاف المنتجات |

> الصلاحيات التفصيلية تُضبط من: **صلاحيات الأدوار** و**صلاحيات المستخدمين**.
>
> يمكن منح صلاحيات إضافية لمستخدم محدد من لوحة الإدارة دون تغيير صلاحيات بقية مستخدمي الدور.

---

### English

| Role | Admin Portal | Holder Portal | Main Access |
|------|--------------|---------------|-------------|
| **Admin** | Yes | Yes | Full access, including users, roles, permissions, branches, inventory, contracts, reports, catalog, invoices, and POS |
| **Manager** | Yes | Yes | Dashboard, service management, invoice creation/editing, reports/export, user viewing, POS, and discounts |
| **Cashier** | Yes, limited | Yes | View services, create/view/print invoices, and use POS without administration or discount permissions |
| **Holder** | No | Yes only | Mobile POS, view/create/print invoices, and view or toggle product availability |

> Detailed access is configured under **Role Permissions** and **User Permissions**.
>
> Extra permissions can be granted to an individual user without changing the role for everyone else.

---

## 5. البدء السريع | Quick Start

### 5.1 روابط النظام | System Links

| الصفحة | العربية | English |
|--------|---------|---------|
| **الصفحة الرئيسية** | [فتح النظام بالعربية](https://aquawash-frontend-production.up.railway.app/ar) | [Open in English](https://aquawash-frontend-production.up.railway.app/en) |
| **دخول الإدارة** | [لوحة الإدارة](https://aquawash-frontend-production.up.railway.app/ar/admin/login) | [Admin Login](https://aquawash-frontend-production.up.railway.app/en/admin/login) |
| **دخول Holder** | [نقطة البيع المحمولة](https://aquawash-frontend-production.up.railway.app/ar/holder/login) | [Holder Login](https://aquawash-frontend-production.up.railway.app/en/holder/login) |

### 5.2 حسابات النسخة التجريبية | Trial Accounts

| الدور | اسم المستخدم | كلمة المرور | الاستخدام |
|-------|---------------|-------------|-----------|
| **مدير النظام / Admin** | `demo` | كلمة المرور المحدّثة والمسلّمة للعميل | تجربة جميع وظائف لوحة الإدارة وHolder |
| **كاشير / Cashier** | `cashier1` | `cashier1` | تجربة نقطة البيع والفواتير في البوابتين |
| **Holder** | `holder1` | `holder1` | تجربة بوابة Holder فقط |

> **تنبيه أمني:** هذه حسابات مؤقتة مخصصة للتجربة. يجب تغيير كلمات المرور وإنشاء حسابات فعلية بأسماء الموظفين قبل بدء التشغيل الفعلي. لا تشارك بيانات الدخول خارج فريق العمل المخوّل.

### 5.3 خطوات الدخول والاستخدام الأول | First Login

### العربية

1. افتح [رابط النظام](https://aquawash-frontend-production.up.railway.app/ar).
2. اختر **لوحة الإدارة** أو **Holder POS**.
3. سجّل الدخول باسم المستخدم وكلمة المرور.
4. اختر الفرع النشط من أعلى الشاشة إذا كان الحساب مرتبطًا بأكثر من فرع.
5. (للمدير) راجع **الإعدادات**، ثم اضبط **الفروع**، **الكتالوج**، **المستخدمين والصلاحيات**.
6. (للكاشير) افتح **نقطة البيع** → اختر المنتجات والخدمات → حدد العميل أو Walk-in → اختر طريقة الدفع → أكّد الطلب → اطبع الإيصال.
7. (لـ Holder) استخدم الشريط السفلي للتنقل بين **الفواتير**، **نقطة البيع** و**تفعيل المنتجات**.
8. عند الانتهاء، سجّل الخروج من قائمة المستخدم، خصوصًا عند استخدام جهاز مشترك.

---

### English

1. Open the [system URL](https://aquawash-frontend-production.up.railway.app/en).
2. Choose **Admin Panel** or **Holder POS**.
3. Sign in with username and password.
4. Select the active branch from the header if the account is assigned to multiple branches.
5. (Admin) Review **settings**, then configure **branches**, **catalog**, and **users & permissions**.
6. (Cashier) Open **POS** → select products/services → choose a customer or walk-in → select payment method → confirm → print the receipt.
7. (Holder) Use the bottom navigation for **invoices**, **POS**, and **product availability**.
8. Sign out when finished, especially on a shared device.

### 5.4 قائمة التحقق المقترحة للتجربة | Suggested Trial Checklist

- تسجيل الدخول بالحسابات الثلاثة والتأكد من اختلاف الصلاحيات.
- اختيار الفرع الصحيح قبل إنشاء أي عملية بيع.
- إنشاء عميل فردي وعميل شركة وتجربة البحث بالاسم والهاتف ورقم العميل.
- إنشاء فاتورة نقدية وأخرى بالبطاقة أو التحويل، ثم طباعة الإيصال.
- البحث عن الفاتورة وتغيير حالتها ومراجعة تفاصيلها.
- تفعيل وإيقاف منتج من بوابة Holder والتأكد من ظهوره في نقطة البيع.
- مراجعة التقارير والمخزون والفروع والعقود بحساب المدير.
- تجربة العربية والإنجليزية على الحاسوب والهاتف.
- تسجيل أي ملاحظة مع اسم المستخدم، رابط الشاشة، وقت المشكلة، والخطوات التي سبقتها.

- Sign in with all three accounts and verify their different permissions.
- Select the correct branch before creating a sale.
- Create individual and company customers, then test all search options.
- Create cash and card/transfer invoices and print the receipt.
- Find an invoice, update its status, and review its details.
- Toggle a product through the Holder portal and verify its POS availability.
- Review reports, inventory, branches, and contracts as Admin.
- Test Arabic and English on both desktop and mobile.
- Report issues with the username, screen URL, time, and reproduction steps.

---

## 6. شرح الشاشات | Screen Guide

> **تعليمات:** أضف لقطة الشاشة داخل المربع أدناه.  
> **Instructions:** Insert your screenshot inside each box below.

---

### 6.1 الصفحة الرئيسية | Home Page

**العربية:** بوابة الدخول — اختيار بين لوحة الإدارة (إدارة كاملة) أو Holder POS (نسخة محمولة).

**English:** Entry portal — choose Admin Panel (full management) or Holder POS (mobile/lightweight).

```
┌──────────────────────────────────────────────────────────────┐
│                                                              │
│              [ أضف لقطة الشاشة هنا / Insert screenshot ]      │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

---

### 6.2 تسجيل الدخول — الإدارة | Admin Login

**العربية:** شاشة دخول المسؤولين والكاشير للوحة الإدارة.

**English:** Sign-in for admin and cashier users accessing the admin panel.

```
┌──────────────────────────────────────────────────────────────┐
│                                                              │
│              [ أضف لقطة الشاشة هنا / Insert screenshot ]      │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

---

### 6.3 تسجيل الدخول — Holder | Holder Login

**العربية:** دخول مستخدمي Holder إلى نقطة البيع المحمولة.

**English:** Sign-in for Holder role users on the mobile POS portal.

```
┌──────────────────────────────────────────────────────────────┐
│                                                              │
│              [ أضف لقطة الشاشة هنا / Insert screenshot ]      │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

---

### 6.4 لوحة التحكم | Dashboard

**العربية:** ملخص الأداء والمبيعات (للمستخدمين الذين لديهم صلاحية العرض).

**English:** Performance and sales overview (for users with dashboard access).

```
┌──────────────────────────────────────────────────────────────┐
│                                                              │
│              [ أضف لقطة الشاشة هنا / Insert screenshot ]      │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

---

### 6.5 نقطة البيع — الإدارة | Admin POS

**العربية:** اختيار نوع القطعة والخدمة، السلة، العميل، الخصم، رقم الطلب، وإتمام الدفع.

**English:** Garment/service picker, cart, customer, discounts, order tag, and checkout.

```
┌──────────────────────────────────────────────────────────────┐
│                                                              │
│              [ أضف لقطة الشاشة هنا / Insert screenshot ]      │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

---

### 6.6 نقطة البيع — Holder | Holder POS

**العربية:** نفس عملية البيع في واجهة مبسطة للجوال.

**English:** Same checkout flow in a simplified mobile layout.

```
┌──────────────────────────────────────────────────────────────┐
│                                                              │
│              [ أضف لقطة الشاشة هنا / Insert screenshot ]      │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

---

### 6.7 الإيصال | Receipt

**العربية:** إيصال بعد إتمام الطلب — طباعة أو تحميل PNG؛ يعرض الفرع ورقم الطلب والعميل.

**English:** Post-checkout receipt — print or download PNG; shows branch, order tag, and customer.

```
┌──────────────────────────────────────────────────────────────┐
│                                                              │
│              [ أضف لقطة الشاشة هنا / Insert screenshot ]      │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

---

### 6.8 الكتالوج | Catalog (Services & Products)

**العربية:** إدارة أنواع الملابس، الخدمات، المنتجات، والأسعار.

**English:** Manage garment types, services, products, and pricing.

```
┌──────────────────────────────────────────────────────────────┐
│                                                              │
│              [ أضف لقطة الشاشة هنا / Insert screenshot ]      │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

---

### 6.9 تفعيل المنتجات — Holder | Product Availability (Holder)

**العربية:** تشغيل/إيقاف المنتجات في نقطة البيع دون الدخول للوحة الإدارة.

**English:** Enable or disable products on POS without opening the admin panel.

```
┌──────────────────────────────────────────────────────────────┐
│                                                              │
│              [ أضف لقطة الشاشة هنا / Insert screenshot ]      │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

---

### 6.10 العملاء | Customers

**العربية:** قائمة العملاء، إضافة/تعديل، رقم عميل مخصص، أفراد وشركات.

**English:** Customer list, add/edit, custom ID, individuals and companies.

```
┌──────────────────────────────────────────────────────────────┐
│                                                              │
│              [ أضف لقطة الشاشة هنا / Insert screenshot ]      │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

---

### 6.11 الفواتير | Invoices

**العربية:** سجل الفواتير، البحث، التصفية، التصدير، وعرض التفاصيل.

**English:** Invoice history, search, filters, export, and detail view.

```
┌──────────────────────────────────────────────────────────────┐
│                                                              │
│              [ أضف لقطة الشاشة هنا / Insert screenshot ]      │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

---

### 6.12 التقارير | Reports

**العربية:** تقارير المبيعات والأداء (حسب الصلاحيات والفرع).

**English:** Sales and performance reports (by permission and branch).

```
┌──────────────────────────────────────────────────────────────┐
│                                                              │
│              [ أضف لقطة الشاشة هنا / Insert screenshot ]      │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

---

### 6.13 الفروع | Branches

**العربية:** إضافة وتعديل فروع المغسلة وربطها بالمستخدمين.

**English:** Add and manage laundry branches and user assignments.

```
┌──────────────────────────────────────────────────────────────┐
│                                                              │
│              [ أضف لقطة الشاشة هنا / Insert screenshot ]      │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

---

### 6.14 المخزون | Inventory

**العربية:** أصناف المخزون والكميات لكل فرع.

**English:** Stock items and quantities per branch.

```
┌──────────────────────────────────────────────────────────────┐
│                                                              │
│              [ أضف لقطة الشاشة هنا / Insert screenshot ]      │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

---

### 6.15 أصحاب المصلحة | Stakeholders

**العربية:** موردون، سائقون، شركاء — للعقود غير المرتبطة بعملاء الغسيل.

**English:** Suppliers, drivers, partners — for non-customer contracts.

```
┌──────────────────────────────────────────────────────────────┐
│                                                              │
│              [ أضف لقطة الشاشة هنا / Insert screenshot ]      │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

---

### 6.16 العقود | Contracts

**العربية:** عقود الغسيل مع العملاء أو التوريد/الصيانة مع أصحاب المصلحة.

**English:** Laundry contracts with customers or supply/maintenance with stakeholders.

```
┌──────────────────────────────────────────────────────────────┐
│                                                              │
│              [ أضف لقطة الشاشة هنا / Insert screenshot ]      │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

---

### 6.17 المستخدمون والصلاحيات | Users & Permissions

**العربية:** حسابات المستخدمين، الأدوار، وربط الصلاحيات.

**English:** User accounts, roles, and permission assignment.

```
┌──────────────────────────────────────────────────────────────┐
│                                                              │
│              [ أضف لقطة الشاشة هنا / Insert screenshot ]      │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

---

### 6.18 الإعدادات | Settings

**العربية:** إعدادات الحساب، المظهر، وتغيير كلمة المرور.

**English:** Account preferences, appearance, and password change.

```
┌──────────────────────────────────────────────────────────────┐
│                                                              │
│              [ أضف لقطة الشاشة هنا / Insert screenshot ]      │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

---

## 7. متطلبات النظام | System Requirements

### العربية

| البند | التوصية |
|-------|---------|
| **المتصفح** | Chrome، Safari، أو Edge (أحدث إصدار) |
| **الشاشة** | لوحة الإدارة: 1024px+؛ Holder: هاتف أو tablet |
| **الطباعة** | طابعة حرارية 80mm أو طباعة PDF/PNG |
| **الاتصال** | إنترنت مستقر عند استخدام النسخة السحابية |

---

### English

| Item | Recommendation |
|------|----------------|
| **Browser** | Chrome, Safari, or Edge (latest) |
| **Display** | Admin: 1024px+; Holder: phone or tablet |
| **Printing** | 80mm thermal printer or PDF/PNG |
| **Network** | Stable internet for cloud deployment |

---

## 8. الأسئلة الشائعة | FAQ

### العربية

**س: هل يمكن استخدام الخصم على الصنف والخصم العام معاً؟**  
ج: لا — النظام يستخدم إما خصماً عاماً بنسبة مئوية أو خصماً لكل صنف.

**س: كيف أبحث عن عميل في POS؟**  
ج: بالاسم، الهاتف، أو رقم العميل المخصص (مثل A-232).

**س: ماذا يعني Order Tag؟**  
ج: رقم أو رمز للطلب (مثل A-101) يظهر على الإيصال لتسليم الملابس.

**س: لا أستطيع فتح إحدى الشاشات، ما السبب؟**
ج: ظهور الشاشات يعتمد على دور المستخدم وصلاحياته. تواصل مع مدير النظام لمراجعة صلاحيات الدور أو المستخدم.

**س: لماذا لا يستطيع مستخدم Holder دخول لوحة الإدارة؟**
ج: دور Holder مخصص للبوابة المحمولة فقط. يمكن للمدير والكاشير استخدام بوابة Holder، بينما لا يستطيع Holder دخول لوحة الإدارة.

**س: ماذا أفعل إذا نسيت كلمة المرور؟**
ج: تواصل مع مدير النظام لإعادة تعيين كلمة المرور. لا يمكن عرض كلمة المرور الحالية لأنها مخزنة بصورة مشفرة.

**س: هل البيانات في النسخة التجريبية نهائية؟**
ج: لا. بيانات النسخة الحالية مخصصة للاختبار وقد يتم تعديلها أو حذفها قبل التشغيل الفعلي.

---

### English

**Q: Can I use global and per-item discount together?**  
A: No — use either a global percentage discount or per-line discounts.

**Q: How do I find a customer in POS?**  
A: Search by name, phone, or custom customer ID (e.g. A-232).

**Q: What is an Order Tag?**  
A: A pickup reference (e.g. A-101) printed on the receipt for garment collection.

**Q: Why can I not open a particular screen?**
A: Screen access depends on the user's role and permissions. Ask an administrator to review the role or user permissions.

**Q: Why can a Holder user not access the admin panel?**
A: The Holder role is restricted to the mobile portal. Admin and Cashier users may use the Holder portal, but Holder users cannot enter the admin panel.

**Q: What should I do if I forget my password?**
A: Contact an administrator to reset it. Existing passwords cannot be displayed because they are stored securely as hashes.

**Q: Is trial data permanent?**
A: No. The current environment is for evaluation, and its data may be changed or removed before production launch.

---

## 9. التواصل والدعم | Contact & Support

### العربية

للدعم والملاحظات، تواصل مع ممثل مشروع AquaWash عبر قناة التواصل المتفق عليها. لتسريع معالجة المشكلة، أرسل:

1. اسم المستخدم والدور المستخدم.
2. اسم الشاشة أو رابطها.
3. وصفًا مختصرًا للمشكلة والخطوات التي أدت إليها.
4. لقطة شاشة أو فيديو إن أمكن.
5. وقت حدوث المشكلة ونوع الجهاز والمتصفح.

**رابط النسخة التجريبية:** [فتح AquaWash بالعربية](https://aquawash-frontend-production.up.railway.app/ar)

---

### English

For support and feedback, contact the AquaWash project representative through the agreed communication channel. To help resolve an issue quickly, provide:

1. The username and role used.
2. The screen name or URL.
3. A short description and reproduction steps.
4. A screenshot or video when possible.
5. The time of the issue, device type, and browser.

**Trial URL:** [Open AquaWash in English](https://aquawash-frontend-production.up.railway.app/en)

---

### ملاحظات إضافية | Additional Notes

- النسخة الحالية مخصصة للتقييم وقبول المستخدم، وليست اعتمادًا نهائيًا للتشغيل التجاري.
- يُنصح بتجربة كل دور على حدة وتسجيل الملاحظات مع اسم الشاشة والخطوات التي سبقت المشكلة.
- يجب تغيير الحسابات التجريبية وكلمات المرور قبل الانتقال إلى الإنتاج.
- Current deployment is intended for evaluation and user acceptance testing.
- Test each role separately and report issues with the screen name and reproduction steps.
- Replace trial accounts and passwords before production go-live.

---

*© AquaWash — جميع الحقوق محفوظة | All rights reserved*
