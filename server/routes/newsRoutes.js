import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";
import ApiKeyManager from "../utils/apiKeyManager.js";

dotenv.config();

const router = express.Router();

// Initialize API keys from environment variables
const API_KEYS = [
  process.env.NEWS_API_KEY,
  process.env.NEWS_API_KEY_2,
  process.env.NEWS_API_KEY_3,
  process.env.NEWS_API_KEY_4,
  process.env.NEWS_API_KEY_5,
].filter((key) => key && key.trim() !== "");

if (API_KEYS.length === 0) {
  process.exit(1); //no api-key inn code to handle that
}

const apiKeyManager = new ApiKeyManager(API_KEYS);
const BASE_URL = "https://newsdata.io/api/1";

// Enhanced fetch function with retry logic and key rotation
const fetchWithRetry = async (url, maxRetries = API_KEYS.length) => {
  let lastError = null;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const currentKey = apiKeyManager.getCurrentKey();
      const urlWithKey = new URL(url);
      urlWithKey.searchParams.set("apikey", currentKey);

      const response = await fetch(urlWithKey.toString());

      if (response.status === 429) {
        apiKeyManager.markKeyAsBlocked(currentKey, 60); // Block for 60 minutes
        lastError = new Error("Rate limit exceeded");
        continue; // Try next key
      }

      if (response.status === 403) {
        apiKeyManager.markKeyAsBlocked(currentKey, 1440); // Block for 24 hours
        lastError = new Error("Authentication error");
        continue; // Try next key
      }

      if (!response.ok) {
        lastError = new Error("API request failed");
        if (attempt < maxRetries - 1) {
          apiKeyManager.rotateToNextKey();
          continue;
        }
        throw lastError;
      }

      return response;
    } catch (error) {
      lastError = error;
      if (attempt < maxRetries - 1) {
        apiKeyManager.rotateToNextKey();
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    }
  }

  throw lastError || new Error("All API keys exhausted");
};

// Helper function to build API URL with filters
const buildApiUrl = (endpoint, params = {}) => {
  const url = new URL(`${BASE_URL}/${endpoint}`);
  Object.entries(params).forEach(([key, value]) => {
    if (value && value.trim() !== "") {
      url.searchParams.append(key, value);
    }
  });
  return url.toString();
};

// Helper function to handle timeframe filter
const getTimeframeDate = (timeframe) => {
  if (!timeframe) return null;

  const now = new Date();
  switch (timeframe) {
    case "24h":
      return new Date(now.getTime() - 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0];
    case "7d":
      return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0];
    case "30d":
      return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0];
    default:
      return null;
  }
};

// Add API status endpoint for monitoring
router.get("/api-status", (req, res) => {
  const status = apiKeyManager.getStatus();
  res.json({
    ...status,
    timestamp: new Date().toISOString(),
  });
});

// Add manual reset endpoint (for development/testing)-frontend
router.post("/reset-keys", (req, res) => {
  apiKeyManager.resetAllKeys();
  res.json({ message: "All API keys reset successfully" });
});

// Search news articles
router.get("/search", async (req, res) => {
  const { q, language, country, timeframe } = req.query;

  if (!q) {
    return res.status(400).json({ error: "Search query is required" });
  }

  try {
    const params = { q };
    if (language && language.trim() !== "") {
      params.language = language;
    }
    if (country && country.trim() !== "") {
      params.country = country;
    }
    const fromDate = getTimeframeDate(timeframe);
    if (fromDate) {
      params.from_date = fromDate;
    }

    const url = buildApiUrl("news", params);
    const response = await fetchWithRetry(url);
    const data = await response.json();
    res.json(data.results || []);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch news articles" });
  }
});

// Fetch news by category
router.get("/category/:category", async (req, res) => {
  const { category } = req.params;
  const { language, country, timeframe } = req.query;

  try {
    const params = { category: category.toLowerCase() };
    if (language && language.trim() !== "") {
      params.language = language;
    }
    if (country && country.trim() !== "") {
      params.country = country;
    }
    const fromDate = getTimeframeDate(timeframe);
    if (fromDate) {
      params.from_date = fromDate; //currently in development
    }

    const url = buildApiUrl("news", params);
    const response = await fetchWithRetry(url);
    const data = await response.json();
    res.json(data.results || []);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch news articles" });
  }
});

// Fetch top headlines
router.get("/top-headlines", async (req, res) => {
  const { language, country, timeframe } = req.query;

  try {
    const params = { prioritydomain: "top" };
    if (language && language.trim() !== "") {
      params.language = language;
    }
    if (country && country.trim() !== "") {
      params.country = country;
    }
    const fromDate = getTimeframeDate(timeframe);
    if (fromDate) {
      params.from_date = fromDate;
    }

    const url = buildApiUrl("news", params);
    const response = await fetchWithRetry(url);
    const data = await response.json();
    res.json(data.results || []);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch news articles" });
  }
});

export default router;
