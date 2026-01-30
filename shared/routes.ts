import { z } from "zod";
import { calculateRequestSchema, insertCalculationSchema, calculations, type CalculateRequest } from "./schema";

export { type CalculateRequest };

export const api = {
  calculator: {
    calculate: {
      method: "POST" as const,
      path: "/api/calculate",
      input: calculateRequestSchema,
      responses: {
        200: z.object({
          projectPrice: z.number(),
          feeAmount: z.number(),
          takeHomeUSD: z.number(),
          targetCurrency: z.string(),
          exchangeRate: z.number(),
          finalAmount: z.number(),
        }),
        400: z.object({ message: z.string() }),
      },
    },
    history: {
      method: "GET" as const,
      path: "/api/history",
      responses: {
        200: z.array(z.custom<typeof calculations.$inferSelect>()),
      },
    },
    currencies: {
      method: "GET" as const,
      path: "/api/currencies",
      responses: {
        200: z.object({
          rates: z.record(z.number()),
          lastUpdate: z.string(),
        }),
      },
    },
  },
};
