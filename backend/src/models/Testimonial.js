import mongoose from "mongoose";

const testimonialSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    role: {
      type: String,
      default: "Verified Customer"
    },
    location: {
      type: String,
      default: "India"
    },
    rating: {
      type: Number,
      default: 5,
      min: 1,
      max: 5
    },
    comment: {
      type: String,
      required: true
    },
    avatar: {
      type: String,
      default: ""
    },
    approved: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

export const Testimonial =
  mongoose.models.Testimonial || mongoose.model("Testimonial", testimonialSchema);
