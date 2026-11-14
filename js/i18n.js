(function (window) {
  "use strict";

  const PF = window.PF;
  const { storage, hasArabic } = PF;

  const dict = {
    ar: {
      "meta.title": "معرض الأعمال الشخصي | إياد يعرب نيوف",

      "a11y.skip": "تجاوز إلى المحتوى",
      "a11y.menu": "فتح القائمة",
      "a11y.themeDark": "التبديل إلى الوضع الليلي",
      "a11y.themeLight": "التبديل إلى الوضع النهاري",
      "a11y.langSwitch": "التبديل إلى الإنجليزية",
      "a11y.toolbar": "أدوات تنسيق النص",
      "a11y.avatar": "الصورة الشخصية للمطور إياد يعرب نيوف",

      "nav.home": "الرئيسية",
      "nav.projects": "أعمالي",
      "nav.contact": "تواصل معي",
      "nav.dashboard": "لوحة التحكم",

      "common.email": "البريد",
      "common.location": "الإقامة",

      "home.browse": "تصفح أعمالي",
      "home.contact": "تواصل معي",

      "projects.title": "معرض الأعمال والمشاريع",
      "projects.subtitle": "تطبيقات ويب وأنظمة قواعد بيانات قمت ببرمجتها وتطويرها",
      "projects.empty":
        'لا توجد أعمال منشورة حالياً. يمكنك إضافة مشروع جديد من قسم "لوحة التحكم".',
      "projects.emptyTable": "لا توجد أعمال منشورة في قاعدة البيانات المحلية.",
      "projects.preview": "معاينة المشروع",
      "projects.edit": "تعديل",
      "projects.delete": "حذف",

      "contact.title": "تواصل معي",
      "contact.subtitle":
        "أرسل تفاصيل مشروعك أو استفسارك التقني وسأرد عليك عبر البريد الإلكتروني",
      "contact.asideTitle": "لنبنِ مشروعك القادم معاً",
      "contact.asideText":
        "أخبرني بفكرتك أو المشكلة التقنية التي تواجهها، وسأعود إليك بخطة واضحة ومدة زمنية وتقدير للتكلفة.",
      "contact.whatsapp": "تواصل عبر واتساب",
      "contact.replyTime": "أرد عادةً خلال 24 ساعة في أيام العمل.",
      "contact.name": "الاسم الكامل",
      "contact.namePh": "أدخل اسمك الكامل",
      "contact.email": "البريد الإلكتروني",
      "contact.subject": "عنوان الرسالة",
      "contact.subjectPh": "مثال: تطوير متجر إلكتروني بـ Django",
      "contact.message": "تفاصيل الرسالة",
      "contact.messagePh": "اكتب المتطلبات التقنية والتفاصيل هنا...",
      "contact.send": "إرسال الرسالة",
      "contact.success": "تم إرسال رسالتك بنجاح، وهي محفوظة الآن في لوحة التحكم.",
      "contact.messageError": "الرجاء كتابة تفاصيل الرسالة قبل الإرسال.",

      "dash.title": "لوحة التحكم وإدارة الموقع",
      "dash.subtitle":
        "حدّث بياناتك الشخصية، أضف أو عدّل مشاريعك، وتابع الرسائل الواردة من الزوار",
      "dash.profile": "تعديل المعلومات الشخصية",
      "dash.avatar": "تغيير الصورة الشخصية (من جهازك)",
      "dash.role": "المسمى الوظيفي",
      "dash.place": "المدينة والبلد",
      "dash.skills": "المهارات التقنية (افصل بينها بفاصلة ,)",
      "dash.bio": "النبذة التعريفية",
      "dash.save": "حفظ التعديلات الشخصية",
      "dash.saved": "تم حفظ البيانات وتحديث الصفحة.",
      "dash.addProject": "إضافة عمل جديد",
      "dash.editProject": "تعديل المشروع: ",
      "dash.projectTitle": "عنوان المشروع",
      "dash.projectTitlePh": "مثال: منصة دار سطور للكتب",
      "dash.projectImage": "صورة المشروع (من جهازك)",
      "dash.projectLink": "رابط المشروع (اختياري)",
      "dash.projectDescription": "وصف المشروع (حدد النص واستخدم الأزرار للتنسيق)",
      "dash.descriptionError": "الرجاء كتابة وصف للمشروع قبل النشر.",
      "dash.publish": "نشر العمل في الموقع",
      "dash.saveChanges": "حفظ التعديلات",
      "dash.cancel": "إلغاء التعديل",
      "dash.published": 'الأعمال المنشورة حالياً (اضغط على "تعديل" لتحرير أي عمل)',
      "dash.tableImage": "الصورة",
      "dash.tableTitle": "عنوان العمل",
      "dash.tableDesc": "الوصف المنسق",
      "dash.tableActions": "الإجراءات",
      "dash.inbox": 'الرسائل الواردة من صفحة "تواصل معي"',
      "dash.clearAll": "مسح جميع الرسائل",
      "dash.emptyInbox":
        "صندوق الوارد فارغ. ستظهر هنا الرسائل المرسلة من نموذج التواصل.",
      "dash.subjectPrefix": "الموضوع: ",
      "dash.deleteMessage": "حذف الرسالة",
      "dash.replyEmail": "الرد بالبريد",

      "editor.bold": "خط عريض",
      "editor.italic": "خط مائل",
      "editor.underline": "تحته خط",
      "editor.strike": "يتوسطه خط",
      "editor.bullets": "قائمة نقطية",
      "editor.numbers": "قائمة مرقّمة",
      "editor.clear": "مسح التنسيق",
      "editor.clearShort": "مسح",

      "footer.rights": "جميع الحقوق محفوظة ©",

      "confirm.deleteProject": "هل أنت متأكد من حذف هذا العمل نهائياً؟",
      "confirm.clearMessages": "هل تريد مسح جميع الرسائل الواردة نهائياً؟",

      "status.translating": "جارٍ ترجمة بياناتك تلقائياً…",
      "status.failed": "تعذّرت الترجمة التلقائية — تُعرض النصوص بلغتها الأصلية.",
    },

    en: {
      "meta.title": "Personal Portfolio | Eyad Yaarub Niyouf",

      "a11y.skip": "Skip to content",
      "a11y.menu": "Open menu",
      "a11y.themeDark": "Switch to dark mode",
      "a11y.themeLight": "Switch to light mode",
      "a11y.langSwitch": "Switch to Arabic",
      "a11y.toolbar": "Text formatting tools",
      "a11y.avatar": "Portrait of the developer Eyad Yaarub Niyouf",

      "nav.home": "Home",
      "nav.projects": "Projects",
      "nav.contact": "Contact",
      "nav.dashboard": "Dashboard",

      "common.email": "Email",
      "common.location": "Location",

      "home.browse": "Browse projects",
      "home.contact": "Contact me",

      "projects.title": "Projects",
      "projects.subtitle":
        "Web applications and database systems I have designed and developed",
      "projects.empty":
        'No published projects yet. You can add a new project from the "Dashboard" section.',
      "projects.emptyTable": "No published projects in the local database.",
      "projects.preview": "Preview project",
      "projects.edit": "Edit",
      "projects.delete": "Delete",

      "contact.title": "Get in touch",
      "contact.subtitle":
        "Send your project details or your technical question and I will reply by email",
      "contact.asideTitle": "Let's build your next project together",
      "contact.asideText":
        "Tell me your idea or the technical problem you are facing, and I will get back to you with a clear plan, a timeline and a cost estimate.",
      "contact.whatsapp": "Chat on WhatsApp",
      "contact.replyTime": "I usually reply within 24 hours on business days.",
      "contact.name": "Full name",
      "contact.namePh": "Enter your full name",
      "contact.email": "Email address",
      "contact.subject": "Subject",
      "contact.subjectPh": "e.g. Building an online store with Django",
      "contact.message": "Message details",
      "contact.messagePh": "Write the technical requirements and details here...",
      "contact.send": "Send message",
      "contact.success": "Your message was sent successfully and saved to the dashboard.",
      "contact.messageError": "Please write the message details before sending.",

      "dash.title": "Dashboard",
      "dash.subtitle":
        "Update your profile, add or edit your projects, and follow up on visitor messages",
      "dash.profile": "Edit personal information",
      "dash.avatar": "Change profile picture (from your device)",
      "dash.role": "Job title",
      "dash.place": "City and country",
      "dash.skills": "Technical skills (separate with a comma ,)",
      "dash.bio": "Biography",
      "dash.save": "Save profile changes",
      "dash.saved": "Profile saved and page updated.",
      "dash.addProject": "Add new project",
      "dash.editProject": "Edit project: ",
      "dash.projectTitle": "Project title",
      "dash.projectTitlePh": "e.g. Dar Sotoor bookstore platform",
      "dash.projectImage": "Project image (from your device)",
      "dash.projectLink": "Project link (optional)",
      "dash.projectDescription":
        "Project description (select text and use the buttons to format)",
      "dash.descriptionError": "Please write a project description before publishing.",
      "dash.publish": "Publish project",
      "dash.saveChanges": "Save changes",
      "dash.cancel": "Cancel edit",
      "dash.published": 'Published projects (click "Edit" to modify any project)',
      "dash.tableImage": "Image",
      "dash.tableTitle": "Title",
      "dash.tableDesc": "Formatted description",
      "dash.tableActions": "Actions",
      "dash.inbox": "Messages received from the contact page",
      "dash.clearAll": "Clear all messages",
      "dash.emptyInbox":
        "The inbox is empty. Messages sent from the contact form will appear here.",
      "dash.subjectPrefix": "Subject: ",
      "dash.deleteMessage": "Delete message",
      "dash.replyEmail": "Reply by email",

      "editor.bold": "Bold",
      "editor.italic": "Italic",
      "editor.underline": "Underline",
      "editor.strike": "Strikethrough",
      "editor.bullets": "Bullet list",
      "editor.numbers": "Numbered list",
      "editor.clear": "Clear formatting",
      "editor.clearShort": "Clear",

      "footer.rights": "All rights reserved ©",

      "confirm.deleteProject": "Delete this project permanently?",
      "confirm.clearMessages": "Clear all received messages permanently?",

      "status.translating": "Translating your content automatically…",
      "status.failed": "Automatic translation failed — showing the original text.",
    },
  };

  const CACHE_KEY = "portfolio_translations_v2";
  const CACHE_LIMIT = 900000;
  const CHUNK_SIZE = 450;
  const CONCURRENCY = 3;
  const TIMEOUT = 12000;

  let lang = "ar";
  let cache = storage.read(CACHE_KEY, {});
  let failures = 0;
  let active = 0;
  const queue = [];

  function t(key) {
    const table = dict[lang] || dict.ar;
    if (table[key] !== undefined) return table[key];
    return dict.ar[key] !== undefined ? dict.ar[key] : key;
  }

  function applyStatic(root) {
    const scope = root || document;

    scope.querySelectorAll("[data-i18n]").forEach((node) => {
      node.textContent = t(node.dataset.i18n);
    });

    scope.querySelectorAll("[data-i18n-placeholder]").forEach((node) => {
      const value = t(node.dataset.i18nPlaceholder);
      node.setAttribute("placeholder", value);
      node.setAttribute("data-placeholder", value);
    });

    scope.querySelectorAll("[data-i18n-title]").forEach((node) => {
      const value = t(node.dataset.i18nTitle);
      node.title = value;
      node.setAttribute("aria-label", value);
    });

    document.title = t("meta.title");
  }

  function persistCache() {
    try {
      const payload = JSON.stringify(cache);
      if (payload.length <= CACHE_LIMIT) {
        window.localStorage.setItem(CACHE_KEY, payload);
        return;
      }
      const keys = Object.keys(cache).slice(-200);
      const trimmed = {};
      keys.forEach((key) => {
        trimmed[key] = cache[key];
      });
      cache = trimmed;
      window.localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
    } catch (error) {
      // تجاهل امتلاء الحصة، النتائج الجديدة تبقى في الذاكرة الحالية
    }
  }

  function needsTarget(text, target) {
    const value = String(text || "");
    if (!value.trim()) return false;
    const arabic = hasArabic(value);
    const latin = /[A-Za-z]/.test(value);
    return target === "en" ? arabic : latin && !arabic;
  }

  const decoder = document.createElement("textarea");

  function decodeEntities(text) {
    decoder.innerHTML = text;
    return decoder.value;
  }

  function schedule(task) {
    return new Promise((resolve, reject) => {
      const run = () => {
        active += 1;
        task()
          .then(resolve, reject)
          .finally(() => {
            active -= 1;
            const next = queue.shift();
            if (next) next();
          });
      };
      if (active < CONCURRENCY) run();
      else queue.push(run);
    });
  }

  async function fetchJson(url) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), TIMEOUT);
    try {
      const response = await fetch(url, { signal: controller.signal, mode: "cors" });
      return response.ok ? await response.json() : null;
    } finally {
      clearTimeout(timer);
    }
  }

  const providers = [
    {
      url: (text, from, to) =>
        "https://api.mymemory.translated.net/get?q=" +
        encodeURIComponent(text) +
        "&langpair=" +
        from +
        "|" +
        to,
      extract(json) {
        if (!json || !json.responseData) return null;
        if (json.responseStatus && Number(json.responseStatus) !== 200) return null;
        const out = json.responseData.translatedText;
        return out && !/MYMEMORY WARNING/i.test(out) ? out : null;
      },
    },
    {
      url: (text, from, to) =>
        "https://translate.googleapis.com/translate_a/single?client=gtx&sl=" +
        from +
        "&tl=" +
        to +
        "&dt=t&q=" +
        encodeURIComponent(text),
      extract(json) {
        if (!Array.isArray(json) || !Array.isArray(json[0])) return null;
        const out = json[0]
          .map((part) => (Array.isArray(part) ? part[0] : ""))
          .join("");
        return out || null;
      },
    },
  ];

  async function translateChunk(text, from, to) {
    for (const provider of providers) {
      try {
        const json = await fetchJson(provider.url(text, from, to));
        const out = provider.extract(json);
        if (out && out.trim()) return decodeEntities(out.trim());
      } catch (error) {
        // المزوّد التالي يعوّض الفشل
      }
    }
    throw new Error("translation failed");
  }

  function splitText(text, limit) {
    const parts = [];
    let rest = text;

    while (rest.length > limit) {
      const slice = rest.slice(0, limit);
      const breaks = /[.!?؟،؛:;\n]/g;
      let cut = -1;
      let match;
      while ((match = breaks.exec(slice))) cut = match.index + 1;

      if (cut < limit * 0.3) {
        const space = rest.lastIndexOf(" ", limit);
        cut = space > limit * 0.3 ? space : limit;
      }

      parts.push(rest.slice(0, cut).trim());
      rest = rest.slice(cut).trim();
    }

    if (rest.trim()) parts.push(rest.trim());
    return parts;
  }

  async function translate(text, target) {
    const value = String(text || "");
    if (!needsTarget(value, target)) return value;

    const key = target + ":" + PF.hash(value);
    if (cache[key]) return cache[key];

    const from = target === "en" ? "ar" : "en";

    try {
      const chunks = splitText(value, CHUNK_SIZE);
      const parts = await Promise.all(
        chunks.map((chunk) => schedule(() => translateChunk(chunk, from, target))),
      );
      const out = parts.join(" ");
      cache[key] = out;
      persistCache();
      return out;
    } catch (error) {
      failures += 1;
      return value;
    }
  }

  async function translateHtml(html, target) {
    if (!html) return "";
    if (!PF.hasTags(html)) return translate(html, target);

    try {
      const doc = new DOMParser().parseFromString(String(html), "text/html");
      const walker = doc.createTreeWalker(doc.body, NodeFilter.SHOW_TEXT);
      const nodes = [];

      while (walker.nextNode()) {
        if (walker.currentNode.nodeValue.trim()) nodes.push(walker.currentNode);
      }

      await Promise.all(
        nodes.map(async (node) => {
          const original = node.nodeValue;
          const core = original.trim();
          const translated = await translate(core, target);
          if (translated === core) return;
          const start = original.indexOf(core);
          node.nodeValue =
            original.slice(0, start) +
            translated +
            original.slice(start + core.length);
        }),
      );

      return doc.body.innerHTML;
    } catch (error) {
      failures += 1;
      return html;
    }
  }

  function needsTranslation(data, target) {
    const texts = [
      data.profile.name,
      data.profile.title,
      data.profile.bio,
      data.profile.location,
    ];

    data.projects.forEach((project) => {
      texts.push(project.title, project.description);
    });

    data.messages.forEach((message) => {
      texts.push(message.name, message.subject, message.message);
    });

    return texts.some((text) => needsTarget(text, target));
  }

  async function localize(data, target) {
    const [name, title, bio, location] = await Promise.all([
      translate(data.profile.name, target),
      translate(data.profile.title, target),
      translate(data.profile.bio, target),
      translate(data.profile.location, target),
    ]);

    const projects = await Promise.all(
      data.projects.map(async (project) => ({
        ...project,
        title: await translate(project.title, target),
        description: await translateHtml(project.description, target),
      })),
    );

    const messages = await Promise.all(
      data.messages.map(async (message) => ({
        ...message,
        name: await translate(message.name, target),
        subject: await translate(message.subject, target),
        message: await translate(message.message, target),
      })),
    );

    return {
      profile: { ...data.profile, name, title, bio, location },
      projects,
      messages,
    };
  }

  PF.i18n = {
    t,
    applyStatic,
    translate,
    translateHtml,
    localize,
    needsTranslation,
    setLang(value) {
      lang = value === "en" ? "en" : "ar";
    },
    get lang() {
      return lang;
    },
    get failures() {
      return failures;
    },
    resetFailures() {
      failures = 0;
    },
  };
})(window);
