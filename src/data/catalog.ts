export type CatalogItem = {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  occasions: string;
  placeholder?: string;
  images?: Array<{
    src: string;
    alt: string;
  }>;
  message: string;
};

const base = "/assets/produtos/";

export const catalogItems: CatalogItem[] = [
  {
    id: "cestas-afetivas",
    eyebrow: "Categoria 01",
    title: "Cestas Afetivas",
    placeholder: "[FOTO_CESTAS_AFETIVAS]",
    description:
      "Cestas elaboradas para expressar carinho com uma seleção delicada de produtos, sabores e detalhes visuais.",
    occasions:
      "aniversários, agradecimentos, boas-vindas, autocuidado, visitas especiais e gestos de apoio.",
    message:
      "Olá, vim pelo site da Villa Dolce Ateliê e gostaria de consultar uma Cesta Afetiva personalizada.\n\nCategoria: Cestas Afetivas\nPode me ajudar com opções e orçamento?",
  },
  {
    id: "caixas-presenteaveis",
    eyebrow: "Categoria 02",
    title: "Caixas Presenteáveis",
    placeholder: "[FOTO_CAIXAS_PRESENTEAVEIS]",
    description:
      "Caixas refinadas para presentes objetivos, elegantes e cheios de significado, com acabamento boutique.",
    occasions:
      "lembranças corporativas, madrinhas, convites especiais, celebrações íntimas e agradecimentos.",
    message:
      "Olá, vim pelo site da Villa Dolce Ateliê e gostaria de consultar uma Caixa Presenteável personalizada.\n\nCategoria: Caixas Presenteáveis\nPode me ajudar com opções e orçamento?",
  },
  {
    id: "delicias-artesanais",
    eyebrow: "Categoria 03",
    title: "Delícias Artesanais",
    images: [
      {
        src: `${base}WhatsApp Image 2026-07-19 at 16.06.23.jpeg`,
        alt: "Biscoitos artesanais recheados em prato",
      },
      {
        src: `${base}WhatsApp Image 2026-07-19 at 16.06.23 (1).jpeg`,
        alt: "Biscoitos artesanais de chocolate recheados",
      },
      {
        src: `${base}WhatsApp Image 2026-07-19 at 16.06.23 (2).jpeg`,
        alt: "Pote personalizado de biscoitos artesanais Villa Dolce",
      },
    ],
    description:
      "Doces e delicadezas preparados para compor presentes, mesas afetivas ou lembranças de celebrações especiais.",
    occasions:
      "aniversários, encontros, datas comemorativas, cafés especiais e momentos de celebração.",
    message:
      "Olá, vim pelo site da Villa Dolce Ateliê e gostaria de consultar Delícias Artesanais para uma encomenda.\n\nCategoria: Delícias Artesanais\nPode me ajudar com opções e orçamento?",
  },
  {
    id: "datas-especiais",
    eyebrow: "Categoria 04",
    title: "Datas Especiais",
    placeholder: "[FOTO_DATAS_ESPECIAIS]",
    description:
      "Edições pensadas para momentos sazonais, mantendo a identidade delicada da Villa Dolce em cada composição.",
    occasions:
      "Dia das Mães, Dia dos Namorados, Natal, Páscoa, Dia dos Professores e celebrações familiares.",
    message:
      "Olá, vim pelo site da Villa Dolce Ateliê e gostaria de consultar uma criação para Data Especial.\n\nCategoria: Datas Especiais\nPode me ajudar com opções e orçamento?",
  },
  {
    id: "personalizados",
    eyebrow: "Categoria 05",
    title: "Personalizados",
    placeholder: "[FOTO_PERSONALIZADOS]",
    description:
      "Criações exclusivas para quem deseja um presente sob medida, com escolha de tons, itens, mensagem e apresentação.",
    occasions:
      "pedidos especiais, eventos, kits corporativos, lembranças personalizadas e surpresas afetivas.",
    message:
      "Olá, vim pelo site da Villa Dolce Ateliê e gostaria de consultar uma criação personalizada sob medida.\n\nCategoria: Personalizados\nPode me ajudar com opções e orçamento?",
  },
  {
    id: "donuts-artesanais",
    eyebrow: "Categoria 06",
    title: "Donuts",
    images: [
      {
        src: `${base}WhatsApp Image 2026-07-19 at 16.06.22 (2).jpeg`,
        alt: "Donuts artesanais variados em embalagens transparentes",
      },
      {
        src: `${base}WhatsApp Image 2026-07-19 at 16.06.21 (4).jpeg`,
        alt: "Donuts artesanais em caixa com laço",
      },
      {
        src: `${base}WhatsApp Image 2026-07-19 at 16.06.22 (1).jpeg`,
        alt: "Donuts artesanais decorados com chocolate e confeitos",
      },
    ],
    description:
      "Donuts preparados sob encomenda, com acabamento delicado e sabores pensados para presentear ou compor celebrações.",
    occasions:
      "aniversários, cafés especiais, lembranças afetivas, kits presenteáveis e encontros personalizados.",
    message:
      "Olá, vim pelo site da Villa Dolce Ateliê e gostaria de consultar Donuts para uma encomenda.\n\nCategoria: Donuts\nPode me ajudar com opções e orçamento?",
  },
  {
    id: "pipoca-doce-artesanal",
    eyebrow: "Categoria 07",
    title: "Pipoca Doce",
    images: [
      {
        src: `${base}pipoca doce.jpeg`,
        alt: "Pipoca doce artesanal embalada com logo Villa Dolce",
      },
      {
        src: `${base}pipoca doce 31.jpeg`,
        alt: "Pipoca doce artesanal em pote",
      },
      {
        src: `${base}WhatsApp Image 2026-07-19 at 16.06.21 (3).jpeg`,
        alt: "Pote com pipoca doce e logo Villa Dolce",
      },
    ],
    description:
      "Pipoca doce delicada, preparada para lembranças afetivas, kits presenteáveis e composições personalizadas.",
    occasions:
      "lembrancinhas, aniversários, cafés especiais, eventos, kits corporativos e presentes de carinho.",
    message:
      "Olá, vim pelo site da Villa Dolce Ateliê e gostaria de consultar Pipoca Doce para uma encomenda.\n\nCategoria: Pipoca Doce\nPode me ajudar com opções e orçamento?",
  },
];
