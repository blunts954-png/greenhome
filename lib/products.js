const SITE_URL = 'https://homegrownmoney.com';

export const PRODUCTS = [
  // --- APPAREL & ACCESSORIES (NATIONWIDE SHIPPING) ---
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
    price: 30,
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
    price: 30,
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
  // --- SMOKING ACCESSORIES (NOW IN APPAREL/FRONT) ---
  {
    id: 110,
    slug: 'hgm-premium-grinder',
    name: 'HGM Premium Grinder',
    price: 25,
    image: '/images/hgm-grinder.png',
    category: 'Accessories',
    storeSection: 'apparel',
    rating: 5,
    details: ['4-piece design', 'Kief catcher', 'Aluminum alloy'],
    description: 'Heavy-duty four-piece grinder for the daily kit.',
    pickupOnly: false
  },
  {
    id: 111,
    slug: 'hgm-rolling-tray',
    name: 'HGM Signature Tray',
    price: 15,
    image: '/images/store/tray.png',
    category: 'Accessories',
    storeSection: 'apparel',
    rating: 5,
    description: 'Large metal rolling tray with the signature HGM Money Tree artwork.',
    pickupOnly: false
  },
  {
    id: 112,
    slug: 'hgm-all-in-one-case',
    name: 'All-In-One Smoking Case',
    price: 40,
    image: '/images/store/case.png',
    category: 'Accessories',
    storeSection: 'apparel',
    rating: 5,
    description: 'Hard-shell smell-proof case to carry your whole setup.',
    pickupOnly: false
  },
  {
    id: 113,
    slug: 'hgm-wax-pen',
    name: 'Premium Wax Pen',
    price: 35,
    image: '/images/store/wax-pen.png',
    category: 'Accessories',
    storeSection: 'apparel',
    rating: 5,
    description: 'Rechargeable high-temp wax pen for concentrates.',
    pickupOnly: false
  },
  {
    id: 114,
    slug: 'hgm-standard-pen-1',
    name: 'Standard 510 Battery - Option 1',
    price: 15,
    image: '/images/store/pen1.png',
    category: 'Accessories',
    storeSection: 'apparel',
    rating: 5,
    description: 'Reliable 510-thread battery with adjustable voltage.',
    pickupOnly: false
  },
  {
    id: 115,
    slug: 'hgm-standard-pen-2',
    name: 'Standard 510 Battery - Option 2',
    price: 15,
    image: '/images/store/pen2.png',
    category: 'Accessories',
    storeSection: 'apparel',
    rating: 5,
    description: 'Slim profile 510-thread battery for daily use.',
    pickupOnly: false
  },
  {
    id: 116,
    slug: 'hgm-cones',
    name: 'HGM Premium Cones',
    price: 5,
    image: '/images/store/cones.png',
    category: 'Accessories',
    storeSection: 'apparel',
    rating: 5,
    description: 'Slow-burning ultra-thin pre-rolled cones (3-pack).',
    pickupOnly: false
  },
  {
    id: 117,
    slug: 'hgm-glass-pipe',
    name: 'Classic Tobacco Pipe',
    price: 20,
    image: '/images/store/pipe.png',
    category: 'Accessories',
    storeSection: 'apparel',
    rating: 5,
    description: 'Hand-blown glass tobacco pipe with deep bowl.',
    pickupOnly: false
  },
  {
    id: 118,
    slug: 'hgm-one-hitter',
    name: 'Glass One-Hitter',
    price: 8,
    image: '/images/store/onehitter.png',
    category: 'Accessories',
    storeSection: 'apparel',
    rating: 5,
    description: 'Discreet glass one-hitter for quick sessions.',
    pickupOnly: false
  },

  // --- BAKERSFIELD MENU (21+ PICKUP ONLY - NO PRICING) ---
  
  // FLOWER GROUP 1: LEGENDS
  {
    id: 201,
    slug: 'flower-legends-series',
    name: 'HGM Legends Series (JORDAN, IVERSON, KOBE...)',
    price: null,
    image: '/images/store/flower.png',
    category: 'Flower',
    storeSection: 'cannabis',
    rating: 5,
    details: ['Premium indoor grown', 'Strains: Jordan, Iverson, Pippen, Curry, Kobe, LeBron, Barkley', 'Verified 21+ only'],
    description: 'Our iconic Legends Series. High-performance indoor flower named after the greats. Call for current availability of Jordan, Kobe, LeBron, and more.',
    pickupOnly: true
  },
  // FLOWER GROUP 2: DESSERTS
  {
    id: 202,
    slug: 'flower-dessert-series',
    name: 'HGM Dessert Series (ICE CREAM, FRITTER, CHERRY...)',
    price: null,
    image: '/images/store/flower.png',
    category: 'Flower',
    storeSection: 'cannabis',
    rating: 5,
    details: ['Terpene-heavy profiles', 'Strains: Apple Fritter, Ice Cream Shake, Lemon Cherry Gelato, Biscotti, Blue Cookies', 'Verified 21+ only'],
    description: 'Sweet, gassy, and heavy. Includes Apple Fritter, Lemon Cherry, and Biscotti. Perfect for flavor chasers.',
    pickupOnly: true
  },
  // FLOWER GROUP 3: CLASSICS & GAS
  {
    id: 203,
    slug: 'flower-classic-gas-series',
    name: 'HGM Classic Gas (OG, GG4, SHERB, JACK...)',
    price: null,
    image: '/images/store/flower.png',
    category: 'Flower',
    storeSection: 'cannabis',
    rating: 5,
    details: ['The heavy hitters', 'Strains: OG, GG4, Jack Herer, Purple Skunk, Clouds OG, Cadillac Shake', 'Verified 21+ only'],
    description: 'The roots of the brand. Hard-hitting classics like OG, GG4, and the signature Clouds OG. Real gas for real smokers.',
    pickupOnly: true
  },
  // DISPOSABLES
  {
    id: 301,
    slug: 'disposable-premium-vapes',
    name: 'Premium Disposables (MUHAMMED, TRAP CITY, BIG CHIEF...)',
    price: null,
    image: '/images/store/disposable.png',
    category: 'Disposables',
    storeSection: 'cannabis',
    rating: 5,
    description: 'Full-gram and half-gram disposables from the world\'s cleanest brands. Mueller\'s, Trap City, Big Chief, Raw Gardens, and Blinkers. Call for current stock.',
    pickupOnly: true
  },
  {
    id: 302,
    slug: 'disposable-tyson-punch',
    name: 'Mike Tyson Punch Disposable',
    price: null,
    image: '/images/store/disposable.png',
    category: 'Disposables',
    storeSection: 'cannabis',
    rating: 5,
    description: 'The heavyweight hitter. Iron Mike\'s signature hardware. Guaranteed high-potency.',
    pickupOnly: true
  },
  // EDIBLES
  {
    id: 401,
    slug: 'edibles-sweets-candy',
    name: 'HGM Edible Selection (SKITTLES, ROPES, DANK GUMMIES...)',
    price: null,
    image: '/images/store/edibles.png',
    category: 'Edibles',
    storeSection: 'cannabis',
    rating: 5,
    description: 'High-dosage gummies and candies. Includes Skittles, Life Savers, Starburst, We Tarts, and both Yellow/Green bag Dank Gummies.',
    pickupOnly: true
  },
  {
    id: 402,
    slug: 'edibles-snacks',
    name: 'Gourmet Medicated Treats (RICE CRISPY, FRITO-LAY...)',
    price: null,
    image: '/images/store/edibles.png',
    category: 'Edibles',
    storeSection: 'cannabis',
    rating: 5,
    description: 'Medicated Rice Crispy Treats and Frito-Lay style salty snacks. Potency varies, call for details.',
    pickupOnly: true
  },
  // WAX
  {
    id: 501,
    slug: 'wax-concentrates',
    name: 'HGM Concentrates (COOKIE WAX, CRUMBLE, SHATTER)',
    price: null,
    image: '/images/store/wax.png',
    category: 'Concentrates',
    storeSection: 'cannabis',
    rating: 5,
    description: 'Clean extraction concentrates. Cookie Wax, high-clarity Shatter, and gold Crumble. Call for the daily head-stash list.',
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
    availability: product.pickupOnly ? 'https://schema.org/InStoreOnly' : 'https://schema.org/InStock',
    itemCondition: 'https://schema.org/NewCondition',
    seller: {
      '@type': 'Organization',
      name: 'Home Grown Money'
    }
  }
});
