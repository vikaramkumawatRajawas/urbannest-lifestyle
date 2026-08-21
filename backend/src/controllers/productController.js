import { fetchProducts, MOCK_PRODUCTS } from "../services/productService.js";
import { Product } from "../models/Product.js";
import { successResponse, errorResponse } from "../utils/apiResponse.js";

// GET /api/products
export const getProducts = async (req, res, next) => {
  try {
    const result = await fetchProducts(req.query);
    return successResponse(res, result.products, "Products fetched successfully", 200, result.pagination);
  } catch (error) {
    next(error);
  }
};

// GET /api/products/featured
export const getFeaturedProducts = async (req, res, next) => {
  try {
    let featured = [];
    try {
      featured = await Product.find({ featured: true }).lean();
    } catch {
      featured = MOCK_PRODUCTS.filter((p) => p.featured);
    }
    if (featured.length === 0) {
      featured = MOCK_PRODUCTS.filter((p) => p.featured);
    }
    return successResponse(res, featured, "Featured products fetched successfully");
  } catch (error) {
    next(error);
  }
};

// GET /api/products/:id
export const getProductById = async (req, res, next) => {
  try {
    const { id } = req.params;
    let product = null;

    if (id.startsWith("prod-")) {
      product = MOCK_PRODUCTS.find((p) => p._id === id);
    } else {
      try {
        product = await Product.findById(id).lean();
      } catch {
        product = MOCK_PRODUCTS.find((p) => p._id === id || p.slug === id);
      }
    }

    if (!product) {
      return errorResponse(res, "Product not found", 404);
    }

    // Related products
    let related = MOCK_PRODUCTS.filter(
      (p) => p.category === product.category && (p._id || p.id) !== id
    ).slice(0, 3);

    return successResponse(res, { product, related }, "Product details fetched");
  } catch (error) {
    next(error);
  }
};
