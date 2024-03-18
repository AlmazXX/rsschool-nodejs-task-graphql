import { PrismaClient } from '@prisma/client';
import { IPost, PostInput } from '../types/posts.js';

export const posts = async (_, context: PrismaClient): Promise<IPost[]> => {
  return await context.post.findMany();
};

export const post = async (
  { id }: { id: string },
  context: PrismaClient,
): Promise<IPost | null> => {
  return await context.post.findUnique({ where: { id } });
};

export const createPost = async (
  { post }: { post: PostInput },
  context: PrismaClient,
): Promise<IPost> => {
  return await context.post.create({ data: post });
};

export const updatePost = async (
  { id, post }: { id: string; post: Partial<PostInput> },
  context: PrismaClient,
): Promise<IPost> => {
  return await context.post.update({ where: { id }, data: post });
};

export const deletePost = async (
  { id }: { id: string },
  context: PrismaClient,
): Promise<IPost> => {
  return await context.post.delete({ where: { id } });
};
