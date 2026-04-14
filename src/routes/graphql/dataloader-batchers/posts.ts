import { PrismaClient } from '@prisma/client';
import { IPost } from '../types/posts.js';

export const batchPosts = async (authorIds: readonly string[], prisma: PrismaClient) => {
  const posts = await prisma.post.findMany({
    where: { authorId: { in: <string[]>authorIds } },
  });

  const postsMap = posts.reduce((acc, post) => {
    const group = acc.get(post.authorId) ?? [];
    group.push(post);

    acc.set(post.authorId, group);
    return acc;
  }, new Map<string, IPost[]>());

  return authorIds.map((id) => postsMap.get(id) ?? []);
};
