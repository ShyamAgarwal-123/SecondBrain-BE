import { z } from "zod";

export const contentSchemaZod = z.object({
  type: z.enum(["link", "youtube", "tweet", "document"]),
  link: z
    .string({ message: "link must be a string" })
    .url({ message: "a url is required" }),
  title: z.string(),
  tags: z.array(z.string()),
});

export type ContentSchemaType = z.infer<typeof contentSchemaZod>;
