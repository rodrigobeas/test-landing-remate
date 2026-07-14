
(() => {
  "use strict";

  const WHATSAPP_NUMBER = "523319856883";
  // DATO PENDIENTE: pega aquí el enlace oficial, por ejemplo:
  // const CALENDLY_URL = "https://calendly.com/tu-cuenta/asesoria";
  const CALENDLY_URL = "";

  const $ = (selector, context = document) => context.querySelector(selector);
  const $$ = (selector, context = document) => [...context.querySelectorAll(selector)];

  // Año
  $$("[data-year]").forEach(el => el.textContent = new Date().getFullYear());

  // Header
  const header = $("#siteHeader");
  const updateHeader = () => header?.classList.toggle("is-scrolled", window.scrollY > 24);
  updateHeader();
  window.addEventListener("scroll", updateHeader, { passive: true });

  // Menú mobile
  const menuToggle = $("#menuToggle");
  const navMenu = $("#navMenu");
  menuToggle?.addEventListener("click", () => {
    const open = menuToggle.getAttribute("aria-expanded") === "true";
    menuToggle.setAttribute("aria-expanded", String(!open));
    navMenu?.classList.toggle("is-open", !open);
    menuToggle.setAttribute("aria-label", open ? "Abrir menú" : "Cerrar menú");
  });
  $$(".nav-link", navMenu || document).forEach(link => link.addEventListener("click", () => {
    navMenu?.classList.remove("is-open");
    menuToggle?.setAttribute("aria-expanded", "false");
  }));

  // Reveal
  const revealItems = $$(".reveal");
  if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: .12 });
    revealItems.forEach(item => revealObserver.observe(item));
  } else {
    revealItems.forEach(item => item.classList.add("is-visible"));
  }

  // Tabs
  $$("[role='tablist']").forEach(tablist => {
    const tabs = $$("[role='tab']", tablist);
    tabs.forEach(tab => tab.addEventListener("click", () => {
      tabs.forEach(t => t.setAttribute("aria-selected", "false"));
      const shell = tab.closest(".tabs-shell");
      $$(".tab-panel", shell).forEach(panel => panel.classList.remove("is-active"));
      tab.setAttribute("aria-selected", "true");
      const target = document.getElementById(tab.getAttribute("aria-controls"));
      target?.classList.add("is-active");
    }));
  });

  // FAQ: una sola respuesta abierta
  $$(".faq-question").forEach(button => {
    button.addEventListener("click", () => {
      const isOpen = button.getAttribute("aria-expanded") === "true";
      const list = button.closest(".faq-list");
      $$(".faq-question", list).forEach(item => item.setAttribute("aria-expanded", "false"));
      if (!isOpen) button.setAttribute("aria-expanded", "true");
    });
  });

  // Modal
  const modal = $("#leadModal");
  const form = $("#leadForm");
  const interestField = $("#interes");
  let lastFocused = null;

  const focusables = () => modal ? $$("button,[href],input,select,textarea,[tabindex]:not([tabindex='-1'])", modal)
    .filter(el => !el.disabled && !el.hidden) : [];

  const openModal = (interest = "") => {
    if (!modal) return;
    lastFocused = document.activeElement;
    if (interest && interestField) {
      const option = [...interestField.options].find(o => o.value === interest || o.textContent.trim() === interest);
      if (option) interestField.value = option.value || option.textContent.trim();
    }
    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");
    setTimeout(() => focusables()[0]?.focus(), 60);
  };

  const closeModal = () => {
    if (!modal) return;
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("modal-open");
    lastFocused?.focus?.();
  };

  $$("[data-open-form]").forEach(button => button.addEventListener("click", () => openModal(button.dataset.interest || "")));
  $$("[data-close-modal]").forEach(button => button.addEventListener("click", closeModal));
  modal?.addEventListener("mousedown", e => { if (e.target === modal) closeModal(); });
  document.addEventListener("keydown", e => {
    if (e.key === "Escape" && modal?.classList.contains("is-open")) closeModal();
    if (e.key === "Tab" && modal?.classList.contains("is-open")) {
      const items = focusables();
      if (!items.length) return;
      const first = items[0], last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });

  form?.addEventListener("submit", e => {
    e.preventDefault();
    if (!form.reportValidity()) return;
    const data = Object.fromEntries(new FormData(form).entries());
    data.timestamp = new Date().toISOString();
    data.origen = document.body.dataset.audience || "";
    sessionStorage.setItem("remateLead", JSON.stringify(data));
    window.location.assign("thankyou.html");
  });

  // Autoapertura por posición real de scroll, rearmable.
  let endArmed = true;
  const detectEnd = () => {
    if (!modal) return;
    const doc = document.documentElement;
    const distance = doc.scrollHeight - (window.scrollY + window.innerHeight);
    const nearEnd = distance <= 90;
    if (nearEnd && endArmed && !modal.classList.contains("is-open")) {
      endArmed = false;
      openModal();
    } else if (distance > 620) {
      endArmed = true;
    }
  };
  window.addEventListener("scroll", detectEnd, { passive: true });

  // Página de agradecimiento
  const leadName = $("#leadName");
  if (leadName) {
    let lead = null;
    try { lead = JSON.parse(sessionStorage.getItem("remateLead") || "null"); } catch (_) {}

    const waButton = $("#waManual");
    const backLink = $("#backLink");
    const summary = $("#leadSummary");
    const redirectNotice = $("#redirectNotice");
    const countdownEl = $("#countdown");
    const cancel = $("#cancelRedirect");

    if (lead) {
      const firstName = (lead.nombre || "").trim().split(/\s+/)[0] || "gracias";
      leadName.textContent = firstName;
      const interest = lead.interes || "mobiliario de oficina";
      summary.textContent = `Recibimos tu solicitud sobre ${interest}. Puedes continuar por WhatsApp o elegir un horario.`;
      backLink.href = lead.origen === "b2c" ? "b2c.html" : "index.html";

      const audienceText = lead.origen === "b2b" ? "mayoreo" : "compra personal";
      const message = `Hola, soy ${lead.nombre || ""}. Envié una solicitud de ${audienceText} desde la landing. Me interesa: ${interest}.`;
      const waUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
      waButton.href = waUrl;

      let remaining = 1.8;
      const tick = setInterval(() => {
        remaining = Math.max(0, remaining - .1);
        if (countdownEl) countdownEl.textContent = remaining.toFixed(1);
      }, 100);

      const redirectTimer = setTimeout(() => {
        clearInterval(tick);
        window.location.href = waUrl;
      }, 1800);

      cancel?.addEventListener("click", () => {
        clearTimeout(redirectTimer);
        clearInterval(tick);
        redirectNotice.textContent = "Redirección pausada. Puedes elegir un horario o continuar manualmente.";
      });
    } else {
      leadName.textContent = "gracias";
      summary.textContent = "Puedes continuar por WhatsApp o elegir un horario.";
      redirectNotice.textContent = "No hay una solicitud guardada en esta sesión.";
      cancel?.remove();
    }

    const frame = $("#calendlyFrame");
    const placeholder = $("#calendarPlaceholder");
    if (CALENDLY_URL && /^https:\/\/calendly\.com\//i.test(CALENDLY_URL)) {
      frame.src = CALENDLY_URL;
      frame.hidden = false;
      placeholder.hidden = true;
    }
  }

  // Cursor sutil
  const dot = $(".cursor-dot");
  const ring = $(".cursor-ring");
  if (dot && ring && matchMedia("(pointer:fine)").matches) {
    let rx = 0, ry = 0, mx = 0, my = 0;
    window.addEventListener("mousemove", e => {
      mx = e.clientX; my = e.clientY;
      dot.style.left = `${mx}px`; dot.style.top = `${my}px`;
    }, { passive: true });
    const loop = () => {
      rx += (mx - rx) * .18; ry += (my - ry) * .18;
      ring.style.left = `${rx}px`; ring.style.top = `${ry}px`;
      requestAnimationFrame(loop);
    };
    loop();
  }
})();
