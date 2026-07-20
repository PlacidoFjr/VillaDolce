import { whatsappUrl } from "@/lib/utils";

const defaultMessage =
  "Olá, vim pelo site da Villa Dolce Ateliê e gostaria de informações sobre uma encomenda personalizada.";

export function Footer() {
  return (
    <footer className="site-footer">
      <div>
        <strong>
          Villa <em>Dolce</em> Ateliê
        </strong>
        <p>Cestas afetivas & delícias artesanais.</p>
      </div>
      <div>
        <a href="https://www.instagram.com/villadolceatelie" target="_blank" rel="noopener noreferrer">
          @villadolceatelie
        </a>
        <a href={whatsappUrl(defaultMessage)} target="_blank" rel="noopener noreferrer">
          WhatsApp
        </a>
      </div>
    </footer>
  );
}
