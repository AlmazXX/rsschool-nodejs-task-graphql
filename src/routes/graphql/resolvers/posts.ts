import { PrismaClient } from '@prisma/client';
import { GraphQLBoolean, GraphQLList, GraphQLNonNull, GraphQLObjectType } from 'graphql';
import { Context } from '../context/context.js';
import {
  IPost,
  IPostInput,
  PostInput,
  PostType,
  PostUpdateInput,
} from '../types/posts.js';
import { UUIDType } from '../types/uuid.js';

export const posts = async (_, { prisma }: Context): Promise<IPost[]> => {
  return await prisma.post.findMany();
};

export const post = async (
  { id }: { id: string },
  { prisma }: Context,
): Promise<IPost | null> => {
  return await prisma.post.findUnique({ where: { id } });
};

export const PostMutations = new GraphQLObjectType({
  name: 'PostMutations',
  fields: () => ({
    create: {
      type: PostType,
      args: {
        dto: { type: new GraphQLNonNull(PostInput) },
      },
      resolve: async (_, { dto: data }: { dto: IPostInput }, { prisma }: Context) => {
        return prisma.post.create({ data });
      },
    },
    change: {
      type: PostType,
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
        dto: { type: new GraphQLNonNull(PostUpdateInput) },
      },
      resolve: async (
        _,
        { id, dto: data }: { id: string; dto: Partial<IPostInput> },
        { prisma }: Context,
      ) => {
        return prisma.post.update({ where: { id }, data });
      },
    },
    delete: {
      type: new GraphQLNonNull(GraphQLBoolean),
      args: {
        id: { type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(UUIDType))) },
      },
      resolve: async ({ id }: { id: string }, { prisma }: Context) => {
        try {
          await prisma.post.delete({ where: { id } });
          return true;
        } catch {
          return false;
        }
      },
    },
  }),
});

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
