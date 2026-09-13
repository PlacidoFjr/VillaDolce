import type { CatalogGroup } from "@/data/catalog";

export const chatBusiness = {
  locations: "Vera Cruz e Salvador, BA",
  hours: "segunda a sexta, das 08:00 às 18:00",
  instagram: "@villadolceatelie",
};

export const chatCategories: Array<{ id: CatalogGroup; label: string; terms: string[] }> = [
  { id: "cestas-caixas", label: "Cestas e caixas", terms: ["cesta", "cestas", "caixa", "caixas", "kit", "kits"] },
  { id: "biscoitos", label: "Biscoitos", terms: ["biscoito", "biscoitos", "sequilho", "amanteigado", "amanteigados"] },
  { id: "doces-chocolates", label: "Doces e chocolates", terms: ["doce", "doces", "chocolate", "chocolates", "bombom", "trufa"] },
  { id: "sobremesas", label: "Sobremesas", terms: ["sobremesa", "sobremesas", "mousse", "pudim", "tortinha"] },
  { id: "salgados", label: "Salgados", terms: ["salgado", "salgados", "empada salgada"] },
  { id: "bolos-donuts", label: "Bolos e donuts", terms: ["bolo", "bolos", "donut", "donuts", "vulcao"] },
];

export const chatOccasions = [
  { id: "aniversario", label: "Aniversário", terms: ["aniversario", "celebracao", "comemoracao"] },
  { id: "agradecimento", label: "Agradecimento", terms: ["agradecimento", "agradecer", "carinho"] },
  { id: "romantico", label: "Romântico", terms: ["romantico", "romantica", "namorado", "namorada", "amor"] },
  { id: "corporativo", label: "Corporativo", terms: ["corporativo", "empresa", "equipe", "cliente"] },
  { id: "lembrancinha", label: "Lembrancinha", terms: ["lembrancinha", "lembranca", "evento"] },
  { id: "visita", label: "Visita especial", terms: ["visita", "cafe", "encontro"] },
  { id: "carinho", label: "Apenas um carinho", terms: ["carinho", "apoio", "surpresa", "presente"] },
] as const;

export const chatStyles = [
  { id: "cesta", label: "Cesta completa", products: ["cestas-afetivas", "caixas-presenteaveis"] },
  { id: "caixa", label: "Caixa elegante", products: ["caixas-presenteaveis", "doces-finos", "trufas"] },
  { id: "chocolate", label: "Com chocolates", products: ["trufas", "brownie-bites", "mega-bombom", "doces-finos", "capsula-cappuccino"] },
  { id: "biscoito", label: "Com biscoitos", products: ["biscoitos-amanteigados", "sequilho-salgado", "pastelzinho-doce"] },
  { id: "bolo", label: "Com bolo", products: ["mini-bolo-presente", "mini-vulcao", "mini-cake-donuts"] },
  { id: "surpresa", label: "Ainda não sei", products: [] },
] as const;

export const productAliases: Record<string, string[]> = {
  "cestas-afetivas": ["cesta", "cestas", "cesta presente", "kit presente"],
  "caixas-presenteaveis": ["caixa", "caixa presente", "caixa presenteavel", "kit"],
  "biscoitos-amanteigados": ["biscoito", "biscoitos", "amanteigado", "amanteigados"],
  "sequilho-salgado": ["sequilho", "sequilho salgado", "biscoito salgado"],
  "pastelzinho-doce": ["pastel", "pastel doce", "pastelzinho"],
  "empada-doce": ["empada doce", "empadinha doce"],
  "empada-salgada": ["empada", "empada salgada", "empadinha"],
  mousses: ["mousse", "mousses"],
  tortinhas: ["torta", "tortinha", "tortinhas"],
  pudim: ["pudim"],
  "mini-cake-donuts": ["donut", "donuts", "mini donut", "mini cake donut", "rosquinha"],
  "mini-vulcao": ["vulcao", "bolo vulcao", "mini vulcao"],
  "mini-bolo-presente": ["mini bolo", "bolo presente", "bolinho"],
  "doces-finos": ["doce fino", "doces finos", "docinho", "docinhos"],
  trufas: ["trufa", "trufas"],
  "capsula-cappuccino": ["capsula", "cappuccino", "capsula de cappuccino"],
  "brownie-bites": ["brownie", "brownies", "brownie bites"],
  "mega-bombom": ["bombom", "mega bombom", "bombom grande"],
  "pipoca-gourmet": ["pipoca", "pipoca doce", "pipoca gourmet"],
};

export const chatStopWords = new Set([
  "a", "ao", "as", "com", "da", "das", "de", "do", "dos", "e", "eu", "me", "o", "os", "para", "por", "pra", "que", "quero", "tem", "uma", "um", "voces",
]);
