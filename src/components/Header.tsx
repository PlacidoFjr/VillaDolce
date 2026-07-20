import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Home", path: "/" },
  { label: "Catálogo", path: "/catalogo" },
  { label: "Sobre", path: "/sobre" },
  { label: "Contato", path: "/contato" },
];

type HeaderProps = {
  currentPath: string;
  onNavigate: (path: string) => void;
};

export function Header({ currentPath, onNavigate }: HeaderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const updateHeader = () => setIsScrolled(window.scrollY > 12);
    updateHeader();
    window.addEventListener("scroll", updateHeader, { passive: true });
    return () => window.removeEventListener("scroll", updateHeader);
  }, []);

  function handleNavigate(path: string) {
    setIsOpen(false);
    onNavigate(path);
  }

  return (
    <header className={cn("site-header", isScrolled && "is-scrolled", isOpen && "nav-open")}>
      <button
        className="brand"
        type="button"
        aria-label="Villa Dolce Ateliê - página inicial"
        onClick={() => handleNavigate("/")}
      >
        <img src="/assets/logo-villa-dolce.jpeg" alt="Logo Villa Dolce Ateliê" />
        <span>
          <strong>
            Villa <em>Dolce</em>
          </strong>
          <small>Ateliê</small>
        </span>
      </button>

      <button
        className="nav-toggle"
        type="button"
        aria-label={isOpen ? "Fechar menu" : "Abrir menu"}
        aria-expanded={isOpen}
        onClick={() => setIsOpen((value) => !value)}
      >
        {isOpen ? <X size={19} /> : <Menu size={19} />}
      </button>

      <nav className="site-nav" aria-label="Navegação principal">
        {navItems.map((item) => (
          <button
            key={item.path}
            type="button"
            className={cn(currentPath === item.path && "active")}
            aria-current={currentPath === item.path ? "page" : undefined}
            onClick={() => handleNavigate(item.path)}
          >
            {item.label}
          </button>
        ))}
      </nav>
    </header>
  );
}
