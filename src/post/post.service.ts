import { Inject, Injectable } from '@nestjs/common';
import { DRIZZLE } from 'src/db/drizzle.module';
import { DrizzleDB } from 'src/db/schema/types/drizzle';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { posts } from 'src/db/schema/posts.schema';
import { eq } from 'drizzle-orm';

@Injectable()
export class PostService {
  constructor(@Inject(DRIZZLE) private db: DrizzleDB | null) {}
  create(createPostDto: CreatePostDto) {
    return 'This action adds a new post';
  }

  async findAll() {
    return await this.db?.query.posts.findMany({
      with: {
        author: {
          with: {
            usersToGroups: {
              with: {
                groups: true,
              },
            }
          }
        },
        comments: true,
      },
    });
  }

  async findOne(id: number) {
    return await this.db?.query.posts.findFirst({
      where: (posts, { eq }) => eq(posts.id, id),
      with: {
        author: {
          with: {
            usersToGroups: {
              with: {
                groups: true,
              },
            }
          }
        },
        comments: true,
      },
    });
  }

  async update(id: number, updatePostDto: UpdatePostDto) {
    return await this.db?.update(posts).set({
      title: "test"
    }).where(eq(posts.id, id));
  }

  async remove(id: number) {
    return await this.db?.delete(posts).where(eq(posts.id, id));
  }
}
