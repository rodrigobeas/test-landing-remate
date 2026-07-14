
(() => {
  "use strict";

  const WHATSAPP_NUMBER = "523319856883";
  // Reemplaza este valor con la URL real de Calendly.
  const CALENDLY_URL = "";

  const qs = (selector, scope = document) => scope.querySelector(selector);
  const qsa = (selector, scope = document) => [...scope.querySelectorAll(selector)];

  const page = document.body?.dataset.page || "";
  const audience = document.body?.dataset.audience || (page === "b2c" ? "b2c" : page === "b2b" ? "b2b" : "");

  function setHeaderState() {
    const header = qs(".site-header");
    if (!header) return;
    header.classList.toggle("is-scrolled", window.scrollY > 24);
  }

  function initNavigation() {
    const header = qs(".site-header");
    const toggle = qs(".menu-toggle");
    const menu = qs(".mobile-menu");
    if (!header || !toggle || !menu) return;

    const closeMenu = () => {
      menu.classList.remove("is-open");
      header.classList.remove("menu-open");
      toggle.setAttribute("aria-expanded", "false");
    };

    toggle.addEventListener("click", () => {
      const opening = !menu.classList.contains("is-open");
      menu.classList.toggle("is-open", opening);
      header.classList.toggle("menu-open", opening);
      toggle.setAttribute("aria-expanded", String(opening));
    });

    qsa("a, button", menu).forEach((item) => {
      item.addEventListener("click", closeMenu);
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closeMenu();
    });
  }

  function initReveal() {
    const items = qsa(".reveal");
    if (!items.length) return;

    if (
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      !("IntersectionObserver" in window)
    ) {
      items.forEach((item) => item.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );

    items.forEach((item) => observer.observe(item));
  }

  function initFaq() {
    const buttons = qsa(".faq-question");
    buttons.forEach((button) => {
      button.addEventListener("click", () => {
        const item = button.closest(".faq-item");
        const isOpen = button.getAttribute("aria-expanded") === "true";

        qsa(".faq-item").forEach((otherItem) => {
          otherItem.classList.remove("is-open");
          const otherButton = qs(".faq-question", otherItem);
          if (otherButton) otherButton.setAttribute("aria-expanded", "false");
        });

        if (!isOpen && item) {
          item.classList.add("is-open");
          button.setAttribute("aria-expanded", "true");
        }
      });
    });
  }

  function initModal() {
    const modal = qs("#lead-modal");
    if (!modal) return;

    const card = qs(".modal-card", modal);
    const closeButton = qs(".modal-close", modal);
    const form = qs("form", modal);
    let lastFocused = null;
    let bottomLatch = false;

    const getFocusable = () =>
      qsa(
        'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
        modal
      ).filter((el) => !el.hasAttribute("hidden"));

    const openModal = (interest = "") => {
      lastFocused = document.activeElement;
      modal.classList.add("is-open");
      modal.setAttribute("aria-hidden", "false");
      document.body.classList.add("modal-open");

      const hiddenInterest = qs('input[name="interest"]', form);
      if (hiddenInterest && interest) hiddenInterest.value = interest;

      const firstInput = qs("input:not([type='hidden']), select, button", form || modal);
      window.setTimeout(() => firstInput?.focus(), 60);
    };

    const closeModal = () => {
      modal.classList.remove("is-open");
      modal.setAttribute("aria-hidden", "true");
      document.body.classList.remove("modal-open");
      if (lastFocused instanceof HTMLElement) lastFocused.focus();
    };

    qsa("[data-open-modal]").forEach((trigger) => {
      const activate = (event) => {
        event.preventDefault();
        openModal(trigger.dataset.interest || "");
      };
      trigger.addEventListener("click", activate);
      trigger.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") activate(event);
      });
    });

    closeButton?.addEventListener("click", closeModal);

    modal.addEventListener("mousedown", (event) => {
      if (event.target === modal) closeModal();
    });

    document.addEventListener("keydown", (event) => {
      if (!modal.classList.contains("is-open")) return;

      if (event.key === "Escape") {
        closeModal();
        return;
      }

      if (event.key === "Tab") {
        const focusable = getFocusable();
        if (!focusable.length) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    });

    const onScroll = () => {
      const remaining =
        document.documentElement.scrollHeight -
        (window.scrollY + window.innerHeight);
      const atBottom = remaining <= 10;

      if (atBottom && !bottomLatch && !modal.classList.contains("is-open")) {
        bottomLatch = true;
        openModal();
      } else if (remaining > 220) {
        bottomLatch = false;
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });

    form?.addEventListener("submit", (event) => {
      event.preventDefault();
      const status = qs(".form-status", form);

      if (audience === "b2c") {
        const checked = qsa('input[name="furniture"]:checked', form);
        if (!checked.length) {
          if (status) {
            status.textContent = "Selecciona al menos un tipo de mobiliario.";
          }
          qs('input[name="furniture"]', form)?.focus();
          return;
        }
      }

      if (!form.reportValidity()) return;

      const data = new FormData(form);
      const lead = {
        source: audience || page,
        name: String(data.get("name") || "").trim(),
        company: String(data.get("company") || "").trim(),
        email: String(data.get("email") || "").trim(),
        phone: String(data.get("phone") || "").trim(),
        interest: String(data.get("interest") || "").trim(),
        people: String(data.get("people") || "").trim(),
        deliveryDate: String(data.get("deliveryDate") || "").trim(),
        furniture: data.getAll("furniture").map(String),
        createdAt: new Date().toISOString()
      };

      sessionStorage.setItem("remateLead", JSON.stringify(lead));
      sessionStorage.removeItem("remateAutoRedirected");
      window.location.href = "thankyou.html";
    });
  }

  function getInitials(name) {
    return String(name || "")
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join("");
  }

  function initThankYou() {
    if (page !== "thankyou") return;

    let lead = {};
    try {
      lead = JSON.parse(sessionStorage.getItem("remateLead") || "{}");
    } catch {
      lead = {};
    }

    const source = lead.source === "b2c" ? "b2c" : "b2b";
    const isB2C = source === "b2c";
    const title = isB2C ? "Cotización solicitada" : "Solicitud enviada";
    const message = isB2C
      ? "Un asesor experto te contactará para armar tu propuesta a la medida sin costo."
      : "Un asesor dedicado te acompañará por llamada o WhatsApp en cada cotización para agilizar tus compras.";

    const nameText = lead.name ? `${lead.name},` : "";
    const titleNode = qs("#thankyou-title");
    const messageNode = qs("#thankyou-message");
    const eyebrowNode = qs("#thankyou-eyebrow");
    const backLink = qs("#back-link");
    const backLinkSecondary = qs("#back-link-secondary");
    const detailName = qs("#detail-name");
    const detailInterest = qs("#detail-interest");

    if (titleNode) titleNode.textContent = title;
    if (eyebrowNode) eyebrowNode.textContent = nameText || "Remate Muebles";
    if (messageNode) messageNode.textContent = message;
    const returnUrl = isB2C ? "index.html" : "b2c.html";
    if (backLink) backLink.href = returnUrl;
    if (backLinkSecondary) backLinkSecondary.href = returnUrl;
    if (detailName) detailName.textContent = lead.name || "No indicado";

    const interest = isB2C
      ? (Array.isArray(lead.furniture) && lead.furniture.length
          ? lead.furniture.join(", ")
          : lead.interest || "No indicado")
      : lead.company || lead.interest || "No indicado";
    if (detailInterest) detailInterest.textContent = interest;

    const messageParts = isB2C
      ? [
          `Hola, soy ${lead.name || ""}.`,
          "Solicité una propuesta y asesoría gratuita.",
          interest !== "No indicado" ? `Mobiliario: ${interest}.` : ""
        ]
      : [
          `Hola, soy ${lead.name || ""}.`,
          "Solicité asesoría y catálogo.",
          lead.company ? `Empresa o negocio: ${lead.company}.` : ""
        ];

    const whatsappMessage = messageParts.filter(Boolean).join(" ");
    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
      whatsappMessage
    )}`;

    qsa("[data-whatsapp-followup]").forEach((link) => {
      link.href = whatsappUrl;
    });

    const calendarHost = qs("#calendar-host");
    if (
      calendarHost &&
      /^https:\/\/calendly\.com\/.+/i.test(CALENDLY_URL) &&
      !CALENDLY_URL.includes("DATO-PENDIENTE")
    ) {
      calendarHost.innerHTML = "";
      const widget = document.createElement("div");
      widget.className = "calendly-inline-widget";
      widget.dataset.url = `${CALENDLY_URL}?hide_event_type_details=1&hide_gdpr_banner=1`;
      calendarHost.appendChild(widget);

      const script = document.createElement("script");
      script.src = "https://assets.calendly.com/assets/external/widget.js";
      script.async = true;
      document.body.appendChild(script);
    }

    const noRedirect =
      new URLSearchParams(window.location.search).get("noRedirect") === "1";
    const alreadyRedirected =
      sessionStorage.getItem("remateAutoRedirected") === "1";

    if (!noRedirect && !alreadyRedirected) {
      sessionStorage.setItem("remateAutoRedirected", "1");
      window.setTimeout(() => {
        window.location.assign(whatsappUrl);
      }, 1800);
    } else {
      const redirectNote = qs(".redirect-note");
      if (redirectNote) {
        redirectNote.textContent =
          "Continúa por WhatsApp con el botón disponible.";
      }
    }
  }


  function initDateInputs() {
    qsa("[data-date-input]").forEach((input) => {
      const activateNativeDate = () => {
        if (input.type !== "date") input.type = "date";
        window.requestAnimationFrame(() => {
          if (typeof input.showPicker === "function") {
            try {
              input.showPicker();
            } catch {
              // El navegador abrirá su selector nativo con la interacción normal.
            }
          }
        });
      };

      input.addEventListener("focus", activateNativeDate);
      input.addEventListener("click", activateNativeDate);
      input.addEventListener("blur", () => {
        if (!input.value) input.type = "text";
      });
    });
  }

  function initWhatsAppFloating() {
    qsa("[data-whatsapp-general]").forEach((link) => {
      const text = audience === "b2b"
        ? "Hola, quiero solicitar asesoría y catálogo."
        : "Hola, quiero solicitar una cotización personalizada.";
      link.href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
    });
  }

  window.addEventListener("scroll", setHeaderState, { passive: true });
  setHeaderState();
  initNavigation();
  initReveal();
  initFaq();
  initModal();
  initThankYou();
  initDateInputs();
  initWhatsAppFloating();
})();
