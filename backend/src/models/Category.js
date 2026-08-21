import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    tagline: {
      type: String,
      default: ""
    },
    description: {
      type: String,
      default: ""
    },
    image: {
      type: String,
      required: true
    },
    itemCount: {
      type: String,
      default: "20+ items"
    }
  },
  {
    timestamps: true
  }
);

export const Category = mongoose.models.Category || mongoose.model("Category", categorySchema);
