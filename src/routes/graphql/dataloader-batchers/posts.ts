import { PrismaClient } from '@prisma/client';
import { IPost } from '../types/posts.js';

export const batchPosts = async (authorIds: readonly string[], prisma: PrismaClient) => {
  const posts = await prisma.post.findMany({
    where: { authorId: { in: <string[]>authorIds } },
  });

  const mappedPosts = posts.reduce<Record<string, IPost[]>>((acc, post) => {
    const { authorId } = post;
    acc[authorId] ? acc[authorId].push(post) : (acc[authorId] = [post]);
    return acc;
  }, {});

  return authorIds.map((id) => mappedPosts[id] ?? []);
};
