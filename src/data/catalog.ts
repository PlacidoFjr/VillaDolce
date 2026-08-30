export type CatalogItem = {
  id: string;
  group: CatalogGroup;
  title: string;
  description: string;
  occasions: string;
  message: string;
};

export type CatalogGroup = "cestas-caixas" | "biscoitos" | "doces-chocolates" | "sobremesas" | "salgados" | "bolos-donuts";

const whatsappMessage = (title: string) =>
  `Olá, vim pelo site da Villa Dolce Ateliê e gostaria de consultar ${title} para uma encomenda personalizada.\n\nCategoria: ${title}\nPode me ajudar com opções e orçamento?`;

export const catalogItems: CatalogItem[] = [
  {
    id: "cestas-afetivas",
    group: "cestas-caixas",
    title: "Cestas Afetivas",
    description:
      "Composições pensadas para transformar carinho em presença, reunindo delícias, detalhes visuais e escolhas personalizadas.",
    occasions:
      "aniversários, agradecimentos, boas-vindas, autocuidado, visitas especiais e gestos de apoio.",
    message: whatsappMessage("Cestas Afetivas"),
  },
  {
    id: "caixas-presenteaveis",
    group: "cestas-caixas",
    title: "Caixa Presenteável",
    description:
      "Uma opção elegante para presentear com intenção, acabamento delicado e seleção feita conforme a ocasião.",
    occasions:
      "lembranças corporativas, madrinhas, convites especiais, celebrações íntimas e agradecimentos.",
    message: whatsappMessage("Caixa Presenteável"),
  },
  {
    id: "biscoitos-amanteigados",
    group: "biscoitos",
    title: "Biscoitos Amanteigados",
    description:
      "Biscoitos delicados, com textura leve e sabor clássico, preparados para acompanhar cafés, lembranças e presentes afetivos.",
    occasions:
      "cafés da tarde, lembrancinhas, kits personalizados, encontros delicados e presentes de carinho.",
    message: whatsappMessage("Biscoitos Amanteigados"),
  },
  {
    id: "sequilho-salgado",
    group: "biscoitos",
    title: "Sequilho Salgado",
    description:
      "Uma opção salgada leve e charmosa, feita para compor kits, cafés especiais e momentos simples com acabamento cuidadoso.",
    occasions:
      "cafés especiais, encontros, kits corporativos, lembranças afetivas e composições sob encomenda.",
    message: whatsappMessage("Sequilho Salgado"),
  },
  {
    id: "pastelzinho-doce",
    group: "doces-chocolates",
    title: "Pastelzinho Doce",
    description:
      "Pastelzinhos doces preparados para trazer aconchego e sabor de celebração, com recheios pensados para cada pedido.",
    occasions:
      "aniversários, cafés, mesas de doces, presentes personalizados e momentos de celebração.",
    message: whatsappMessage("Pastelzinho Doce"),
  },
  {
    id: "empada-doce",
    group: "doces-chocolates",
    title: "Empada Doce",
    description:
      "Empadas doces com massa delicada e recheios especiais, pensadas para surpreender em presentes e mesas afetivas.",
    occasions:
      "cafés, aniversários, lembranças personalizadas, caixas presenteáveis e encontros especiais.",
    message: whatsappMessage("Empada Doce"),
  },
  {
    id: "empada-salgada",
    group: "salgados",
    title: "Empada Salgada",
    description:
      "Empadas salgadas feitas sob encomenda, com sabor acolhedor e apresentação cuidadosa para cafés, reuniões e kits.",
    occasions:
      "cafés especiais, reuniões, aniversários, lembranças corporativas e kits presenteáveis.",
    message: whatsappMessage("Empada Salgada"),
  },
  {
    id: "mousses",
    group: "sobremesas",
    title: "Mousses",
    description:
      "Sobremesas cremosas e delicadas, ideais para compor celebrações leves, lembranças doces e pedidos personalizados.",
    occasions:
      "aniversários, almoços especiais, cafés, encontros familiares e mesas de sobremesa.",
    message: whatsappMessage("Mousses"),
  },
  {
    id: "tortinhas",
    group: "sobremesas",
    title: "Tortinhas",
    description:
      "Tortinhas individuais com visual delicado e sabor marcante, perfeitas para presentear ou servir em momentos especiais.",
    occasions:
      "cafés, aniversários, datas comemorativas, encontros íntimos e caixas personalizadas.",
    message: whatsappMessage("Tortinhas"),
  },
  {
    id: "pudim",
    group: "sobremesas",
    title: "Pudim",
    description:
      "Um clássico afetivo em apresentação especial, feito para levar conforto, memória e sabor às encomendas da Villa Dolce.",
    occasions:
      "almoços em família, aniversários, presentes afetivos, celebrações íntimas e momentos de carinho.",
    message: whatsappMessage("Pudim"),
  },
  {
    id: "mini-cake-donuts",
    group: "bolos-donuts",
    title: "Mini Cake Donuts",
    description:
      "Mini donuts delicados e presenteáveis, com cobertura charmosa e sabores escolhidos para deixar a experiência mais doce.",
    occasions:
      "aniversários, lembrancinhas, cafés especiais, kits personalizados e celebrações descontraídas.",
    message: whatsappMessage("Mini Cake Donuts"),
  },
  {
    id: "mini-vulcao",
    group: "bolos-donuts",
    title: "Mini Vulcão",
    description:
      "Mini bolos vulcão em porções especiais, com cobertura generosa e visual convidativo para presentes cheios de sabor.",
    occasions:
      "aniversários, datas especiais, surpresas afetivas, cafés e encomendas personalizadas.",
    message: whatsappMessage("Mini Vulcão"),
  },
  {
    id: "mini-bolo-presente",
    group: "bolos-donuts",
    title: "Mini Bolo para Presente",
    description:
      "Bolos pequenos e elegantes, preparados para presentear com delicadeza, sabor e acabamento pensado nos detalhes.",
    occasions:
      "aniversários, agradecimentos, comemorações íntimas, boas-vindas e presentes personalizados.",
    message: whatsappMessage("Mini Bolo para Presente"),
  },
  {
    id: "doces-finos",
    group: "doces-chocolates",
    title: "Doces Finos",
    description:
      "Doces de apresentação refinada para compor caixas, cestas e mesas afetivas com um toque elegante e memorável.",
    occasions:
      "casamentos, aniversários, eventos, lembranças especiais, kits boutique e celebrações sofisticadas.",
    message: whatsappMessage("Doces Finos"),
  },
  {
    id: "trufas",
    group: "doces-chocolates",
    title: "Trufas",
    description:
      "Trufas delicadas e marcantes, com recheios especiais para compor presentes sofisticados e momentos de doçura.",
    occasions:
      "presentes românticos, lembrancinhas, datas especiais, caixas personalizadas e celebrações afetivas.",
    message: whatsappMessage("Trufas"),
  },
  {
    id: "capsula-cappuccino",
    group: "doces-chocolates",
    title: "Cápsula de Cappuccino",
    description:
      "Uma delicadeza para acompanhar cafés e presentes, ideal para quem gosta de sabores aconchegantes e experiências afetivas.",
    occasions:
      "cafés especiais, kits de inverno, cestas afetivas, lembranças corporativas e presentes de cuidado.",
    message: whatsappMessage("Cápsula de Cappuccino"),
  },
  {
    id: "brownie-bites",
    group: "doces-chocolates",
    title: "Brownie Bites",
    description:
      "Pequenas porções de brownie com sabor intenso, pensadas para compor presentes, caixas e momentos de puro aconchego.",
    occasions:
      "aniversários, cafés, kits presenteáveis, encontros, lembranças corporativas e mesas de doces.",
    message: whatsappMessage("Brownie Bites"),
  },
  {
    id: "mega-bombom",
    group: "doces-chocolates",
    title: "Mega Bombom",
    description:
      "Bombom generoso e marcante, preparado para surpreender com recheio especial, presença visual e sabor de celebração.",
    occasions:
      "presentes românticos, aniversários, datas especiais, surpresas afetivas e encomendas personalizadas.",
    message: whatsappMessage("Mega Bombom"),
  },
  {
    id: "pipoca-gourmet",
    group: "doces-chocolates",
    title: "Pipoca Gourmet",
    description:
      "Pipoca doce preparada para presentear, com sabor delicado e acabamento ideal para kits, lembranças e composições especiais.",
    occasions:
      "lembrancinhas, aniversários, cafés especiais, eventos, kits corporativos e presentes afetivos.",
    message: whatsappMessage("Pipoca Gourmet"),
  },
];
