import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// Ensure data directory exists
const DATA_DIR = path.join(process.cwd(), "data");
const SETTINGS_FILE = path.join(DATA_DIR, "settings.json");

if (!fs.existsSync(DATA_DIR)) {
  try {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  } catch (err) {
    console.error("Error creating data directory:", err);
  }
}

// API Routes
app.get("/api/settings", (req, res) => {
  try {
    if (fs.existsSync(SETTINGS_FILE)) {
      const content = fs.readFileSync(SETTINGS_FILE, "utf-8");
      if (content && content.trim().length > 0) {
        return res.json(JSON.parse(content));
      }
    }
  } catch (err) {
    console.error("Error reading settings file:", err);
  }
  return res.json({ empty: true });
});

app.post("/api/settings", (req, res) => {
  try {
    const { data } = req.body;

    if (!data) {
      return res.status(400).json({ success: false, error: "No data provided" });
    }

    fs.writeFileSync(SETTINGS_FILE, JSON.stringify(data), "utf-8");
    return res.json({ success: true });
  } catch (err: any) {
    console.error("Error saving settings:", err);
    return res.status(500).json({ success: false, error: err?.message || "Server error saving data" });
  }
});

// Global error handler for Express (e.g. payload too large)
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  if (err) {
    console.error("Express middleware error:", err);
    return res.status(err.status || 500).json({
      success: false,
      error: err.message || "Server payload error"
    });
  }
  next();
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
