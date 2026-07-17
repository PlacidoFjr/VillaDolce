const body = document.body;
const header = document.querySelector("[data-header]");
const navToggle = document.querySelector("[data-nav-toggle]");
const nav = document.querySelector("[data-nav]");

const updateHeaderState = () => {
  if (!header) return;
  header.classList.toggle("is-scrolled", window.scrollY > 12);
};

updateHeaderState();
window.addEventListener("scroll", updateHeaderState, { passive: true });

if (navToggle && nav) {
  navToggle.addEventListener("click", () => {
    const isOpen = body.classList.toggle("nav-open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
    navToggle.setAttribute("aria-label", isOpen ? "Fechar menu" : "Abrir menu");
  });

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      body.classList.remove("nav-open");
      navToggle.setAttribute("aria-expanded", "false");
      navToggle.setAttribute("aria-label", "Abrir menu");
    });
  });
}

const currentPage = window.location.pathname.split("/").pop() || "index.html";

document.querySelectorAll(".site-nav a").forEach((link) => {
  const href = link.getAttribute("href");
  if (href === currentPage) {
    link.classList.add("active");
    link.setAttribute("aria-current", "page");
  }
});

const revealItems = document.querySelectorAll(".page-reveal");
const motionItems = document.querySelectorAll(
  ".category-card, .feature-card, .catalog-item, .values-grid article, .contact-panel, .contact-form"
);

motionItems.forEach((item, index) => {
  item.classList.add("motion-item");
  item.style.setProperty("--stagger", String(index % 6));
});

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  revealItems.forEach((item) => observer.observe(item));

  const motionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          motionObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.16 }
  );

  motionItems.forEach((item) => motionObserver.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
  motionItems.forEach((item) => item.classList.add("is-visible"));
}

const whatsappForm = document.querySelector("[data-whatsapp-form]");

if (whatsappForm) {
  whatsappForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const formData = new FormData(whatsappForm);
    const fields = [
      ["Nome", formData.get("nome")],
      ["Ocasião", formData.get("ocasiao")],
      ["Estilo do presente", formData.get("estilo")],
      ["Preferências", formData.get("preferencias")]
    ];

    const filledFields = fields
      .map(([label, value]) => [label, String(value || "").trim()])
      .filter(([, value]) => value.length > 0);

    const messageLines = [
      "Olá, vim pelo site da Villa Dolce Ateliê e gostaria de informações sobre uma encomenda personalizada."
    ];

    if (filledFields.length > 0) {
      messageLines.push("", "Informações para orçamento:");
      filledFields.forEach(([label, value]) => {
        messageLines.push(`${label}: ${value}`);
      });
    }

    const url = `https://wa.me/557193875356?text=${encodeURIComponent(messageLines.join("\n"))}`;
    window.open(url, "_blank", "noopener");
  });
}
