const IMG = (id: string) =>
  `https://images.unsplash.com/photo-${id}?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=85&w=900`;

const HOOKAH = IMG('TzzuDSO81Ko');
const SMOKE_COALS = IMG('UVtEndlShxA');
const GRAY_HOOKAH = IMG('OUGqm1DjYIc');
const GREY_FIRE = IMG('Ke6eNtGG018');
const TABLE_HOOKAH = IMG('Sw7dClRfLk0');

export type ShishaProduct = {
  id: string;
  name: string;
  description: string;
  price: number;
  category: 'pipes' | 'flavours' | 'charcoal' | 'accessories' | 'bundles';
  image: string;
  stock: number;
  is_available: boolean;
  featured?: boolean;
};

export const shishaProducts: ShishaProduct[] = [
  {
    id: 'p1',
    name: 'Khalil Mamoon Mini Hookah',
    description: 'Authentic Egyptian handmade mini hookah. Perfect for home sessions and small spaces. Thick clouds, traditional build.',
    price: 4500,
    category: 'pipes',
    image: HOOKAH,
    stock: 12,
    is_available: true,
    featured: true,
  },
  {
    id: 'p2',
    name: 'Khalil Mamoon Full Size Hookah',
    description: 'Full-size Egyptian hookah with thick glass base. Delivers dense clouds and smooth draws. A Kenyan classic.',
    price: 8500,
    category: 'pipes',
    image: SMOKE_COALS,
    stock: 8,
    is_available: true,
    featured: true,
  },
  {
    id: 'p3',
    name: 'Amy Deluxe Pharaoh Hookah',
    description: 'German-engineered Amy Deluxe with premium crystal base and adjustable diffuser. Sleek, modern, easy to clean.',
    price: 11000,
    category: 'pipes',
    image: GRAY_HOOKAH,
    stock: 5,
    is_available: true,
    featured: true,
  },
  {
    id: 'p4',
    name: 'MYA QT Mini Hookah',
    description: 'Compact and portable acrylic hookah. Ideal for travel, balconies, and small apartments. Easy setup.',
    price: 4200,
    category: 'pipes',
    image: GREY_FIRE,
    stock: 15,
    is_available: true,
  },
  {
    id: 'p5',
    name: 'Shisha Carry Case',
    description: 'Padded travel carry case designed for mini and travel hookahs. Protects your pipe on the go.',
    price: 1800,
    category: 'pipes',
    image: TABLE_HOOKAH,
    stock: 20,
    is_available: true,
  },
  {
    id: 'f1',
    name: 'Al Fakher Double Apple 50g',
    description: "Kenya's favourite shisha flavour. Red apple with a hint of aniseed. Smooth and balanced.",
    price: 450,
    category: 'flavours',
    image: TABLE_HOOKAH,
    stock: 60,
    is_available: true,
  },
  {
    id: 'f2',
    name: 'Al Fakher Double Apple 250g',
    description: 'Double Apple economy jar, 250g. Great value for regular sessions.',
    price: 1300,
    category: 'flavours',
    image: TABLE_HOOKAH,
    stock: 35,
    is_available: true,
  },
  {
    id: 'f3',
    name: 'Al Fakher Mint 250g',
    description: 'Cool, refreshing mint. Excellent on its own or mixed with fruit flavours.',
    price: 1300,
    category: 'flavours',
    image: SMOKE_COALS,
    stock: 40,
    is_available: true,
  },
  {
    id: 'f4',
    name: 'Al Fakher Grape Mint 250g',
    description: 'Sweet grape with a crisp minty finish. A bestseller among Nairobi shisha lovers.',
    price: 1300,
    category: 'flavours',
    image: SMOKE_COALS,
    stock: 30,
    is_available: true,
  },
  {
    id: 'f5',
    name: 'Starbuzz Blue Mist 100g',
    description: 'Blueberries fused with cool mint. Produces thick, flavourful clouds. Premium US blend.',
    price: 950,
    category: 'flavours',
    image: GRAY_HOOKAH,
    stock: 25,
    is_available: true,
  },
  {
    id: 'f6',
    name: 'Fumari White Gummi Bear 100g',
    description: 'Sweet gummy bear candy flavour. Smooth, dessert-like shisha experience.',
    price: 1100,
    category: 'flavours',
    image: GREY_FIRE,
    stock: 20,
    is_available: true,
  },
  {
    id: 'f7',
    name: 'Al Fakher Watermelon 250g',
    description: 'Juicy summer watermelon. Light, refreshing and perfect for warm Kenyan evenings.',
    price: 1300,
    category: 'flavours',
    image: TABLE_HOOKAH,
    stock: 28,
    is_available: true,
  },
  {
    id: 'c1',
    name: 'Coco Nara Natural Charcoal 1kg',
    description: 'Quick-light natural coconut charcoal. Clean burn, minimal ash, consistent heat for long sessions.',
    price: 1200,
    category: 'charcoal',
    image: SMOKE_COALS,
    stock: 50,
    is_available: true,
  },
  {
    id: 'c2',
    name: 'Instant Charcoal Roll (10 pcs)',
    description: 'Quick-light charcoal discs. Pack of 10. Light up in seconds with a lighter.',
    price: 350,
    category: 'charcoal',
    image: GREY_FIRE,
    stock: 80,
    is_available: true,
  },
  {
    id: 'c3',
    name: 'Heat Management Device (Lotus style)',
    description: 'HMD for even, controlled heat without foil. Extends session life and improves flavour.',
    price: 1900,
    category: 'charcoal',
    image: GRAY_HOOKAH,
    stock: 18,
    is_available: true,
  },
  {
    id: 'a1',
    name: 'Heavy-Duty Aluminum Foil Roll',
    description: 'Pre-cut hookah foil, heavy duty. Fits standard bowls. Pack of multiple sheets.',
    price: 250,
    category: 'accessories',
    image: TABLE_HOOKAH,
    stock: 100,
    is_available: true,
  },
  {
    id: 'a2',
    name: 'Silicone Mouth Tips (100 pcs)',
    description: 'Hygienic disposable mouth tips. Pack of 100. Essential for group sessions.',
    price: 450,
    category: 'accessories',
    image: TABLE_HOOKAH,
    stock: 70,
    is_available: true,
  },
  {
    id: 'a3',
    name: 'Stainless Steel Hookah Tongs',
    description: 'Heat-resistant tongs for safe coal handling. Long handle keeps fingers away from heat.',
    price: 350,
    category: 'accessories',
    image: SMOKE_COALS,
    stock: 45,
    is_available: true,
  },
  {
    id: 'a4',
    name: 'Ceramic Replacement Bowl',
    description: 'Standard clay ceramic bowl. Fits most hookah pipes. Great spare or upgrade.',
    price: 600,
    category: 'accessories',
    image: TABLE_HOOKAH,
    stock: 40,
    is_available: true,
  },
  {
    id: 'a5',
    name: 'Silicone Replacement Hose',
    description: 'Washable silicone hose with mouthpiece. Flexible, easy to clean, no ghosting flavours.',
    price: 700,
    category: 'accessories',
    image: GRAY_HOOKAH,
    stock: 35,
    is_available: true,
  },
  {
    id: 'a6',
    name: 'Foil Poker & Punch Tool',
    description: 'Dual-purpose poker and foil punch. Must-have accessory for every shisha setup.',
    price: 200,
    category: 'accessories',
    image: GREY_FIRE,
    stock: 60,
    is_available: true,
  },
  {
    id: 'b1',
    name: 'Starter Bundle',
    description: 'Mini hookah + 2 flavours (250g) + charcoal + foil. Everything you need to start.',
    price: 6200,
    category: 'bundles',
    image: HOOKAH,
    stock: 15,
    is_available: true,
    featured: true,
  },
  {
    id: 'b2',
    name: 'Party Bundle',
    description: 'Full-size hookah + 3 flavours + charcoal + mouth tips. Ready for gatherings.',
    price: 11500,
    category: 'bundles',
    image: SMOKE_COALS,
    stock: 10,
    is_available: true,
  },
];

export const shishaCategories = [
  { slug: 'pipes', name: 'Hookah Pipes', image: HOOKAH },
  { slug: 'flavours', name: 'Shisha Flavours', image: TABLE_HOOKAH },
  { slug: 'charcoal', name: 'Charcoal & Heat', image: SMOKE_COALS },
  { slug: 'accessories', name: 'Accessories', image: GRAY_HOOKAH },
  { slug: 'bundles', name: 'Bundles', image: TABLE_HOOKAH },
];

export const featuredProducts = shishaProducts.filter((p) => p.featured);

export function getProduct(id: string) {
  return shishaProducts.find((p) => p.id === id);
}

export function getProductsByCategory(slug: string) {
  return shishaProducts.filter((p) => p.category === slug);
}
