import { relations } from 'drizzle-orm';
import { pgTable, serial, text } from 'drizzle-orm/pg-core';
import { profileInfo } from './profileInfo.schema';
import { posts } from './posts.schema';
import { comments } from './comments.schema';
import { usersToGroups } from './groups.schema';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull(),
  password: text('password').notNull(),
});

export const userRelations = relations(users, ({ one, many }) => ({
  profile: one(profileInfo),
  posts: many(posts),
  comments: many(comments),
  usersToGroups: many(usersToGroups),
}))