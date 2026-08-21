import mongoose from "mongoose";

const customerQuerySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Customer name is required"],
      trim: true
    },
    email: {
      type: String,
      required: [true, "Email address is required"],
      lowercase: true,
      trim: true
    },
    phone: {
      type: String,
      default: "Not provided",
      trim: true
    },
    category: {
      type: String,
      required: [true, "Query category is required"],
      enum: [
        "Product Inquiry",
        "Order Inquiry",
        "Delivery",
        "Store Information",
        "Complaint",
        "Feedback",
        "Other"
      ]
    },
    message: {
      type: String,
      required: [true, "Message details are required"]
    },
    status: {
      type: String,
      enum: ["new", "processing", "resolved", "closed"],
      default: "new"
    },
    n8nStatus: {
      type: String,
      enum: ["pending", "success", "failed"],
      default: "pending"
    },
    n8nResponse: {
      type: mongoose.Schema.Types.Mixed,
      default: null
    }
  },
  {
    timestamps: true
  }
);

export const CustomerQuery =
  mongoose.models.CustomerQuery || mongoose.model("CustomerQuery", customerQuerySchema);
