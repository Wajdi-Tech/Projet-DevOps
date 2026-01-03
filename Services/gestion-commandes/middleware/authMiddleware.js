import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const jwtSecret = process.env.JWT_SECRET;

// JWT Authentication Middleware
const authenticate = (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");


  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, jwtSecret);
    
    
    req.user = decoded; // Attach user info to request
    next();
  } catch (error) {
    console.log(error);
    
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

// Admin Middleware
const isAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Forbidden: Admin access required" });
  }
  next();
};

export { authenticate, isAdmin };
