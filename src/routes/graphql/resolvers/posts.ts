import { PrismaClient } from '@prisma/client';
import { GraphQLList, GraphQLNonNull, GraphQLObjectType } from 'graphql';
import { HttpCompatibleError } from '../../../plugins/handle-http-error.js';
import { Context } from '../context/context.js';
import { Payload, PayloadType } from '../types/payload.js';
import { IPost, IPostInput, PostInput, PostUpdateInput } from '../types/posts.js';
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
      type: new GraphQLNonNull(PayloadType),
      args: {
        dto: { type: new GraphQLNonNull(PostInput) },
      },
      resolve: async (_, { dto: data }: { dto: IPostInput }, { prisma }: Context) => {
        const payload = Payload.withDefault();
        try {
          const item = await prisma.post.create({ data });
          payload.withSuccess();
          payload.withRecord(item);
        } catch (error) {
          if (error instanceof HttpCompatibleError) {
            payload.withFail();
            payload.withError(error);
          }
        }
        return payload;
      },
    },
    change: {
      type: new GraphQLNonNull(PayloadType),
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
        dto: { type: new GraphQLNonNull(PostUpdateInput) },
      },
      resolve: async (
        _,
        { id, dto: data }: { id: string; dto: Partial<IPostInput> },
        { prisma }: Context,
      ) => {
        const payload = Payload.withDefault();
        try {
          const item = await prisma.post.update({ where: { id }, data });
          payload.withSuccess();
          payload.withRecord(item);
        } catch (error) {
          if (error instanceof HttpCompatibleError) {
            payload.withFail();
            payload.withError(error);
          }
        }
        return payload;
      },
    },
    delete: {
      type: new GraphQLNonNull(PayloadType),
      args: {
        id: { type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(UUIDType))) },
      },
      resolve: async ({ id }: { id: string }, { prisma }: Context) => {
        const payload = Payload.withDefault();
        try {
          await prisma.post.delete({ where: { id } });
          payload.withSuccess();
        } catch (error) {
          if (error instanceof HttpCompatibleError) {
            payload.withFail();
            payload.withError(error);
          }
        }
        return payload;
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
