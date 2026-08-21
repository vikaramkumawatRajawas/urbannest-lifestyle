import mongoose from "mongoose";
import { connectDB } from "../src/config/database.js";
import { Product } from "../src/models/Product.js";
import { Category } from "../src/models/Category.js";
import { Offer } from "../src/models/Offer.js";
import { Testimonial } from "../src/models/Testimonial.js";

// 1. CATEGORIES DATA
const categories = [
  {
    name: "Home Décor",
    slug: "home-decor",
    tagline: "Beautiful pieces for your space",
    description: "Vases, scented candles, warm lighting, and accent pieces that make a house feel like home.",
    image: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=800&q=80",
    itemCount: "48+ items"
  },
  {
    name: "Gifts",
    slug: "gifts",
    tagline: "Thoughtful gifts for every occasion",
    description: "Curated hampers, artisan keepsakes, and personalized surprises.",
    image: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=800&q=80",
    itemCount: "35+ items"
  },
  {
    name: "Stationery",
    slug: "stationery",
    tagline: "Creative and practical stationery",
    description: "Artisan notebooks, planners, wooden organizers, and writing tools.",
    image: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80",
    itemCount: "29+ items"
  },
  {
    name: "Lifestyle Accessories",
    slug: "lifestyle-accessories",
    tagline: "Small accessories for everyday life",
    description: "Thermal tumblers, organic totes, fabric sprays.",
    image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=800&q=80",
    itemCount: "42+ items"
  },
  {
    name: "Household Essentials",
    slug: "household-essentials",
    tagline: "Useful products for everyday living",
    description: "Stoneware mugs, storage baskets, coasters, and smart organizers.",
    image: "https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&w=800&q=80",
    itemCount: "30+ items"
  }
];

// 2. OFFERS DATA (matching src/data/offersData.js)
const offers = [
  {
    title: "Weekend Special Offer",
    subtitle: "On all Home Décor & Ceramic Vases",
    discount: "Up to 20% OFF",
    code: "WEEKEND20",
    description: "Upgrade your living space with handcrafted ceramic pieces and aromatic candles at an exclusive discount.",
    bgGradient: "from-amber-500 to-orange-600",
    expiresIn: "Ends Sunday 11:59 PM",
    active: true
  },
  {
    title: "Gift Collection Pack",
    subtitle: "On all Curated Hampers & Gift Sets",
    discount: "Buy 2 → Get 10% OFF",
    code: "GIFTNEST10",
    description: "Surprise loved ones with curated gift boxes. Bundle any 2 hampers and enjoy instant savings at checkout.",
    bgGradient: "from-emerald-600 to-teal-700",
    expiresIn: "Limited Time Offer",
    active: true
  },
  {
    title: "New Arrivals Delight",
    subtitle: "On orders above ₹1,499",
    discount: "Flat ₹150 OFF",
    code: "URBANNEST150",
    description: "Discover our freshly arrived Scandinavian desk accessories, planners, and linen room sprays.",
    bgGradient: "from-rose-500 to-amber-600",
    expiresIn: "Valid for New & Existing Customers",
    active: true
  }
];

// 3. TESTIMONIALS DATA (matching src/data/testimonialsData.js)
const testimonials = [
  {
    name: "Ananya Sharma",
    role: "Interior Enthusiast",
    location: "Bangalore, India",
    rating: 5,
    comment: "UrbanNest has become my favorite place for small home décor pieces. The ceramic vase and candle I ordered arrived impeccably packaged and transformed my living room coffee table!",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
    approved: true
  },
  {
    name: "Rohan Mehta",
    role: "Architect & Designer",
    location: "Mumbai, India",
    rating: 5,
    comment: "The wooden desk organizer is top-tier quality. Natural grain finish, solid wood, and very functional. Plus, their AI assistant helped me check store availability instantly.",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
    approved: true
  },
  {
    name: "Priya Nair",
    role: "HR Executive",
    location: "Pune, India",
    rating: 5,
    comment: "Ordered 5 celebration gift hampers for my team. Everyone loved the handwritten cards and curated luxury treats. Friendly support and fast delivery!",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80",
    approved: true
  },
  {
    name: "Vikramaditya Verma",
    role: "Verified Buyer",
    location: "Delhi NCR, India",
    rating: 5,
    comment: "Submitted a query through their online form regarding custom gift packaging and got a response within minutes thanks to their N8N query system. Outstanding customer experience!",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
    approved: true
  }
];

// 4. PRODUCTS DATA (matching src/data/productsData.js)
const products = [
  {
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
    stockQuantity: 50,
    inStock: true
  },
  {
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
    stockQuantity: 65,
    inStock: true
  },
  {
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
    description: "Multi-compartment solid mango wood organizer crafted for office desk clutter.",
    stockQuantity: 40,
    inStock: true
  },
  {
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
    description: "Refillable vegan leather notebook with 100 GSM fountain-pen friendly cream pages.",
    stockQuantity: 30,
    inStock: true
  },
  {
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
    stockQuantity: 25,
    inStock: true
  },
  {
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
    stockQuantity: 35,
    inStock: true
  },
  {
    name: "Abstract Botanical Framed Wall Art",
    slug: "abstract-botanical-framed-wall-art",
    category: "Home Décor",
    price: 1299,
    originalPrice: 1699,
    rating: 4.6,
    reviewsCount: 28,
    image: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=800&q=80",
    images: ["https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=800&q=80"],
    featured: false,
    tags: ["Wall Art", "Modern"],
    description: "Minimalist botanical art print framed in natural pinewood with acrylic glass cover.",
    stockQuantity: 20,
    inStock: true
  },
  {
    name: "Woven Natural Seagrass Storage Basket",
    slug: "woven-natural-seagrass-storage-basket",
    category: "Household Essentials",
    price: 999,
    originalPrice: 1299,
    rating: 4.7,
    reviewsCount: 39,
    image: "https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&w=800&q=80",
    images: ["https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&w=800&q=80"],
    featured: false,
    tags: ["Eco Storage", "Organizers"],
    description: "Handwoven seagrass foldable belly basket with handles for home storage.",
    stockQuantity: 45,
    inStock: true
  },
  {
    name: "Insulated Stainless Steel Aesthetic Flask",
    slug: "insulated-stainless-steel-aesthetic-flask",
    category: "Lifestyle Accessories",
    price: 849,
    originalPrice: 1199,
    rating: 4.8,
    reviewsCount: 72,
    image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=800&q=80",
    images: ["https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=800&q=80"],
    featured: false,
    tags: ["Everyday", "Drinkware"],
    description: "Double-walled vacuum insulated thermal tumbler. Keeps drinks cold 24h / hot 12h.",
    stockQuantity: 60,
    inStock: true
  },
  {
    name: "Ceramic Coffee Mug with Coaster Set",
    slug: "ceramic-coffee-mug-coaster-set",
    category: "Household Essentials",
    price: 499,
    originalPrice: 699,
    rating: 4.9,
    reviewsCount: 110,
    image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80",
    images: ["https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80"],
    featured: false,
    tags: ["Coffee", "Ceramic"],
    description: "Speckled stoneware coffee mug paired with a matching cork-backed wooden coaster.",
    stockQuantity: 80,
    inStock: true
  },
  {
    name: "Linen Scented Room & Fabric Spray",
    slug: "linen-scented-room-fabric-spray",
    category: "Lifestyle Accessories",
    price: 449,
    originalPrice: 599,
    rating: 4.7,
    reviewsCount: 45,
    image: "https://images.unsplash.com/photo-1616949755610-8c9bbc08f138?auto=format&fit=crop&w=800&q=80",
    images: ["https://images.unsplash.com/photo-1616949755610-8c9bbc08f138?auto=format&fit=crop&w=800&q=80"],
    featured: false,
    tags: ["Home Fragrance", "Fresh"],
    description: "Instant room refresher crafted with lavender, white tea, and citrus floral hydrosols.",
    stockQuantity: 50,
    inStock: true
  },
  {
    name: "Handmade Ceramic Coaster Set (Pack of 4)",
    slug: "handmade-ceramic-coaster-set",
    category: "Home Décor",
    price: 649,
    originalPrice: 849,
    rating: 4.8,
    reviewsCount: 53,
    image: "https://images.unsplash.com/photo-1615873968403-89e068629265?auto=format&fit=crop&w=800&q=80",
    images: ["https://images.unsplash.com/photo-1615873968403-89e068629265?auto=format&fit=crop&w=800&q=80"],
    featured: false,
    tags: ["Tableware", "Handmade"],
    description: "Geometric terrazzo pattern ceramic coasters with non-slip cork base.",
    stockQuantity: 40,
    inStock: true
  },
  {
    name: "Pastel Hardcover Weekly Planner 2026",
    slug: "pastel-hardcover-weekly-planner-2026",
    category: "Stationery",
    price: 699,
    originalPrice: 899,
    rating: 4.9,
    reviewsCount: 95,
    image: "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?auto=format&fit=crop&w=800&q=80",
    images: ["https://images.unsplash.com/photo-1506784983877-45594efa4cbe?auto=format&fit=crop&w=800&q=80"],
    featured: false,
    tags: ["Planner", "Productivity"],
    description: "Undated 12-month goal tracking journal with habit trackers and budget spreads.",
    stockQuantity: 55,
    inStock: true
  },
  {
    name: "Minimalist Brass Leaf Bookmarks (Set of 3)",
    slug: "minimalist-brass-leaf-bookmarks",
    category: "Gifts",
    price: 399,
    originalPrice: 549,
    rating: 4.7,
    reviewsCount: 33,
    image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=800&q=80",
    images: ["https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=800&q=80"],
    featured: false,
    tags: ["Book Lovers", "Gifts"],
    description: "Laser-cut leaf brass bookmarks with satin tassel accents for avid bookworms.",
    stockQuantity: 70,
    inStock: true
  },
  {
    name: "Aesthetic Cotton Canvas Tote Bag",
    slug: "aesthetic-cotton-canvas-tote-bag",
    category: "Lifestyle Accessories",
    price: 499,
    originalPrice: 699,
    rating: 4.8,
    reviewsCount: 67,
    image: "https://images.unsplash.com/photo-1597484661643-2f5fef640dd1?auto=format&fit=crop&w=800&q=80",
    images: ["https://images.unsplash.com/photo-1597484661643-2f5fef640dd1?auto=format&fit=crop&w=800&q=80"],
    featured: false,
    tags: ["Eco Friendly", "Tote Bag"],
    description: "Heavy-duty organic cotton tote bag featuring minimal typography 'Little Things. Beautiful Living.'",
    stockQuantity: 50,
    inStock: true
  },
  {
    name: "Wooden Aromatherapy Reed Diffuser",
    slug: "wooden-aromatherapy-reed-diffuser",
    category: "Home Décor",
    price: 899,
    originalPrice: 1199,
    rating: 4.9,
    reviewsCount: 41,
    image: "https://images.unsplash.com/photo-1508746829417-e6f548d8d6ed?auto=format&fit=crop&w=800&q=80",
    images: ["https://images.unsplash.com/photo-1508746829417-e6f548d8d6ed?auto=format&fit=crop&w=800&q=80"],
    featured: false,
    tags: ["Diffuser", "Home Scent"],
    description: "Glass vessel topped with solid beechwood cap and 8 natural rattan reeds.",
    stockQuantity: 35,
    inStock: true
  },
  {
    name: "Scandinavian Stoneware Breakfast Bowl Set",
    slug: "scandinavian-stoneware-breakfast-bowl-set",
    category: "Household Essentials",
    price: 799,
    originalPrice: 1099,
    rating: 4.8,
    reviewsCount: 29,
    image: "https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&w=800&q=80",
    images: ["https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&w=800&q=80"],
    featured: true,
    tags: ["New Arrival", "Kitchenware"],
    description: "Set of 2 matte glazed ceramic cereal & soup bowls designed for slow cozy mornings.",
    stockQuantity: 40,
    inStock: true
  },
  {
    name: "Artisan Macramé Plant Hanger",
    slug: "artisan-macrame-plant-hanger",
    category: "Home Décor",
    price: 549,
    originalPrice: 749,
    rating: 4.7,
    reviewsCount: 36,
    image: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=800&q=80",
    images: ["https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=800&q=80"],
    featured: false,
    tags: ["Boho", "Handcrafted"],
    description: "100% natural cotton cord macramé planter holder crafted by local women artisans.",
    stockQuantity: 30,
    inStock: true
  },
  {
    name: "Minimalist Brass Desk Clock",
    slug: "minimalist-brass-desk-clock",
    category: "Stationery",
    price: 1399,
    originalPrice: 1799,
    rating: 4.9,
    reviewsCount: 22,
    image: "https://images.unsplash.com/photo-1563861826100-9cb868fdbe1c?auto=format&fit=crop&w=800&q=80",
    images: ["https://images.unsplash.com/photo-1563861826100-9cb868fdbe1c?auto=format&fit=crop&w=800&q=80"],
    featured: false,
    tags: ["Desk Clock", "Brass"],
    description: "Silent sweep quartz movement analog clock encased in brushed brass frame.",
    stockQuantity: 25,
    inStock: true
  },
  {
    name: "Handcrafted Herbal Tea & Honey Gift Set",
    slug: "handcrafted-herbal-tea-honey-gift-set",
    category: "Gifts",
    price: 1299,
    originalPrice: 1599,
    rating: 4.8,
    reviewsCount: 51,
    image: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=800&q=80",
    images: ["https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=800&q=80"],
    featured: true,
    tags: ["Gift Pack", "Wellness"],
    description: "Relaxing wellness hamper featuring 2 loose-leaf herbal tea blends, raw wild honey jar, and wooden dipper.",
    stockQuantity: 30,
    inStock: true
  },
  {
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
    stockQuantity: 35,
    inStock: true
  },
  {
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
    stockQuantity: 50,
    inStock: true
  },
  {
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
    stockQuantity: 40,
    inStock: true
  },
  {
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
    stockQuantity: 30,
    inStock: true
  },
  {
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
    stockQuantity: 45,
    inStock: true
  }
];

const seedDatabase = async () => {
  console.log("--------------------------------------------------");
  console.log("🌱 UrbanNest Database Seeding System Starting...");
  console.log("--------------------------------------------------");

  const connected = await connectDB();
  if (!connected) {
    console.error("❌ MongoDB connection failed. Aborting seed script.");
    process.exit(1);
  }

  try {
    // 1. Seed Categories
    await Category.deleteMany({});
    const insertedCategories = await Category.insertMany(categories);
    console.log(`✅ Categories Seeded: ${insertedCategories.length} collections/documents created.`);

    // 2. Seed Offers
    await Offer.deleteMany({});
    const insertedOffers = await Offer.insertMany(offers);
    console.log(`✅ Offers Seeded: ${insertedOffers.length} documents created.`);

    // 3. Seed Testimonials
    await Testimonial.deleteMany({});
    const insertedTestimonials = await Testimonial.insertMany(testimonials);
    console.log(`✅ Testimonials Seeded: ${insertedTestimonials.length} documents created.`);

    // 4. Seed Products
    await Product.deleteMany({});
    const insertedProducts = await Product.insertMany(products);
    console.log(`✅ Products Seeded: ${insertedProducts.length} documents created.`);

    console.log("--------------------------------------------------");
    console.log("🎉 SUCCESS: MongoDB Database Seeding Complete!");
    console.log("📦 Collections Active in MongoDB Atlas:");
    console.log(`   - categories  : ${insertedCategories.length} records`);
    console.log(`   - offers      : ${insertedOffers.length} records`);
    console.log(`   - testimonials: ${insertedTestimonials.length} records`);
    console.log(`   - products    : ${insertedProducts.length} records`);
    console.log("--------------------------------------------------");

    process.exit(0);
  } catch (error) {
    console.error("❌ Database Seeding Error:", error);
    process.exit(1);
  }
};

seedDatabase();
