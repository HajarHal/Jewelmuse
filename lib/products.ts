// ─────────────────────────────────────────────────────────────
// Jewel Muse — catalogue produits
// Les prix sont en dirham marocain (MAD).
//
// Chaque produit possède un tableau `media` qui peut contenir
// PLUSIEURS photos et/ou UNE vidéo. La galerie produit permet de
// faire défiler ces médias (swipe sur mobile, flèches sur ordinateur).
//
// Pour AJOUTER UNE VIDÉO à un produit :
//   1) Déposez le fichier .mp4 dans /public/products/ (ex : montre-perle.mp4)
//   2) Ajoutez une entrée vidéo dans `media`, en premier ou n'importe où :
//        { type: "video", url: "/products/montre-perle.mp4", poster: "/products/montre-perle-main.jpg" }
//   Le « poster » est l'image affichée avant la lecture (facultatif).
// ─────────────────────────────────────────────────────────────

export type MediaItem =
  | { type: "image"; url: string }
  | { type: "video"; url: string; poster?: string };

export type Product = {
  id: number;
  name: string;
  slug: string;
  description: string;
  descriptionAr?: string;
  price: number;
  oldPrice?: number;
  media: MediaItem[]; // le premier média sert de visuel principal
  category: string;
  colors: string[];
  material: string;
  stock: number;
  featured?: boolean;
};

const img = (url: string): MediaItem => ({ type: "image", url });

export const products: Product[] = [
  {
    id: 1,
    name: "Collier Cygne & Bracelet Tennis & bracelet Tulipe",
    slug: "parure-cygne",
    description:
      "Ensemble de bijoux élégant composé d’un collier et de deux bracelets assortis. Le collier est orné d’un délicat pendentif cygne serti de cristaux scintillants, accompagné d’un bracelet style vigne et d’un bracelet tennis classique",
    descriptionAr:
     " طقم مجوهرات أنيق يتكون من عقد وسوارين متناسقين. يتميز العقد بتعليقة على شكل بجعة مزينة بكريستالات لامعة، مع سوار بتصميم زهرة التوليب وسوار تينس كلاسيكي",
    price: 189,
    media: [
      img("/products/parure-cygne-1.jpg"),
      img("/products/parure-cygne-2.jpg"),
    ],
    category: "Colliers",
    colors: ["Gold"],
    material: "Acier innoxydable",
    stock: 1,
    featured: true,
  },
  {
    id: 2,
    name: "Set Collier Fleur & Bracelet Tennis",
    slug: "collier-medaillon-fleur",
    description:
      "Collier pendentif fleur ajouré en or + bracelet tennis en cristaux blancs",
      descriptionAr: "قلادة زهرة ذهبية مفرغة+ سوار تنس بكريستال أبيض ",
    price: 169,
    media: [
      img("/products/medaillon-soie.jpg"),
      img("/products/medaillon-reel-2.jpeg"),
    ],
    category: "Colliers",
    colors: ["Gold / White"],
    material: "Acier inoxydable",
    stock: 1,
  },
  {
    id: 3,
    name: "Set Cœur Or & Émeraude",
    slug: "collier-coeur",
    description : "Set : collier cœur + bracelet cœur + bracelet pierre verte + bague cœur + boucles d'oreilles cœur dorées",
    descriptionAr :" طقم: قلادة قلب + سوار قلب + سوار بحجر أخضر + خاتم قلب + أقراط قلب ذهبية",
    price: 199,
    media: [
      img("/products/coeur-soie.jpg"),
      img("/products/coeur-reel-2.jpg"),
      
    ],
    category: "Colliers",
    colors: ["Gold"],
    material: "Acier innoxydable",
    stock: 1,
  },
   {
    id: 4,
    name: "Montre Serpent Gold & Bracelet Tennis & Bracelet Tulipe",
    slug: "montre-serpent-gold",
    description:
      " montre carrée dorée avec bracelet cristal + bracelet Tennis doré + bracelet Tulipe",
    descriptionAr: "ساعة مربعة ذهبية بسوار مرصع بالكريستال + سوار تينيس ذهبي + سوار التوليب الذهبي",
    price: 189,
    media: [
      img("/products/serpant-montre2.jpg"),
      img("/products/serpant-montre3.jpg"),
     
    ],
    category: "Montres",
    colors: ["Gold"],
    material: "Acier innoxydable",
    stock: 1,
  },
  {
    id: 5,
    name: " Montre Rectangle & Bracelet Papillonv & Bracelet Tennis",
    slug: "coffret-montre-perles",
    description:
      "Montre rectangulaire dorée + bracelet fin avec pendentif papillon + Bracelet Tennis ",
    descriptionAr: "ساعة مستطيلة ذهبية + سوار رفيع مع قلادة فراشة + سوار التوليب الذهبي",
    price: 189,
    media: [
      img("/products/rectangle2.jpg"),
    ],
    category: "Montres",
    colors: ["Gold / Pearl"],
    material: "Perles d'eau douce · Acier Innoxydable",
    stock: 1,
  },
  {
    id: 6,
    name: "Montre ovale & Bracelet Tennis & Bracelet Tulipe ",
    slug: "jonc-torsade",
    description:
      "montre ovale dorée avec cristaux + bracelet Tennis doré + bracelet Tulipe",
    descriptionAr: "ساعة بيضاوية ذهبية مرصعة بالكريستال + سوار زهرة التوليب + سوار تينيس ذهبي",
    price: 189,
    media: [
      img("/products/gold-watch-2.jpg"),
      img("/product/goldwatch.jpg"),
      img("/product/goldwatch2.jpg"),
     
    ],
    category: "Montres",
    colors: ["gold"],
    material: "Acier innoxydable",
    stock: 1,
  },
  {
    id: 7,
    name: "Montre Serpent & Macramé",
    slug: "coffret-montre-serpent",
    description:
      " Montre dorée forme goutte avec cristaux + bracelet macramé noir",
    descriptionAr: "ساعة ذهبية على شكل قطرة مع كريستالات + سوار ماكرامي أسود",
    price: 179,
    media: [
      img("/products/serpannt2.png"),
    ],
    category: "Watches",
    colors: ["Gold / Black"],
    material: "Acier innoxydable · Cristaux · Cuir",
    stock: 1,
  },
  {
    id: 8,
    name: "Collier Pendentif Carré",
    slug: "collier-pendentif-carre",
    description:
      " Collier chaîne fine dorée avec pendentif carré à pierre noire",
    descriptionAr: "قلادة سلسلة ذهبية رفيعة بقلادة مربعة وحجر أسود",
    price: 99,
    oldPrice: 125,
    media: [
      img("/products/carre-buste.jpg"),
      img("/products/coolier_pendat.jpeg"),
    ],
    category: "Colliers",
    colors: ["Noir onyx"],
    material: "Acier innoxydable",
    stock: 1,
  },
  {
    id: 9,
    name: "Collier Soleil",
    slug: "collier-soleil",
    description:
      "Collier chaîne dorée avec pendentif soleil et pierre noire centrale",
    descriptionAr: "قلادة سلسلة ذهبية بقلادة على شكل شمس مع حجر أسود في الوسط",
    price: 99,
    oldPrice: 125,
    media: [
      img("/products/soleil-reel-2.jpg"),
      img("/products/soleil-reel-1.jpg"),
      
    ],
    category: "Colliers",
    colors: ["Gold"],
    material: "Acier innoxydable",
    stock: 1,
    featured: true,
  },
  {
    id: 10,
    name: "Collier Perles & Fleur Or",
    slug: "collier-perles-fleur-or",
    description:
      "Collier de perles avec pendentif fleur en or",
    descriptionAr: "عقد لؤلؤ بقلادة زهرة ذهبية",
    price: 99,
    oldPrice: 125,
    media: [
      img("/products/fleur-buste.jpg"),
      img("/products/collierblanc.jpeg"),
    ],
    category: "Colliers",
    colors: ["Gold / Pearl"],
    material: "Perles d'eau douce · Acier innoxydable",
    stock: 1,
    featured: true,
  },
  

  {
    id: 11,     

    name: "Collier Chaîne Or",
    slug: "collier-maille-rectangle",
    description:
      "Collier chaîne dorée style maillons rectangulaires",
    descriptionAr: "قلادة سلسلة ذهبية على شكل حلقات مستطيلة",
    price: 99,
    oldPrice: 125,
    media: [
      img("/products/maille-buste.jpg"),
   
    ],
    category: "Colliers",
    colors: ["Or"],
    material: "Acier inoxydable plaqué or",
    stock: 22,
  },
  
  
  {
    id: 12,
    name: "Bague & Bracelet Géométrique",
    slug: "bague-bracelet-geometrique",
    description:
      "Bracelet chaîne doré texturé + bague géométrique en X dorée",
    descriptionAr: "سوار سلسلة ذهبي منسَّج + خاتم هندسي على شكل X ذهبي",
    price: 149,
    media: [
      img("/products/jonc-reel-0.jpg"),
      img("/products/jonc-reel-2.jpg"),
     
    ],
    category: "Bracelets",
    colors: ["Gold"],
    material: "Acier innoxydable",
    stock: 1,
  },
  
 
  {
    id: 13,
    name: "Tulip Bracelet",
    slug: "tulip-bracelet",
    description:
      "Bracelet doré avec pendentif fleur de tulipe et strass",
    descriptionAr: "سوار ذهبي مع قلادة زهرة التوليب وستراس",
    price: 55,
    media: [
      img("/products/tulip.jpeg"),
     
    ],
    category: "Bracelets",
    colors: ["Gold"],
    material: "Acier innoxydable",
    stock: 1,
  },
  
  
];

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getFeaturedProducts(): Product[] {
  return products.filter((p) => p.featured);
}

/** Premier média de type image — sert de visuel de couverture. */
export function coverImage(product: Product): string {
  const firstImage = product.media.find((m) => m.type === "image");
  if (firstImage) return firstImage.url;
  // sinon, le poster de la vidéo
  const firstVideo = product.media.find((m) => m.type === "video") as
    | Extract<MediaItem, { type: "video" }>
    | undefined;
  return firstVideo?.poster ?? "/products/parure-cygne-1.jpg";
}

export function hasVideo(product: Product): boolean {
  return product.media.some((m) => m.type === "video");
}

export function formatMAD(value: number): string {
  return `${value.toLocaleString("fr-FR")} MAD`;
}

