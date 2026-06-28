# AquaWash — دليل المستخدم | User Guide

**نظام إدارة المغاسل الاحترافي | Professional Laundry Management System**

| | |
|---|---|
| **الإصدار / Version** | 1.0 |
| **التاريخ / Date** | _________________ |
| **إعداد / Prepared by** | _________________ |

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

**AquaWash (أكواواش)** هو نظام متكامل لإدارة مغاسل الملابس وخدمات الغسيل والكي. يجمع بين **لوحة إدارة شاملة** للحاسوب والأجهزة اللوحية، و**نقطة بيع محمولة (Holder POS)** للاستخدام السريع على الهاتف أو الجهاز اللوحي في counter.

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
| **العقود** | عقود غسيل مع العملاء، أو توريد/صيانة/لوجistics مع أصحاب المصلحة |
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
3. **عربي وإنجليزي** — واجهة وتبديل لغة فوري للمو staff والإدارة.
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

| الدور | الاستخدام |
|-------|-----------|
| **Admin / Manager** | لوحة الإدارة الكاملة: فروع، مخزون، عقود، مستخدمون، تقارير |
| **Cashier** | POS، فواتير، عملاء (حسب الصلاحيات) |
| **Holder** | تطبيق Holder فقط: POS محمول، الفواتير، تفعيل المنتجات |

> الصلاحيات التفصيلية تُضبط من: **صلاحيات الأدوار** و**صلاحيات المستخدمين**.

---

### English

| Role | Usage |
|------|-------|
| **Admin / Manager** | Full admin panel: branches, inventory, contracts, users, reports |
| **Cashier** | POS, invoices, customers (as permitted) |
| **Holder** | Holder app only: mobile POS, invoices, product toggles |

> Detailed access is configured under **Role Permissions** and **User Permissions**.

---

## 5. البدء السريع | Quick Start

### العربية

1. افتح رابط النظام (محلي أو سحابي).
2. اختر **لوحة الإدارة** أو **Holder POS**.
3. سجّل الدخول باسم المستخدم وكلمة المرور.
4. (للمدير) اضبط **الفروع**، **الكتالوج**، **المستخدمين**.
5. (للكاشير) اختر **الفرع** من أعلى الشاشة → افتح **نقطة البيع** → أنشئ الطلب → أكّد الدفع → اطبع الإيصال.

---

### English

1. Open the system URL (local or cloud).
2. Choose **Admin Panel** or **Holder POS**.
3. Sign in with username and password.
4. (Admin) Configure **branches**, **catalog**, and **users**.
5. (Cashier) Select **branch** from the header → open **POS** → build order → confirm payment → print receipt.

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

---

### English

**Q: Can I use global and per-item discount together?**  
A: No — use either a global percentage discount or per-line discounts.

**Q: How do I find a customer in POS?**  
A: Search by name, phone, or custom customer ID (e.g. A-232).

**Q: What is an Order Tag?**  
A: A pickup reference (e.g. A-101) printed on the receipt for garment collection.

---

## 9. التواصل والدعم | Contact & Support

> **املأ البيانات التالية قبل التسليم للعميل.**  
> **Fill in the fields below before sharing with your client.**

### العربية

| | |
|---|---|
| **اسم الشركة** | _________________________________ |
| **الشخص المسؤول** | _________________________________ |
| **الهاتف** | _________________________________ |
| **البريد الإلكتروني** | _________________________________ |
| **الموقع / العنوان** | _________________________________ |
| **ساعات الدعم** | _________________________________ |
| **رابط النظام (Production)** | _________________________________ |
| **رابط النظام (Demo / Staging)** | _________________________________ |

---

### English

| | |
|---|---|
| **Company name** | _________________________________ |
| **Contact person** | _________________________________ |
| **Phone** | _________________________________ |
| **Email** | _________________________________ |
| **Website / Address** | _________________________________ |
| **Support hours** | _________________________________ |
| **System URL (Production)** | _________________________________ |
| **System URL (Demo / Staging)** | _________________________________ |

---

### ملاحظات إضافية | Additional Notes

_______________________________________________________________________________

_______________________________________________________________________________

_______________________________________________________________________________

---

*© AquaWash — جميع الحقوق محفوظة | All rights reserved*
