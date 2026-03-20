const SITE_URL = 'https://homegrownmoney.com';

export const PRODUCTS = [
  {
    id: 101,
    slug: 'hgm-pink-tee',
    name: 'HGM Money Tree Tee - Pink',
    price: 20,
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
    price: 20,
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
    price: 20,
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
    price: 20,
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
    price: 20,
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
    price: 10,
    image: '/images/store/hgmbennie.png',
    hoverImage: '/images/store/beanie-blue.png',
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
    name: 'HGM Tee + Hat Combo',
    price: 30,
    image: '/images/store/HGMcombo.png',
    category: 'Combos',
    storeSection: 'apparel',
    rating: 5,
    sizes: ['S', 'M', 'L', 'XL', '2XL'],
    details: ['1x HGM tee in any listed color', '1x trucker hat or blue beanie', 'Best-value full fit bundle'],
    description: 'Bundle any tee with your choice of HGM headwear for a lower combo price.',
    pickupOnly: false
  },
  {
    id: 201,
    slug: 'hgm-reserve-flower',
    name: 'HGM Reserve Flower',
    price: 45,
    image: '/images/store/flower.png',
    hoverImage: '/images/store/weed-reserve.png',
    category: 'Flower',
    storeSection: 'cannabis',
    rating: 5,
    sizes: [],
    details: ['Premium hand-trimmed flower', 'Slow cured', 'Bakersfield pickup or local delivery only'],
    description: 'Premium reserve flower available for verified local pickup or local delivery only.',
    pickupOnly: true
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
    details: ['High-potency concentrate', 'Clean extraction', 'Local fulfillment only'],
    description: 'High-potency HGM wax reserved for local pickup or compliant local delivery.',
    pickupOnly: true
  },
  {
    id: 203,
    slug: 'hgm-signature-edibles',
    name: 'HGM Signature Edibles',
    price: 25,
    image: '/images/store/edibles.png',
    category: 'Edibles',
    storeSection: 'cannabis',
    rating: 5,
    sizes: [],
    details: ['100mg THC per pack', 'Lab tested', 'Local fulfillment only'],
    description: 'Signature HGM edibles for verified local pickup or local delivery.',
    pickupOnly: true
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
    details: ['0.5g premium oil', 'Rechargeable', 'Draw activated'],
    description: 'Ready-to-go disposable pen for local pickup or compliant local delivery.',
    pickupOnly: true
  },
  {
    id: 205,
    slug: 'hgm-grinder',
    name: 'HGM Premium Grinder',
    price: 25,
    image: '/images/hgm-grinder.png',
    category: 'Accessories',
    storeSection: 'cannabis',
    rating: 5,
    sizes: [],
    details: ['4-piece design', 'Kief catcher', 'Aluminum alloy'],
    description: 'Heavy-duty four-piece grinder for the daily kit.',
    pickupOnly: false
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
    price: product.price,
    priceValidUntil: '2027-12-31',
    availability: 'https://schema.org/InStock',
    itemCondition: 'https://schema.org/NewCondition',
    seller: {
      '@type': 'Organization',
      name: 'Home Grown Money'
    }
  }
});
