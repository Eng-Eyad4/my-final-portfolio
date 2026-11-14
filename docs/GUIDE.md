# دليل الموقع التفصيلي

شرح كامل لكل ملف وكل آلية في الموقع، مكتوب ليفهمه من يقرأ الكود لأول مرة،
وليفيد من يريد تعديله لاحقاً.

---

## المحتويات

1. [الصورة الكبيرة](#1-الصورة-الكبيرة)
2. [رحلة تحميل الصفحة](#2-رحلة-تحميل-الصفحة)
3. [index.html بالتفصيل](#3-indexhtml-بالتفصيل)
4. [CSS: نظام التصميم](#4-css-نظام-التصميم)
5. [JavaScript: الملفات الثلاثة](#5-javascript-الملفات-الثلاثة)
6. [البيانات والتخزين](#6-البيانات-والتخزين)
7. [الثيم الفاتح والداكن](#7-الثيم-الفاتح-والداكن)
8. [منظومة اللغتين والترجمة التلقائية](#8-منظومة-اللغتين-والترجمة-التلقائية)
9. [المحرّر النصي المنسّق](#9-المحرّر-النصي-المنسّق)
10. [تدفّق العمليات (سكربتات حقيقية)](#10-تدفّق-العمليات-سكربتات-حقيقية)
11. [الإتاحة والأداء](#11-الإتاحة-والأداء)
12. [كيف تعدّل الموقع](#12-كيف-تعدّل-الموقع)
13. [استكشاف الأخطاء](#13-استكشاف-الأخطاء)
14. [مسرد المصطلحات](#14-مسرد-المصطلحات)

---

## 1. الصورة الكبيرة

### ما نوع هذا الموقع؟

موقع **ثابت (static)**: ملفات HTML وCSS وJavaScript تُفتح مباشرة في المتصفح،
بلا خادم وبلا قاعدة بيانات وبلا أدوات بناء (Webpack/Vite). كل شيء يعمل على جهاز
الزائر نفسه.

### لماذا لا يوجد إطار عمل (Framework)؟

- الموقع صفحة واحدة بأربعة أقسام، لا يحتاج راوتراً ولا إدارة حالة معقّدة.
- React/Vue كانت ستضيف 100+ كيلوبايت وحلقة بناء لمشكلة لا تزيد عن 3000 سطر
  (بضمنها القاموس والتصميم).
- الاعتماد على المتصفح وحده يعني أن الملف يُفتح بالنقر المزدوج ويعمل للأبد.

### الملفات ودور كل منها

```
index.html      ← البنية: ما يظهر على الشاشة (بلا أي تصميم أو منطق)
css/base.css    ← الأساس: ألوان، مسافات، خطوط، تصفير المتصفح، تخطيط عام
css/components.css ← القطع القابلة للتكرار: أزرار، حقول، بطاقات، جداول
css/pages.css   ← التخطيط الخاص بكل قسم + قواعد الشاشات الصغيرة
js/core.js      ← أدوات عامة: تخزين، DOM، تنظيف HTML، تواريخ
js/i18n.js      ← قاموس اللغتين + خدمة الترجمة التلقائية
js/app.js       ← "العقل": الحالة، العرض، الأحداث، النماذج
assets/favicon.svg ← أيقونة التبويب
```

### ثلاثة مبادئ تحكم المعمارية

1. **فصل المسؤوليات**: HTML للبنية، CSS للشكل، JS للسلوك. لا يُكتب نص تصميم
   داخل HTML، ولا يُحقن HTML داخل JS إلا كناتج عرض.
2. **نطاق واحد مشترك**: كل ملف يُغلَّف في دالة ذاتية التنفيذ (IIFE)، والوحيد
   المكشوف للعالم هو `window.PF`. لا متغيّرات عامة تتصارع.
3. **اتجاه واحد للبيانات**: `state` (الحقيقة) → العرض → ما يراه المستخدم.
   الأحداث تعدّل `state` فقط، ثم تُستدعى إعادة العرض.

---

## 2. رحلة تحميل الصفحة

عند فتح `index.html` يحدث هذا بالترتيب:

```
1. المتصفح يقرأ <head>:
   - charset و viewport
   - يطبّق سكربت الثيم الصغير (قبل أي رسم) → يضيف class="dark" إن كان محفوظاً
   - يحمّل خط Alexandria من Google Fonts (غير حاجب للرسم)
   - يحمّل ملفات CSS الثلاثة بالترتيب

2. المتصفح يرسم أول إطار (First Paint):
   - الألوان من متغيّرات CSS
   - المحتوى العربي الثابت من HTML

3. يصل إلى نهاية <body> فينفّذ السكربتات بالترتيب:
   core.js  → يعرّف PF.storage و PF.escapeHtml ... إلخ
   i18n.js  → يعرّف PF.i18n والقواميس
   app.js   → ينتظر DOMContentLoaded ثم init()

4. init():
   - يجمع عناصر الصفحة في كائن dom
   - يضبط اللغة (lang/dir) ويطبّق ترجمات الواجهة
   - يضبط الثيم وأيقونته
   - يربط الأحداث
   - يرسم البيانات من localStorage
   - يطلق الترجمة التلقائية إن لزمت (async)

5. التفاعل: كل نقرة تمرّ عبر مستمع واحد مفوَّض
```

### لماذا سكربت الثيم داخل `<head>` وليس في app.js؟

لأن `app.js` يعمل بعد رسم الصفحة. لو انتظرنا، لرأى المستخدم وميضاً أبيض
(Flash of Unstyled/Wrong Theme) قبل تحوّل الصفحة إلى الداكن. السكربت الصغير
يُغيّر الصنف قبل الرسم الأول:

```html
<script>
  (function () {
    try {
      if (localStorage.getItem("portfolio_theme") === "dark") {
        document.documentElement.classList.add("dark");
      }
      if (localStorage.getItem("portfolio_lang") === "en") {
        document.documentElement.lang = "en";
        document.documentElement.dir = "ltr";
      }
    } catch (error) {}
  })();
</script>
```

هذا الكود المكرّر الوحيد في المشروع، ومبرّره أن CSS وحده لا يستطيع قراءة
`localStorage`.

---

## 3. index.html بالتفصيل

### الوسوم الأولى

```html
<html lang="ar" dir="rtl">
```

- `lang` يخبر المتصفح وقارئ الشاشة بلغة النص (مهم للنطق الصحيح).
- `dir="rtl"` يجعل اتجاه التخطيط من اليمين لليسار. عند التبديل للإنجليزية
  يغيّره `app.js` إلى `ltr`.

### بيانات `<head>`

| الوسم | وظيفته |
| --- | --- |
| `charset="UTF-8"` | ضروري لظهور الحروف العربية صحيحة |
| `viewport` | يجعل العرض مساوياً لعرض الجهاز على الهاتف |
| `description` | وصف يظهر في نتائج البحث وعند مشاركة الرابط |
| `theme-color` | يلوّن شريط المتصفح على الهاتف بلون الثيم |
| `favicon` | أيقونة التبويب (SVG واحدة تعمل بكل المقاسات) |
| `preconnect` | يوفر مئات الأجزاء من الثانية عند تحميل الخط |

### رابط التخطي

```html
<a class="skip-link" href="#main" data-i18n="a11y.skip">تجاوز إلى المحتوى</a>
```

أول عنصر قابل للتركيز في الصفحة. يظهر فقط عند وصولك إليه بمفتاح Tab، ويتيح
لمستخدم لوحة المفاتيح تجاوز شريط التنقل. من بدونه يعيد المستخدم الضغط على
Tab عشرات المرات في كل صفحة.

### شريط التنقل

```html
<header class="site-header">
  <div class="container site-header__inner">
    <a class="brand" href="#" data-nav="home" id="brand">إياد يعرب نيوف</a>

    <nav class="nav" id="nav" aria-label="التنقل الرئيسي">
      <button class="nav__link is-active" type="button" data-nav="home" ...>
```

- `data-nav="home"` هي **الوصلة** بين الزر والقسم: `app.js` يقرأها ليقرر أي
  صفحة يعرض. لا يوجد `onclick` مكتوب يدوياً.
- `aria-label` على `<nav>` يميّزه لقارئ الشاشة.
- `aria-current="page"` يعلن الزر النشط.
- الشارة `<span class="nav__badge" id="navBadge">0</span>` تعرض عدد الرسائل،
  ويحدّثها `render()`.

### أدوات الشريط

```html
<div class="tools">
  <p class="status" id="status" role="status" aria-live="polite" hidden></p>
  <button class="icon-btn" id="themeToggle" data-action="theme" ...>
  <button class="lang-btn" id="langToggle" data-action="lang">EN</button>
  <button class="icon-btn menu-btn" id="menuToggle" data-action="menu" ...>
```

- `role="status"` + `aria-live="polite"` يجعلان قارئ الشاشة يعلن نص الترجمة
  عند تغيّره تلقائياً.
- `data-action` يقول للمستمع المفوَّض أي عملية تُنفَّذ.
- `EN` هو النص الظاهر: الزر يعرض **اللغة التي ستنتقل إليها**، لا الحالية.
- `menu-btn` مخفي على الشاشات الكبيرة بـ CSS، ويظهر تحت 768px.

### الأقسام

```html
<main class="container main" id="main">
  <section class="page is-active" id="page-home" data-page="home"> ... </section>
  <section class="page" id="page-projects" data-page="projects"> ... </section>
  <section class="page" id="page-contact" data-page="contact"> ... </section>
  <section class="page" id="page-dashboard" data-page="dashboard"> ... </section>
```

الأقسام الأربعة موجودة كلها في الملف من البداية. CSS يخفي كل `.page` ويعرض
فقط `.is-active`. هذا أسرع من إنشاء محتوى عند كل تنقّل، ويمنع أي تحميل جديد.

### قسم التواصل

يتألف من عمودين:

```html
<div class="contact">
  <aside class="contact__aside card"> ... </aside>   <!-- لوحة تعريفية -->
  <div class="contact__card card"> <form id="contactForm"> ... </form> </div>
</div>
```

داخل `<aside>`:

- رسم SVG مضمّن يستخدم `currentColor` و`var(--bg-surface)` فيتبع الثيم تلقائياً.
- `#contactEmail` و`#contactLocation` يمتلئان من بيانات لوحة التحكم.
- `#contactWhatsApp` زر واتساب: يفتح `https://wa.me/963994845656` في تبويب جديد
  (`target="_blank"` + `rel="noopener noreferrer"`)، ويحمل أيقونة العلامة بلونها
  الأصلي `#25d366` — اللون الوحيد خارج الثيم، والمبرّر أنه لون علامة تجارية معروفة.
- `aria-hidden="true"` على الرسم يُخفيه من قارئ الشاشة (زخرفي).

داخل النموذج:

- حقول `name/email/subject` عادية مع `autocomplete` و`inputmode` لتحسين لوحة
  مفاتيح الهاتف.
- **محرّر الرسالة**:

```html
<div class="editor">
  <div class="editor__toolbar" role="toolbar">
    <button type="button" class="editor__btn"
            data-command="bold" data-editor="senderMessage">...</button>
    ...
  </div>
  <div id="senderMessage" class="editor__surface editor__surface--auto"
       contenteditable="true" role="textbox" aria-multiline="true"
       aria-labelledby="messageLabel"
       data-placeholder="اكتب المتطلبات التقنية والتفاصيل هنا..."></div>
</div>
```

| السمة | لماذا |
| --- | --- |
| `contenteditable="true"` | يجعل `div` قابلاً للتحرير مع إمكانية التنسيق |
| `role="textbox"` | يعيد للعنصر دلالة حقل الإدخال |
| `aria-multiline` | يعلن أنه متعدد الأسطر |
| `aria-labelledby` | يربطه بعنوان الحقل المرئي |
| `data-placeholder` | النص الإرشادي عبر CSS لأن `placeholder` لا يعمل على `div` |
| `data-editor="senderMessage"` | على الأزرار: أي محرّر تستهدف |

### لوحة التحكم

ثلاث كتل:

1. **نموذج الملف الشخصي**: صورة، اسم، مسمى، بريد، بلد، مهارات، نبذة.
2. **نموذج المشروع**: عنوان، صورة، رابط، ومحرّر وصف + زر إلغاء مخفي.
3. **جدول الأعمال** (`#projectsTable`) و**صندوق الوارد** (`#messages`)،
   كلاهما يُملأ من JS.

نهايات الملف:

```html
<script src="js/core.js"></script>
<script src="js/i18n.js"></script>
<script src="js/app.js"></script>
```

الترتيب **إلزامي**: كل ملف يعتمد على ما قبله (`app` يستخدم `PF.i18n`،
و`i18n` يستخدم `PF.storage`).

---

## 4. CSS: نظام التصميم

### لماذا ثلاثة ملفات؟

| الملف | المسؤولية | مثال |
| --- | --- | --- |
| `base.css` | قواعد عالمية تُطبَّق على كل شيء | `body`, `:root`, `.container` |
| `components.css` | قطع مستقلة قابلة لإعادة الاستخدام | `.btn`, `.field`, `.editor` |
| `pages.css` | تخطيط شاشة معيّنة أو قسم | `.hero`, `.contact`, `.dashboard` |

الفائدة: تعديل زر لا يتطلب البحث في 1700 سطر، ولا يخاطر بكسر قسم آخر.

### المتغيّرات (Design Tokens)

```css
:root {
  --bg-main: #fdfbfb;
  --bg-surface: #ffffff;
  --primary: #9b111e;
  --primary-hover: #7e0e18;
  --text-main: #1f1a1b;
  --text-muted: #6e6566;
  --border-color: #e8dfe0;

  --bg-input: #f7f2f2;
  --nav-bg: var(--bg-surface);

  --space-1: 4px;  ...  --space-16: 64px;
  --text-xs: 0.8125rem; ... --text-xl: 2rem;
  --radius: 8px;
  --dur: 140ms;
}
```

**لماذا متغيّرات لا ألوان مكتوبة؟** لأن لون الزر موجود في مكان واحد؛ تغييره
مرة يغيّر الموقع كله، وثيم الليل لا يحتاج إعادة كتابة أي قاعدة.

**لماذا `--space-4` بدل `16px`؟** لضمان سلّم متناسق: كل المسافات من مضاعفات 4.
تعديل `--space-4` يضبط الحشوات كلها دفعة واحدة.

### تصفير المتصفح بـ `:where()`

```css
:where(ul, ol) {
  margin: 0;
  padding: 0;
  list-style: none;
}
```

`:where()` له **درجة تخصيص صفر**، أي أن أي قاعدة لاحقة (مثل قوائم المحرّر)
تتغلّب عليه بلا `!important` ولا معارك أولويات. هذا سبب اختفاء كلمة
`!important` من المشروع.

### التخطيط العام

```css
body {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}
.main { flex: 1; }
.site-footer { margin-top: auto; }
```

حيلة التذييل اللاصق بالأسفل: الجسم عمود مرن، والمحتوى يتمدد (`flex: 1`)،
فيدفع التذييل إلى آخر الشاشة حتى لو كانت الصفحة شبه فارغة.

```css
.container { width: min(100% - 32px, 1200px); margin-inline: auto; }
```

- `min()` تختار الأصغر: إما عرض الشاشة ناقص 32px، أو 1200px كحد أقصى.
- `margin-inline` بدل `left/right` حتى ينعكس تلقائياً في RTL.

### الخصائص المنطقية بدل الفيزيائية

| بدل | نستخدم |
| --- | --- |
| `margin-left` | `margin-inline-start` |
| `padding-right` | `padding-inline-end` |
| `top` | `inset-block-start` |
| `text-align: right` | `text-align: start` |

المعنى: "البداية" و"النهاية" بحسب الاتجاه. القاعدة نفسها تعمل في العربية
والإنجليزية بلا كود مكرّر.

### الأزرار

```css
.btn { /* الشكل الأساسي */ }
.btn--primary { background: var(--primary); color: #fff; }
.btn--outline { border-color: var(--border-color); }
.btn--danger { background: var(--danger); }
.btn--edit { height: 32px; background: var(--bg-input); }
.btn--sm { height: 32px; }
```

نمط BEM المبسّط: `.btn` هو الكتلة، و`--primary` مُعدّل (modifier). قراءة
`class="btn btn--danger btn--sm"` تخبرك فوراً: زر أساسي، خطر، صغير.

### المحرّر

```css
.editor__surface { min-height: 120px; max-height: 240px; overflow-y: auto; }

.editor__surface--auto {
  min-height: 150px;
  max-height: none;
  overflow: visible;
  white-space: pre-wrap;
}
```

- النسخة الافتراضية (لوحة التحكم) بارتفاع محدود وشريط تمرير.
- النسخة `--auto` (مربّع الرسالة) بلا حد أقصى: **يتمدّد تلقائياً** مع الكتابة
  لأن `contenteditable` يزيد ارتفاعه مع المحتوى.
- `white-space: pre-wrap` يحفظ أسطر المستخدم، و`overflow-wrap: anywhere`
  يمنع كلمة طويلة من كسر التخطيط.

```css
.editor__surface--auto:empty::before {
  content: attr(data-placeholder);
  color: var(--text-muted);
}
```

عندما يكون العنصر فارغاً تماماً، يعرض CSS النص الإرشادي من السمة.

القوائم داخل المحرّر أُعيد تفعيلها بعد التصفير:

```css
.editor__surface :where(ul, ol) {
  padding-inline-start: 22px;
  list-style: revert;
}
```

`revert` تعني "ارجع إلى ما كان المتصفح يفعله أصلاً" أي النقاط والأرقام.

### الاستجابة (Responsive)

| الشرط | التغيير |
| --- | --- |
| `max-width: 900px` | صفحة التواصل تصبح عموداً واحداً |
| `max-width: 768px` | يظهر زر القائمة، القائمة عمودية عند فتحها |
| `max-width: 600px` | يُخفى رسم التواصل، حشوات أصغر |
| `max-width: 420px` | الصورة الشخصية تصغر |
| `max-width: 380px` | شبكات البطاقات تصبح عموداً واحداً |

القاعدة: لا أعراض أفقي (horizontal scroll) في أي عرض.

---

## 5. JavaScript: الملفات الثلاثة

كل ملف يبدأ وينتهي بهذا الشكل:

```js
(function (window) {
  "use strict";
  const PF = (window.PF = window.PF || {});
  // ... الكود
})(window);
```

- IIFE: نطاق مغلق، لا تتسرّب المتغيّرات إلى `window`.
- `"use strict"`: يمنع الأخطاء الصامتة (إسناد لمتغيّر غير معرّف، حذف خاصية…).
- `window.PF`: الكائن الوحيد المشترك، ومنه يتواصل الملفان الآخران.

### 5.1 core.js — الأدوات العامة

#### التخزين

```js
const storage = {
  read(key, fallback) {
    try {
      const raw = window.localStorage.getItem(key);
      return raw === null ? fallback : JSON.parse(raw);
    } catch (error) {
      return fallback;
    }
  },
  write(key, value) { /* JSON.stringify + try/catch */ },
  readText(key) { /* نص خام */ },
  writeText(key, value) { /* نص خام */ },
};
```

- `read` تفكّ JSON، و`readText` للقيم النصية البسيطة (`ar`, `dark`).
- `try/catch` هنا **مبرّر**: التخزين ممنوع في وضع التصفح الخاص في بعض
  المتصفحات، وقد تمتلئ الحصة، وقد تكون القيمة تالفة. الفشل يجب ألا يُسقط الموقع.

#### `escapeHtml`

```js
const escapeHtml = (value) =>
  String(value ?? "").replace(/[&<>"']/g, (char) => HTML_ESCAPES[char]);
```

تحوّل `<` إلى `&lt;` وهكذا. بدونها يستطيع زائر كتابة
`<img src=x onerror=alert(1)>` في اسمه، فينفّذ كوداً في متصفحك عند فتح
صندوق الوارد (ثغرة XSS). **كل** نص مستخدم يمرّ عبرها قبل لصقه في HTML.

#### `sanitizeRichText`

تسمح بوسوم التنسيق فقط:

```js
const ALLOWED_TAGS = new Set(["B","STRONG","I","EM","U","S","STRIKE","BR",
  "P","DIV","UL","OL","LI","A","SPAN"]);
const ALLOWED_ATTRS = { A: ["href"] };
```

الطريقة: تحليل HTML في مستند منفصل (`DOMParser`) ثم المرور على كل عقدة:

- وسم غير مسموح ← **يُفكّ** (يبقى نصه، يُحذف غلافه): `node.replaceWith(...node.childNodes)`.
- سمة غير مسموح بها ← تُحذف من العقدة.

المخرَج آمن للعرض. تُستخدم عند الحفظ (منع تخزين وسوم خطرة) وعند العرض
(حماية البيانات القديمة).

#### `renderRichText`

```js
const raw = String(value || "");
return hasTags(raw) ? sanitizeRichText(raw) : escapeHtml(raw);
```

إن كان النص عادياً (وصف افتراضي، رسالة قديمة) يُهرَّب كنص. إن كان HTML
(من المحرّر) يُنقّى.

#### `formatDate`

```js
new Intl.DateTimeFormat(lang === "ar" ? "ar-SY" : "en-US", {
  dateStyle: "short",
  timeStyle: "short",
});
```

`Intl` يعطي صيغة صحيحة للغة تلقائياً، ويتعامل مع التوقيت المحلي. كائن التنسيق
يُخزَّن في `Map` لأنه غالي الإنشاء، فلا نبنيه لكل رسالة.

#### `hash` (djb2)

```js
let value = 5381;
for (...) value = (value * 33) ^ text.charCodeAt(index);
return (value >>> 0).toString(36);
```

دالة تجزئة قصيرة جداً تُستخدم مفتاحاً في ذاكرة الترجمة، لتجنّب مفاتيح طويلة
بأحرف عربية قد تحمل رموزاً مربكة.

#### `clearFormatting` — أداة "مسح التنسيق"

ثلاث دوال متعاونة:

```js
function unwrapInline(node) { ... }   // يزيل b/i/u/a/span + سمات style
function flattenLists(node, editor) { ... } // يحوّل li إلى أسطر
function clearFormatting(editor) { ... }    // ينسّق العملية
```

**لماذا لم نستخدم `execCommand("removeFormat")`؟** لأنه في المتصفحات يزيل
التنسيق السطري فقط، ولا يمسّ `<ul>/<ol>` لأنها بنية لا تنسيق. لذلك نفكّ
القوائم يدوياً.

خوارزمية `flattenLists`:

1. اجمع كل `ul, ol` داخل النطاق + القائمة التي يحتويها التحديد.
2. رتّبها من الأعمق إلى الأعلى (حتى تُفكّ القوائم المتداخلة أولاً).
3. لكل قائمة: أنشئ `fragment`، وبالنسبة لكل `li`:
   - إن لم تكن الأولى، أضف `<br>`.
   - انقل أبناء `li` إلى الـ fragment.
4. استبدل القائمة بالـ fragment.

النتيجة:

```
<ul><li><b>One</b></li><li>Two</li></ul>   →   One<br>Two
```

وتُعالَج الحالتان اللتان تُنتجان كلاماً ملتصقاً:
`Parent` + قائمة متداخلة ← فاصل قبلها، ونص قبل القائمة ← فاصل قبله.

`clearFormatting` تحترم التحديد:

```js
const hasSelection = range && !range.collapsed && editor.contains(range.commonAncestorContainer);
const scope = hasSelection ? range.commonAncestorContainer : editor;
```

- هناك تحديد ← يُنظَّف ما داخله فقط.
- لا يوجد ← يُنظَّف المحرّر كله (سلوك زر «مسح» المتوقّع).

وإن ضاع المؤشر بعد إعادة الهيكلة، يُعاد إلى نهاية المحرّر بـ `createRange`.

### 5.2 i18n.js — القواميس والترجمة

#### شكل القاموس

```js
const dict = {
  ar: { "nav.home": "الرئيسية", "contact.send": "إرسال الرسالة", ... },
  en: { "nav.home": "Home", "contact.send": "Send message", ... },
};
```

مفاتيح مسطّحة بنقاط (`قسم.عنصر`) — سهلة البحث، ولا تحتاج دوال تنقيب داخل
كائنات متداخلة. عددها 84 مفتاحاً لكل لغة، ويتحقق منه اختبار آلي.

#### `t(key)`

```js
const table = dict[lang] || dict.ar;
if (table[key] !== undefined) return table[key];
return dict.ar[key] !== undefined ? dict.ar[key] : key;
```

سلسلة احتياط: اللغة الحالية ← العربية ← المفتاح نفسه. لا يظهر `undefined`
في الواجهة أبداً.

#### `applyStatic()`

يمرّ على الصفحة ويطبّق:

| السمة | ما تفعله |
| --- | --- |
| `data-i18n` | تستبدل `textContent` |
| `data-i18n-placeholder` | تضبط `placeholder` **و** `data-placeholder` (للمحرّرات) |
| `data-i18n-title` | تضبط `title` و`aria-label` (زر الثيم والقائمة) |

ثم يضبط `document.title`.

#### قاعدة "هل يحتاج هذا النص ترجمة؟"

```js
function needsTarget(text, target) {
  const arabic = hasArabic(value);
  const latin = /[A-Za-z]/.test(value);
  return target === "en" ? arabic : latin && !arabic;
}
```

- إلى الإنجليزية: نترجم أي نص فيه حروف عربية (حتى المختلط).
- إلى العربية: نترجم النص **اللاتيني الخالص** فقط.

هذه القاعدة تمنع خطأً واقعياً: عنوانك `مطور ويب متكامل (Full-Stack Web
Developer)` نص مختلط؛ القاعدة الساذجة كانت ستعتبره إنجليزياً وتعيد ترجمته إلى
العربية عند كل فتح للصفحة، فتُفسده وتستهلك طلبات بلا داعٍ.

#### الطابور (الحد من التوازي)

```js
let active = 0;
const queue = [];
function schedule(task) { /* ينفّذ فوراً إذا كان active < 3، وإلا يضع في الطابور */ }
```

بلا هذا الحد، ترجمة رسالة فيها عشر فقرات تطلق عشرين طلباً متزامناً فتُرفض من
الخدمة. الحد 3 متزامن.

#### مزوّدو الترجمة

```js
const providers = [
  { url: MyMemory..., extract: ... },  // أولاً
  { url: Google gtx..., extract: ... }, // احتياطاً
];
```

- **MyMemory**: يدعم CORS من صفحات `file://`، وله حدّ يومي مجاني.
- **Google**: احتياط عند فشل الأول، ويُستخرج النص من مصفوفة متداخلة.
- إن فشل الاثنان: `throw`، فيلتقطه `translate` ويزيد عدّاد `failures`
  ويعيد النص الأصلي. الموقع لا ينكسر.

#### المهلة

```js
const controller = new AbortController();
const timer = setTimeout(() => controller.abort(), 12000);
```

`AbortController` يلغي الطلب بعد 12 ثانية بدل انتظار أبدي، و`finally` ينظّف
المؤقّت في كل الحالات.

#### التقطيع

الخدمات تحدّ طول النص (نحو 500 حرف). `splitText`:

1. يأخذ أول 450 حرفاً.
2. يبحث عن آخر علامة ترقيم/سطر داخلها.
3. إن لم يجد، يقطع عند آخر مسافة.
4. يكرّر حتى ينتهي النص، ثم تُترجَم القطع بالتوازي وتُدمج.

#### الذاكرة المؤقتة

```js
const key = target + ":" + PF.hash(value);
if (cache[key]) return cache[key];
```

تُخزَّن في `localStorage` تحت `portfolio_translations_v2`. الثمن: مساحة.
لذلك `persistCache` يفحص الطول، وإن تجاوز 900 ألف حرف يحتفظ بآخر 200 مدخل فقط.

الفائدة العملية: التبديل للعربية ثم للإنجليزية مرة أخرى لا يطلق أي طلب
(اختُبر: صفر طلبات).

#### ترجمة HTML

الوصف المنسّق قد يكون `<b>نص</b> <ul><li>بند</li></ul>`. لو أرسلناه كاملاً
للخدمة لتُكسَّرت الوسوم. الحل:

```js
const walker = doc.createTreeWalker(doc.body, NodeFilter.SHOW_TEXT);
```

- `TreeWalker` يزور **عُقد النص فقط**.
- كل عقدة تُترجَم على حدة، وتُستبدل قيمتها مع الحفاظ على المسافات الطرفية.
- الوسوم لا تُلمس، فيبقى التنسيق سليماً والترجمة صحيحة.

#### `localize(data, lang)`

يبني نسخة مترجمة من الحالة كلها:

```js
{ profile: {...name,title,bio,location} , projects: [...], messages: [...] }
```

بحيث لا يُلمس الأصل أبداً؛ الترجمة "طبقة عرض" فقط. لو عدّلت اسمك بعد الترجمة
تبقى بياناتك العربية سليمة في `localStorage`.

### 5.3 app.js — العقل

#### البيانات الافتراضية

```js
const DEFAULT_AVATAR = "data:image/svg+xml;utf8," + encodeURIComponent('<svg ...>');
```

صورة SVG مضمّنة كـ Data URI: تعمل بلا ملفات، وتتكيّف مع أي مقاس، وتبقى
حتى لو حذفت مجلد الصور.

#### الحالة

```js
const state = {
  lang, dark,
  profile, projects, messages,
  snapshots: { ar: null, en: null },
  editingId: null,
  avatarDraft: "",
  imageDraft: "",
};
```

- `snapshots`: نسخة مترجمة جاهزة لكل لغة، فالعودة للغة سابقة فورية.
- `editingId`: `null` = إضافة، رقم = تعديل مشروع قائم.
- `*Draft`: صورة اختارها المستخدم ولم تُحفظ بعد. لا نكتبها في `state.profile`
  إلا عند الحفظ، حتى لا تُفقد لو ألغى التعديل.

#### `cacheDom`

يجمع كل عناصر الصفحة مرة واحدة في كائن `dom`:

```js
dom.senderMessage = document.getElementById("senderMessage");
```

بدل البحث في الشجرة عند كل استخدام (`document.getElementById` لكل حقل في كل
رسم = عمل مهدور واستعلامات متكررة).

#### منظومة العرض

```
state (أو snapshot)  →  renderProfile / renderProjects / renderMessages  →  DOM
```

- `projectCard` و`projectRow` و`messageCard` تُنتج HTML نصياً، ثم يُلصق دفعة
  واحدة (`map(...).join("")` + `innerHTML`).
- كل قيمة مستخدم تمرّ عبر `escapeHtml` أو `renderRichText`.
- `render()` يختار `state.snapshots[state.lang]` إن وُجد، وإلا يعرض الأصل.

#### الترجمة اللحظية

```js
async function localize() {
  const lang = state.lang;
  state.snapshots[lang] = null;
  render();                       // اعرض الأصل فوراً

  if (!i18n.needsTranslation(state, lang)) { setStatus("idle"); return; }

  setStatus("busy");
  i18n.resetFailures();
  const snapshot = await i18n.localize(state, lang);

  if (lang !== state.lang) return; // المستخدم بدّل اللغة أثناء الانتظار
  state.snapshots[lang] = snapshot;
  render();                        // اعرض المترجم
  setStatus(i18n.failures > 0 ? "error" : "idle");
}
```

ثلاث تفاصيل مهمة:

1. **عرض فوري ثم تحسين**: لا تنتظر الواجهة الشبكة.
2. **حماية من التسابق**: إن بدّل المستخدم اللغة أثناء الترجمة، تُهمل النتيجة
   القديمة (`lang !== state.lang`).
3. **صدق مع المستخدم**: إن فشلت الترجمة يظهر شريط أحمر، والضغط عليه يعيد
   المحاولة.

#### الثيم

```js
function setTheme(dark) {
  state.dark = dark;
  document.documentElement.classList.toggle("dark", dark);
  storage.writeText("portfolio_theme", dark ? "dark" : "light");
  syncThemeButton();
}
```

الصنف على `<html>` (لا `body`) لأن المتغيّرات يجب أن تصل لكل شيء بما فيها
الخلفية الكاملة للصفحة.

#### تبديل اللغة — الخطوات بالترتيب

```js
function setLang(lang) {
  state.lang = lang;
  storage.writeText("portfolio_lang", lang);
  document.documentElement.lang = lang;
  document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";

  i18n.setLang(lang);      // 1) القاموس الجديد
  i18n.applyStatic();      // 2) نصوص الواجهة
  syncLangButton();        // 3) نص الزر EN/AR
  syncThemeButton();       // 4) وصف زر الثيم
  syncProjectForm();       // 5) عناوين نموذج المشروع

  localize();              // 6) بيانات المستخدم (async)
}
```

الترتيب مقصود: لا يمكن ترجمة بيانات قبل اختيار القاموس، ولا تحديث عناوين
النموذج قبل `applyStatic` (لأنها تستبدلها).

#### التنقّل

```js
function showPage(page) {
  $$(".page").forEach((section) =>
    section.classList.toggle("is-active", section.dataset.page === page));
  ...
  dom.nav.classList.remove("is-open");
}
```

- إظهار/إخفاء بصنف واحد.
- تحديث `aria-current` لقارئ الشاشة.
- إغلاق قائمة الهاتف تلقائياً بعد الاختيار.

#### النماذج

**التواصل**:

```js
if (!dom.senderMessage.textContent.trim()) { /* خطأ + تركيز */ }
state.messages = [{ ..., message: sanitizeRichText(dom.senderMessage.innerHTML) }, ...];
save(...); dom.contactForm.reset(); dom.senderMessage.innerHTML = "";
```

- `textContent` للحكم على الفراغ (لا `innerHTML`، فقد يكون `<br>` بلا نص).
- `innerHTML` للحفظ مع التنقية.
- `form.reset()` لا يمسّ `contenteditable`، لذا نُفرغه يدوياً.

**المشروع**: يحفظ صورة جديدة فقط إن اختار المستخدم واحدة:

```js
item.id === state.editingId
  ? { ...item, ...draft, image: draft.image || item.image }
  : item
```

**الملف الشخصي**: الصورة الجديدة تُستخدم إن وُجدت، وإلا تبقى القديمة.

#### الأحداث: التفويض

```js
document.addEventListener("click", (event) => {
  const nav = event.target.closest("[data-nav]");
  if (nav) { event.preventDefault(); showPage(nav.dataset.nav); return; }

  const action = event.target.closest("[data-action]");
  if (action) { handleAction(action.dataset.action, action); return; }

  const command = event.target.closest("[data-command]");
  if (command) applyCommand(command);
});
```

مستمع واحد فقط لكل النقرات. السبب: عناصر المشاريع والرسائل تُعاد بناؤها باستمرار
عند كل تعديل؛ لو ربطنا مستمعاً لكل زر لفقدنا المستمعين وفاضت الذاكرة مع كل
إعادة رسم.

`closest` تصعد من العنصر المضغوط إلى أقرب أب مطابق، فالنقر على أيقونة داخل زر
يعمل أيضاً.

#### حماية التحديد

```js
document.addEventListener("mousedown", (event) => {
  if (event.target.closest("[data-command]")) event.preventDefault();
});
```

بدونها يفقد المحرّر التركيز والتحديد عند الضغط على **B**، فيُطبَّق التنسيق في
مكان خاطئ أو لا يُطبَّق.

#### `init()`

```js
cacheDom();
i18n.setLang(state.lang);
document.documentElement.lang/dir = ...
i18n.applyStatic();
syncLangButton();
setTheme(state.dark);
syncProjectForm();
bindEvents();
localize();
```

كل خطوة تعتمد على سابقتها، وهذا هو الترتيب الوحيد الصحيح.

---

## 6. البيانات والتخزين

كل شيء في `localStorage` (مخزن نصي دائم في المتصفح، لكل موقع/ملف).

| المفتاح | النوع | المحتوى |
| --- | --- | --- |
| `portfolio_profile` | JSON | `{ name, title, bio, email, location, skills, avatar }` |
| `portfolio_projects` | JSON | `[{ id, title, image, link, description }]` |
| `portfolio_messages` | JSON | `[{ id, name, email, subject, message, createdAt }]` |
| `portfolio_lang` | نص | `ar` أو `en` |
| `portfolio_theme` | نص | `light` أو `dark` |
| `portfolio_translations_v2` | JSON | `{ "en:hash": "النص المترجم" }` |

### لماذا `Date.now()` كمعرّف؟

بسيط وفريد عملياً. في التعديل والحذف نقارن `Number(dataset.id)`، لأن سمات
`data-*` تُعيد نصاً دائماً.

### الصورة تُخزَّن كـ Base64

`FileReader` يحوّل الملف إلى Data URI نصي. النتيجة: الصورة تبقى بعد إعادة
التشغيل، لكن حدّ التخزين نحو 5 ميغابايت، لذا يجب ضغط الصور الكبيرة قبل رفعها.

### البيانات الافتراضية

إن كان المفتاح غير موجود، يستخدم الموقع `DEFAULTS`. أي أن أول فتح يعرض
بيانات جاهزة، والفتح الثاني يعرض ما عدّلته.

### النسخ الاحتياطي

من أدوات المتصفح (F12 → Application → Local Storage) يمكنك نسخ القيمة
ولصقها لاحقاً. أو من الـ Console:

```js
copy(localStorage.getItem("portfolio_projects"));
```

---

## 7. الثيم الفاتح والداكن

```css
:root { --bg-main: #fdfbfb; --primary: #9b111e; ... }   /* الفاتح */
.dark  { --bg-main: #120b0c; --primary: #e0115f; ... }  /* الداكن */
```

- `.dark` على `<html>` يعيد تعريف المتغيّرات فقط.
- كل قاعدة في الموقع تقرأ `var(--...)`، فلا تحتاج أي قاعدة أن تعرف بالثيم.
- `color-scheme` يجعل عناصر المتصفح الأصلية (شريط التمرير، القوائم) داكنة أيضاً.

### دورة التبديل

```
نقرة زر → setTheme(!state.dark)
        → classList.toggle("dark")
        → localStorage
        → تبديل الأيقونة (شمس/قمر)
        → تحديث title و aria-label
```

`transition` على `background-color` و`color` يجعل التحوّل ناعماً في 200ms بدل
قفزة حادة.

---

## 8. منظومة اللغتين والترجمة التلقائية

### القسمان: ثابت ومتغيّر

| النوع | المصدر | السرعة |
| --- | --- | --- |
| نصوص الواجهة (أزرار، عناوين، تلميحات) | قاموس محلي في `i18n.js` | فوري، بلا إنترنت |
| بيانات المستخدم (اسم، نبذة، مشاريع، رسائل) | خدمة ترجمة عبر الشبكة | ثانية أو ثانيتان، ثم مخزّن |

### مخطط الترجمة

```
تبديل اللغة
   │
   ├─ نصوص الواجهة  →  dict[lang]  →  فوري
   │
   └─ البيانات  →  needsTranslation?
                      │ نعم
                      ▼
                 شريط "جارٍ الترجمة"
                      │
                 كل نص: مخزّن سابقاً؟
                   ├─ نعم → استخدمه (فوري)
                   └─ لا  → MyMemory → (فشل؟) Google
                              │
                        حفظ في localStorage
                      │
                 إعادة رسم الشاشة
                      │
                 نجاح؟ → إخفاء الشريط
                 فشل؟  → شريط أحمر قابل لإعادة المحاولة
```

### لماذا لا تُترجم رسالة الزائر عند وصولها؟

لأن ذلك يبطئ الإرسال ويكلّف طلبات لا داعي لها إن لم يُبدّل المالك اللغة.
الترجمة تحدث عند الحاجة فقط (عند تبديل اللغة)، ثم تُخزَّن.

### الخصوصية

بيانات العرض (اسمك، نبذتك، وصف مشاريعك) تُرسل إلى خدمة ترجمة عامة عند التبديل
إلى الإنجليزية. لا تُرسل كلمات المرور (لا توجد) ولا البريد (لا يُترجم).
إن كان ذلك غير مقبول، يمكن تعطيل الميزة بجعل `translate` تعيد النص كما هو.

---

## 9. المحرّر النصي المنسّق

### كيف يعمل `contenteditable`؟

عنصر `div` بسمة `contenteditable="true"` يصبح قابلاً للكتابة، ويحفظ HTML
داخله (`<b>`, `<ul>`…). لا يوجد `value`؛ نقرأ `innerHTML` ونكتب فيه.

### أوامر التنسيق

```js
document.execCommand("bold", false, null);
```

`execCommand` واجهة قديمة (deprecated) لكنها ما زالت مدعومة في كل المتصفحات
الحديثة، وتكفي لأربعة أزرار ومحرّرين. بديلها يتطلب بناء محرّر كامل من الصفر
(إدارة `Range` و`Selection` يدوياً) — تعقيد لا يبرّره الحجم.

الأوامر المستخدمة:

| الأمر | النتيجة |
| --- | --- |
| `bold` | `<b>` |
| `italic` | `<i>` |
| `underline` | `<u>` |
| `strikeThrough` | `<s>` |
| `insertUnorderedList` | `<ul><li>` |
| `insertOrderedList` | `<ol><li>` |
| `removeFormat` | لا يمسّ القوائم ← لذلك كتبنا `clearFormatting` |

### دورة حياة المحتوى

```
كتابة المستخدم
   │
   ├─ عند الإرسال: sanitizeRichText(innerHTML)  ← منع الأكواد
   ├─ عند الحفظ: JSON في localStorage
   └─ عند العرض: renderRichText(value)          ← تأمين مزدوج
```

التأمين مرّتان مقصود: قد تكون البيانات القديمة في `localStorage` كُتبت قبل
إضافة التنقية.

### النص الإرشادي

`placeholder` لا يعمل على `div`؛ الحل CSS:

```css
.editor__surface--auto:empty::before { content: attr(data-placeholder); }
```

### التمدّد التلقائي

لا يوجد سطر JS له. `contenteditable` يزيد ارتفاعه مع المحتوى، وCSS يمنع فقط
الحد الأقصى وشريط التمرير:

```css
min-height: 150px; max-height: none; overflow: visible;
```

### "مسح التنسيق" بالتفصيل

راجع [القسم 5.1](#51-corejs--الأدوات-العامة) — الخلاصة: يفكّ القوائم إلى أسطر،
يزيل الوسوم السطرية والروابط وسمات `style`، ويحترم التحديد.

---

## 10. تدفّق العمليات (سكربتات حقيقية)

### إضافة مشروع

1. `projectForm` يُطلق `submit` ← `submitProject(event)`.
2. `preventDefault()` يمنع إعادة تحميل الصفحة.
3. `sanitizeRichText(dom.projectDescription.innerHTML)`.
4. إن كان الوصف فارغاً ← `alert` وخروج.
5. `state.projects = [{ id: Date.now(), ...draft }, ...state.projects]`.
6. `save("portfolio_projects", state.projects)`.
7. `resetProjectForm()`: تفريغ الحقول، إخفاء زر الإلغاء، إعادة العنوان.
8. `invalidate()`: تفريغ النسخ المترجمة (البيانات تغيّرت).
9. `localize()`: رسم جديد + ترجمة إن لزمت.

### تعديل مشروع

1. زر `data-action="edit-project" data-id="..."`.
2. `handleAction` ← `startEdit(id)`.
3. تعبئة الحقول من `state.projects`، `state.editingId = id`.
4. `syncProjectForm()`: العنوان "تعديل المشروع: …"، الزر "حفظ التعديلات".
5. عند الحفظ: `submitProject` يمرّ على المصفوفة ويستبدل العنصر المطابق.

### حذف مشروع

`confirm(t("confirm.deleteProject"))` ← تصفية المصفوفة ← حفظ ← إعادة رسم.

### إرسال رسالة

1. التحقق من `textContent`.
2. بناء كائن الرسالة (`createdAt: new Date().toISOString()` — التخزين بـ ISO
   يجعل التنسيق ممكناً بأي لغة لاحقاً).
3. الحفظ، تفريغ النموذج والمحرّر.
4. إظهار تنبيه النجاح 5 ثوانٍ.
5. إعادة رسم الوارد + تحديث الشارة.

---

## 11. الإتاحة والأداء

### الإتاحة

| الميزة | الفائدة |
| --- | --- |
| `skip-link` | تجاوز التنقل بلوحة المفاتيح |
| `aria-current` | إعلان الصفحة النشطة |
| `aria-live` على شريط الحالة | إعلان تلقائي لتقدّم الترجمة |
| `aria-labelledby` للمحرّرات | اسم مقروء لكل حقل |
| `scope="col"` للجداول | ربط الخلية بعنوانها |
| `:focus-visible` | حلقة تركيز واضحة بلا إزعاج الفأرة |
| `prefers-reduced-motion` | إيقاف الحركة لمن يعاني الدوار |
| تباين الألوان | النص الأساسي على الخلفية > 7:1 |

### الأداء

- **بلا مكتبات**: صفر كيلوبايت JS خارجي.
- **بلا خطوة بناء**: ما تكتبه هو ما يعمل.
- `preconnect` + `display=swap` للخط.
- عرض دفعة واحدة (`innerHTML` مرة) بدل إضافة عنصر عنصر.
- `Intl` مُخزَّن، الترجمة مُخزَّنة، لا استعلامات متكرّرة.
- SVG بدل صور نقطية للأيقونات والرسوم.

---

## 12. كيف تعدّل الموقع

### تغيير لون

`css/base.css` ← عدّل `--primary` (والثيم الداكن في `.dark`). لا تلمس أي ملف آخر.

### إضافة مفتاح ترجمة

1. أضف المفتاح في `ar` و`en` داخل `js/i18n.js`.
2. ضع `data-i18n="مفتاحك"` على العنصر في HTML.
3. لا شيء آخر — `applyStatic` يتكفّل بالباقي.

### إضافة قسم جديد

1. `<section class="page" id="page-about" data-page="about">` في `index.html`.
2. زر `<button class="nav__link" data-nav="about" data-i18n="nav.about">`.
3. مفتاحا ترجمة `nav.about`.
4. `#page-about` تعمل تلقائياً: `showPage` تبدّل `is-active` لكل `.page`.

### إضافة حقل للمشروع

1. حقل في `index.html` (بمعرّف جديد).
2. أضفه إلى `ids` في `cacheDom`.
3. اقرأه في `submitProject` واكتبه في `draft`.
4. اعرضه في `projectCard` و/أو `projectRow`.
5. إن كان نصياً ويحتاج ترجمة، أضفه في `localize` و`needsTranslation`.

### إضافة أمر تنسيق

1. زر في `editor__toolbar` بـ `data-command="اسم الأمر" data-editor="…"`.
2. إن كان أمر `execCommand` قياسياً، لا شيء آخر. وإلا أضِف حالة في `applyCommand`.

### تغيير الخط

رابط Google Fonts في `<head>` + `--font-sans` في `base.css`.

---

## 13. استكشاف الأخطاء

| العَرَض | السبب المحتمل | الفحص |
| --- | --- | --- |
| الصفحة فارغة | خطأ JS يوقف `app.js` | Console (F12) |
| الثيم لا يُحفظ | `localStorage` محظور | Application → Local Storage |
| الترجمة لا تعمل | الخدمة محجوبة/تجاوزت الحد | Network → ابحث عن `mymemory` |
| شريط أحمر دائم | فشل المزوّدين | اضغط الشريط لإعادة المحاولة |
| زر لا يستجيب | `data-action` خاطئ أو معرّف ناقص | Elements → تحقّق من السمة |
| المحرّر لا يتمدّد | صنف `--auto` مفقود | Computed → max-height |
| قوائم بلا نقاط | تصفير `list-style` | تحقّق من `.editor__surface :where(ul,ol)` |

### أوامر مفيدة في الـ Console

```js
PF.i18n.t("nav.home");                    // نص مفتاح باللغة الحالية
JSON.parse(localStorage.getItem("portfolio_projects"));
localStorage.removeItem("portfolio_translations_v2"); // امسح ذاكرة الترجمة
document.documentElement.className;       // "dark" أم لا
```

---

## 14. مسرد المصطلحات

| المصطلح | المعنى |
| --- | --- |
| **DOM** | تمثيل المتصفح لصفحة HTML كشجرة عناصر يمكن لـ JS تعديلها |
| **IIFE** | دالة تُنفّذ فور تعريفها، تُستخدم لعزل المتغيّرات |
| **Design Tokens** | متغيّرات CSS تصف قرارات التصميم (لون، مسافة، حجم) |
| **BEM** | تسمية الأصناف: `block__element--modifier` |
| **Delegation** | ربط مستمع واحد بالأب بدل مستمع لكل عنصر |
| **Sanitization** | تنقية HTML من الوسوم والسمات الخطرة |
| **Snapshot** | نسخة جاهزة من البيانات بلغة معيّنة |
| **XSS** | حقن كود يعمل في متصفح زائر آخر |
| **CORS** | سياسة تمنع طلب بيانات من نطاق آخر بلا إذن الخادم |
| **Data URI** | تضمين ملف (صورة) داخل نص بدل رابط خارجي |
| **contenteditable** | خاصية تجعل أي عنصر قابلاً للتحرير |
| **execCommand** | واجهة قديمة لتنسيق النص في المحرّرات |
| **RTL** | اتجاه الكتابة من اليمين إلى اليسار |
| **Logical Properties** | خصائص تتبع اتجاه الكتابة (`inline-start` بدل `left`) |
