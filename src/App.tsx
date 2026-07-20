import { CSSProperties, FormEvent, useEffect, useMemo, useState } from "react";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { ProductCarousel } from "@/components/ui/ProductCarousel";
import { Reveal } from "@/components/Reveal";
import { catalogItems } from "@/data/catalog";
import { whatsappUrl } from "@/lib/utils";

const defaultMessage =
  "Olá, vim pelo site da Villa Dolce Ateliê e gostaria de informações sobre uma encomenda personalizada.";

type Route = "/" | "/catalogo" | "/sobre" | "/contato";

const routes: Route[] = ["/", "/catalogo", "/sobre", "/contato"];

function getRouteFromLocation(): Route {
  const path = window.location.pathname.replace(/\/$/, "") || "/";

  if (path.endsWith("/catalogo.html") || path.endsWith("/catalogo")) return "/catalogo";
  if (path.endsWith("/sobre.html") || path.endsWith("/sobre")) return "/sobre";
  if (path.endsWith("/contato.html") || path.endsWith("/contato")) return "/contato";
  if (routes.includes(path as Route)) return path as Route;

  return "/";
}

export function App() {
  const [currentPath, setCurrentPath] = useState<Route>(() => getRouteFromLocation());

  useEffect(() => {
    const handlePopState = () => setCurrentPath(getRouteFromLocation());
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  useEffect(() => {
    document.title = pageTitles[currentPath];
    const hash = window.location.hash.replace("#", "");

    if (hash) {
      window.setTimeout(() => {
        document.getElementById(hash)?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 80);
      return;
    }

    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentPath]);

  function navigate(path: string) {
    const [rawRoute, hash] = path.split("#");
    const route = routes.includes(rawRoute as Route) ? (rawRoute as Route) : "/";
    const target = `${route === "/" ? "/" : route}${hash ? `#${hash}` : ""}`;
    window.history.pushState({}, "", target);
    setCurrentPath(route);

    if (hash) {
      window.setTimeout(() => {
        document.getElementById(hash)?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 80);
    }
  }

  return (
    <>
      <Header currentPath={currentPath} onNavigate={navigate} />
      <main>
        {currentPath === "/" && <HomePage onNavigate={navigate} />}
        {currentPath === "/catalogo" && <CatalogPage onNavigate={navigate} />}
        {currentPath === "/sobre" && <AboutPage />}
        {currentPath === "/contato" && <ContactPage />}
      </main>
      <Footer />
    </>
  );
}

const pageTitles: Record<Route, string> = {
  "/": "Villa Dolce Ateliê | Cestas afetivas e delícias artesanais",
  "/catalogo": "Catálogo | Villa Dolce Ateliê",
  "/sobre": "Sobre | Villa Dolce Ateliê",
  "/contato": "Contato | Villa Dolce Ateliê",
};

function HomePage({ onNavigate }: { onNavigate: (path: string) => void }) {
  const previewItems = useMemo(
    () => [
      catalogItems[0],
      catalogItems[1],
      catalogItems[2],
    ],
    [],
  );

  return (
    <>
      <Reveal className="hero">
        <div className="hero-copy">
          <p className="eyebrow">Cestas afetivas & delícias artesanais</p>
          <h1>
            Villa <span>Dolce</span> Ateliê
          </h1>
          <p className="hero-lead">
            Cestas afetivas e delícias artesanais feitas para transformar gestos em memórias.
          </p>
          <div className="hero-actions">
            <a className="button primary" href={whatsappUrl(defaultMessage)} target="_blank" rel="noopener noreferrer">
              Pedir orçamento pelo WhatsApp
            </a>
            <button className="button ghost" type="button" onClick={() => onNavigate("/catalogo")}>
              Conhecer catálogo
            </button>
          </div>
        </div>

        <div className="hero-visual" aria-label="Identidade visual Villa Dolce Ateliê">
          <div className="seal-frame">
            <img src="/assets/logo-villa-dolce.jpeg" alt="Villa Dolce Ateliê" />
          </div>
        </div>
      </Reveal>

      <Reveal className="section compact">
        <div className="section-heading">
          <p className="eyebrow">Catálogo afetivo</p>
          <h2>Presentes pensados para cada história</h2>
        </div>
        <div className="category-grid">
          {previewItems.map((item, index) => (
            <article className="category-card motion-item is-visible" key={item.id} style={{ "--stagger": index } as CSSProperties}>
              {item.images ? (
                <figure className="product-thumb">
                  <img src={item.images[0].src} alt={item.images[0].alt} />
                </figure>
              ) : (
                <div className="image-placeholder">{item.placeholder}</div>
              )}
              <h3>{item.title}</h3>
              <p>{homeDescriptions[item.id] ?? item.description}</p>
              <button type="button" onClick={() => onNavigate(`/catalogo#${item.id}`)}>
                Ver detalhes
              </button>
            </article>
          ))}
        </div>
      </Reveal>

      <Reveal className="section split-section">
        <div>
          <p className="eyebrow">Essência da marca</p>
          <h2>Um ateliê para transformar carinho em presença</h2>
        </div>
        <div className="text-column">
          <p>
            A Villa Dolce Ateliê nasceu do desejo de tornar pequenos gestos inesquecíveis. Cada cesta, caixa
            ou delícia artesanal é pensada a partir da ocasião, da intenção e de quem vai receber.
          </p>
          <p>
            O resultado é uma experiência delicada, elegante e feita com atenção aos detalhes, para que o
            presente carregue afeto antes mesmo de ser aberto.
          </p>
        </div>
      </Reveal>

      <Reveal className="section">
        <div className="section-heading">
          <p className="eyebrow">Diferenciais</p>
          <h2>Cuidado em cada escolha</h2>
        </div>
        <div className="feature-grid">
          {[
            ["01", "Personalização", "Cada composição nasce a partir da ocasião, preferências, estilo e mensagem desejada."],
            ["02", "Acabamento premium", "Materiais, cores, laços e detalhes visuais são escolhidos para uma apresentação refinada."],
            ["03", "Afeto artesanal", "As criações unem delicadeza manual, sabores especiais e intenção verdadeira em cada entrega."],
          ].map(([number, title, description], index) => (
            <article className="feature-card motion-item is-visible" key={title} style={{ "--stagger": index } as CSSProperties}>
              <span>{number}</span>
              <h3>{title}</h3>
              <p>{description}</p>
            </article>
          ))}
        </div>
      </Reveal>

      <Reveal className="cta-band">
        <p className="eyebrow">Encomendas personalizadas</p>
        <h2>Conte a ocasião. A Villa Dolce cuida dos detalhes.</h2>
        <a className="button primary" href={whatsappUrl(defaultMessage)} target="_blank" rel="noopener noreferrer">
          Pedir orçamento pelo WhatsApp
        </a>
      </Reveal>
    </>
  );
}

const homeDescriptions: Record<string, string> = {
  "cestas-afetivas": "Composições personalizadas para aniversários, agradecimentos, boas-vindas e gestos de cuidado.",
  "caixas-presenteaveis": "Caixas elegantes com escolhas delicadas para surpreender com discrição, beleza e significado.",
  "delicias-artesanais": "Sabores preparados com cuidado para acompanhar momentos especiais e tornar a memória mais doce.",
  "donuts-artesanais": "Donuts delicados, presenteáveis e feitos sob encomenda para celebrar com charme e sabor.",
};

function CatalogPage({ onNavigate }: { onNavigate: (path: string) => void }) {
  return (
    <>
      <Reveal className="page-hero">
        <h1>Criações personalizadas para presentear com intenção</h1>
        <p>
          As composições são feitas sob encomenda. O orçamento é individual, considerando ocasião, estilo,
          preferências e disponibilidade dos itens artesanais.
        </p>
      </Reveal>

      <Reveal className="catalog-list" aria-label="Categorias do catálogo">
        {catalogItems.map((item, index) => (
          <article className="catalog-item motion-item is-visible" id={item.id} key={item.id} style={{ "--stagger": index % 6 } as CSSProperties}>
            {item.images ? (
              <ProductCarousel images={item.images} label={item.title} />
            ) : (
              <div className="catalog-media image-placeholder">{item.placeholder}</div>
            )}
            <div className="catalog-copy">
              <p className="eyebrow">{item.eyebrow}</p>
              <h2>{item.title}</h2>
              <p>{item.description}</p>
              <p>
                <strong>Ocasiões indicadas:</strong> {item.occasions}
              </p>
              <a className="button secondary" href={whatsappUrl(item.message)} target="_blank" rel="noopener noreferrer">
                Consultar pelo WhatsApp
              </a>
            </div>
          </article>
        ))}
      </Reveal>

      <Reveal className="cta-band">
        <p className="eyebrow">Orçamento individual</p>
        <h2>Cada criação é personalizada de acordo com a ocasião.</h2>
        <button className="button primary" type="button" onClick={() => onNavigate("/contato")}>
          Enviar preferências
        </button>
      </Reveal>
    </>
  );
}

function AboutPage() {
  return (
    <>
      <Reveal className="page-hero story-hero">
        <p className="eyebrow">Nossa história</p>
        <h1>Presentes com afeto, acabamento e significado</h1>
        <p>
          A Villa Dolce nasceu do desejo de transformar pequenos gestos em lembranças inesquecíveis. Cada criação
          é pensada com carinho, cuidado e significado, para que quem recebe sinta afeto em cada detalhe.
        </p>
      </Reveal>

      <Reveal className="section split-section">
        <div className="seal-frame small">
          <img src="/assets/logo-villa-dolce.jpeg" alt="Logo Villa Dolce Ateliê" />
        </div>
        <div className="text-column large">
          <p>
            A Villa Dolce Ateliê une o encanto do presente artesanal à apresentação refinada de uma boutique.
            O processo começa pela escuta: a ocasião, a pessoa presenteada, os sabores preferidos, os tons
            desejados e a mensagem que precisa chegar junto.
          </p>
          <p>
            Com esse cuidado, cada cesta, caixa ou delícia artesanal deixa de ser apenas um produto e se torna
            uma forma sensível de presença. A beleza está nos detalhes, mas também na intenção por trás de cada
            escolha.
          </p>
        </div>
      </Reveal>

      <Reveal className="section">
        <div className="section-heading">
          <p className="eyebrow">Valores</p>
          <h2>O que guia cada criação</h2>
        </div>
        <div className="values-grid">
          {[
            ["Delicadeza", "Composições leves, elegantes e equilibradas, sem excesso visual."],
            ["Personalização", "Presentes pensados para a história, a ocasião e a intenção de cada cliente."],
            ["Cuidado", "Atenção ao acabamento, à escolha dos itens e à experiência de quem recebe."],
            ["Afeto", "Criações feitas para aproximar pessoas por meio de gestos significativos."],
            ["Memórias especiais", "Detalhes que tornam a entrega marcante, doce e difícil de esquecer."],
          ].map(([title, description], index) => (
            <article className="motion-item is-visible" key={title} style={{ "--stagger": index } as CSSProperties}>
              <h3>{title}</h3>
              <p>{description}</p>
            </article>
          ))}
        </div>
      </Reveal>

      <Reveal className="cta-band">
        <p className="eyebrow">Feito sob encomenda</p>
        <h2>Um presente Villa Dolce começa com uma boa conversa.</h2>
        <a className="button primary" href={whatsappUrl(defaultMessage)} target="_blank" rel="noopener noreferrer">
          Falar pelo WhatsApp
        </a>
      </Reveal>
    </>
  );
}

function ContactPage() {
  const [form, setForm] = useState({
    nome: "",
    ocasiao: "",
    estilo: "",
    preferencias: "",
  });

  function updateField(field: keyof typeof form, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function submitForm(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const fields = [
      ["Nome", form.nome],
      ["Ocasião", form.ocasiao],
      ["Estilo do presente", form.estilo],
      ["Preferências", form.preferencias],
    ].filter(([, value]) => value.trim().length > 0);

    const messageLines = [defaultMessage];

    if (fields.length > 0) {
      messageLines.push("", "Informações para orçamento:");
      fields.forEach(([label, value]) => messageLines.push(`${label}: ${value}`));
    }

    window.open(whatsappUrl(messageLines.join("\n")), "_blank", "noopener");
  }

  return (
    <>
      <Reveal className="page-hero">
        <p className="eyebrow">Contato</p>
        <h1>Vamos criar uma encomenda personalizada?</h1>
        <p>
          Conte a ocasião, o estilo do presente, as preferências de sabores, tons e detalhes especiais.
          A Villa Dolce prepara uma proposta sob medida para tornar o gesto memorável.
        </p>
      </Reveal>

      <Reveal className="contact-section">
        <div className="contact-panel motion-item is-visible">
          <h2>Fale pelo WhatsApp</h2>
          <p>Envie sua mensagem com antecedência para que cada detalhe possa ser pensado com cuidado.</p>
          <a className="button primary full" href={whatsappUrl(defaultMessage)} target="_blank" rel="noopener noreferrer">
            Abrir WhatsApp
          </a>
          <div className="contact-lines">
            <p>
              <strong>Instagram</strong>
              <a href="https://www.instagram.com/villadolceatelie" target="_blank" rel="noopener noreferrer">
                @villadolceatelie
              </a>
            </p>
            <p>
              <strong>Cidade</strong>
              <span>Vera Cruz - BA e Salvador - BA</span>
            </p>
            <p>
              <strong>Atendimento</strong>
              <span>Segunda a sexta, das 08:00 às 18:00</span>
            </p>
            <p>
              <strong>Observações</strong>
              <span>Cestas afetivas, delícias artesanais, presentes personalizados e corporativos feitos sob encomenda.</span>
            </p>
          </div>
        </div>

        <form className="contact-form motion-item is-visible" onSubmit={submitForm}>
          <h2>Informações para orçamento</h2>
          <label>
            Nome
            <input type="text" value={form.nome} placeholder="Seu nome" onChange={(event) => updateField("nome", event.target.value)} />
          </label>
          <label>
            Ocasião
            <input
              type="text"
              value={form.ocasiao}
              placeholder="Aniversário, agradecimento, data especial..."
              onChange={(event) => updateField("ocasiao", event.target.value)}
            />
          </label>
          <label>
            Estilo do presente
            <input
              type="text"
              value={form.estilo}
              placeholder="Delicado, clássico, romântico, corporativo..."
              onChange={(event) => updateField("estilo", event.target.value)}
            />
          </label>
          <label>
            Preferências
            <textarea
              value={form.preferencias}
              rows={5}
              placeholder="Sabores, cores, itens desejados, restrições ou detalhes importantes"
              onChange={(event) => updateField("preferencias", event.target.value)}
            />
          </label>
          <button className="button secondary full" type="submit">
            Enviar pelo WhatsApp
          </button>
        </form>
      </Reveal>
    </>
  );
}
