(() => {
  "use strict";

  /* ---------- Header scroll state ---------- */
  const header = document.getElementById("siteHeader");
  const onScroll = () => {
    header.classList.toggle("scrolled", window.scrollY > 40);
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* ---------- Mobile nav ---------- */
  const navToggle = document.getElementById("navToggle");
  const mobileNav = document.getElementById("mobileNav");
  navToggle.addEventListener("click", () => {
    const isOpen = mobileNav.classList.toggle("open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
    document.body.style.overflow = isOpen ? "hidden" : "";
  });

  /* ---------- Smooth anchor scroll with header offset ---------- */
  const HEADER_OFFSET = 84;
  document.querySelectorAll('a[data-nav]').forEach((link) => {
    link.addEventListener("click", (e) => {
      const id = link.getAttribute("href");
      if (!id || !id.startsWith("#")) return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      mobileNav.classList.remove("open");
      navToggle.setAttribute("aria-expanded", "false");
      document.body.style.overflow = "";
      const top = target.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET;
      window.scrollTo({ top, behavior: "smooth" });
    });
  });

  /* ---------- Active nav link on scroll ---------- */
  const navLinks = document.querySelectorAll('.main-nav a[data-nav]');
  const sections = Array.from(navLinks)
    .map((l) => document.querySelector(l.getAttribute("href")))
    .filter(Boolean);

  if (sections.length) {
    const navObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = "#" + entry.target.id;
            navLinks.forEach((l) => l.classList.toggle("active", l.getAttribute("href") === id));
          }
        });
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    sections.forEach((s) => navObserver.observe(s));
  }

  /* ---------- Reveal on scroll ---------- */
  const revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    revealEls.forEach((el) => revealObserver.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("in-view"));
  }

  /* ---------- Menu tabs ---------- */
  const tabButtons = document.querySelectorAll(".tab-btn");
  const panels = document.querySelectorAll(".menu-panel");
  const menuTabsEl = document.querySelector(".menu-tabs");
  let tabIndicator = null;

  if (menuTabsEl && tabButtons.length) {
    tabIndicator = document.createElement("span");
    tabIndicator.className = "tab-indicator";
    menuTabsEl.appendChild(tabIndicator);
  }

  const moveTabIndicator = (btn) => {
    if (!tabIndicator || !btn) return;
    tabIndicator.style.width = btn.offsetWidth + "px";
    tabIndicator.style.height = btn.offsetHeight + "px";
    tabIndicator.style.transform = `translate(${btn.offsetLeft}px, ${btn.offsetTop}px)`;
  };

  tabButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const target = btn.dataset.tab;
      tabButtons.forEach((b) => {
        const active = b === btn;
        b.classList.toggle("active", active);
        b.setAttribute("aria-selected", String(active));
      });
      panels.forEach((p) => p.classList.toggle("active", p.dataset.panel === target));
      moveTabIndicator(btn);
    });
  });

  const initialActiveTab = document.querySelector(".tab-btn.active");
  if (initialActiveTab) {
    // wait one frame so offsetWidth/offsetLeft are laid out (fonts, etc.)
    requestAnimationFrame(() => moveTabIndicator(initialActiveTab));
  }
  window.addEventListener("resize", () => {
    const active = document.querySelector(".tab-btn.active");
    if (active) moveTabIndicator(active);
  });

  /* ---------- Gallery lightbox ---------- */
  const galleryItems = Array.from(document.querySelectorAll(".gallery-item"));
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightboxImg");
  const lightboxCaption = document.getElementById("lightboxCaption");
  const lightboxClose = document.getElementById("lightboxClose");
  const lightboxPrev = document.getElementById("lightboxPrev");
  const lightboxNext = document.getElementById("lightboxNext");
  let currentIndex = 0;

  const openLightbox = (index) => {
    currentIndex = (index + galleryItems.length) % galleryItems.length;
    const item = galleryItems[currentIndex];
    lightboxImg.src = item.dataset.full;
    lightboxImg.alt = item.querySelector("img")?.alt || "";
    lightboxCaption.textContent = item.dataset.caption || "";
    lightbox.classList.add("open");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  };
  const closeLightbox = () => {
    lightbox.classList.remove("open");
    lightbox.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  };

  galleryItems.forEach((item, i) => {
    item.addEventListener("click", () => openLightbox(i));
  });
  lightboxClose.addEventListener("click", closeLightbox);
  lightboxPrev.addEventListener("click", () => openLightbox(currentIndex - 1));
  lightboxNext.addEventListener("click", () => openLightbox(currentIndex + 1));
  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) closeLightbox();
  });
  document.addEventListener("keydown", (e) => {
    if (!lightbox.classList.contains("open")) return;
    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowLeft") openLightbox(currentIndex - 1);
    if (e.key === "ArrowRight") openLightbox(currentIndex + 1);
  });

  /* ---------- Live open/closed status ----------
     Hours: 10:30 AM – 3:00 AM daily (crosses midnight), evaluated
     against the visitor's local clock as a simple approximation. */
  const openStatusEl = document.getElementById("openStatus");
  const stickyCtaStatus = document.getElementById("stickyCtaStatus");
  const hoursTable = document.getElementById("hoursTable");

  const updateOpenStatus = () => {
    const now = new Date();
    const minutes = now.getHours() * 60 + now.getMinutes();
    const openAt = 10 * 60 + 30; // 10:30
    const closeAt = 3 * 60; // 3:00 next day
    const isOpen = minutes >= openAt || minutes < closeAt;

    if (openStatusEl) {
      openStatusEl.textContent = isOpen ? "Open Now" : "Closed Now";
      openStatusEl.style.color = isOpen ? "var(--gold-bright)" : "var(--cream-dim)";
    }
    if (stickyCtaStatus) {
      stickyCtaStatus.textContent = isOpen ? "Open now · tap to order" : "Opens 10:30 AM";
    }

    if (hoursTable) {
      const day = now.getDay();
      hoursTable.querySelectorAll("tr").forEach((row) => {
        row.classList.toggle("today", Number(row.dataset.day) === day);
      });
    }
  };
  updateOpenStatus();
  setInterval(updateOpenStatus, 60000);

  /* ---------- Sticky mobile CTA visibility ---------- */
  const stickyCta = document.getElementById("stickyCta");
  const heroEl = document.querySelector(".hero");
  if (stickyCta && heroEl && "IntersectionObserver" in window) {
    const ctaObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          stickyCta.classList.toggle("show", !entry.isIntersecting);
        });
      },
      { threshold: 0 }
    );
    ctaObserver.observe(heroEl);
  }

  /* ---------- Order link: click-to-call fallback ---------- */
  const orderLink = document.getElementById("orderLink");
  if (orderLink) {
    orderLink.setAttribute("href", "tel:+16044967495");
  }

  /* ---------- Footer year ---------- */
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Desktop-only motion: cursor glow + card tilt ---------- */
  const canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (canHover && !reducedMotion) {
    // ambient glow that follows the pointer
    const glow = document.createElement("div");
    glow.className = "cursor-glow";
    document.body.appendChild(glow);
    let glowHideTimer;
    window.addEventListener(
      "mousemove",
      (e) => {
        glow.style.setProperty("--mx", e.clientX + "px");
        glow.style.setProperty("--my", e.clientY + "px");
        glow.classList.add("active");
        clearTimeout(glowHideTimer);
        glowHideTimer = setTimeout(() => glow.classList.remove("active"), 1400);
      },
      { passive: true }
    );

    // cursor-reactive tilt on cards
    const tiltEls = document.querySelectorAll(".value-card, .dish-feature, .quote-card");
    tiltEls.forEach((el) => {
      el.addEventListener("mousemove", (e) => {
        const rect = el.getBoundingClientRect();
        const px = (e.clientX - rect.left) / rect.width - 0.5;
        const py = (e.clientY - rect.top) / rect.height - 0.5;
        el.style.setProperty("--rx", (px * 9).toFixed(2) + "deg");
        el.style.setProperty("--ry", (py * -9).toFixed(2) + "deg");
        el.style.setProperty("--ty", "-6px");
      });
      el.addEventListener("mouseleave", () => {
        el.style.setProperty("--rx", "0deg");
        el.style.setProperty("--ry", "0deg");
        el.style.setProperty("--ty", "0px");
      });
    });
  }

  /* ---------- Animated stat counters ---------- */
  const statEls = document.querySelectorAll(".stat strong");
  const animateStat = (el) => {
    const raw = el.textContent.trim();
    const match = raw.match(/^(\d+)(.*)$/);
    if (!match) return;
    const target = parseInt(match[1], 10);
    const suffix = match[2];
    const duration = 900;
    const start = performance.now();
    const step = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(target * eased) + suffix;
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  if (statEls.length && "IntersectionObserver" in window) {
    const statObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateStat(entry.target);
            statObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.6 }
    );
    statEls.forEach((el) => statObserver.observe(el));
  }
})();
