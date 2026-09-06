/* ANA Gebäudereinigung Ost West — Interaktionen
   Bewusst klein gehalten: Menü, Header-Schatten, Einblenden, Jahreszahl.
   Die Seite funktioniert vollständig auch ohne dieses Skript. */
(function () {
  "use strict";

  /* Jahreszahl im Fußbereich */
  var yearEl = document.getElementById("year");
  if (yearEl) { yearEl.textContent = new Date().getFullYear(); }

  /* Mobiles Menü */
  var toggle = document.getElementById("navToggle");
  var menu = document.getElementById("mobileMenu");

  if (toggle && menu) {
    var setState = function (open) {
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Menü schließen" : "Menü öffnen");
      menu.classList.toggle("is-open", open);
    };

    toggle.addEventListener("click", function () {
      setState(toggle.getAttribute("aria-expanded") !== "true");
    });

    menu.addEventListener("click", function (e) {
      if (e.target.tagName === "A") { setState(false); }
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && menu.classList.contains("is-open")) {
        setState(false);
        toggle.focus();
      }
    });
  }

  /* Schatten am Header, sobald gescrollt wird */
  var header = document.getElementById("siteHeader");
  if (header) {
    var onScroll = function () {
      header.classList.toggle("is-stuck", window.scrollY > 8);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* Sanftes Einblenden — mit Sicherheitsnetz, damit nie Inhalte unsichtbar bleiben */
  var items = document.querySelectorAll(".reveal");
  var revealAll = function () {
    Array.prototype.forEach.call(items, function (el) { el.classList.add("is-visible"); });
  };

  if (!("IntersectionObserver" in window) ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    revealAll();
  } else {
    var sawAny = false;
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          sawAny = true;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });

    Array.prototype.forEach.call(items, function (el) { observer.observe(el); });

    window.setTimeout(function () {
      if (!sawAny) { observer.disconnect(); revealAll(); }
    }, 1200);
  }
})();
