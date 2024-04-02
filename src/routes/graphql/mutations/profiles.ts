import { GraphQLList, GraphQLNonNull, GraphQLObjectType } from 'graphql';
import { HttpCompatibleError } from '../../../plugins/handle-http-error.js';
import { Context } from '../context/context.js';
import {
  ErrorPayload,
  PayloadInterface,
  SuccessMutationPayload,
} from '../types/payload.js';
import { IProfileInput, ProfileInput, ProfileUpdateInput } from '../types/profiles.js';
import { UUIDType } from '../types/uuid.js';

export const ProfileMutations = new GraphQLObjectType({
  name: 'ProfileMutations',
  fields: () => ({
    create: {
      type: new GraphQLNonNull(PayloadInterface),
      args: {
        dto: {
          type: new GraphQLNonNull(ProfileInput),
        },
      },
      resolve: async (_, { dto: data }: { dto: IProfileInput }, { prisma }: Context) => {
        try {
          const item = await prisma.profile.create({ data });
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
        dto: { type: new GraphQLNonNull(ProfileUpdateInput) },
      },
      resolve: async (
        _,
        { id, dto: data }: { id: string; dto: IProfileInput },
        { prisma }: Context,
      ) => {
        try {
          const item = await prisma.profile.update({ where: { id }, data });
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
      resolve: async (_, { id }: { id: string[] }, { prisma }: Context) => {
        try {
          await prisma.profile.deleteMany({ where: { id: { in: id } } });
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
