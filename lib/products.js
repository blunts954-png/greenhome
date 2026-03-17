export const PRODUCTS = [
  // --- APPAREL STORE ---
  { 
    id: 101, 
    slug: 'hgm-pink-tee',
    name: 'HGM Logo Tee - Pink', 
    price: 20, 
    image: '/images/store/pink-tee.png',
    category: 'Tees',
    storeSection: 'apparel',
    rating: 5,
    sizes: ['S', 'M', 'L', 'XL'],
    details: ['100% Premium Cotton', 'Screen Printed Logo', 'Standard Fit'],
    description: 'Home Grown Money signature logo tee in vibrant pink. Premium cotton blend for ultimate comfort.',
    pickupOnly: false
  },
  { 
    id: 102, 
    slug: 'hgm-yellow-tee',
    name: 'HGM Logo Tee - Yellow', 
    price: 20, 
    image: '/images/store/yellow-tee.png',
    category: 'Tees',
    storeSection: 'apparel',
    rating: 5,
    sizes: ['S', 'M', 'L', 'XL'],
    description: 'Home Grown Money signature logo tee in sunset yellow. High-visibility hustle.',
    pickupOnly: false
  },
  { 
    id: 103, 
    slug: 'hgm-navy-tee',
    name: 'HGM Logo Tee - Navy', 
    price: 20, 
    image: '/images/store/navy-tee.png',
    category: 'Tees',
    storeSection: 'apparel',
    rating: 5,
    sizes: ['S', 'M', 'L', 'XL'],
    description: 'Home Grown Money signature logo tee in classic navy blue.',
    pickupOnly: false
  },
  { 
    id: 104, 
    slug: 'hgm-trucker-hat',
    name: 'HGM Trucker Hat - Sky Blue', 
    price: 15, 
    image: '/images/store/trucker-hat.png',
    category: 'Hats',
    storeSection: 'apparel',
    rating: 5,
    details: ['High Profile', 'Mesh Back', 'Adjustable Snapback'],
    description: 'Classic trucker style with the HGM logo. Light blue and white mesh.',
    pickupOnly: false
  },
  { 
    id: 105, 
    slug: 'hgm-blue-beanie',
    name: 'HGM Beanie - Blue', 
    price: 10, 
    image: '/images/store/beanie-blue.png',
    category: 'Hats',
    storeSection: 'apparel',
    rating: 5,
    description: 'Stay warm with the Home Grown Money ribbed beanie in blue.',
    pickupOnly: false
  },

  // --- CANNABIS STORE ---
  { 
    id: 201, 
    slug: 'hgm-reserve-weed',
    name: 'HGM Reserve Flower', 
    price: 45, 
    image: '/images/store/flower.png',
    category: 'Flower',
    storeSection: 'cannabis',
    rating: 5,
    sizes: [],
    details: ['Premium Hand-Trimmed', 'Slow Cured', 'Bakersfield Grown'],
    description: 'Premium valley-grown flower. Hand-trimmed and slow-cured for the ultimate experience.',
    pickupOnly: false
  },
  { 
    id: 202, 
    slug: 'hgm-gold-wax',
    name: 'HGM Gold Wax', 
    price: 60, 
    image: '/images/store/wax.png',
    category: 'Concentrates',
    storeSection: 'cannabis',
    rating: 5,
    sizes: [],
    details: ['99% Pure THCA', 'Clean Extraction', 'High Potency'],
    description: 'High-potency concentrate. Clean, pure, and powerful.',
    pickupOnly: false
  },
  { 
    id: 203, 
    slug: 'hgm-gummy-edibles',
    name: 'HGM Signature Edibles', 
    price: 25, 
    image: '/images/store/edibles.png',
    category: 'Edibles',
    storeSection: 'cannabis',
    rating: 5,
    sizes: [],
    details: ['100mg THC per pack', 'Lab Tested', 'Artisanal Flavors'],
    description: 'Infused gourmet treats. Precision dosed for consistency.',
    pickupOnly: false
  },
  { 
    id: 204, 
    slug: 'hgm-disposable-pen',
    name: 'HGM Disposable Pen', 
    price: 40, 
    image: '/images/store/disposable.png',
    category: 'Disposables',
    storeSection: 'cannabis',
    rating: 5,
    sizes: [],
    details: ['0.5g Premium Oil', 'Rechargeable', 'Draw Activated'],
    description: 'Convenient, sleek, and ready to go. Premium oil in a portable design.',
    pickupOnly: false
  },
  { 
    id: 205, 
    slug: 'hgm-grinder',
    name: 'HGM Premium Grinder', 
    price: 25, 
    image: '/images/hgm-grinder.png',
    category: 'Others',
    storeSection: 'cannabis',
    rating: 5,
    sizes: [],
    details: ['4-Piece Design', 'Kief Catcher', 'Aluminum Alloy'],
    description: 'Heavy-duty 4-piece grinder with kief catcher.',
    pickupOnly: false
  }
];

export const getProductSchema = (product) => {
  return {
    "@context": "https://schema.org/",
    "@type": "Product",
    "name": product.name,
    "image": [`https://homegrownmoney.com${product.image}`],
    "description": product.description,
    "sku": product.slug,
    "brand": {
      "@type": "Brand",
      "name": "Home Grown Money"
    },
    "offers": {
      "@type": "Offer",
      "url": `https://homegrownmoney.com/shop/${product.slug}`,
      "priceCurrency": "USD",
      "price": product.price,
      "priceValidUntil": "2026-12-31",
      "availability": "https://schema.org/InStock",
      "seller": {
        "@type": "Organization",
        "name": "Home Grown Money Bakersfield"
      }
    }
  };
};
