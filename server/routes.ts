import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import { setupAuth, registerAuthRoutes, isAuthenticated } from "./replit_integrations/auth";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Setup Authentication
  await setupAuth(app);
  registerAuthRoutes(app);

  // Cache for exchange rates
  let cachedRates: Record<string, number> | null = null;
  let lastFetchTime = 0;
  const CACHE_DURATION = 1000 * 60 * 60; // 1 hour

  async function getRates() {
    const now = Date.now();
    if (cachedRates && (now - lastFetchTime < CACHE_DURATION)) {
      return cachedRates;
    }

    try {
      const response = await fetch("https://open.er-api.com/v6/latest/USD");
      const data = await response.json();
      if (data && data.rates) {
        cachedRates = data.rates;
        lastFetchTime = now;
        return cachedRates;
      }
      throw new Error("Invalid rates data");
    } catch (error) {
      console.error("Failed to fetch rates:", error);
      return cachedRates || {};
    }
  }

  app.get(api.calculator.currencies.path, async (req, res) => {
    const rates = await getRates();
    res.json({
      rates: rates || {},
      lastUpdate: new Date(lastFetchTime).toISOString(),
    });
  });

  app.post(api.calculator.calculate.path, isAuthenticated, async (req: any, res) => {
    try {
      const input = api.calculator.calculate.input.parse(req.body);
      const rates = await getRates();
      const userId = req.user.claims.sub;
      
      const rate = rates?.[input.targetCurrency] || 1;
      const projectPrice = input.amount;
      const feeAmount = projectPrice * 0.20;
      const takeHomeUSD = projectPrice - feeAmount;
      const finalAmount = takeHomeUSD * rate;

      const calc = await storage.createCalculation({
        userId,
        projectPrice: projectPrice.toString(),
        feeAmount: feeAmount.toString(),
        takeHomeUSD: takeHomeUSD.toString(),
        targetCurrency: input.targetCurrency,
        exchangeRate: rate.toString(),
        finalAmount: finalAmount.toString(),
      });

      res.json({
        projectPrice,
        feeAmount,
        takeHomeUSD,
        targetCurrency: input.targetCurrency,
        exchangeRate: rate,
        finalAmount,
      });
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get(api.calculator.history.path, isAuthenticated, async (req: any, res) => {
    const userId = req.user.claims.sub;
    const history = await storage.getHistory(userId);
    res.json(history);
  });

  app.patch("/api/user/profile", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { firstName, lastName } = req.body;
      const user = await storage.updateUser(userId, { firstName, lastName });
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Failed to update profile" });
    }
  });

  return httpServer;
}
