import { z } from "zod";

export const registerSchema = z.object({
  userName: z
    .string()
    .min(5, "Username too short")
    .max(20, "Username too long"),

  email: z
  .string()
  .email("Invalid email format"),

  password: z
    .string()
    .min(5, "Password must be at least 5 chars"),
});

export type RegisterInput = z.infer<typeof registerSchema>;
