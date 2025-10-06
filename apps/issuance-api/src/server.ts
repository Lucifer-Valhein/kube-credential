import express from "express";
import cors from "cors";
import { registerRoutes } from "./routes.js";

export function createServer() {
  const app = express();

  // ✅ Allow requests from your frontend
  app.use(cors({
    origin: "http://localhost:3000",   // frontend origin
    methods: ["GET", "POST"],          // allowed HTTP methods
    allowedHeaders: ["Content-Type"],  // allowed headers
  }));

  // ✅ Parse JSON
  app.use(express.json({ limit: "1mb" }));

  // ✅ Register API routes
  registerRoutes(app);

  // ✅ Health check endpoint
  app.get("/healthz", (_req, res) => res.json({ ok: true }));

  return app;
}
