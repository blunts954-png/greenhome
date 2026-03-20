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
    comboNote: 'As long as the color and style you want are available, you can build your combo that way.',
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
    comboNote: 'As long as the color and style you want are available, you can build your combo that way.',
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
