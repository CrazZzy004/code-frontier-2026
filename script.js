/* ============================================================
   CODE FRONTIER 2026 — interactions
   Vanilla JS · no dependencies
   ============================================================ */
(function () {
  "use strict";

  /* ---- Countdown to 17 Oct 2026, 10:30 (local) ---- */
  const target = new Date("2026-10-17T10:30:00").getTime();
  const cd = {
    days: document.querySelector('[data-cd="days"]'),
    hours: document.querySelector('[data-cd="hours"]'),
    minutes: document.querySelector('[data-cd="minutes"]'),
    seconds: document.querySelector('[data-cd="seconds"]'),
  };
  const pad = (n) => String(n).padStart(2, "0");

  function tick() {
    if (!cd.days) return;
    const diff = target - Date.now();
    if (diff <= 0) {
      cd.days.textContent = cd.hours.textContent = cd.minutes.textContent = cd.seconds.textContent = "00";
      return;
    }
    const s = Math.floor(diff / 1000);
    cd.days.textContent = pad(Math.floor(s / 86400));
    cd.hours.textContent = pad(Math.floor((s % 86400) / 3600));
    cd.minutes.textContent = pad(Math.floor((s % 3600) / 60));
    cd.seconds.textContent = pad(s % 60);
  }
  tick();
  setInterval(tick, 1000);

  /* ---- Sticky header + scroll progress ---- */
  const header = document.getElementById("siteHeader");
  const progress = document.getElementById("scrollProgress");
  function onScroll() {
    const y = window.scrollY;
    header.classList.toggle("is-stuck", y > 20);
    const h = document.documentElement.scrollHeight - window.innerHeight;
    if (progress) progress.style.width = (h > 0 ? (y / h) * 100 : 0) + "%";
  }
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* ---- Burger menu ---- */
  const burger = document.getElementById("burger");
  const nav = document.getElementById("nav");
  if (burger && nav) {
    burger.addEventListener("click", () => {
      const open = nav.classList.toggle("is-open");
      burger.classList.toggle("is-open", open);
      burger.setAttribute("aria-expanded", String(open));
    });
    nav.querySelectorAll("a").forEach((a) =>
      a.addEventListener("click", () => {
        nav.classList.remove("is-open");
        burger.classList.remove("is-open");
        burger.setAttribute("aria-expanded", "false");
      })
    );
  }

  /* ---- FAQ accordion ---- */
  document.querySelectorAll(".acc-head").forEach((head) => {
    head.addEventListener("click", () => {
      const item = head.parentElement;
      const body = head.nextElementSibling;
      const isOpen = item.classList.toggle("is-open");
      head.setAttribute("aria-expanded", String(isOpen));
      body.style.maxHeight = isOpen ? body.scrollHeight + "px" : null;
    });
  });

  /* ---- Schedule day switch ---- */
  const dayBtns = document.querySelectorAll(".day-switch__btn");
  const panels = document.querySelectorAll("[data-day-panel]");
  const title = document.querySelector("#schedule .section-title");
  const labels = { 1: "Расписание · День 1", 2: "Расписание · День 2" };
  dayBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const day = btn.dataset.day;
      dayBtns.forEach((b) => {
        const active = b === btn;
        b.classList.toggle("is-active", active);
        b.setAttribute("aria-selected", String(active));
      });
      panels.forEach((p) => p.classList.toggle("is-hidden", p.dataset.dayPanel !== day));
      if (title) title.textContent = labels[day];
      // re-reveal freshly shown rows
      document.querySelectorAll(`[data-day-panel="${day}"] .reveal`).forEach((el) => el.classList.add("is-visible"));
    });
  });

  /* ---- Ticket buy stub ---- */
  const note = document.getElementById("buyNote");
  document.querySelectorAll("[data-buy]").forEach((el) => {
    el.addEventListener("click", (e) => {
      e.preventDefault();
      if (note) {
        note.textContent = `Тариф «${el.dataset.buy}» выбран — это демо, оплата не подключена.`;
        note.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    });
  });

  /* ---- Reveal on scroll ---- */
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
  );
  document.querySelectorAll(".reveal").forEach((el, i) => {
    el.style.transitionDelay = Math.min((i % 6) * 60, 300) + "ms";
    io.observe(el);
  });
})();
