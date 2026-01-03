import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Reference to User model
      required: true,
    },
    items: [
      {
        ID: { type: String, required: true },
        Name: { type: String, required: true },
        quantity: { type: Number, required: true },
        Price: { type: Number, required: true },
      },
    ],
    address: {
      address: { type: String, required: true },
      city: { type: String, required: true },
      zip: { type: String, required: true },
    },
    total: { type: Number, required: true },
  },
  { timestamps: true }
);

export default mongoose.model("Order", OrderSchema); 