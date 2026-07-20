import { CSSProperties, HTMLAttributes, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

type RevealProps = HTMLAttributes<HTMLElement> & {
  as?: "section" | "article" | "div";
  delay?: number;
};

export function Reveal({ as: Tag = "section", className, delay = 0, style, ...props }: RevealProps) {
  const ref = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!ref.current) return;

    if (!("IntersectionObserver" in window)) {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.12 },
    );

    observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <Tag
      ref={(node) => {
        ref.current = node;
      }}
      className={cn("page-reveal", visible && "is-visible", className)}
      style={{ ...style, "--stagger": String(delay) } as CSSProperties}
      {...props}
    />
  );
}
