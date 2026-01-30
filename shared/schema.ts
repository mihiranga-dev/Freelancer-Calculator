import { sql } from "drizzle-orm";
import { pgTable, text, serial, numeric, timestamp, varchar, jsonb, index } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// --- Mandatory Replit Auth Tables ---
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)]
);

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique(),
  username: text("username").unique(),
  fullName: text("full_name"),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// --- Application Tables ---
export const calculations = pgTable("calculations", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id),
  projectPrice: numeric("project_price").notNull(),
  feeAmount: numeric("fee_amount").notNull(),
  takeHomeUSD: numeric("take_home_usd").notNull(),
  targetCurrency: text("target_currency").notNull(),
  exchangeRate: numeric("exchange_rate").notNull(),
  finalAmount: numeric("final_amount").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// --- Schemas & Types ---
export const insertUserSchema = createInsertSchema(users).omit({ id: true, createdAt: true, updatedAt: true });
export const insertCalculationSchema = createInsertSchema(calculations).omit({
  id: true,
  createdAt: true,
});

export type User = typeof users.$inferSelect;
export type UpsertUser = typeof users.$inferInsert;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Calculation = typeof calculations.$inferSelect;
export type InsertCalculation = z.infer<typeof insertCalculationSchema>;

export const currencySchema = z.object({
  code: z.string(),
  name: z.string(),
});

export type Currency = z.infer<typeof currencySchema>;

export const calculateRequestSchema = z.object({
  amount: z.number().min(0),
  targetCurrency: z.string(),
});

export type CalculateRequest = z.infer<typeof calculateRequestSchema>;

export const updateUserSchema = z.object({
  firstName: z.string().min(1).optional(),
  lastName: z.string().min(1).optional(),
});

export type UpdateUser = z.infer<typeof updateUserSchema>;
