import express from "express";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import Order from "../models/Order.js";
import { authenticate, isAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

// Separate connection to authentication-service database
const authServiceConnection = mongoose.createConnection(
  process.env.AUTH_SERVICE_DB_URI || "mongodb://localhost:27017/authentication-service",
  {}
);

// Define User schema for authentication-service
const User = authServiceConnection.model(
  "User",
  new mongoose.Schema({
    firstName: String,
    lastName: String,
    email: String,
    role: String,
  }),
  "users"
);

// ✅ Create an order
router.post("/order", async (req, res) => {
  try {
    const { token, items, address, total } = req.body;

    if (!token) {
      return res.status(401).json({ message: "Unauthorized: No token provided" });
    }

    // Verify token and extract userId
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId;

    // Validate required fields
    if (!items || items.length === 0 || !address || !total) {
      return res.status(400).json({ message: "Invalid order data" });
    }

    // Fetch user data from authentication-service
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Create and save order
    const newOrder = new Order({
      user: userId,
      items,
      address,
      total,
    });

    await newOrder.save();

    res.status(201).json({ message: "Order placed successfully", order: newOrder });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// ✅ Get logged-in user's orders
router.get("/my-orders", authenticate, async (req, res) => {
  try {
    const userId = req.user.userId; // Extracted from token by authenticate middleware
    const orders = await Order.find({ user: userId }).sort({ createdAt: -1 }); // Newest first
    res.status(200).json({ orders });
  } catch (error) {
    console.error("Error fetching user orders:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// ✅ Get all orders with user details
router.get("/orders", authenticate, isAdmin, async (req, res) => {
  try {
    console.log("Fetching orders...");

    // Fetch all orders
    const orders = await Order.find();

    // Fetch user details for each order
    const ordersWithUsers = await Promise.all(
      orders.map(async (order) => {
        const user = await User.findById(order.user).select("firstName lastName email role");
        return {
          ...order.toObject(),
          user: user
            ? {
              firstName: user.firstName,
              lastName: user.lastName,
              email: user.email,
              role: user.role,
            }
            : { firstName: "Unknown", lastName: "", email: "N/A", role: "N/A" },
        };
      })
    );

    res.status(200).json({ orders: ordersWithUsers });
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

export default router;
