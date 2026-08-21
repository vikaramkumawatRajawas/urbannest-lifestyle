import { Cart } from "../models/Cart.js";
import { Product } from "../models/Product.js";
import { successResponse, errorResponse } from "../utils/apiResponse.js";
import { validateAddToCart, validateUpdateCartItem } from "../validators/cartValidator.js";

const formatCartResponse = (cart) => {
  if (!cart) return { items: [], totalAmount: 0, itemCount: 0 };
  
  const formattedItems = cart.items
    .filter((item) => item.product)
    .map((item) => {
      const p = item.product.toObject ? item.product.toObject() : item.product;
      const price = p.price || item.priceAtAdd || 0;
      return {
        product: {
          ...p,
          id: p._id ? p._id.toString() : p.id,
          image: p.image || p.imageUrl || (p.images && p.images[0]) || ""
        },
        quantity: item.quantity,
        priceAtAdd: item.priceAtAdd || price,
        itemTotal: price * item.quantity
      };
    });

  const totalAmount = formattedItems.reduce((acc, curr) => acc + curr.itemTotal, 0);
  const itemCount = formattedItems.reduce((acc, curr) => acc + curr.quantity, 0);

  return {
    id: cart._id ? cart._id.toString() : cart.id,
    items: formattedItems,
    totalAmount,
    itemCount,
    updatedAt: cart.updatedAt
  };
};

// GET /api/cart
export const getCart = async (req, res, next) => {
  try {
    const userId = req.user.id;
    let cart = await Cart.findOne({ user: userId }).populate("items.product");

    if (!cart) {
      cart = await Cart.create({ user: userId, items: [] });
    }

    return successResponse(res, { cart: formatCartResponse(cart) }, "Cart retrieved successfully");
  } catch (error) {
    next(error);
  }
};

// POST /api/cart/add
export const addToCart = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { productId, quantity = 1, priceAtAdd } = req.body;

    const { error } = validateAddToCart({ productId, quantity, priceAtAdd });
    if (error) {
      return errorResponse(res, error.details.map((d) => d.message).join(", "), 400);
    }

    const product = await Product.findById(productId);
    if (!product) {
      return errorResponse(res, "Product not found.", 404);
    }

    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
      cart = await Cart.create({ user: userId, items: [] });
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId.toString()
    );

    const price = priceAtAdd !== undefined ? priceAtAdd : product.price;

    if (itemIndex > -1) {
      cart.items[itemIndex].quantity += quantity;
      cart.items[itemIndex].priceAtAdd = price;
    } else {
      cart.items.push({
        product: productId,
        quantity,
        priceAtAdd: price
      });
    }

    await cart.save();
    await cart.populate("items.product");

    return successResponse(
      res,
      { cart: formatCartResponse(cart) },
      "Product added to cart successfully.",
      200
    );
  } catch (error) {
    next(error);
  }
};

// PUT /api/cart/update
export const updateCartItem = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { productId, quantity } = req.body;

    const { error } = validateUpdateCartItem({ productId, quantity });
    if (error) {
      return errorResponse(res, error.details.map((d) => d.message).join(", "), 400);
    }

    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return errorResponse(res, "Cart not found.", 404);
    }

    if (quantity <= 0) {
      cart.items = cart.items.filter(
        (item) => item.product.toString() !== productId.toString()
      );
    } else {
      const itemIndex = cart.items.findIndex(
        (item) => item.product.toString() === productId.toString()
      );
      if (itemIndex > -1) {
        cart.items[itemIndex].quantity = quantity;
      } else {
        return errorResponse(res, "Item not found in cart.", 404);
      }
    }

    await cart.save();
    await cart.populate("items.product");

    return successResponse(
      res,
      { cart: formatCartResponse(cart) },
      "Cart updated successfully."
    );
  } catch (error) {
    next(error);
  }
};

// DELETE /api/cart/remove/:productId
export const removeFromCart = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { productId } = req.params;

    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return errorResponse(res, "Cart not found.", 404);
    }

    cart.items = cart.items.filter(
      (item) => item.product.toString() !== productId.toString()
    );

    await cart.save();
    await cart.populate("items.product");

    return successResponse(
      res,
      { cart: formatCartResponse(cart) },
      "Product removed from cart successfully."
    );
  } catch (error) {
    next(error);
  }
};

// DELETE /api/cart/clear
export const clearCart = async (req, res, next) => {
  try {
    const userId = req.user.id;
    let cart = await Cart.findOne({ user: userId });
    if (cart) {
      cart.items = [];
      await cart.save();
    }
    return successResponse(
      res,
      { cart: { items: [], totalAmount: 0, itemCount: 0 } },
      "Cart cleared successfully."
    );
  } catch (error) {
    next(error);
  }
};
