import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      default: 0,
    },
    size: {
      type: [String],
      required: true,
      enum: ["S", "M", "L", "XL", "XXL"],
    },
    color: {
      type: [String],
      required: true,
    },
    category: {
      type: String,
      required: true,
      enum: ["Bridal Lehenga", "Wedding Guest Lehenga", "Party Wear Lehenga", "Engagement Lehenga", "Festive Lehenga", "Designer Pieces"],
    },
    images: {
      type: [String], // Array of URLs
      required: true,
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    inventory: {
      type: Number,
      default: 1,
    },
    gst: {
      type: Number,
      default: 12, // Default 12% GST
    },
    fabric: String,
    work: String,
    delivery: String,
    securityDeposit: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model("Product", productSchema);

export default Product;
