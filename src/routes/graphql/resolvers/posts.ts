import { PrismaClient } from '@prisma/client';
import { Context } from '../context/context.js';
import { IPost, PostInput } from '../types/posts.js';

export const posts = async (_, { prisma }: Context): Promise<IPost[]> => {
  return await prisma.post.findMany();
};

export const post = async (
  { id }: { id: string },
  { prisma }: Context,
): Promise<IPost | null> => {
  return await prisma.post.findUnique({ where: { id } });
};

export const createPost = async (
  { post }: { post: PostInput },
  { prisma }: Context,
): Promise<IPost> => {
  return await prisma.post.create({ data: post });
};

export const updatePost = async (
  { id, post }: { id: string; post: Partial<PostInput> },
  { prisma }: Context,
): Promise<IPost> => {
  return await prisma.post.update({ where: { id }, data: post });
};

export const deletePost = async (
  { id }: { id: string },
  { prisma }: Context,
): Promise<IPost> => {
  return await prisma.post.delete({ where: { id } });
};

export const batchPosts = async (authorIds: readonly string[], prisma: PrismaClient) => {
  const posts = await prisma.post.findMany({
    where: { authorId: { in: <string[]>authorIds } },
  });

  const mappedPosts = posts.reduce<Record<string, IPost[]>>((acc, post) => {
    const { authorId } = post;
    acc[authorId] ? acc[authorId].push(post) : (acc[authorId] = [post]);
    return acc;
  }, {});

  return authorIds.map((id) => mappedPosts[id]);
};
