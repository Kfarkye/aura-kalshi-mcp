import { z } from "zod";

// Auto-generated Zod schemas for kalshi API

export const RateLimitConfigSchema = z.object({
  enabled: z.boolean().default(true),
  maxRequests: z.number().default(100),
  windowMs: z.number().default(60000)
});

// Example domain schema based on OpenAPI analysis
export const APIRequestSchema = z.object({
  endpoint: z.string(),
  method: z.enum(['GET', 'POST', 'PUT', 'DELETE']),
  params: z.record(z.any()).optional()
});
