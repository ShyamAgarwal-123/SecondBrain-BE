import { z } from "zod";
export const signUpUserSchemaZod = z.object({
  username: z
    .string()
    .min(3, { message: "minimum 3 character is required" })
    .max(40, { message: "maximum 40 charecter is reached" }),
  email: z.string().email(),
  password: z
    .string()
    .min(8, { message: "minimum 8 character is required" })
    .max(20, "maximum 20 charecter is reached"),
});

export type signUpUserSchema = z.infer<typeof signUpUserSchemaZod>;
export const signInUserSchemaZod = signUpUserSchemaZod.omit({ username: true });
export type signInUserSchema = z.infer<typeof signInUserSchemaZod>;
