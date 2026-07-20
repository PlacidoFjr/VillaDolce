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

document.querySelectorAll(".product-collage").forEach((carousel, carouselIndex) => {
  const images = Array.from(carousel.querySelectorAll(":scope > img"));

  if (images.length < 2) {
    return;
  }

  let currentIndex = 0;
  let pointerStart = null;

  carousel.classList.add("is-carousel");
  carousel.setAttribute("tabindex", "0");
  carousel.setAttribute("role", "region");

  const frame = document.createElement("div");
  frame.className = "carousel-frame";

  const track = document.createElement("div");
  track.className = "carousel-track";

  const controls = document.createElement("div");
  controls.className = "carousel-controls";

  const prevButton = document.createElement("button");
  prevButton.className = "carousel-button";
  prevButton.type = "button";
  prevButton.setAttribute("aria-label", "Foto anterior");
  prevButton.innerHTML = '<span aria-hidden="true">&lt;</span>';

  const nextButton = document.createElement("button");
  nextButton.className = "carousel-button";
  nextButton.type = "button";
  nextButton.setAttribute("aria-label", "Próxima foto");
  nextButton.innerHTML = '<span aria-hidden="true">&gt;</span>';

  const dots = document.createElement("div");
  dots.className = "carousel-dots";
  dots.setAttribute("aria-label", "Selecionar foto");

  const dotButtons = images.map((image, index) => {
    image.loading = "lazy";
    image.decoding = "async";
    image.draggable = false;

    const slide = document.createElement("figure");
    slide.className = "carousel-slide";
    slide.setAttribute("aria-label", `Foto ${index + 1} de ${images.length}`);
    slide.appendChild(image);
    track.appendChild(slide);

    const dot = document.createElement("button");
    dot.className = "carousel-dot";
    dot.type = "button";
    dot.setAttribute("aria-label", `Ver foto ${index + 1}`);
    dot.addEventListener("click", () => goToSlide(index));
    dots.appendChild(dot);
    return dot;
  });

  const updateCarousel = () => {
    track.style.transform = `translateX(-${currentIndex * 100}%)`;

    dotButtons.forEach((dot, index) => {
      const isActive = index === currentIndex;
      dot.classList.toggle("is-active", isActive);
      dot.setAttribute("aria-current", isActive ? "true" : "false");
    });
  };

  function goToSlide(index) {
    currentIndex = (index + images.length) % images.length;
    updateCarousel();
  }

  prevButton.addEventListener("click", () => goToSlide(currentIndex - 1));
  nextButton.addEventListener("click", () => goToSlide(currentIndex + 1));

  frame.addEventListener("pointerdown", (event) => {
    pointerStart = event.clientX;
  });

  frame.addEventListener("pointerup", (event) => {
    if (pointerStart === null) {
      return;
    }

    const pointerDistance = event.clientX - pointerStart;
    pointerStart = null;

    if (Math.abs(pointerDistance) < 42) {
      return;
    }

    goToSlide(currentIndex + (pointerDistance < 0 ? 1 : -1));
  });

  carousel.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      goToSlide(currentIndex - 1);
    }

    if (event.key === "ArrowRight") {
      event.preventDefault();
      goToSlide(currentIndex + 1);
    }
  });

  carousel.textContent = "";
  frame.appendChild(track);
  controls.append(prevButton, nextButton);
  carousel.append(frame, controls, dots);
  carousel.style.setProperty("--stagger", String(carouselIndex % 6));
  updateCarousel();
});

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
