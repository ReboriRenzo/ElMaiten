const inviernoImages = [
  "./assets/Invierno/Invierno Maiten.jpg",
  "./assets/Invierno/Invierno Maiten 2.jpg",
  "./assets/Invierno/Invierno maiten 3.jpg",
  "./assets/Invierno/Invierno Maiten 4.jpg",
];

const otonoImages = [
  "./assets/Otono/Otono Maiten.jpg",
  "./assets/Otono/Otono maiten 2.jpg",
  "./assets/Otono/Otono maiten 3.jpg",
  "./assets/Otono/Otono maiten 4.jpg",
];

const heroImages = [
  "./assets/El Maiten/El Maiten.jpg",
  "./assets/El Maiten/El maiten1.jpg",
  "./assets/El Maiten/El Maiten 2.jpg",
  "./assets/El Maiten/El Maiten 3.jpg",
  "./assets/El Maiten/El Maiten 4.jpg",
  "./assets/El Maiten/El Maiten 5.jpg",
  "./assets/El Maiten/El Maiten 6.jpg",
  "./assets/El Maiten/El Maiten 7.jpg",
  "./assets/El Maiten/El Maiten 8.jpg",
  "./assets/El Maiten/El Maiten 9.jpg",
  "./assets/El Maiten/El Maiten 10.jpg",
  "./assets/El Maiten/El Maiten 11.jpg",
  "./assets/El Maiten/El Maiten 12.jpg",
  "./assets/El Maiten/El maiten 13.jpg",
  "./assets/El Maiten/El maiten 14.jpg",
];

/** Galería del hero: El Maitén + vistas del pueblo + invierno + otoño (miniaturas que rotan). */
const vistaPuebloImages = [
  "./assets/Vista del pueblo desde El cerro de la Cruz.jpg",
  "./assets/Vista del pueblo desde El cerro de la Cruz 2.jpg",
];

/** Fiesta Nacional del Tren a Vapor — fondo con recorte mobile dedicado */
const heroEventoTrenVapor = "./assets/Eventos/Tren a vapor.jpg";

const heroThumbGallery = [
  ...heroImages,
  ...vistaPuebloImages,
  ...inviernoImages,
  ...otonoImages,
  heroEventoTrenVapor,
];

function buildCarousel(containerId, images, prefix) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const track = document.createElement("div");
  track.className = "carousel-track";

  const duplicated = [...images, ...images];
  duplicated.forEach((src, index) => {
    const item = document.createElement("figure");
    item.className = "carousel-item";

    const img = document.createElement("img");
    img.src = src;
    img.alt = `${prefix} ${index % images.length + 1}`;

    item.appendChild(img);
    track.appendChild(item);
  });

  container.appendChild(track);
}

buildCarousel("carousel-invierno", inviernoImages, "El Maiten invierno");
buildCarousel("carousel-otono", otonoImages, "El Maiten en otoño");

/** Cinco miniaturas; rotan solas (de a una) y las flechas saltan de 5 en 5 en `heroThumbGallery`. */
const HERO_THUMB_SLOTS = 5;
const HERO_THUMB_ARROW_STEP = 5;
let heroThumbOffset = 0;
let heroThumbRotateTimer = null;

function ensureHeroThumbSlots() {
  const root = document.getElementById("hero-thumbs-root");
  if (!root) return null;
  const n = root.querySelectorAll(".hero-thumb").length;
  if (n === HERO_THUMB_SLOTS) return root;
  root.innerHTML = "";
  for (let s = 0; s < HERO_THUMB_SLOTS; s++) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "hero-thumb";
    btn.dataset.slot = String(s);
    const img = document.createElement("img");
    img.alt = "";
    btn.appendChild(img);
    root.appendChild(btn);
  }
  return root;
}

function shiftHeroThumbs(delta) {
  const n = heroThumbGallery.length;
  if (n === 0) return;
  heroThumbOffset = ((heroThumbOffset + delta) % n + n) % n;
  const root = document.getElementById("hero-thumbs-root");
  if (root) {
    root.querySelectorAll(".hero-thumb.is-active").forEach((b) => b.classList.remove("is-active"));
  }
  renderHeroThumbStrip();
}

function renderHeroThumbStrip() {
  const root = ensureHeroThumbSlots();
  if (!root || heroThumbGallery.length === 0) return;
  const total = heroThumbGallery.length;
  root.querySelectorAll(".hero-thumb").forEach((btn, slot) => {
    const globalIndex = (heroThumbOffset + slot) % total;
    const src = heroThumbGallery[globalIndex];
    btn.dataset.heroBg = src;
    btn.dataset.heroIndex = String(globalIndex);
    const img = btn.querySelector("img");
    if (img) {
      img.src = src;
      img.alt = `Galería ${globalIndex + 1} de ${total}`;
    }
    btn.setAttribute("aria-label", `Foto ${globalIndex + 1} de ${total} — Turismo El Maitén`);
  });

  const prev = document.getElementById("hero-thumbs-prev");
  const next = document.getElementById("hero-thumbs-next");
  const hideArrows = total <= HERO_THUMB_SLOTS;
  if (prev) prev.hidden = hideArrows;
  if (next) next.hidden = hideArrows;
}

function startHeroThumbRotation() {
  const slider = document.querySelector(".hero-photos-slider");
  if (!slider || heroThumbGallery.length <= HERO_THUMB_SLOTS) return;

  const prefersReduced =
    typeof window.matchMedia === "function" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (prefersReduced) return;

  const tick = () => {
    shiftHeroThumbs(1);
  };

  heroThumbRotateTimer = window.setInterval(tick, 5000);

  const pause = () => {
    if (heroThumbRotateTimer) {
      window.clearInterval(heroThumbRotateTimer);
      heroThumbRotateTimer = null;
    }
  };
  const resume = () => {
    if (heroThumbRotateTimer) return;
    heroThumbRotateTimer = window.setInterval(tick, 5000);
  };

  slider.addEventListener("mouseenter", pause);
  slider.addEventListener("mouseleave", resume);
}

function setupHeroThumbArrows() {
  const prev = document.getElementById("hero-thumbs-prev");
  const next = document.getElementById("hero-thumbs-next");
  if (!prev || !next) return;

  prev.addEventListener("click", () => {
    shiftHeroThumbs(-HERO_THUMB_ARROW_STEP);
  });
  next.addEventListener("click", () => {
    shiftHeroThumbs(HERO_THUMB_ARROW_STEP);
  });
}

renderHeroThumbStrip();
setupHeroThumbArrows();
startHeroThumbRotation();

const heroGradient = "linear-gradient(rgba(12, 10, 8, 0.55), rgba(12, 10, 8, 0.45))";

/** Fondo del hero al cargar (antes de elegir otra escena o miniatura). */
const DEFAULT_HERO_BG = "./assets/Otono/Otono maiten 3.jpg";

/** Imagen de fondo por cada botón de atracción (El Maitén, Cañadón, Cerro). */
const heroSceneImages = [
  "./assets/El Maiten/El Maiten.jpg",
  "./assets/Canadon ensuenos/Canadon ensuenos.jpg",
  "./assets/Cerro de la ventana/Cerro de la ventana.jpg",
];

function applyHeroBackground(url) {
  const hero = document.querySelector(".hero");
  if (!hero || !url) return;
  let path = String(url).trim();
  try {
    path = decodeURIComponent(path);
  } catch {
    /* usar path tal cual */
  }
  const safePath = encodeURI(path);
  hero.style.backgroundImage = `${heroGradient}, url("${safePath}")`;

  const pathNorm = path.replace(/\\/g, "/").toLowerCase();
  const isTrainFestival =
    pathNorm.includes("eventos") && pathNorm.includes("tren") && pathNorm.includes("vapor");
  hero.classList.toggle("hero-bg--train-event", isTrainFestival);
}

function setupHeroBackground() {
  const hero = document.querySelector(".hero");
  if (!hero) return;

  const sceneButtons = document.querySelectorAll("[data-hero-scene]");
  const thumbsRoot = document.getElementById("hero-thumbs-root");

  function clearSceneActive() {
    sceneButtons.forEach((b) => b.classList.remove("is-active"));
  }

  function clearThumbActive() {
    if (!thumbsRoot) return;
    thumbsRoot.querySelectorAll(".hero-thumb").forEach((b) => b.classList.remove("is-active"));
  }

  sceneButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const i = parseInt(btn.getAttribute("data-hero-scene"), 10);
      const path = heroSceneImages[i];
      if (!path) return;
      sceneButtons.forEach((b) => b.classList.toggle("is-active", b === btn));
      clearThumbActive();
      applyHeroBackground(path);
    });
  });

  if (thumbsRoot) {
    thumbsRoot.addEventListener("click", (e) => {
      const btn = e.target.closest(".hero-thumb");
      if (!btn || !thumbsRoot.contains(btn)) return;
      const path = btn.dataset.heroBg || "";
      if (!path) return;
      applyHeroBackground(path);
      thumbsRoot.querySelectorAll(".hero-thumb").forEach((b) => b.classList.toggle("is-active", b === btn));
      clearSceneActive();
    });
  }

  applyHeroBackground(DEFAULT_HERO_BG);

  const sideNav = document.querySelector(".hero-side-nav");
  document.querySelectorAll(".hero-side-item").forEach((btn) => {
    btn.addEventListener("click", () => {
      const side = btn.getAttribute("data-side");
      if (sideNav && side) sideNav.setAttribute("data-side", side);
      document.querySelectorAll(".hero-side-item").forEach((b) => b.classList.toggle("is-active", b === btn));
    });
  });
}

setupHeroBackground();

function setupAboutBackgroundSlideshow() {
  const slides = document.querySelectorAll(".about-bg-slide");
  if (slides.length < 2) return;

  let activeIndex = 0;

  setInterval(() => {
    slides[activeIndex].classList.remove("is-active");
    activeIndex = (activeIndex + 1) % slides.length;
    slides[activeIndex].classList.add("is-active");
  }, 7000);
}

setupAboutBackgroundSlideshow();

function setupScrollReveal() {
  const elements = document.querySelectorAll(".timeline-item.reveal-on-scroll");
  if (!elements.length) return;

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        obs.unobserve(entry.target);
      });
    },
    {
      threshold: 0.12,
      rootMargin: "0px 0px -6% 0px",
    }
  );

  elements.forEach((el) => observer.observe(el));
}

setupScrollReveal();

/** Entrada al scroll: añadí .fx-section + .fx-fade-up en el HTML (ver effects.css). */
function setupFxSections() {
  const sections = document.querySelectorAll(".fx-section");
  if (!sections.length) return;

  const prefersReduced =
    typeof window.matchMedia === "function" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (prefersReduced) {
    sections.forEach((el) => el.classList.add("fx-inview"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("fx-inview");
        obs.unobserve(entry.target);
      });
    },
    { threshold: 0.08, rootMargin: "0px 0px -6% 0px" }
  );

  sections.forEach((el) => observer.observe(el));
}

setupFxSections();

function setupAttractionsBackgroundCycle() {
  const section = document.getElementById("atracciones");
  if (!section) return;

  const images = [
    "./assets/Actividades/Kayak/1.jpeg",
    "./assets/Actividades/Caballos/WhatsApp Image 2026-04-24 at 3.44.32 PM (1).jpeg",
    "./assets/Actividades/Aero Club/image.png",
    "./assets/Actividades/22 diciembre/1.jpeg",
  ];
  if (!images.length) return;

  const prefersReduced =
    typeof window.matchMedia === "function" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const applySectionBg = (src) => {
    if (!src) return;
    const safePath = encodeURI(src);
    section.style.setProperty("--attractions-bg", `url("${safePath}")`);
  };

  let index = 0;
  applySectionBg(images[index]);
  if (prefersReduced || images.length < 2) return;

  window.setInterval(() => {
    index = (index + 1) % images.length;
    applySectionBg(images[index]);
  }, 7000);
}

setupAttractionsBackgroundCycle();

/**
 * Otras atracciones/actividades: cada tarjeta recorre su carpeta de fotos cada 4s.
 * Solo usa imágenes que realmente cargan (evita rutas rotas).
 */
function setupAttractionsSlideshows() {
  const cards = document.querySelectorAll(".attractions-showcase .attraction-card");
  if (!cards.length) return;

  const prefersReduced =
    typeof window.matchMedia === "function" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (prefersReduced) return;

  const candidateGalleries = {
    cerro: [
      "./assets/Cerro de la ventana/Cerro de la ventana.jpg",
      "./assets/Cerro de la ventana/Cerro de la ventana 2.jpg",
      "./assets/Cerro de la ventana/Cerro de la ventana 3.jpg",
      "./assets/Cerro de la ventana/Cerro de la ventana 4.jpg",
    ],
    canadon: [
      "./assets/Canadon ensuenos/Canadon ensuenos.jpg",
      "./assets/Canadon ensuenos/Canadon ensuenos 2.jpg",
      "./assets/Canadon ensuenos/Canadon ensuenos 3.jpg",
      "./assets/Canadon ensuenos/Canon de los ensuenos.jpg",
      "./assets/Canadon ensuenos/Canon de los ensuenos 2.jpg",
    ],
    grutita: [
      "./assets/Vista del pueblo desde El cerro de la Cruz.jpg",
      "./assets/Vista del pueblo desde El cerro de la Cruz 2.jpg",
      "./assets/Vista del pueblo desde El cerro de la Cruz 3.jpg",
    ],
    aeroclub: ["./assets/Actividades/Aero Club/image.png"],
    kayak: [
      "./assets/Actividades/Kayak/1.jpeg",
      "./assets/Actividades/Kayak/2.jpeg",
    ],
    caballos: [
      "./assets/Actividades/Caballos/WhatsApp Image 2026-04-24 at 3.44.32 PM.jpeg",
      "./assets/Actividades/Caballos/WhatsApp Image 2026-04-24 at 3.44.32 PM (1).jpeg",
    ],
    raftraining: [
      "./assets/Actividades/R.A.F training.png",
      "./assets/Actividades/R.A.F training2.png",
    ],
  };

  const checkImage = (src) =>
    new Promise((resolve) => {
      const probe = new Image();
      probe.onload = () => resolve(src);
      probe.onerror = () => resolve("");
      probe.src = src;
    });

  cards.forEach(async (card) => {
    const img = card.querySelector("img");
    if (!img) return;

    const key = card.getAttribute("data-gallery") || "";
    const candidates = candidateGalleries[key] || [img.getAttribute("src") || ""];
    const checked = await Promise.all(candidates.map((src) => checkImage(src)));
    const gallery = checked.filter(Boolean);
    if (gallery.length <= 1) return;

    let current = 0;
    window.setInterval(() => {
      current = (current + 1) % gallery.length;
      img.classList.add("is-fading");
      window.setTimeout(() => {
        img.src = gallery[current];
        img.classList.remove("is-fading");
      }, 180);
    }, 4000);
  });
}

setupAttractionsSlideshows();

const wppForm = document.getElementById("wpp-form");

if (wppForm) {
  wppForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const nombre = document.getElementById("nombre")?.value?.trim() || "";
    const apellido = document.getElementById("apellido")?.value?.trim() || "";
    const email = document.getElementById("email")?.value?.trim() || "";
    const telefono = document.getElementById("telefono")?.value?.trim() || "";
    const mensaje = document.getElementById("mensaje")?.value?.trim() || "";

    const nombreCompleto = [nombre, apellido].filter(Boolean).join(" ");

    const lineas = [
      "Hola equipo de Turismo El Maiten 👋",
      "Estoy con muchas ganas de conocer El Maiten y me encantaria que me ayuden a planificar una experiencia inolvidable ✨",
      "",
      `Nombre: ${nombreCompleto || nombre || "(sin nombre)"}`,
      email ? `Email: ${email}` : null,
      telefono ? `Tel / WhatsApp: ${telefono}` : null,
      "",
      "Consulta:",
      mensaje,
      "",
      "Muchas gracias por su tiempo y buena onda. Quedo atento/a para coordinar mi viaje 🏞️",
    ].filter((line) => line !== null);

    const text = lineas.join("\n");
    const wppUrl = `https://wa.me/5492945691741?text=${encodeURIComponent(text)}`;

    window.open(wppUrl, "_blank", "noopener,noreferrer");
  });
}
