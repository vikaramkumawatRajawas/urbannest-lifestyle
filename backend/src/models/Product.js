import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
      index: true
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    description: {
      type: String,
      required: [true, "Product description is required"]
    },
    shortDescription: {
      type: String,
      default: ""
    },
    category: {
      type: String,
      required: [true, "Product category is required"],
      index: true
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price cannot be negative"],
      index: true
    },
    originalPrice: {
      type: Number,
      default: null
    },
    rating: {
      type: Number,
      default: 5.0,
      min: 1,
      max: 5
    },
    reviewsCount: {
      type: Number,
      default: 0
    },
    images: {
      type: [String],
      required: true,
      default: []
    },
    tags: {
      type: [String],
      default: [],
      index: true
    },
    features: {
      type: [String],
      default: []
    },
    featured: {
      type: Boolean,
      default: false,
      index: true
    },
    inStock: {
      type: Boolean,
      default: true
    },
    stockQuantity: {
      type: Number,
      default: 50,
      min: 0
    }
  },
  {
    timestamps: true
  }
);

// Index for text search
productSchema.index({ name: "text", description: "text", category: "text", tags: "text" });

export const Product = mongoose.models.Product || mongoose.model("Product", productSchema);
