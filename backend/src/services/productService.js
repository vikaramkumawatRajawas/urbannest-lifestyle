import { Product } from "../models/Product.js";

// Fallback seed data in case MongoDB is not connected
export const MOCK_PRODUCTS = [
  {
    _id: "prod-1",
    id: "prod-1",
    name: "Ceramic Minimalist Ribbed Vase",
    slug: "ceramic-minimalist-ribbed-vase",
    category: "Home Décor",
    price: 899,
    originalPrice: 1299,
    rating: 4.8,
    reviewsCount: 42,
    image: "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=800&q=80",
    images: ["https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=800&q=80"],
    featured: true,
    tags: ["Best Seller", "Handcrafted", "Minimalist"],
    description: "Elegantly textured ceramic vase designed for dried florals or modern pampas grass.",
    inStock: true
  },
  {
    _id: "prod-2",
    id: "prod-2",
    name: "Scented Soy Wax Candle - Amber & Cedarwood",
    slug: "scented-soy-wax-candle-amber-cedarwood",
    category: "Home Décor",
    price: 599,
    originalPrice: 799,
    rating: 4.9,
    reviewsCount: 88,
    image: "https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=800&q=80",
    images: ["https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=800&q=80"],
    featured: true,
    tags: ["Eco-Friendly", "Aromatherapy", "Best Seller"],
    description: "Hand-poured 100% natural soy wax candle infused with essential oils.",
    inStock: true
  },
  {
    _id: "prod-3",
    id: "prod-3",
    name: "Handcrafted Wooden Desk Organizer",
    slug: "handcrafted-wooden-desk-organizer",
    category: "Stationery",
    price: 1199,
    originalPrice: 1599,
    rating: 4.7,
    reviewsCount: 31,
    image: "https://images.unsplash.com/photo-1593062096033-9a26b09da705?auto=format&fit=crop&w=800&q=80",
    images: ["https://images.unsplash.com/photo-1593062096033-9a26b09da705?auto=format&fit=crop&w=800&q=80"],
    featured: true,
    tags: ["Sustainable", "Workplace"],
    description: "Multi-compartment solid mango wood organizer crafted for pens and desk clutter.",
    inStock: true
  },
  {
    _id: "prod-4",
    id: "prod-4",
    name: "Artisan Leather Journal & Pen Set",
    slug: "artisan-leather-journal-pen-set",
    category: "Stationery",
    price: 799,
    originalPrice: 999,
    rating: 4.8,
    reviewsCount: 56,
    image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80",
    images: ["https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80"],
    featured: false,
    tags: ["Gift Idea", "Stationery"],
    description: "Refillable vegan leather notebook with cream pages and brass gel pen.",
    inStock: true
  },
  {
    _id: "prod-5",
    id: "prod-5",
    name: "Warm Brass Decorative Table Lamp",
    slug: "warm-brass-decorative-table-lamp",
    category: "Home Décor",
    price: 2499,
    originalPrice: 3299,
    rating: 4.9,
    reviewsCount: 19,
    image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=800&q=80",
    images: ["https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=800&q=80"],
    featured: true,
    tags: ["Premium", "Lighting"],
    description: "Mushroom-inspired ambient bedside lamp with touch-controlled dimmable warm LED glow.",
    inStock: true
  },
  {
    _id: "prod-6",
    id: "prod-6",
    name: "Curated Celebration Gift Hamper",
    slug: "curated-celebration-gift-hamper",
    category: "Gifts",
    price: 1899,
    originalPrice: 2299,
    rating: 5.0,
    reviewsCount: 64,
    image: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=800&q=80",
    images: ["https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=800&q=80"],
    featured: true,
    tags: ["Gift Pack", "Festive"],
    description: "Thoughtfully assembled luxury gift box containing candle, chocolate bar, bookmark, and tea tin.",
    inStock: true
  },
  {
    _id: "prod-21",
    id: "prod-21",
    name: "Artisan Ceramic Candle Holder Box",
    slug: "artisan-ceramic-candle-holder-box",
    category: "Gifts",
    price: 999,
    originalPrice: 1299,
    rating: 4.9,
    reviewsCount: 38,
    image: "https://images.unsplash.com/photo-1602523961358-f9f03dd557db?auto=format&fit=crop&w=800&q=80",
    images: ["https://images.unsplash.com/photo-1602523961358-f9f03dd557db?auto=format&fit=crop&w=800&q=80"],
    featured: false,
    tags: ["Gift Idea", "Ceramic"],
    description: "Sculptural ceramic tea light candle holder paired with matching matchstick bottle in an embossed gift box.",
    inStock: true
  },
  {
    _id: "prod-22",
    id: "prod-22",
    name: "Deluxe Brass Pen & Bookmark Corporate Gift Set",
    slug: "deluxe-brass-pen-bookmark-gift-set",
    category: "Gifts",
    price: 1499,
    originalPrice: 1899,
    rating: 5.0,
    reviewsCount: 47,
    image: "https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?auto=format&fit=crop&w=800&q=80",
    images: ["https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?auto=format&fit=crop&w=800&q=80"],
    featured: true,
    tags: ["Executive", "Corporate Gift"],
    description: "Heavyweight solid brass rollerball pen and gold leaf bookmark presented in a velvet lined wooden box.",
    inStock: true
  },
  {
    _id: "prod-23",
    id: "prod-23",
    name: "Minimalist Glass Storage Jars with Wooden Lids (Set of 3)",
    slug: "minimalist-glass-storage-jars",
    category: "Household Essentials",
    price: 1199,
    originalPrice: 1499,
    rating: 4.8,
    reviewsCount: 62,
    image: "https://images.unsplash.com/photo-1584992236310-6edddc08acff?auto=format&fit=crop&w=800&q=80",
    images: ["https://images.unsplash.com/photo-1584992236310-6edddc08acff?auto=format&fit=crop&w=800&q=80"],
    featured: false,
    tags: ["Kitchen", "Storage"],
    description: "Aesthetic borosilicate glass pantry containers with airtight acacia wood lids for coffee, spices, or tea.",
    inStock: true
  },
  {
    _id: "prod-24",
    id: "prod-24",
    name: "Artisan Stoneware Serving Platter Board",
    slug: "artisan-stoneware-serving-platter",
    category: "Household Essentials",
    price: 1599,
    originalPrice: 1999,
    rating: 4.9,
    reviewsCount: 33,
    image: "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=800&q=80",
    images: ["https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=800&q=80"],
    featured: false,
    tags: ["Serving", "Ceramic"],
    description: "Hand-glazed ceramic serving tray with wooden handle, perfect for charcuterie, cheese, or breakfast spreads.",
    inStock: true
  },
  {
    _id: "prod-25",
    id: "prod-25",
    name: "Handcrafted Genuine Leather Cable & Tech Organizer",
    slug: "handcrafted-genuine-leather-cable-organizer",
    category: "Lifestyle Accessories",
    price: 899,
    originalPrice: 1199,
    rating: 4.8,
    reviewsCount: 54,
    image: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80",
    images: ["https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80"],
    featured: false,
    tags: ["Travel", "Leather"],
    description: "Roll-up leather pouch designed with elastic slots to hold chargers, AirPods, cables, and pen accessories on the go.",
    inStock: true
  }
];

const normalizeProduct = (p) => ({
  ...p,
  id: p.id || p._id,
  image: p.image || (Array.isArray(p.images) && p.images.length > 0 ? p.images[0] : null) || "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=800&q=80"
});

export const fetchProducts = async (queryParams) => {
  const page = parseInt(queryParams.page || "1", 10);
  const limit = parseInt(queryParams.limit || "30", 10);
  const skip = (page - 1) * limit;

  const { search, category, minPrice, maxPrice, sort, featured } = queryParams;

  try {
    const filter = {};

    if (search) {
      filter.$text = { $search: search };
    }
    if (category && category !== "All") {
      filter.category = new RegExp(category, "i");
    }
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }
    if (featured === "true") {
      filter.featured = true;
    }

    let sortOptions = {};
    if (sort === "price_asc" || sort === "price-low") sortOptions.price = 1;
    else if (sort === "price_desc" || sort === "price-high") sortOptions.price = -1;
    else if (sort === "rating") sortOptions.rating = -1;
    else if (sort === "newest") sortOptions.createdAt = -1;
    else sortOptions.featured = -1;

    const rawProducts = await Product.find(filter)
      .sort(sortOptions)
      .skip(skip)
      .limit(limit)
      .lean();

    const products = rawProducts.map(normalizeProduct);
    const total = await Product.countDocuments(filter);

    if (products.length === 0 && !search && (!category || category === "All")) {
      return {
        products: MOCK_PRODUCTS.map(normalizeProduct),
        pagination: {
          page: 1,
          limit: 30,
          total: MOCK_PRODUCTS.length,
          totalPages: 1
        }
      };
    }

    return {
      products,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit) || 1
      }
    };
  } catch (err) {
    let result = [...MOCK_PRODUCTS];
    if (category && category !== "All") {
      result = result.filter((p) => p.category.toLowerCase() === category.toLowerCase());
    }
    if (search) {
      const q = search.toLowerCase();
      result = result.filter((p) => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q));
    }
    return {
      products: result.map(normalizeProduct),
      pagination: {
        page: 1,
        limit: 30,
        total: result.length,
        totalPages: 1
      }
    };
  }
};
