import { Category } from "../models/Category.js";
import { Product } from "../models/Product.js";
import { MOCK_PRODUCTS } from "../services/productService.js";
import { successResponse, errorResponse } from "../utils/apiResponse.js";

const DEFAULT_CATEGORIES = [
  {
    name: "Home Décor",
    slug: "home-decor",
    tagline: "Beautiful pieces for your space",
    description: "Vases, scented candles, warm lighting, and accent pieces.",
    image: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=800&q=80",
    itemCount: "48+ items"
  },
  {
    name: "Gifts",
    slug: "gifts",
    tagline: "Thoughtful gifts for every occasion",
    description: "Curated hampers, artisan keepsakes, and surprises.",
    image: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=800&q=80",
    itemCount: "35+ items"
  },
  {
    name: "Stationery",
    slug: "stationery",
    tagline: "Creative and practical stationery",
    description: "Artisan notebooks, planners, wooden organizers, and refined writing tools.",
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

// GET /api/categories
export const getCategories = async (req, res, next) => {
  try {
    let categories = [];
    try {
      categories = await Category.find().lean();
    } catch {
      categories = DEFAULT_CATEGORIES;
    }

    if (categories.length === 0) {
      categories = DEFAULT_CATEGORIES;
    }

    return successResponse(res, categories, "Categories fetched successfully");
  } catch (error) {
    next(error);
  }
};

// GET /api/categories/:slug
export const getCategoryBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params;
    let category = null;

    try {
      category = await Category.findOne({ slug }).lean();
    } catch {
      category = DEFAULT_CATEGORIES.find((c) => c.slug === slug);
    }

    if (!category) {
      category = DEFAULT_CATEGORIES.find((c) => c.slug === slug);
    }

    if (!category) {
      return errorResponse(res, `Category '${slug}' not found`, 404);
    }

    // Get products under category
    let products = [];
    try {
      products = await Product.find({
        category: new RegExp(category.name, "i")
      }).lean();
    } catch {
      products = MOCK_PRODUCTS.filter(
        (p) => p.category.toLowerCase() === category.name.toLowerCase()
      );
    }

    return successResponse(res, { category, products }, "Category and products fetched");
  } catch (error) {
    next(error);
  }
};
