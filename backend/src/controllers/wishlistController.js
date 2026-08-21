import { Wishlist } from "../models/Wishlist.js";
import { Product } from "../models/Product.js";
import { successResponse, errorResponse } from "../utils/apiResponse.js";

const formatProductItem = (item) => {
  if (!item.product) return null;
  const p = item.product.toObject ? item.product.toObject() : item.product;
  return {
    ...p,
    id: p._id ? p._id.toString() : p.id,
    image: p.image || p.imageUrl || (p.images && p.images[0]) || "",
    addedAt: item.addedAt
  };
};

// GET /api/wishlist
export const getWishlist = async (req, res, next) => {
  try {
    const userId = req.user.id;

    let wishlist = await Wishlist.findOne({ user: userId }).populate("products.product");

    if (!wishlist) {
      wishlist = await Wishlist.create({ user: userId, products: [] });
    }

    const populatedProducts = wishlist.products
      .map(formatProductItem)
      .filter(Boolean);

    return successResponse(res, { products: populatedProducts }, "Wishlist retrieved successfully");
  } catch (error) {
    next(error);
  }
};

// POST /api/wishlist/:productId
export const addToWishlist = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { productId } = req.params;

    // Check if product exists
    const productExists = await Product.findById(productId);
    if (!productExists) {
      return errorResponse(res, "Product not found.", 404);
    }

    let wishlist = await Wishlist.findOne({ user: userId });
    if (!wishlist) {
      wishlist = await Wishlist.create({ user: userId, products: [] });
    }

    // Check duplicate
    const isDuplicate = wishlist.products.some(
      (item) => item.product.toString() === productId.toString()
    );

    if (isDuplicate) {
      return errorResponse(res, "Product is already in your wishlist.", 409);
    }

    wishlist.products.unshift({ product: productId, addedAt: new Date() });
    await wishlist.save();

    await wishlist.populate("products.product");

    const populatedProducts = wishlist.products
      .map(formatProductItem)
      .filter(Boolean);

    return successResponse(
      res,
      { wishlist: { products: populatedProducts } },
      "Product added to wishlist.",
      201
    );
  } catch (error) {
    next(error);
  }
};

// DELETE /api/wishlist/:productId
export const removeFromWishlist = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { productId } = req.params;

    const wishlist = await Wishlist.findOne({ user: userId });
    if (!wishlist) {
      return errorResponse(res, "Wishlist not found.", 404);
    }

    wishlist.products = wishlist.products.filter(
      (item) => item.product.toString() !== productId.toString()
    );

    await wishlist.save();
    await wishlist.populate("products.product");

    const populatedProducts = wishlist.products
      .map(formatProductItem)
      .filter(Boolean);

    return successResponse(
      res,
      { wishlist: { products: populatedProducts } },
      "Product removed from wishlist."
    );
  } catch (error) {
    next(error);
  }
};

// GET /api/wishlist/check/:productId
export const checkWishlistStatus = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { productId } = req.params;

    const wishlist = await Wishlist.findOne({ user: userId });
    if (!wishlist) {
      return successResponse(res, { isWishlisted: false });
    }

    const isWishlisted = wishlist.products.some(
      (item) => item.product.toString() === productId.toString()
    );

    return successResponse(res, { isWishlisted });
  } catch (error) {
    next(error);
  }
};
