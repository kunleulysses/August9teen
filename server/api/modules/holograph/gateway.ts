import express from "express";
import { wsRateLimiter } from "./rateLimit";
// TODO: Implement JWT auth, rate-limiting, WebSocket gateway logic

export const router = express.Router();

// TODO: Wire up routes, use wsRateLimiter, add authentication
router.get("/", (req, res) => {
  res.json({ message: "Holograph gateway placeholder" });
});