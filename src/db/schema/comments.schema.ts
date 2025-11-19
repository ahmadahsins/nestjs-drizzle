import { pgTable, serial, text, integer } from "drizzle-orm/pg-core";
import { users } from "./users.shema";

export const comments = pgTable("comments", {
  id: serial("id").primaryKey(),
  content: text("content").notNull(),
  authorId: integer("authorId").references(() => users.id),
})