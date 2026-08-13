export type CatalogItem = {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  occasions: string;
  message: string;
};

const whatsappMessage = (title: string) =>
  `Olá, vim pelo site da Villa Dolce Ateliê e gostaria de consultar ${title} para uma encomenda personalizada.\n\nCategoria: ${title}\nPode me ajudar com opções e orçamento?`;

export const catalogItems: CatalogItem[] = [
  {
    id: "cestas-afetivas",
    eyebrow: "Categoria 01",
    title: "Cestas Afetivas",
    description:
      "Composições pensadas para transformar carinho em presença, reunindo delícias, detalhes visuais e escolhas personalizadas.",
    occasions:
      "aniversários, agradecimentos, boas-vindas, autocuidado, visitas especiais e gestos de apoio.",
    message: whatsappMessage("Cestas Afetivas"),
  },
  {
    id: "caixas-presenteaveis",
    eyebrow: "Categoria 02",
    title: "Caixa Presenteável",
    description:
      "Uma opção elegante para presentear com intenção, acabamento delicado e seleção feita conforme a ocasião.",
    occasions:
      "lembranças corporativas, madrinhas, convites especiais, celebrações íntimas e agradecimentos.",
    message: whatsappMessage("Caixa Presenteável"),
  },
  {
    id: "biscoito-amanteigado",
    eyebrow: "Categoria 03",
    title: "Biscoito Amanteigado",
    description:
      "Biscoitos delicados, com textura leve e sabor clássico, ideais para compor presentes afetivos ou mesas especiais.",
    occasions:
      "cafés da tarde, lembrancinhas, kits personalizados, encontros delicados e presentes de carinho.",
    message: whatsappMessage("Biscoito Amanteigado"),
  },
  {
    id: "sequilho-salgado",
    eyebrow: "Categoria 04",
    title: "Sequilho Salgado",
    description:
      "Uma versão delicada e surpreendente para quem prefere sabores salgados, com apresentação simples, charmosa e artesanal.",
    occasions:
      "cafés especiais, encontros, kits corporativos, lembranças afetivas e composições sob encomenda.",
    message: whatsappMessage("Sequilho Salgado"),
  },
  {
    id: "pastel-doce",
    eyebrow: "Categoria 05",
    title: "Pastel Doce",
    description:
      "Pastéis doces preparados para trazer aconchego e sabor de celebração, com recheios pensados para cada pedido.",
    occasions:
      "aniversários, cafés, mesas de doces, presentes personalizados e momentos de celebração.",
    message: whatsappMessage("Pastel Doce"),
  },
  {
    id: "empada-doce-salgada",
    eyebrow: "Categoria 06",
    title: "Empada Doce e Salgada",
    description:
      "Empadas em versões doces e salgadas, feitas sob encomenda para compor presentes, cafés e encontros com cuidado.",
    occasions:
      "cafés especiais, reuniões, aniversários, lembranças corporativas e kits presenteáveis.",
    message: whatsappMessage("Empada Doce e Salgada"),
  },
  {
    id: "mini-cake-donuts",
    eyebrow: "Categoria 07",
    title: "Mini Cake Donuts",
    description:
      "Mini donuts delicados e presenteáveis, com cobertura charmosa e sabores escolhidos para deixar a experiência mais doce.",
    occasions:
      "aniversários, lembrancinhas, cafés especiais, kits personalizados e celebrações descontraídas.",
    message: whatsappMessage("Mini Cake Donuts"),
  },
  {
    id: "mini-vulcao",
    eyebrow: "Categoria 08",
    title: "Mini Vulcão",
    description:
      "Mini bolos vulcão em porções especiais, com cobertura generosa e visual convidativo para presentes cheios de sabor.",
    occasions:
      "aniversários, datas especiais, surpresas afetivas, cafés e encomendas personalizadas.",
    message: whatsappMessage("Mini Vulcão"),
  },
  {
    id: "mini-bolo-presente",
    eyebrow: "Categoria 09",
    title: "Mini Bolo para Presente",
    description:
      "Bolos pequenos e elegantes, preparados para presentear com delicadeza, sabor e acabamento pensado nos detalhes.",
    occasions:
      "aniversários, agradecimentos, comemorações íntimas, boas-vindas e presentes personalizados.",
    message: whatsappMessage("Mini Bolo para Presente"),
  },
  {
    id: "doces-finos",
    eyebrow: "Categoria 10",
    title: "Doces Finos",
    description:
      "Doces de apresentação refinada para compor caixas, cestas e mesas afetivas com um toque elegante e memorável.",
    occasions:
      "casamentos, aniversários, eventos, lembranças especiais, kits boutique e celebrações sofisticadas.",
    message: whatsappMessage("Doces Finos"),
  },
  {
    id: "pipoca-gourmet",
    eyebrow: "Categoria 11",
    title: "Pipoca Gourmet",
    description:
      "Pipoca doce preparada para presentear, com sabor delicado e acabamento ideal para kits, lembranças e composições especiais.",
    occasions:
      "lembrancinhas, aniversários, cafés especiais, eventos, kits corporativos e presentes afetivos.",
    message: whatsappMessage("Pipoca Gourmet"),
  },
  {
    id: "brownie-bites",
    eyebrow: "Categoria 12",
    title: "Brownie Bites",
    description:
      "Pequenas porções de brownie com sabor intenso, pensadas para compor presentes, caixas e momentos de puro aconchego.",
    occasions:
      "aniversários, cafés, kits presenteáveis, encontros, lembranças corporativas e mesas de doces.",
    message: whatsappMessage("Brownie Bites"),
  },
  {
    id: "mega-bombom",
    eyebrow: "Categoria 13",
    title: "Mega Bombom",
    description:
      "Bombom generoso e marcante, preparado para surpreender com recheio especial, presença visual e sabor de celebração.",
    occasions:
      "presentes românticos, aniversários, datas especiais, surpresas afetivas e encomendas personalizadas.",
    message: whatsappMessage("Mega Bombom"),
  },
  {
    id: "capsula-cappuccino",
    eyebrow: "Categoria 14",
    title: "Cápsula de Cappuccino",
    description:
      "Uma delicadeza para acompanhar cafés e presentes, ideal para quem gosta de sabores aconchegantes e experiências afetivas.",
    occasions:
      "cafés especiais, kits de inverno, cestas afetivas, lembranças corporativas e presentes de cuidado.",
    message: whatsappMessage("Cápsula de Cappuccino"),
  },
];
