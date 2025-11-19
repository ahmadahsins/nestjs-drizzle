import { pgTable, serial, text, integer } from "drizzle-orm/pg-core";
import { users } from "./users.shema";
import { posts } from "./posts.schema";

export const comments = pgTable("comments", {
  id: serial("id").primaryKey(),
  content: text("content").notNull(),
  authorId: integer("authorId").references(() => users.id),
  postId: integer("postId").references(() => posts.id),
})