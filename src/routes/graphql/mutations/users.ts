import { GraphQLList, GraphQLNonNull, GraphQLObjectType } from 'graphql';
import { HttpCompatibleError } from '../../../plugins/handle-http-error.js';
import { Context } from '../context/context.js';
import {
  ErrorPayload,
  PayloadInterface,
  SuccessMutationPayload,
} from '../types/payload.js';
import { IUserInput, UserInput, UserUpdateInput } from '../types/users.js';
import { UUIDType } from '../types/uuid.js';

export const UserMutations = new GraphQLObjectType<unknown, Context>({
  name: 'UserMutations',
  fields: () => ({
    create: {
      type: new GraphQLNonNull(PayloadInterface),
      args: {
        dto: {
          type: new GraphQLNonNull(UserInput),
        },
      },
      resolve: async (_, { dto: data }: { dto: IUserInput }, { prisma }) => {
        try {
          const item = await prisma.user.create({ data });
          return new SuccessMutationPayload().withRecord(item);
        } catch (error) {
          if (error instanceof HttpCompatibleError) {
            return new ErrorPayload().withError(error);
          }
        }
      },
    },
    change: {
      type: new GraphQLNonNull(PayloadInterface),
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
        dto: { type: new GraphQLNonNull(UserUpdateInput) },
      },
      resolve: async (
        _,
        { id, dto: data }: { id: string; dto: Partial<IUserInput> },
        { prisma },
      ) => {
        try {
          const item = await prisma.user.update({ where: { id }, data });
          return new SuccessMutationPayload().withRecord(item);
        } catch (error) {
          if (error instanceof HttpCompatibleError) {
            return new ErrorPayload().withError(error);
          }
        }
      },
    },
    delete: {
      type: new GraphQLNonNull(PayloadInterface),
      args: {
        id: { type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(UUIDType))) },
      },
      resolve: async (_, { id }: { id: string[] }, { prisma }) => {
        try {
          await prisma.user.deleteMany({ where: { id: { in: id } } });
          return new SuccessMutationPayload();
        } catch (error) {
          if (error instanceof HttpCompatibleError) {
            return new ErrorPayload().withError(error);
          }
        }
      },
    },
    subscribeTo: {
      type: new GraphQLNonNull(PayloadInterface),
      args: {
        userId: { type: new GraphQLNonNull(UUIDType) },
        authorId: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: async (
        _,
        { userId: id, authorId }: { userId: string; authorId: string },
        { prisma }: Context,
      ) => {
        try {
          const item = await prisma.user.update({
            where: { id },
            data: { userSubscribedTo: { create: { authorId } } },
          });
          return new SuccessMutationPayload().withRecord(item);
        } catch (error) {
          if (error instanceof HttpCompatibleError) {
            return new ErrorPayload().withError(error);
          }
        }
      },
    },
    unsubscribeFrom: {
      type: new GraphQLNonNull(PayloadInterface),
      args: {
        userId: { type: new GraphQLNonNull(UUIDType) },
        authorId: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: async (
        _,
        { userId, authorId }: { userId: string; authorId: string },
        { prisma }: Context,
      ) => {
        try {
          await prisma.subscribersOnAuthors.delete({
            where: { subscriberId_authorId: { subscriberId: userId, authorId } },
          });
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
