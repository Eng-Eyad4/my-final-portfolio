(function (window) {
  "use strict";

  const PF = (window.PF = window.PF || {});

  const storage = {
    read(key, fallback) {
      try {
        const raw = window.localStorage.getItem(key);
        return raw === null ? fallback : JSON.parse(raw);
      } catch (error) {
        return fallback;
      }
    },
    write(key, value) {
      try {
        window.localStorage.setItem(key, JSON.stringify(value));
      } catch (error) {
        // الحصة ممتلئة أو التخزين محظور؛ نكمل بلا حفظ
      }
    },
    readText(key) {
      try {
        return window.localStorage.getItem(key);
      } catch (error) {
        return null;
      }
    },
    writeText(key, value) {
      try {
        window.localStorage.setItem(key, value);
      } catch (error) {}
    },
  };

  const $ = (selector, root) => (root || document).querySelector(selector);
  const $$ = (selector, root) => Array.from((root || document).querySelectorAll(selector));

  const HTML_ESCAPES = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  };

  const escapeHtml = (value) =>
    String(value === undefined || value === null ? "" : value).replace(
      /[&<>"']/g,
      (char) => HTML_ESCAPES[char],
    );

  const hasTags = (value) => /<[a-z][\s\S]*>/i.test(String(value || ""));
  const hasArabic = (value) => /[\u0600-\u06FF]/.test(String(value || ""));

  // وسوم التنسيق المسموح بها في المحرّرات ورسائل الزوار
  const ALLOWED_TAGS = new Set([
    "B",
    "STRONG",
    "I",
    "EM",
    "U",
    "S",
    "STRIKE",
    "BR",
    "P",
    "DIV",
    "UL",
    "OL",
    "LI",
    "A",
    "SPAN",
  ]);
  const ALLOWED_ATTRS = { A: ["href"] };

  function sanitizeRichText(html) {
    if (!html) return "";

    const doc = new DOMParser().parseFromString(String(html), "text/html");
    doc.body.querySelectorAll("*").forEach((node) => {
      if (!ALLOWED_TAGS.has(node.tagName)) {
        node.replaceWith(...node.childNodes);
        return;
      }
      Array.from(node.attributes).forEach((attr) => {
        const allowed = ALLOWED_ATTRS[node.tagName] || [];
        if (!allowed.includes(attr.name)) node.removeAttribute(attr.name);
      });
    });

    return doc.body.innerHTML;
  }

  function renderRichText(value) {
    const raw = String(value || "");
    return hasTags(raw) ? sanitizeRichText(raw) : escapeHtml(raw);
  }

  const INLINE_FORMATS = "a,b,strong,i,em,u,s,strike,span,font,mark";

  function unwrapInline(node) {
    const element = node.nodeType === 1 ? node : node.parentElement;
    if (!element) return;

    element.querySelectorAll("[style]").forEach((child) => child.removeAttribute("style"));
    if (element.getAttribute("style")) element.removeAttribute("style");

    element.querySelectorAll(INLINE_FORMATS).forEach((child) => {
      child.replaceWith(...child.childNodes);
    });

    if (element.matches(INLINE_FORMATS)) element.replaceWith(...element.childNodes);
  }

  function listDepth(node) {
    let depth = 0;
    let current = node.parentElement;
    while (current) {
      depth += 1;
      current = current.parentElement;
    }
    return depth;
  }

  // execCommand("removeFormat") لا يمسّ القوائم، فنفكّها يدوياً إلى أسطر
  function flattenLists(node, editor) {
    const element = node.nodeType === 1 ? node : node.parentElement;
    if (!element) return;

    const lists = new Set();
    const ancestor = element.closest("ul, ol");
    if (ancestor) lists.add(ancestor);
    element.querySelectorAll("ul, ol").forEach((list) => lists.add(list));

    Array.from(lists)
      .filter((list) => editor.contains(list))
      .sort((first, second) => listDepth(second) - listDepth(first))
      .forEach((list) => {
        const fragment = document.createDocumentFragment();
        const previous = list.previousSibling;
        const inlineBefore =
          previous &&
          !(previous.nodeType === 1 && /^(DIV|P|BR|TABLE|BLOCKQUOTE)$/.test(previous.tagName));
        let items = 0;

        if (inlineBefore) fragment.appendChild(document.createElement("br"));

        Array.from(list.children).forEach((child) => {
          if (child.tagName !== "LI") {
            fragment.appendChild(child);
            return;
          }
          if (items > 0) fragment.appendChild(document.createElement("br"));
          while (child.firstChild) fragment.appendChild(child.firstChild);
          items += 1;
        });

        list.replaceWith(fragment);
      });
  }

  function clearFormatting(editor) {
    const selection = window.getSelection();
    const range = selection && selection.rangeCount > 0 ? selection.getRangeAt(0) : null;
    const hasSelection =
      Boolean(range) && !range.collapsed && editor.contains(range.commonAncestorContainer);

    const scope = hasSelection ? range.commonAncestorContainer : editor;

    unwrapInline(scope);
    flattenLists(scope, editor);

    if (!selection.anchorNode || !editor.contains(selection.anchorNode)) {
      editor.focus();
      const caret = document.createRange();
      caret.selectNodeContents(editor);
      caret.collapse(false);
      selection.removeAllRanges();
      selection.addRange(caret);
    }
  }

  const dateFormats = new Map();

  function formatDate(value, lang) {
    const date = value ? new Date(value) : null;
    if (!date || Number.isNaN(date.getTime())) return String(value || "");

    if (!dateFormats.has(lang)) {
      dateFormats.set(
        lang,
        new Intl.DateTimeFormat(lang === "ar" ? "ar-SY" : "en-US", {
          dateStyle: "short",
          timeStyle: "short",
        }),
      );
    }

    return dateFormats.get(lang).format(date);
  }

  function hash(text) {
    let value = 5381;
    for (let index = 0; index < text.length; index += 1) {
      value = (value * 33) ^ text.charCodeAt(index);
    }
    return (value >>> 0).toString(36);
  }

  PF.$ = $;
  PF.$$ = $$;
  PF.storage = storage;
  PF.escapeHtml = escapeHtml;
  PF.hasTags = hasTags;
  PF.hasArabic = hasArabic;
  PF.sanitizeRichText = sanitizeRichText;
  PF.renderRichText = renderRichText;
  PF.clearFormatting = clearFormatting;
  PF.formatDate = formatDate;
  PF.hash = hash;
})(window);
