(function (window) {
  "use strict";

  const PF = window.PF;
  const { $, $$, storage, escapeHtml, renderRichText, sanitizeRichText, formatDate } = PF;
  const i18n = PF.i18n;
  const t = i18n.t;

  const DEFAULT_AVATAR =
    "data:image/svg+xml;utf8," +
    encodeURIComponent(
      '<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300" viewBox="0 0 300 300">' +
        '<rect width="300" height="300" fill="#1C1315"/>' +
        '<circle cx="150" cy="115" r="50" fill="#A89B9D"/>' +
        '<path d="M 65 260 C 65 195 235 195 235 260 Z" fill="#A89B9D"/>' +
        "</svg>",
    );

  const DEFAULT_PROJECT_IMAGE =
    "data:image/svg+xml;utf8," +
    encodeURIComponent(
      '<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400">' +
        '<rect width="600" height="400" fill="#FDFBFB"/>' +
        '<rect x="60" y="60" width="480" height="280" rx="8" fill="#FFFFFF" stroke="#E8DFE0" stroke-width="2"/>' +
        '<text x="300" y="208" font-family="Alexandria, sans-serif" font-size="24" fill="#9B111E" text-anchor="middle">مشروع تطبيق ويب</text>' +
        "</svg>",
    );

  const DEFAULTS = {
    profile: {
      name: "إياد يعرب نيوف",
      title: "مطور ويب متكامل (Full-Stack Web Developer)",
      bio:
        "أدرس تقنيات الحاسوب في جامعة حمص (السنة الثالثة)، وأطور تطبيقات الويب وقواعد البيانات باستخدام Python و Django و JavaScript. أنجزت بناء منصات تجارة إلكترونية وأنظمة إدارة قواعد بيانات علائقية بواجهات عربية متجاوبة.",
      email: "eyad@example.com",
      location: "سلمية، حماة، سوريا",
      skills: "HTML5, CSS3, JavaScript, Python, Django, Oracle SQL, PL/SQL, C++, C#",
      avatar: DEFAULT_AVATAR,
    },
    projects: [
      {
        id: 1,
        title: "منصة دار سطور البحث العلمي للكتب",
        image: DEFAULT_PROJECT_IMAGE,
        link: "https://example.com/bookstore",
        description:
          "متجر إلكتروني لبيع الكتب الورقية في حمص يدعم التسعير بالليرة السورية، صلاحيات المدير والمستخدمين، توجيه الطلبات المباشر عبر واتساب، والدفع عبر خدمة شام كاش.",
      },
      {
        id: 2,
        title: "نظام إدارة شؤون الموظفين (Oracle SQL & PL/SQL)",
        image: DEFAULT_PROJECT_IMAGE,
        link: "https://example.com/ems",
        description:
          "نظام قواعد بيانات علائقية متكامل لإدارة سجلات الموظفين، الأقسام، والرواتب مع إجراءات مخزنة وتقارير تفصيلية.",
      },
    ],
  };

  const ICONS = {
    moon:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">' +
      '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>',
    sun:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true">' +
      '<circle cx="12" cy="12" r="5"></circle>' +
      '<path d="M12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4"></path></svg>',
  };

  const state = {
    lang: storage.readText("portfolio_lang") === "en" ? "en" : "ar",
    dark: storage.readText("portfolio_theme") === "dark",
    profile: storage.read("portfolio_profile", DEFAULTS.profile),
    projects: storage.read("portfolio_projects", DEFAULTS.projects),
    messages: storage.read("portfolio_messages", []),
    // نسخة مترجمة جاهزة لكل لغة، حتى يكون التبديل فورياً بعد أول تحميل
    snapshots: { ar: null, en: null },
    editingId: null,
    avatarDraft: "",
    imageDraft: "",
  };
  const dom = {};

  function cacheDom() {
    const ids = [
      "nav",
      "brand",
      "navBadge",
      "status",
      "themeToggle",
      "langToggle",
      "menuToggle",
      "displayAvatar",
      "displayName",
      "displayTitle",
      "displayBio",
      "displayEmail",
      "displayLocation",
      "skills",
      "projectsGrid",
      "contactEmail",
      "contactLocation",
      "contactForm",
      "senderName",
      "senderEmail",
      "senderSubject",
      "senderMessage",
      "messageError",
      "contactSuccess",
      "profileForm",
      "avatarInput",
      "inputName",
      "inputTitle",
      "inputEmail",
      "inputLocation",
      "inputSkills",
      "inputBio",
      "profileNotice",
      "projectForm",
      "projectFormTitle",
      "projectId",
      "projectTitle",
      "projectImage",
      "projectLink",
      "projectDescription",
      "saveProject",
      "cancelEdit",
      "projectsTable",
      "messages",
      "footerName",
    ];

    ids.forEach((id) => {
      dom[id] = document.getElementById(id);
    });
  }

  function save(key, value) {
    storage.write(key, value);
  }

  function invalidate() {
    state.snapshots.ar = null;
    state.snapshots.en = null;
  }

  function splitSkills(skills) {
    return String(skills || "")
      .split(",")
      .map((skill) => skill.trim())
      .filter(Boolean);
  }

  function projectCard(project) {
    const preview = project.link
      ? '<a class="project__link" href="' +
        escapeHtml(project.link) +
        '" target="_blank" rel="noopener noreferrer">' +
        escapeHtml(t("projects.preview")) +
        "</a>"
      : "";

    return (
      '<article class="project">' +
      '<img class="project__img" src="' +
      escapeHtml(project.image || DEFAULT_PROJECT_IMAGE) +
      '" alt="' +
      escapeHtml(project.title) +
      '">' +
      '<div class="project__body">' +
      '<h3 class="project__title">' +
      escapeHtml(project.title) +
      "</h3>" +
      '<div class="project__desc">' +
      renderRichText(project.description) +
      "</div>" +
      preview +
      "</div></article>"
    );
  }

  function projectRow(project) {
    return (
      "<tr>" +
      '<td><img src="' +
      escapeHtml(project.image || DEFAULT_PROJECT_IMAGE) +
      '" alt=""></td>' +
      "<td><strong>" +
      escapeHtml(project.title) +
      "</strong></td>" +
      "<td>" +
      renderRichText(project.description) +
      "</td>" +
      '<td><div class="actions">' +
      '<button class="btn btn--sm btn--edit" type="button" data-action="edit-project" data-id="' +
      escapeHtml(project.id) +
      '">' +
      escapeHtml(t("projects.edit")) +
      "</button>" +
      '<button class="btn btn--sm btn--danger" type="button" data-action="delete-project" data-id="' +
      escapeHtml(project.id) +
      '">' +
      escapeHtml(t("projects.delete")) +
      "</button></div></td></tr>"
    );
  }

  function mailtoFor(message) {
    const subject = t("dash.subjectPrefix") + (message.subject || "");
    return "mailto:" + (message.email || "") + "?subject=" + encodeURIComponent(subject);
  }

  function messageCard(message) {
    return (
      '<article class="message">' +
      '<p class="message__meta"><span><strong>' +
      escapeHtml(message.name) +
      "</strong> (" +
      escapeHtml(message.email) +
      ")</span><span>" +
      escapeHtml(formatDate(message.createdAt || message.date, state.lang)) +
      "</span></p>" +
      '<h4 class="message__subject">' +
      escapeHtml(t("dash.subjectPrefix")) +
      escapeHtml(message.subject) +
      "</h4>" +
      '<div class="message__body">' +
      renderRichText(message.message) +
      "</div>" +
      '<div class="actions">' +
      '<a class="btn btn--sm btn--outline" href="' +
      escapeHtml(mailtoFor(message)) +
      '">' +
      escapeHtml(t("dash.replyEmail")) +
      "</a>" +
      '<button class="btn btn--sm btn--danger" type="button" data-action="delete-message" data-id="' +
      escapeHtml(message.id) +
      '">' +
      escapeHtml(t("dash.deleteMessage")) +
      "</button></div></article>"
    );
  }

  function renderProfile(profile) {
    dom.displayName.textContent = profile.name;
    dom.brand.textContent = profile.name;
    dom.footerName.textContent = profile.name;
    dom.displayTitle.textContent = profile.title;
    dom.displayBio.textContent = profile.bio;
    dom.displayEmail.textContent = state.profile.email;
    dom.displayLocation.textContent = profile.location;

    dom.displayAvatar.src = state.profile.avatar || DEFAULT_AVATAR;
    dom.displayAvatar.alt = t("a11y.avatar");

    dom.skills.replaceChildren(
      ...splitSkills(state.profile.skills).map((skill) => {
        const item = document.createElement("li");
        item.className = "skill";
        item.textContent = skill;
        return item;
      }),
    );

    dom.contactEmail.textContent = state.profile.email;
    dom.contactLocation.textContent = profile.location;

    fillProfileForm();
  }

  function fillProfileForm() {
    const focused = document.activeElement;
    if (dom.profileForm.contains(focused) && focused.tagName !== "BUTTON") return;

    dom.inputName.value = state.profile.name;
    dom.inputTitle.value = state.profile.title;
    dom.inputEmail.value = state.profile.email;
    dom.inputLocation.value = state.profile.location;
    dom.inputSkills.value = state.profile.skills;
    dom.inputBio.value = state.profile.bio;
  }

  function render() {
    const snapshot = state.snapshots[state.lang];
    const view = snapshot || {
      profile: state.profile,
      projects: state.projects,
      messages: state.messages,
    };

    renderProfile(view.profile);

    dom.projectsGrid.innerHTML = view.projects.length
      ? view.projects.map(projectCard).join("")
      : '<p class="empty">' + escapeHtml(t("projects.empty")) + "</p>";

    dom.projectsTable.innerHTML = view.projects.length
      ? view.projects.map(projectRow).join("")
      : '<tr><td colspan="4" class="empty">' +
        escapeHtml(t("projects.emptyTable")) +
        "</td></tr>";

    dom.navBadge.textContent = String(state.messages.length);
    dom.messages.innerHTML = view.messages.length
      ? view.messages.map(messageCard).join("")
      : '<p class="empty">' + escapeHtml(t("dash.emptyInbox")) + "</p>";
  }

  function setStatus(mode) {
    dom.status.hidden = mode === "idle";
    dom.status.classList.toggle("is-busy", mode === "busy");
    dom.status.classList.toggle("is-error", mode === "error");
    dom.status.textContent =
      mode === "busy" ? t("status.translating") : mode === "error" ? t("status.failed") : "";
  }

  async function localize() {
    const lang = state.lang;
    state.snapshots[lang] = null;
    render();

    if (!i18n.needsTranslation(state, lang)) {
      setStatus("idle");
      return;
    }

    setStatus("busy");
    i18n.resetFailures();
    const snapshot = await i18n.localize(state, lang);
    if (lang !== state.lang) return;

    state.snapshots[lang] = snapshot;
    render();
    setStatus(i18n.failures > 0 ? "error" : "idle");
  }

  function syncThemeButton() {
    dom.themeToggle.innerHTML = state.dark ? ICONS.sun : ICONS.moon;
    const label = t(state.dark ? "a11y.themeLight" : "a11y.themeDark");
    dom.themeToggle.title = label;
    dom.themeToggle.setAttribute("aria-label", label);
  }

  function setTheme(dark) {
    state.dark = dark;
    document.documentElement.classList.toggle("dark", dark);
    storage.writeText("portfolio_theme", dark ? "dark" : "light");
    syncThemeButton();
  }

  function syncLangButton() {
    dom.langToggle.textContent = state.lang === "ar" ? "EN" : "AR";
    const label = t("a11y.langSwitch");
    dom.langToggle.title = label;
    dom.langToggle.setAttribute("aria-label", label);
  }

  function syncProjectForm() {
    const editing = state.editingId !== null;
    const project = editing
      ? state.projects.find((item) => item.id === state.editingId)
      : null;

    dom.projectFormTitle.textContent = editing
      ? t("dash.editProject") + (project ? project.title : "")
      : t("dash.addProject");
    dom.saveProject.textContent = editing ? t("dash.saveChanges") : t("dash.publish");
    dom.cancelEdit.hidden = !editing;
  }

  function setLang(lang) {
    state.lang = lang;
    storage.writeText("portfolio_lang", lang);
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";

    i18n.setLang(lang);
    i18n.applyStatic();
    syncLangButton();
    syncThemeButton();
    syncProjectForm();

    localize();
  }

  function showPage(page) {
    $$(".page").forEach((section) => {
      section.classList.toggle("is-active", section.dataset.page === page);
    });

    $$(".nav__link").forEach((link) => {
      const active = link.dataset.nav === page;
      link.classList.toggle("is-active", active);
      if (active) link.setAttribute("aria-current", "page");
      else link.removeAttribute("aria-current");
    });

    dom.nav.classList.remove("is-open");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function readImage(input, apply) {
    const file = input.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => apply(event.target.result);
    reader.readAsDataURL(file);
  }

  function startEdit(id) {
    const project = state.projects.find((item) => item.id === id);
    if (!project) return;

    state.editingId = project.id;
    state.imageDraft = "";

    dom.projectId.value = String(project.id);
    dom.projectTitle.value = project.title;
    dom.projectLink.value = project.link || "";
    dom.projectImage.value = "";
    dom.projectDescription.innerHTML = project.description || "";

    syncProjectForm();
    dom.projectForm.scrollIntoView({ behavior: "smooth" });
  }

  function resetProjectForm() {
    state.editingId = null;
    state.imageDraft = "";

    dom.projectForm.reset();
    dom.projectId.value = "";
    dom.projectDescription.innerHTML = "";

    syncProjectForm();
  }

  function deleteProject(id) {
    if (!window.confirm(t("confirm.deleteProject"))) return;

    state.projects = state.projects.filter((item) => item.id !== id);
    save("portfolio_projects", state.projects);
    invalidate();
    localize();
  }

  function deleteMessage(id) {
    state.messages = state.messages.filter((item) => item.id !== id);
    save("portfolio_messages", state.messages);
    invalidate();
    localize();
  }

  function clearMessages() {
    if (!state.messages.length) return;
    if (!window.confirm(t("confirm.clearMessages"))) return;

    state.messages = [];
    save("portfolio_messages", state.messages);
    invalidate();
    localize();
  }

  function submitProfile(event) {
    event.preventDefault();

    state.profile = {
      name: dom.inputName.value.trim(),
      title: dom.inputTitle.value.trim(),
      email: dom.inputEmail.value.trim(),
      location: dom.inputLocation.value.trim(),
      skills: dom.inputSkills.value.trim(),
      bio: dom.inputBio.value.trim(),
      avatar: state.avatarDraft || state.profile.avatar,
    };

    save("portfolio_profile", state.profile);
    state.avatarDraft = "";
    invalidate();
    localize();

    dom.profileNotice.textContent = t("dash.saved");
    window.setTimeout(() => {
      dom.profileNotice.textContent = "";
    }, 3000);
  }

  function submitProject(event) {
    event.preventDefault();

    const description = sanitizeRichText(dom.projectDescription.innerHTML).trim();
    if (!description) {
      window.alert(t("dash.descriptionError"));
      return;
    }

    const draft = {
      title: dom.projectTitle.value.trim(),
      link: dom.projectLink.value.trim(),
      description,
      image: state.imageDraft,
    };

    if (state.editingId !== null) {
      state.projects = state.projects.map((item) =>
        item.id === state.editingId
          ? { ...item, ...draft, image: draft.image || item.image }
          : item,
      );
    } else {
      state.projects = [
        { id: Date.now(), ...draft, image: draft.image || DEFAULT_PROJECT_IMAGE },
        ...state.projects,
      ];
    }

    save("portfolio_projects", state.projects);
    resetProjectForm();
    invalidate();
    localize();
  }

  function submitContact(event) {
    event.preventDefault();

    if (!dom.senderMessage.textContent.trim()) {
      dom.messageError.hidden = false;
      dom.senderMessage.focus();
      return;
    }

    dom.messageError.hidden = true;

    state.messages = [
      {
        id: Date.now(),
        name: dom.senderName.value.trim(),
        email: dom.senderEmail.value.trim(),
        subject: dom.senderSubject.value.trim(),
        message: sanitizeRichText(dom.senderMessage.innerHTML).trim(),
        createdAt: new Date().toISOString(),
      },
      ...state.messages,
    ];

    save("portfolio_messages", state.messages);
    dom.contactForm.reset();
    dom.senderMessage.innerHTML = "";
    dom.contactSuccess.hidden = false;
    window.setTimeout(() => {
      dom.contactSuccess.hidden = true;
    }, 5000);

    invalidate();
    localize();
  }

  function applyCommand(button) {
    const editor = document.getElementById(button.dataset.editor);
    if (!editor || !editor.isContentEditable) return;

    if (button.dataset.command === "removeFormat") {
      PF.clearFormatting(editor);
      return;
    }

    editor.focus();
    document.execCommand(button.dataset.command, false, null);
  }

  function handleAction(action, node) {
    switch (action) {
      case "theme":
        setTheme(!state.dark);
        break;
      case "lang":
        setLang(state.lang === "ar" ? "en" : "ar");
        break;
      case "menu":
        dom.nav.classList.toggle("is-open");
        break;
      case "edit-project":
        startEdit(Number(node.dataset.id));
        break;
      case "delete-project":
        deleteProject(Number(node.dataset.id));
        break;
      case "delete-message":
        deleteMessage(Number(node.dataset.id));
        break;
      case "clear-messages":
        clearMessages();
        break;
      default:
        break;
    }
  }

  function bindEvents() {
    // مستمع واحد بدل ربط كل زر يُعاد رسمه بعد كل تحديث
    document.addEventListener("click", (event) => {
      const nav = event.target.closest("[data-nav]");
      if (nav) {
        event.preventDefault();
        showPage(nav.dataset.nav);
        return;
      }

      const action = event.target.closest("[data-action]");
      if (action) {
        handleAction(action.dataset.action, action);
        return;
      }

      const command = event.target.closest("[data-command]");
      if (command) applyCommand(command);
    });

    // منع فقدان التحديد داخل المحرّر عند الضغط على أزرار التنسيق
    document.addEventListener("mousedown", (event) => {
      if (event.target.closest("[data-command]")) event.preventDefault();
    });

    dom.status.addEventListener("click", () => {
      if (dom.status.classList.contains("is-error")) localize();
    });

    dom.contactForm.addEventListener("submit", submitContact);
    dom.profileForm.addEventListener("submit", submitProfile);
    dom.projectForm.addEventListener("submit", submitProject);

    dom.cancelEdit.addEventListener("click", resetProjectForm);

    dom.senderMessage.addEventListener("input", () => {
      if (!dom.messageError.hidden) dom.messageError.hidden = true;
    });

    dom.avatarInput.addEventListener("change", () => {
      readImage(dom.avatarInput, (dataUrl) => {
        state.avatarDraft = dataUrl;
      });
    });

    dom.projectImage.addEventListener("change", () => {
      readImage(dom.projectImage, (dataUrl) => {
        state.imageDraft = dataUrl;
      });
    });
  }

  function init() {
    cacheDom();
    i18n.setLang(state.lang);
    document.documentElement.lang = state.lang;
    document.documentElement.dir = state.lang === "ar" ? "rtl" : "ltr";

    i18n.applyStatic();
    syncLangButton();
    setTheme(state.dark);
    syncProjectForm();
    bindEvents();
    localize();
  }

  document.addEventListener("DOMContentLoaded", init);
})(window);
