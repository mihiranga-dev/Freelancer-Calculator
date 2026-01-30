import { db } from "./db";
import { calculations, users, type InsertCalculation, type Calculation, type User, type UpsertUser } from "@shared/schema";
import { desc, eq } from "drizzle-orm";
import { type IAuthStorage } from "./replit_integrations/auth/storage";

export interface IStorage extends IAuthStorage {
  createCalculation(calculation: InsertCalculation): Promise<Calculation>;
  getHistory(userId: string): Promise<Calculation[]>;
  updateUser(id: string, data: Partial<User>): Promise<User>;
}

export class DatabaseStorage implements IStorage {
  // Auth methods
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  async updateUser(id: string, data: Partial<User>): Promise<User> {
    const [user] = await db
      .update(users)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();
    if (!user) throw new Error("User not found");
    return user;
  }

  // App methods
  async createCalculation(calculation: InsertCalculation): Promise<Calculation> {
    const [result] = await db
      .insert(calculations)
      .values(calculation)
      .returning();
    return result;
  }

  async getHistory(userId: string): Promise<Calculation[]> {
    return await db
      .select()
      .from(calculations)
      .where(eq(calculations.userId, userId))
      .orderBy(desc(calculations.createdAt))
      .limit(10);
  }
}

export const storage = new DatabaseStorage();
