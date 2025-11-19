import { Pool } from "pg";
import "dotenv/config";
import { drizzle, NodePgDatabase } from "drizzle-orm/node-postgres";
import * as schema from "./schema/schema";
import { faker } from "@faker-js/faker";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: true,
});

const db = drizzle(pool, { schema }) as NodePgDatabase<typeof schema>;

async function main() {
  const userIds = await Promise.all(
    Array(50).fill("").map(async () => {
      const user = await db.insert(schema.users).values({
        name: faker.person.firstName() + " " + faker.person.lastName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
      }).returning();
      return user[0].id;
    })
  );

  await Promise.all(
    userIds.map(async (userId) => {
      const profileInfo = await db.insert(schema.profileInfo).values({
        metadata: JSON.stringify({
          bio: faker.lorem.paragraph(),
          location: faker.location.city(),
          website: faker.internet.url(),
        }),
        userId,
      }).returning();
      return profileInfo[0].id;
    })
  );

  const postIds = await Promise.all(
    Array(50).fill("").map(async () => {
      const post = await db.insert(schema.posts).values({
        title: faker.lorem.sentence(),
        content: faker.lorem.paragraph(),
        authorId: faker.helpers.arrayElement(userIds),
      }).returning();
      return post[0].id;
    })
  );

  await Promise.all(
    Array(50).fill("").map(async () => {
      const comment = await db.insert(schema.comments).values({
        content: faker.lorem.sentence(),
        authorId: faker.helpers.arrayElement(userIds),
        postId: faker.helpers.arrayElement(postIds),
      }).returning();
      return comment[0].id;
    })
  );

  const insertedGroups = await db.insert(schema.groups).values([
    {
      name: "JS",
    },
    {
      name: "TS",
    }
  ]).returning();

  const groupIds = insertedGroups.map((group) => group.id);

  await Promise.all(
    userIds.map(async (userId) => {
      return await db.insert(schema.usersToGroups).values({
        userId,
        groupId: faker.helpers.arrayElement(groupIds),
      }).returning();
    })
  )
}

main().then(() => console.log("done")).catch((e) => {
  console.error(e);
  process.exit(0);
}).finally(() => pool.end());
