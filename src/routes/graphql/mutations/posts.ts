import { GraphQLList, GraphQLNonNull, GraphQLObjectType } from 'graphql';
import { HttpCompatibleError } from '../../../plugins/handle-http-error.js';
import { Context } from '../context/context.js';
import {
  ErrorPayload,
  PayloadInterface,
  SuccessMutationPayload,
} from '../types/payload.js';
import { IPostInput, PostInput, PostUpdateInput } from '../types/posts.js';
import { UUIDType } from '../types/uuid.js';

export const PostMutations = new GraphQLObjectType({
  name: 'PostMutations',
  fields: () => ({
    create: {
      type: PayloadInterface,
      args: {
        dto: { type: new GraphQLNonNull(PostInput) },
      },
      resolve: async (_, { dto: data }: { dto: IPostInput }, { prisma }: Context) => {
        try {
          const item = await prisma.post.create({ data });
          return new SuccessMutationPayload().withRecord(item);
        } catch (error) {
          if (error instanceof HttpCompatibleError) {
            return new ErrorPayload().withError(error);
          }
        }
      },
    },
    change: {
      type: PayloadInterface,
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
        dto: { type: new GraphQLNonNull(PostUpdateInput) },
      },
      resolve: async (
        _,
        { id, dto: data }: { id: string; dto: Partial<IPostInput> },
        { prisma }: Context,
      ) => {
        try {
          const item = await prisma.post.update({ where: { id }, data });
          return new SuccessMutationPayload().withRecord(item);
        } catch (error) {
          if (error instanceof HttpCompatibleError) {
            return new ErrorPayload().withError(error);
          }
        }
      },
    },
    delete: {
      type: PayloadInterface,
      args: {
        id: { type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(UUIDType))) },
      },
      resolve: async (_, { id }: { id: string[] }, { prisma }: Context) => {
        try {
          await prisma.post.deleteMany({ where: { id: { in: id } } });
          return new SuccessMutationPayload();
        } catch (error) {
          if (error instanceof HttpCompatibleError) {
            return new ErrorPayload().withError(error);
          }
        }
      },
    },
  }),
});
