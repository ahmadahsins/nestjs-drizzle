import { pgTable, serial, text, integer, primaryKey, index } from "drizzle-orm/pg-core";
import { users } from "./users.shema";

export const groups = pgTable("groups", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
});

// join table (many-to-many relationship)
export const usersToGroups = pgTable("usersToGroups", {
  userId: integer("userId").references(() => users.id),
  groupId: integer("groupId").references(() => groups.id),
},
  // composite primary key
  (table) => [
    primaryKey({ columns: [table.userId, table.groupId] }),
    // or PK with custom name
    // primaryKey({ name: "custome_name", columns: [table.userId, table.groupId] }),
    index("userIdIndex").on(table.userId),
  ]
);