import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";

type ProductCarouselProps = {
  images: Array<{
    src: string;
    alt: string;
  }>;
  label: string;
};

export function ProductCarousel({ images, label }: ProductCarouselProps) {
  const [current, setCurrent] = useState(0);
  const [pointerStart, setPointerStart] = useState<number | null>(null);
  const [isPaused, setIsPaused] = useState(false);

  function goTo(index: number) {
    setCurrent((index + images.length) % images.length);
  }

  useEffect(() => {
    if (isPaused || images.length < 2) return;

    const interval = window.setInterval(() => {
      setCurrent((index) => (index + 1) % images.length);
    }, 5600);

    return () => window.clearInterval(interval);
  }, [images.length, isPaused]);

  return (
    <div
      className="catalog-media product-collage is-carousel"
      role="region"
      aria-label={`Fotos de ${label}`}
      tabIndex={0}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={() => setIsPaused(false)}
      onKeyDown={(event) => {
        if (event.key === "ArrowLeft") {
          event.preventDefault();
          goTo(current - 1);
        }

        if (event.key === "ArrowRight") {
          event.preventDefault();
          goTo(current + 1);
        }
      }}
    >
      <div
        className="carousel-frame"
        onPointerDown={(event) => setPointerStart(event.clientX)}
        onPointerUp={(event) => {
          if (pointerStart === null) return;
          const distance = event.clientX - pointerStart;
          setPointerStart(null);
          if (Math.abs(distance) < 42) return;
          goTo(current + (distance < 0 ? 1 : -1));
        }}
      >
        <div className="carousel-track" style={{ transform: `translateX(-${current * 100}%)` }}>
          {images.map((image, index) => (
            <figure className="carousel-slide" aria-label={`Foto ${index + 1} de ${images.length}`} key={image.src}>
              <img src={image.src} alt={image.alt} loading="lazy" draggable={false} />
            </figure>
          ))}
        </div>
      </div>

      <div className="carousel-controls">
        <button className="carousel-button" type="button" aria-label="Foto anterior" onClick={() => goTo(current - 1)}>
          <ChevronLeft size={19} />
        </button>
        <button className="carousel-button" type="button" aria-label="Próxima foto" onClick={() => goTo(current + 1)}>
          <ChevronRight size={19} />
        </button>
      </div>

    </div>
  );
}
