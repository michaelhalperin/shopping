import type { Category, Product, StoreMeta } from "../types";

export const ILS = "₪";

export const storeMeta: StoreMeta = {
  title: "דג מלוח | בני ברק",
  rating: 8.8,
  closesAt: "16:00",
  deliveryEtaMin: 35,
  deliveryEtaMax: 45,
  minOrder: 50,
  fees: { processingPercent: 5, deliveryFee: 10 },
};

export const categories: Category[] = [
  { id: "designed-fish-platters", name: "פלטות דגים מעוצבות" },
  { id: "smoked-fish", name: "דגים מעושנים פרוסים" },
  { id: "salads", name: "סלטי דגים" },
];

// Use a reliable placeholder CDN to avoid occasional 403/404 from hotlinked images
const productImage = (idx: number) =>
  `https://picsum.photos/seed/fish-${idx}/800/600`;

export const products: Product[] = Array.from({ length: 8 }).map((_, idx) => ({
  id: `p${idx + 1}`,
  name: `${idx % 2 === 0 ? "פלטת דגים מעושנים" : "מארז דגים מעושנים"} | ${
    (idx % 5) + 5
  } סועדים`,
  imageUrl: productImage(idx),
  price: [165, 125, 295, 220, 185, 205, 260, 240][idx % 8],
  weightGrams: [550, 350, 1000, 750, 650, 700, 800, 900][idx % 8],
  per100gPrice: Number((Math.random() * (36 - 28) + 28).toFixed(2)),
}));

export const mostOrdered: Product[] = products.slice(0, 2);
