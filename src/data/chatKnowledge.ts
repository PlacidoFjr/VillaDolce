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
  {
    id: "aniversario",
    label: "Aniversário",
    terms: ["aniversario", "festa de aniversario", "parabens", "celebracao", "comemoracao"],
    products: ["mini-bolo-presente", "mini-vulcao", "mini-cake-donuts", "cestas-afetivas"],
  },
  {
    id: "agradecimento",
    label: "Agradecimento",
    terms: ["agradecimento", "agradecer", "obrigado pelo presente", "retribuir", "reconhecimento"],
    products: ["cestas-afetivas", "caixas-presenteaveis", "biscoitos-amanteigados", "doces-finos"],
  },
  {
    id: "romantico",
    label: "Romance e Dia dos Namorados",
    terms: ["romantico", "romantica", "namorado", "namorada", "namoro", "dia dos namorados", "amor", "paixao", "bodas", "noivado"],
    products: ["mega-bombom", "trufas", "caixas-presenteaveis", "doces-finos"],
  },
  {
    id: "familia",
    label: "Família e afeto",
    terms: ["dia das maes", "dia dos pais", "mae", "mamae", "pai", "papai", "avo", "avó", "familia", "irma", "irmao"],
    products: ["cestas-afetivas", "mini-bolo-presente", "caixas-presenteaveis", "capsula-cappuccino"],
  },
  {
    id: "casamento",
    label: "Casamento e noivado",
    terms: ["casamento", "casar", "noivado", "noivos", "madrinha", "padrinho", "cha de panela", "cha bar"],
    products: ["doces-finos", "trufas", "caixas-presenteaveis", "cestas-afetivas"],
  },
  {
    id: "nascimento",
    label: "Nascimento e maternidade",
    terms: ["nascimento", "nasceu", "bebe", "maternidade", "gestante", "gravida", "cha de bebe", "boas vindas"],
    products: ["cestas-afetivas", "biscoitos-amanteigados", "caixas-presenteaveis", "doces-finos"],
  },
  {
    id: "corporativo",
    label: "Corporativo",
    terms: ["corporativo", "empresa", "equipe", "funcionario", "colaborador", "cliente", "evento empresarial", "confraternizacao"],
    products: ["caixas-presenteaveis", "biscoitos-amanteigados", "capsula-cappuccino", "brownie-bites"],
  },
  {
    id: "lembrancinha",
    label: "Lembrancinha e evento",
    terms: ["lembrancinha", "lembranca", "evento", "festa", "quantidade", "convidados", "brinde"],
    products: ["biscoitos-amanteigados", "mini-cake-donuts", "pipoca-gourmet", "trufas"],
  },
  {
    id: "visita",
    label: "Visita e café",
    terms: ["visita", "cafe", "encontro", "receber em casa", "cafe da tarde", "reuniao"],
    products: ["biscoitos-amanteigados", "sequilho-salgado", "capsula-cappuccino", "brownie-bites"],
  },
  {
    id: "datas-especiais",
    label: "Datas comemorativas",
    terms: ["natal", "pascoa", "sao joao", "formatura", "professores", "dia do professor", "fim de ano", "data comemorativa"],
    products: ["cestas-afetivas", "caixas-presenteaveis", "doces-finos", "biscoitos-amanteigados"],
  },
  {
    id: "carinho",
    label: "Apenas um carinho",
    terms: ["carinho", "apoio", "surpresa", "presente", "melhoras", "saudade", "amizade", "amiga", "amigo"],
    products: ["cestas-afetivas", "caixas-presenteaveis", "mini-bolo-presente", "trufas"],
  },
] as const;

export const chatStyles = [
  { id: "cesta", label: "Cesta completa", terms: ["cesta", "cesta completa", "variedade"], products: ["cestas-afetivas", "caixas-presenteaveis"] },
  { id: "caixa", label: "Caixa elegante", terms: ["caixa", "elegante", "sofisticado", "sofisticada"], products: ["caixas-presenteaveis", "doces-finos", "trufas"] },
  { id: "chocolate", label: "Com chocolates", terms: ["chocolate", "chocolates", "bombom", "trufa"], products: ["trufas", "brownie-bites", "mega-bombom", "doces-finos", "capsula-cappuccino"] },
  { id: "biscoito", label: "Com biscoitos", terms: ["biscoito", "biscoitos", "sequilho", "cafe"], products: ["biscoitos-amanteigados", "sequilho-salgado", "pastelzinho-doce"] },
  { id: "bolo", label: "Com bolo", terms: ["bolo", "bolinho", "vulcao", "donuts"], products: ["mini-bolo-presente", "mini-vulcao", "mini-cake-donuts"] },
  { id: "surpresa", label: "Ainda não sei", terms: ["nao sei", "surpresa", "me ajuda", "qualquer", "sugestao"], products: [] },
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
