// JWT Authentication Middleware
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Access denied. Token missing or invalid." });
  }

  const token = authHeader.split(" ")[1];

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET || "super_secret_key_for_mathquest_game_jwt_tokens");
    req.user = verified; // Attaches { userId, email }
    next();
  } catch (error) {
    return res.status(401).json({ error: "Access denied. Token expired or invalid signature." });
  }
};
