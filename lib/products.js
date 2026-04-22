const SITE_URL = 'https://homegrownmoney.com';

export const PRODUCTS = [
  // --- APPAREL (NATIONWIDE SHIPPING) ---
  {
    id: 101,
    slug: 'hgm-pink-tee',
    name: 'HGM Money Tree Tee - Pink',
    price: 30,
    image: '/images/store/hgmpink.png',
    hoverImage: '/images/store/pink-tee.png',
    category: 'Tees',
    storeSection: 'apparel',
    rating: 5,
    sizes: ['S', 'M', 'L', 'XL', '2XL'],
    details: ['6.5oz premium cotton', 'Money Tree front graphic', 'Standard unisex fit'],
    description: 'Soft pink HGM Money Tree tee with the signature front print and premium everyday weight.',
    pickupOnly: false
  },
  {
    id: 102,
    slug: 'hgm-yellow-tee',
    name: 'HGM Money Tree Tee - Yellow',
    price: 30,
    image: '/images/store/hgmyellow.png',
    hoverImage: '/images/store/yellow-tee.png',
    category: 'Tees',
    storeSection: 'apparel',
    rating: 5,
    sizes: ['S', 'M', 'L', 'XL', '2XL'],
    details: ['6.5oz premium cotton', 'Money Tree front graphic', 'Standard unisex fit'],
    description: 'Bright yellow HGM Money Tree tee built for daily wear and clean photo-ready color.',
    pickupOnly: false
  },
  {
    id: 103,
    slug: 'hgm-navy-tee',
    name: 'HGM Money Tree Tee - Navy',
    price: 30,
    image: '/images/store/hgmdarkblue.png',
    hoverImage: '/images/store/navy-tee.png',
    category: 'Tees',
    storeSection: 'apparel',
    rating: 5,
    sizes: ['S', 'M', 'L', 'XL', '2XL'],
    details: ['6.5oz premium cotton', 'Money Tree front graphic', 'Standard unisex fit'],
    description: 'Classic navy HGM Money Tree tee with the full front graphic and premium cotton feel.',
    pickupOnly: false
  },
  {
    id: 104,
    slug: 'hgm-blue-tee',
    name: 'HGM Money Tree Tee - Royal Blue',
    price: 30,
    image: '/images/store/hgmblue.png',
    category: 'Tees',
    storeSection: 'apparel',
    rating: 5,
    sizes: ['S', 'M', 'L', 'XL', '2XL'],
    details: ['6.5oz premium cotton', 'Money Tree front graphic', 'Standard unisex fit'],
    description: 'Royal blue HGM Money Tree tee with bold contrast and the signature front artwork.',
    pickupOnly: false
  },
  {
    id: 105,
    slug: 'hgm-red-tee',
    name: 'HGM Money Tree Tee - Red',
    price: 30,
    image: '/images/store/hgmred.png',
    category: 'Tees',
    storeSection: 'apparel',
    rating: 5,
    sizes: ['S', 'M', 'L', 'XL', '2XL'],
    details: ['6.5oz premium cotton', 'Money Tree front graphic', 'Standard unisex fit'],
    description: 'Vivid red HGM Money Tree tee designed to stand out while keeping the fit simple and clean.',
    pickupOnly: false
  },
  {
    id: 106,
    slug: 'hgm-trucker-hat',
    name: 'HGM Trucker Hat - Sky Blue',
    price: 15,
    image: '/images/store/hgmhat.png',
    hoverImage: '/images/store/trucker-hat.png',
    category: 'Hats',
    storeSection: 'apparel',
    rating: 5,
    details: ['Foam front panel', 'Mesh back', 'Adjustable snapback'],
    description: 'Sky-blue HGM trucker hat with the Money Tree mark up front and an easy all-day fit.',
    pickupOnly: false
  },
  {
    id: 107,
    slug: 'hgm-blue-beanie',
    name: 'HGM Beanie - Blue',
    price: 15,
    image: '/images/store/beanie-blue.png',
    category: 'Hats',
    storeSection: 'apparel',
    rating: 5,
    details: ['Ribbed knit', 'Fold-over cuff', 'Front Money Tree embroidery'],
    description: 'Royal blue HGM beanie with a soft ribbed knit and front logo detail.',
    pickupOnly: false
  },
  {
    id: 108,
    slug: 'hgm-combo-deal',
    name: 'HGM Blue Tee + Blue Beanie Combo',
    price: 35,
    image: '/images/store/HGMcombo.png',
    category: 'Combos',
    storeSection: 'apparel',
    rating: 5,
    sizes: ['S', 'M', 'L', 'XL', '2XL'],
    details: ['1x royal blue HGM tee', '1x blue HGM beanie', 'Best-value full fit bundle'],
    description: 'Royal blue tee paired with the blue HGM beanie for a clean full-fit bundle.',
    comboNote: 'As long as the color and style you want are available, we can build your combo that way.',
    pickupOnly: false
  },
  {
    id: 109,
    slug: 'hgm-pink-tee-blue-hat-combo',
    name: 'HGM Pink Tee + Blue Hat Combo',
    price: 35,
    image: '/images/store/bluepinkcombo.png',
    category: 'Combos',
    storeSection: 'apparel',
    rating: 5,
    sizes: ['S', 'M', 'L', 'XL', '2XL'],
    details: ['1x pink HGM tee', '1x sky-blue trucker hat', 'Built from current available inventory'],
    description: 'Pink tee matched with the blue trucker hat for a bright combo fit.',
    comboNote: 'As long as the color and style you want are available, we can build your combo that way.',
    pickupOnly: false
  },
  // --- BAKERSFIELD LOCAL MENU (21+ PICKUP OR DELIVERY - NO PRICING) ---
  
  // FLOWER GROUP 1: LEGENDS
  {
    id: 201,
    slug: 'flower-legends-series',
    name: 'HGM Connoisseur Series (BULLRIDER, GELATO 41, KING LOUIS XIII...)',
    price: null,
    image: '/images/store/flower.png',
    category: 'Flower',
    storeSection: 'cannabis',
    rating: 5,
    details: ['Premium indoor grown', 'Strains: Bullrider, Gelato 41, Purple Drank Breath, King Louis XIII', 'Verified 21+ only'],
    description: 'Our iconic Connoisseur Series. High-performance indoor flower featuring raw genetics. Call for current availability of Gelato 41, King Louis XIII, and more.',
    pickupOnly: true
  },
  // FLOWER GROUP 2: DESSERTS
  {
    id: 202,
    slug: 'flower-dessert-series',
    name: 'HGM Dessert Series (APPLE FRITTER, LEMON CHERRY GELATO, BISCOTTI...)',
    price: null,
    image: '/images/store/flower.png',
    category: 'Flower',
    storeSection: 'cannabis',
    rating: 5,
    details: ['Terpene-heavy profiles', 'Strains: Apple Fritter, Lemon Cherry Gelato, Biscotti', 'Verified 21+ only'],
    description: 'Sweet, gassy, and heavy. Includes Apple Fritter, Lemon Cherry Gelato, and Biscotti. Perfect for flavor chasers.',
    pickupOnly: true
  },
  // FLOWER GROUP 3: CLASSICS & GAS
  {
    id: 203,
    slug: 'flower-classic-gas-series',
    name: 'HGM Classic Gas (SKYWALKER OG, GORILLA GLUE #4, SUNSET SHERBET)',
    price: null,
    image: '/images/store/flower.png',
    category: 'Flower',
    storeSection: 'cannabis',
    rating: 5,
    details: ['The heavy hitters', 'Strains: Skywalker OG, Gorilla Glue #4, Sunset Sherbet', 'Verified 21+ only'],
    description: 'The roots of the brand. Hard-hitting classics like Skywalker OG, Gorilla Glue #4, and Sunset Sherbet. Real gas for real smokers.',
    pickupOnly: true
  },
  // DISPOSABLES
  {
    id: 301,
    slug: 'disposable-premium-vapes',
    name: 'Premium Disposables (REFINED LIVE RESIN, CURED RESIN SERIES...)',
    price: null,
    image: '/images/store/disposable.png',
    category: 'Disposables',
    storeSection: 'cannabis',
    rating: 5,
    description: 'Full-gram and half-gram disposables from the highest quality lab-tested sources. Includes Refined Live Resin, Cured Resin Series, Big Chief Extract, and High-Capacity Dual Coil. Call for current stock.',
    pickupOnly: true
  },
  {
    id: 302,
    slug: 'disposable-knockout-punch',
    name: 'HGM Knockout Punch Disposable',
    price: null,
    image: '/images/store/disposable.png',
    category: 'Disposables',
    storeSection: 'cannabis',
    rating: 5,
    description: 'The heavyweight hitter. Signature HGM hardware for maximum impact. Guaranteed high-potency.',
    pickupOnly: true
  },
  // EDIBLES
  {
    id: 401,
    slug: 'edibles-sweets-candy',
    name: 'HGM Edible Selection (PRISM DROPS, POWER ROPES, SOLAR BURSTS)',
    price: null,
    image: '/images/store/edibles.png',
    category: 'Edibles',
    storeSection: 'cannabis',
    rating: 5,
    description: 'High-dosage gummies and candies. Includes HGM Prism Drops, HGM Power Ropes, HGM Solar Bursts, and our signature Mixed Gummies.',
    pickupOnly: true
  },
  {
    id: 402,
    slug: 'edibles-snacks',
    name: 'Gourmet Medicated Treats (SNAP TREATS, SALTY SERIES...)',
    price: null,
    image: '/images/store/edibles.png',
    category: 'Edibles',
    storeSection: 'cannabis',
    rating: 5,
    description: 'HGM Snap Treats and HGM Salty Series medicated snacks. Potency varies, call for details.',
    pickupOnly: true
  },
  // WAX
  {
    id: 501,
    slug: 'wax-concentrates',
    name: 'HGM Concentrates (PREMIUM WAX, CRUMBLE, SHATTER)',
    price: null,
    image: '/images/store/wax.png',
    category: 'Concentrates',
    storeSection: 'cannabis',
    rating: 5,
    description: 'Clean extraction concentrates. Gold high-clarity Shatter, Creamy Wax, and terpene-rich Crumble. Call for the daily head-stash list.',
    pickupOnly: true
  },
  // PRE-ROLLS
  {
    id: 601,
    slug: 'pre-rolls-joints',
    name: 'HGM Premium Pre-Rolls (HYBRID, INDICA, SATIVA)',
    price: null,
    image: '/images/store/flower.png', // Generic flower/joint image
    category: 'Pre-Rolls',
    storeSection: 'cannabis',
    rating: 5,
    description: 'Hand-rolled 1g premium joints available in Hybrid, Indica, or Sativa. Clean ash and smooth burn guarantee.',
    pickupOnly: true
  }
];

export const getProductBySlug = (slug) => PRODUCTS.find((product) => product.slug === slug);

export const getProductSchema = (product) => ({
  '@context': 'https://schema.org/',
  '@type': 'Product',
  name: product.name,
  image: [`${SITE_URL}${product.image}`],
  description: product.description,
  sku: product.slug,
  category: product.category,
  brand: {
    '@type': 'Brand',
    name: 'Home Grown Money'
  },
  offers: {
    '@type': 'Offer',
    url: `${SITE_URL}/shop/${product.slug}`,
    priceCurrency: 'USD',
    price: product.price || 0,
    priceValidUntil: '2027-12-31',
    availability: product.pickupOnly ? 'https://schema.org/LimitedAvailability' : 'https://schema.org/InStock',
    itemCondition: 'https://schema.org/NewCondition',
    seller: {
      '@type': 'Organization',
      name: 'Home Grown Money'
    }
  }
});
