import { catalogItems, type CatalogGroup, type CatalogItem } from "@/data/catalog";
import {
  chatBusiness,
  chatCategories,
  chatOccasions,
  chatStopWords,
  chatStyles,
  productAliases,
} from "@/data/chatKnowledge";

export type ChatAction = {
  label: string;
  type: "reply" | "navigate" | "whatsapp" | "reset";
  value: string;
};

export type ChatContent = {
  text: string;
  actions?: ChatAction[];
  products?: CatalogItem[];
};

export type ChatSession = {
  awaiting?: "product" | "occasion" | "style";
  occasion?: string;
  occasionLabel?: string;
};

export type ChatAnswer = {
  content: ChatContent;
  session: ChatSession;
};

const mainActions: ChatAction[] = [
  { label: "Explorar catálogo", type: "reply", value: "catalog:start" },
  { label: "Escolher um presente", type: "reply", value: "gift:start" },
  { label: "Como encomendar", type: "reply", value: "order" },
];

const standardFooterActions: ChatAction[] = [
  { label: "Voltar ao início", type: "reset", value: "reset" },
  { label: "Falar pelo WhatsApp", type: "whatsapp", value: defaultWhatsappMessage() },
];

export function initialChatContent(): ChatContent {
  return {
    text: "Olá! Que bom ter você na Villa Dolce Ateliê. Escolha uma opção abaixo ou escreva sua dúvida do seu jeito.",
    actions: mainActions,
  };
}

export function answerChatAction(value: string, session: ChatSession): ChatAnswer {
  if (value === "catalog:start") return categoryMenu(0);
  if (value.startsWith("catalog:menu:")) return categoryMenu(Number(value.split(":")[2]) || 0);
  if (value === "gift:start") return occasionMenu(0);
  if (value === "search:start") {
    return answer(
      "Digite o nome ou uma característica do produto que procura. Por exemplo: brownie, biscoito, presente com chocolate ou mini bolo.",
      { awaiting: "product" },
      [{ label: "Ver categorias", type: "reply", value: "catalog:start" }],
    );
  }
  if (value === "order") return orderAnswer(session);
  if (value === "service") return serviceAnswer(session);
  if (value === "feedback") return feedbackAnswer(session);
  if (value.startsWith("category:")) {
    const [, group, offset] = value.split(":");
    return categoryResults(group as CatalogGroup, Number(offset) || 0);
  }
  if (value.startsWith("occasion:menu:")) return occasionMenu(Number(value.split(":")[2]) || 0);
  if (value.startsWith("occasion:")) return styleMenu(value.replace("occasion:", ""), 0);
  if (value.startsWith("style:menu:")) {
    const [, , occasionId, offset] = value.split(":");
    return styleMenu(occasionId, Number(offset) || 0, session.occasionLabel);
  }
  if (value.startsWith("style:")) return giftResults(session, value.replace("style:", ""));

  return fallbackAnswer(session);
}

export function answerChatText(input: string, session: ChatSession): ChatAnswer {
  const query = normalize(input);
  if (!query) return fallbackAnswer(session);

  if (hasAny(query, ["inicio", "menu", "comecar", "recomecar", "voltar"])) {
    return { content: initialChatContent(), session: {} };
  }

  if (hasAny(query, ["reclamacao", "reclamar", "problema", "errado", "faltou", "atrasou", "estragado", "danificado", "insatisfeito", "insatisfeita", "nao gostei"])) {
    return answer(
      "Sinto muito que sua experiência não tenha acontecido como esperado. Para que a Villa Dolce possa entender e cuidar da situação, fale diretamente pelo WhatsApp e informe seu nome e pedido.",
      {},
      standardFooterActions,
    );
  }

  if (hasAny(query, ["alergia", "alergico", "alergica", "intolerancia", "lactose", "gluten", "ingrediente", "restricao alimentar", "vegano", "vegetariano", "sem acucar", "diabetico", "castanha", "amendoim"])) {
    return answer(
      "Para sua segurança, ingredientes, alergênicos e possíveis adaptações precisam ser confirmados diretamente com a Villa Dolce. Informe qualquer restrição alimentar antes de fazer a encomenda.",
      session,
      standardFooterActions,
    );
  }

  if (hasAny(query, ["preco", "valor", "quanto custa", "quanto fica", "tabela de preco", "orcamento", "barato", "caro"])) {
    return answer(
      "Os valores são definidos conforme o produto, quantidade, personalização e detalhes da encomenda. Posso levar suas preferências para uma consulta de orçamento pelo WhatsApp.",
      session,
      standardFooterActions,
    );
  }

  if (hasAny(query, ["prazo", "disponibilidade", "quando fica pronto", "antecedencia", "data", "para hoje", "ainda hoje", "amanha", "urgente", "ultima hora"])) {
    return answer(
      "O prazo e a disponibilidade dependem da data, do produto escolhido e da quantidade. A confirmação segura é feita diretamente pela Villa Dolce no WhatsApp.",
      session,
      standardFooterActions,
    );
  }

  if (hasAny(query, ["entrega", "entregam", "delivery", "retirada", "buscar", "onde fica", "localizacao", "endereco", "salvador", "vera cruz", "cidade", "taxa de entrega", "frete"])) {
    return answer(
      `A Villa Dolce atende em ${chatBusiness.locations}. Entrega, retirada, disponibilidade para cada região e possíveis valores são confirmados pelo WhatsApp.`,
      session,
      standardFooterActions,
    );
  }

  if (hasAny(query, ["horario", "que horas", "abre", "funciona", "atendimento hoje"])) {
    return answer(`O atendimento acontece de ${chatBusiness.hours}.`, session, standardFooterActions);
  }

  if (hasAny(query, ["pagamento", "pagar", "pix", "cartao", "credito", "debito", "dinheiro", "parcelar", "parcelamento", "sinal"])) {
    return answer(
      "As formas e condições de pagamento precisam ser confirmadas diretamente com a Villa Dolce, pois podem variar conforme a encomenda. Posso abrir o WhatsApp para você consultar.",
      session,
      standardFooterActions,
    );
  }

  if (hasAny(query, ["quantidade minima", "pedido minimo", "minimo", "atacado", "muitas unidades", "cem unidades", "100 unidades"])) {
    return answer(
      "A quantidade mínima e as condições para pedidos maiores dependem do produto e da data. Informe o item, a quantidade e o dia desejado para a Villa Dolce avaliar a produção.",
      session,
      standardFooterActions,
    );
  }

  if (hasAny(query, ["validade", "conservar", "conservacao", "guardar", "geladeira", "dura quanto", "armazenar"])) {
    return answer(
      "A conservação e a validade mudam conforme cada produto. Para receber uma orientação segura, confirme o item escolhido diretamente com a Villa Dolce e siga as instruções entregues com a encomenda.",
      session,
      standardFooterActions,
    );
  }

  if (hasAny(query, ["cancelar", "cancelamento", "alterar pedido", "mudar pedido", "trocar data", "trocar sabor", "corrigir pedido"])) {
    return answer(
      "Alterações ou cancelamentos de uma encomenda existente precisam ser tratados diretamente pelo WhatsApp. Informe seu nome, a data combinada e o que precisa ser ajustado.",
      session,
      [{ label: "Falar sobre meu pedido", type: "whatsapp", value: "Olá! Preciso falar sobre uma encomenda que já fiz na Villa Dolce." }],
    );
  }

  if (hasAny(query, ["instagram", "rede social", "perfil", "insta", "seguir"])) {
    return answer(
      `O Instagram da Villa Dolce é ${chatBusiness.instagram}. Lá você pode acompanhar novidades e inspirações das criações.`,
      session,
      standardFooterActions,
    );
  }

  if (hasAny(query, ["quem e voce", "voce e robo", "voce e humano", "assistente virtual", "como funciona o chat"])) {
    return answer(
      "Sou o assistente virtual da Villa Dolce. Uso as informações do próprio site para ajudar com catálogo, presentes e dúvidas frequentes. Para confirmar detalhes comerciais, encaminho você ao atendimento humano pelo WhatsApp.",
      session,
      standardFooterActions,
    );
  }

  if (hasAny(query, ["corporativo", "empresa", "equipe", "funcionario", "cliente da empresa"])) {
    return answer(
      "A Villa Dolce trabalha com presentes e composições corporativas sob encomenda. Informe quantidade, data, ocasião e tipo de personalização para receber uma proposta adequada.",
      session,
      [
        { label: "Ver opções", type: "reply", value: "category:cestas-caixas:0" },
        ...standardFooterActions,
      ],
    );
  }

  if (hasAny(query, ["personalizar", "personalizado", "personalizada", "cor", "laco", "mensagem", "sabor"])) {
    return answer(
      "As encomendas podem ser pensadas conforme a ocasião, preferências, estilo e intenção do presente. Cores, composição, sabores e disponibilidade são confirmados diretamente com a Villa Dolce.",
      session,
      standardFooterActions,
    );
  }

  if (hasAny(query, ["feedback", "avaliacao", "avaliar", "depoimento", "mural"])) return feedbackAnswer(session);
  if (
    hasAny(query, [
      "whatsapp",
      "whats",
      "wpp",
      "zap",
      "falar com alguem",
      "falar com atendente",
      "falar no atendimento",
      "atendimento humano",
      "pessoa de verdade",
    ])
  ) {
    return humanServiceAnswer(session);
  }
  if (hasAny(query, ["pedido", "encomenda", "encomendar", "comprar"])) return orderAnswer(session);

  const requestedStyle = chatStyles.find((style) => style.terms.some((term) => includesTerm(query, normalize(term))));
  if (session.awaiting === "style" && requestedStyle) return giftResults(session, requestedStyle.id);

  const directProducts = searchProducts(query);
  if (directProducts.length > 0 && (session.awaiting === "product" || hasProductTerm(query))) {
    return productSearchAnswer(directProducts, session);
  }

  const category = chatCategories.find((item) => item.terms.some((term) => includesTerm(query, term)));
  if (category && hasAny(query, ["catalogo", "categoria", "opcao", "produto", "tem", "mostrar", ...category.terms])) {
    return categoryResults(category.id, 0);
  }

  const occasion = chatOccasions.find((item) => item.terms.some((term) => includesTerm(query, normalize(term))));
  if (occasion && hasAny(query, ["presente", "quero", "preciso", "procurando", ...occasion.terms])) {
    return styleMenu(occasion.id, 0);
  }

  if (session.awaiting === "occasion") {
    return styleMenu("carinho", 0, input.trim());
  }

  if (hasAny(query, ["catalogo", "categorias", "produtos", "cardapio", "opcoes"])) return categoryMenu(0);
  if (hasAny(query, ["presente", "presentear", "sugestao", "recomenda", "indica", "ocasiao"])) return occasionMenu(0);

  if (session.awaiting === "product") return productSearchAnswer(directProducts, session);

  if (hasAny(query, ["oi", "ola", "bom dia", "boa tarde", "boa noite", "tudo bem"])) {
    return { content: initialChatContent(), session: {} };
  }

  if (hasAny(query, ["obrigado", "obrigada", "valeu", "agradeco"])) {
    return answer("Por nada! Quando precisar, estarei aqui para ajudar com sua escolha Villa Dolce.", {}, mainActions);
  }

  return fallbackAnswer(session);
}

function categoryMenu(offset: number): ChatAnswer {
  const categories = chatCategories.slice(offset, offset + 3);
  const actions: ChatAction[] = categories.map((category) => ({
    label: category.label,
    type: "reply",
    value: `category:${category.id}:0`,
  }));

  if (offset + 3 < chatCategories.length) {
    actions.push({ label: "Mais categorias", type: "reply", value: `catalog:menu:${offset + 3}` });
  } else if (offset > 0) {
    actions.push({ label: "Categorias anteriores", type: "reply", value: "catalog:menu:0" });
  }

  return answer(
    "Qual tipo de criação você deseja conhecer? Você também pode digitar o nome de qualquer produto.",
    {},
    actions,
  );
}

function categoryResults(group: CatalogGroup, offset: number): ChatAnswer {
  const category = chatCategories.find((item) => item.id === group);
  const items = catalogItems.filter((item) => item.group === group);
  const products = items.slice(offset, offset + 3);
  const actions: ChatAction[] = [];

  if (offset + 3 < items.length) actions.push({ label: "Mostrar mais", type: "reply", value: `category:${group}:${offset + 3}` });
  actions.push({ label: "Outras categorias", type: "reply", value: "catalog:start" });
  actions.push({ label: "Falar pelo WhatsApp", type: "whatsapp", value: defaultWhatsappMessage(category?.label) });

  return {
    content: {
      text: `Estas são algumas opções de ${category?.label.toLowerCase() ?? "nosso catálogo"}:`,
      products,
      actions,
    },
    session: {},
  };
}

function occasionMenu(offset: number): ChatAnswer {
  const occasions = chatOccasions.slice(offset, offset + 3);
  const actions: ChatAction[] = occasions.map((occasion) => ({
    label: occasion.label,
    type: "reply",
    value: `occasion:${occasion.id}`,
  }));

  if (offset + 3 < chatOccasions.length) {
    actions.push({ label: "Mais ocasiões", type: "reply", value: `occasion:menu:${offset + 3}` });
  } else if (offset > 0) {
    actions.push({ label: "Ocasiões anteriores", type: "reply", value: "occasion:menu:0" });
  }

  return answer(
    "Para qual ocasião você procura um presente? Se preferir, escreva a ocasião no campo abaixo.",
    { awaiting: "occasion" },
    actions,
  );
}

function styleMenu(occasionId: string, offset: number, occasionLabel?: string): ChatAnswer {
  const occasion = chatOccasions.find((item) => item.id === occasionId);
  const styles = chatStyles.slice(offset, offset + 3);
  const actions: ChatAction[] = styles.map((style) => ({
    label: style.label,
    type: "reply",
    value: `style:${style.id}`,
  }));

  if (offset + 3 < chatStyles.length) {
    actions.push({ label: "Mais estilos", type: "reply", value: `style:menu:${occasionId}:${offset + 3}` });
  } else if (offset > 0) {
    actions.push({ label: "Estilos anteriores", type: "reply", value: `style:menu:${occasionId}:0` });
  }

  return answer(
    "Entendi. Qual estilo de presente combina melhor com esse momento?",
    { occasion: occasionId, occasionLabel: occasionLabel ?? occasion?.label, awaiting: "style" },
    actions,
  );
}

function giftResults(session: ChatSession, styleId: string): ChatAnswer {
  const occasion = chatOccasions.find((item) => item.id === session.occasion) ?? chatOccasions[chatOccasions.length - 1];
  const occasionLabel = session.occasionLabel ?? occasion.label;
  const style = chatStyles.find((item) => item.id === styleId) ?? chatStyles[chatStyles.length - 1];
  const styleRank = new Map<string, number>(
    style.products.map((id, index) => [id, style.products.length - index]),
  );
  const occasionProducts: readonly string[] = occasion.products;
  const products = [...catalogItems]
    .map((item) => ({
      item,
      score:
        (styleRank.get(item.id) ?? 0) * 4 +
        (occasionProducts.includes(item.id) ? 10 : 0) +
        occasion.terms.filter((term) => normalize(item.occasions).includes(normalize(term))).length * 3,
    }))
    .sort((a, b) => b.score - a.score || a.item.title.localeCompare(b.item.title, "pt-BR"))
    .slice(0, 3)
    .map(({ item }) => item);

  const whatsappMessage = `Olá! Vim pelo assistente do site da Villa Dolce.\n\nOcasião: ${occasionLabel}\nEstilo desejado: ${style.label}\nGostaria de consultar opções, disponibilidade e orçamento.`;
  return {
    content: {
      text: `Pensando em ${occasionLabel.toLowerCase()}, estas opções seguem o estilo “${style.label.toLowerCase()}”. A composição final pode ser personalizada com a Villa Dolce.`,
      products,
      actions: [
        { label: "Escolher outra ocasião", type: "reply", value: "gift:start" },
        { label: "Consultar pelo WhatsApp", type: "whatsapp", value: whatsappMessage },
      ],
    },
    session: { occasion: occasion.id, occasionLabel },
  };
}

function productSearchAnswer(products: CatalogItem[], session: ChatSession): ChatAnswer {
  if (products.length === 0) {
    return answer(
      "Ainda não encontrei essa opção no catálogo. Posso mostrar nossas categorias ou levar você diretamente ao atendimento da Villa Dolce.",
      { awaiting: "product" },
      [
        { label: "Ver categorias", type: "reply", value: "catalog:start" },
        { label: "Tentar outra busca", type: "reply", value: "search:start" },
        { label: "Falar pelo WhatsApp", type: "whatsapp", value: defaultWhatsappMessage() },
      ],
    );
  }

  return {
    content: {
      text: products.length === 1 ? "Encontrei esta opção no catálogo:" : "Encontrei algumas opções relacionadas à sua busca:",
      products: products.slice(0, 3),
      actions: [
        { label: "Procurar outro produto", type: "reply", value: "search:start" },
        { label: "Ver categorias", type: "reply", value: "catalog:start" },
      ],
    },
    session: { ...session, awaiting: undefined },
  };
}

function orderAnswer(session: ChatSession): ChatAnswer {
  return answer(
    "As criações Villa Dolce são preparadas sob encomenda. Para solicitar um orçamento, informe a ocasião, produto ou estilo desejado, quantidade, data, preferências e local de entrega ou retirada.",
    session,
    [
      { label: "Escolher um produto", type: "reply", value: "catalog:start" },
      { label: "Iniciar pedido", type: "whatsapp", value: defaultWhatsappMessage() },
      { label: "Voltar ao início", type: "reset", value: "reset" },
    ],
  );
}

function humanServiceAnswer(session: ChatSession): ChatAnswer {
  return answer(
    "Claro. Você pode continuar diretamente com o atendimento da Villa Dolce pelo WhatsApp.",
    session,
    [
      { label: "Abrir WhatsApp", type: "whatsapp", value: defaultWhatsappMessage() },
      { label: "Voltar ao início", type: "reset", value: "reset" },
    ],
  );
}

function serviceAnswer(session: ChatSession): ChatAnswer {
  return answer(
    `A Villa Dolce atende em ${chatBusiness.locations}, de ${chatBusiness.hours}. Valores, disponibilidade, entrega e retirada são confirmados pelo WhatsApp.`,
    session,
    [
      { label: "Como encomendar", type: "reply", value: "order" },
      { label: "Abrir WhatsApp", type: "whatsapp", value: defaultWhatsappMessage() },
      { label: "Voltar ao início", type: "reset", value: "reset" },
    ],
  );
}

function feedbackAnswer(session: ChatSession): ChatAnswer {
  return answer(
    "Você pode conhecer as histórias compartilhadas no Mural de Carinho ou contar como foi sua experiência com a Villa Dolce.",
    session,
    [
      { label: "Abrir Mural de Carinho", type: "navigate", value: "/feedbacks" },
      { label: "Voltar ao início", type: "reset", value: "reset" },
    ],
  );
}

function fallbackAnswer(session: ChatSession): ChatAnswer {
  return answer(
    "Ainda não encontrei essa informação no catálogo. Posso mostrar nossas categorias, ajudar a escolher um presente ou levar você ao atendimento pelo WhatsApp.",
    session,
    [
      { label: "Ver categorias", type: "reply", value: "catalog:start" },
      { label: "Escolher um presente", type: "reply", value: "gift:start" },
      { label: "Falar pelo WhatsApp", type: "whatsapp", value: defaultWhatsappMessage() },
    ],
  );
}

function searchProducts(query: string): CatalogItem[] {
  const tokens = query.split(" ").filter((token) => token.length > 2 && !chatStopWords.has(token));

  return catalogItems
    .map((item) => {
      const title = normalize(item.title);
      const haystack = normalize(`${item.title} ${item.description} ${item.occasions}`);
      const aliases = productAliases[item.id] ?? [];
      let score = 0;

      if (query.includes(title)) score += 24;
      aliases.forEach((alias) => {
        const normalizedAlias = normalize(alias);
        if (includesTerm(query, normalizedAlias)) score += normalizedAlias.includes(" ") ? 16 : 11;
      });
      tokens.forEach((token) => {
        if (title.split(" ").includes(token)) score += 7;
        else if (haystack.includes(token)) score += 2;
      });

      return { item, score };
    })
    .filter(({ score }) => score >= 7)
    .sort((a, b) => b.score - a.score || a.item.title.localeCompare(b.item.title, "pt-BR"))
    .map(({ item }) => item);
}

function hasProductTerm(query: string) {
  return Object.values(productAliases).some((aliases) => aliases.some((alias) => includesTerm(query, normalize(alias))));
}

function includesTerm(query: string, term: string) {
  return ` ${query} `.includes(` ${term} `) || query.includes(term);
}

function hasAny(query: string, terms: string[]) {
  return terms.some((term) => includesTerm(query, normalize(term)));
}

function normalize(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function answer(text: string, session: ChatSession, actions?: ChatAction[]): ChatAnswer {
  return { content: { text, actions }, session };
}

function defaultWhatsappMessage(subject?: string) {
  return `Olá! Vim pelo assistente do site da Villa Dolce${subject ? ` e gostaria de informações sobre ${subject}` : " e gostaria de informações sobre uma encomenda personalizada"}.`;
}
