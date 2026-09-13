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
  awaiting?: "product" | "occasion";
  occasion?: string;
};

export type ChatAnswer = {
  content: ChatContent;
  session: ChatSession;
};

const mainActions: ChatAction[] = [
  { label: "Ver catálogo", type: "reply", value: "catalog:start" },
  { label: "Escolher um presente", type: "reply", value: "gift:start" },
  { label: "Procurar produto", type: "reply", value: "search:start" },
  { label: "Como encomendar", type: "reply", value: "order" },
  { label: "Atendimento", type: "reply", value: "service" },
  { label: "Feedbacks", type: "reply", value: "feedback" },
];

const standardFooterActions: ChatAction[] = [
  { label: "Voltar ao início", type: "reset", value: "reset" },
  { label: "Falar pelo WhatsApp", type: "whatsapp", value: defaultWhatsappMessage() },
];

export function initialChatContent(): ChatContent {
  return {
    text: "Olá! Que bom ter você na Villa Dolce Ateliê. Posso ajudar você a conhecer nossas delícias, escolher um presente ou iniciar uma encomenda.",
    actions: mainActions,
  };
}

export function answerChatAction(value: string, session: ChatSession): ChatAnswer {
  if (value === "catalog:start") return categoryMenu();
  if (value === "gift:start") return occasionMenu();
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
  if (value.startsWith("occasion:")) return styleMenu(value.replace("occasion:", ""));
  if (value.startsWith("style:")) return giftResults(session.occasion, value.replace("style:", ""));

  return fallbackAnswer(session);
}

export function answerChatText(input: string, session: ChatSession): ChatAnswer {
  const query = normalize(input);
  if (!query) return fallbackAnswer(session);

  if (hasAny(query, ["inicio", "menu", "comecar", "recomecar", "voltar"])) {
    return { content: initialChatContent(), session: {} };
  }

  if (hasAny(query, ["reclamacao", "problema", "errado", "insatisfeito", "insatisfeita", "nao gostei"])) {
    return answer(
      "Sinto muito que sua experiência não tenha acontecido como esperado. Para que a Villa Dolce possa entender e cuidar da situação, fale diretamente pelo WhatsApp e informe seu nome e pedido.",
      {},
      standardFooterActions,
    );
  }

  if (hasAny(query, ["alergia", "alergico", "alergica", "intolerancia", "lactose", "gluten", "ingrediente", "restricao alimentar"])) {
    return answer(
      "Para sua segurança, ingredientes, alergênicos e possíveis adaptações precisam ser confirmados diretamente com a Villa Dolce. Informe qualquer restrição alimentar antes de fazer a encomenda.",
      session,
      standardFooterActions,
    );
  }

  if (hasAny(query, ["preco", "valor", "quanto custa", "tabela de preco", "orcamento"])) {
    return answer(
      "Os valores são definidos conforme o produto, quantidade, personalização e detalhes da encomenda. Posso levar suas preferências para uma consulta de orçamento pelo WhatsApp.",
      session,
      standardFooterActions,
    );
  }

  if (hasAny(query, ["prazo", "disponibilidade", "quando fica pronto", "antecedencia", "data"])) {
    return answer(
      "O prazo e a disponibilidade dependem da data, do produto escolhido e da quantidade. A confirmação segura é feita diretamente pela Villa Dolce no WhatsApp.",
      session,
      standardFooterActions,
    );
  }

  if (hasAny(query, ["entrega", "retirada", "onde fica", "localizacao", "salvador", "vera cruz", "cidade"])) {
    return answer(
      `A Villa Dolce atende em ${chatBusiness.locations}. Entrega, retirada, disponibilidade para cada região e possíveis valores são confirmados pelo WhatsApp.`,
      session,
      standardFooterActions,
    );
  }

  if (hasAny(query, ["horario", "que horas", "abre", "funciona", "atendimento hoje"])) {
    return answer(`O atendimento acontece de ${chatBusiness.hours}.`, session, standardFooterActions);
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
  if (hasAny(query, ["pedido", "encomenda", "encomendar", "comprar", "whatsapp", "falar com alguem"])) return orderAnswer(session);

  const directProducts = searchProducts(query);
  if (directProducts.length > 0 && (session.awaiting === "product" || hasProductTerm(query))) {
    return productSearchAnswer(directProducts, session);
  }

  const category = chatCategories.find((item) => item.terms.some((term) => includesTerm(query, term)));
  if (category && hasAny(query, ["catalogo", "categoria", "opcao", "produto", "tem", "mostrar", ...category.terms])) {
    return categoryResults(category.id, 0);
  }

  const occasion = chatOccasions.find((item) => item.terms.some((term) => includesTerm(query, term)));
  if (occasion && hasAny(query, ["presente", "quero", "preciso", "procurando", ...occasion.terms])) {
    return styleMenu(occasion.id);
  }

  if (hasAny(query, ["catalogo", "categorias", "produtos", "cardapio", "opcoes"])) return categoryMenu();
  if (hasAny(query, ["presente", "presentear", "sugestao", "recomenda", "indica", "ocasiao"])) return occasionMenu();

  if (session.awaiting === "product") return productSearchAnswer(directProducts, session);

  if (hasAny(query, ["oi", "ola", "bom dia", "boa tarde", "boa noite", "tudo bem"])) {
    return { content: initialChatContent(), session: {} };
  }

  if (hasAny(query, ["obrigado", "obrigada", "valeu", "agradeco"])) {
    return answer("Por nada! Quando precisar, estarei aqui para ajudar com sua escolha Villa Dolce.", {}, mainActions);
  }

  return fallbackAnswer(session);
}

function categoryMenu(): ChatAnswer {
  return answer(
    "Qual tipo de criação você deseja conhecer?",
    {},
    chatCategories.map((category) => ({ label: category.label, type: "reply", value: `category:${category.id}:0` })),
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

function occasionMenu(): ChatAnswer {
  return answer(
    "Para qual ocasião você procura um presente?",
    { awaiting: "occasion" },
    chatOccasions.map((occasion) => ({ label: occasion.label, type: "reply", value: `occasion:${occasion.id}` })),
  );
}

function styleMenu(occasionId: string): ChatAnswer {
  const occasion = chatOccasions.find((item) => item.id === occasionId);
  return answer(
    `Ótimo${occasion ? `, para ${occasion.label.toLowerCase()}` : ""}. Qual estilo de presente combina melhor?`,
    { occasion: occasionId },
    chatStyles.map((style) => ({ label: style.label, type: "reply", value: `style:${style.id}` })),
  );
}

function giftResults(occasionId = "carinho", styleId: string): ChatAnswer {
  const occasion = chatOccasions.find((item) => item.id === occasionId) ?? chatOccasions[chatOccasions.length - 1];
  const style = chatStyles.find((item) => item.id === styleId) ?? chatStyles[chatStyles.length - 1];
  const styleRank = new Map<string, number>(
    style.products.map((id, index) => [id, style.products.length - index]),
  );
  const products = [...catalogItems]
    .map((item) => ({
      item,
      score: (styleRank.get(item.id) ?? 0) * 4 + occasion.terms.filter((term) => normalize(item.occasions).includes(term)).length * 3,
    }))
    .sort((a, b) => b.score - a.score || a.item.title.localeCompare(b.item.title, "pt-BR"))
    .slice(0, 3)
    .map(({ item }) => item);

  const whatsappMessage = `Olá! Vim pelo assistente do site da Villa Dolce.\n\nOcasião: ${occasion.label}\nEstilo desejado: ${style.label}\nGostaria de consultar opções, disponibilidade e orçamento.`;
  return {
    content: {
      text: `Para ${occasion.label.toLowerCase()}, estas opções seguem o estilo “${style.label.toLowerCase()}”. A composição final pode ser personalizada com a Villa Dolce.`,
      products,
      actions: [
        { label: "Escolher outra ocasião", type: "reply", value: "gift:start" },
        { label: "Consultar pelo WhatsApp", type: "whatsapp", value: whatsappMessage },
      ],
    },
    session: { occasion: occasion.id },
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
