import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@shared/routes";
import { type CalculateRequest } from "@shared/schema";
import { z } from "zod";

// Fetch supported currencies and rates
export function useCurrencies() {
  return useQuery({
    queryKey: [api.calculator.currencies.path],
    queryFn: async () => {
      const res = await fetch(api.calculator.currencies.path);
      if (!res.ok) throw new Error("Failed to fetch currencies");
      return api.calculator.currencies.responses[200].parse(await res.json());
    },
    // Cache for 1 hour since rates don't change instantly
    staleTime: 1000 * 60 * 60,
  });
}

// Perform calculation
export function useCalculate() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: CalculateRequest) => {
      const res = await fetch(api.calculator.calculate.path, {
        method: api.calculator.calculate.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      
      if (!res.ok) {
        if (res.status === 400) {
          const errorData = await res.json();
          throw new Error(errorData.message || "Invalid input");
        }
        throw new Error("Calculation failed");
      }
      
      return api.calculator.calculate.responses[200].parse(await res.json());
    },
    // Refresh history after a successful calculation
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.calculator.history.path] });
    },
  });
}

// Fetch calculation history
export function useHistory() {
  return useQuery({
    queryKey: [api.calculator.history.path],
    queryFn: async () => {
      const res = await fetch(api.calculator.history.path);
      if (!res.ok) throw new Error("Failed to fetch history");
      return api.calculator.history.responses[200].parse(await res.json());
    },
  });
}
