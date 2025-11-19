import { pgTable, serial, text, integer } from "drizzle-orm/pg-core";
import { users } from "./users.shema";

export const posts = pgTable("posts", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull(), 
  authorId: integer("authorId").references(() => users.id),
})