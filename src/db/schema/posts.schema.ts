import { pgTable, serial, text, integer } from "drizzle-orm/pg-core";
import { users } from "./users.shema";
import { relations } from "drizzle-orm";
import { comments } from "./comments.schema";

export const posts = pgTable("posts", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  authorId: integer("authorId").references(() => users.id),
});

export const postRelations = relations(posts, ({ one, many }) => ({
  author: one(users, {
    fields: [posts.authorId],
    references: [users.id],
  }),
  comments: many(comments),
}));