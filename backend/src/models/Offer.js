import mongoose from "mongoose";

const offerSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true
    },
    subtitle: {
      type: String,
      default: ""
    },
    discount: {
      type: String,
      required: true
    },
    code: {
      type: String,
      required: true,
      uppercase: true,
      trim: true
    },
    description: {
      type: String,
      default: ""
    },
    bgGradient: {
      type: String,
      default: "from-amber-500 to-orange-600"
    },
    expiresIn: {
      type: String,
      default: "Limited Time Offer"
    },
    active: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

export const Offer = mongoose.models.Offer || mongoose.model("Offer", offerSchema);
