import { PrismaClient } from '@prisma/client';
import { GraphQLList, GraphQLNonNull, GraphQLObjectType } from 'graphql';
import { HttpCompatibleError } from '../../../plugins/handle-http-error.js';
import { Context } from '../context/context.js';
import { Payload, PayloadType } from '../types/payload.js';
import {
  IProfile,
  IProfileInput,
  ProfileInput,
  ProfileUpdateInput,
} from '../types/profiles.js';
import { UUIDType } from '../types/uuid.js';

export const ProfileMutations = new GraphQLObjectType({
  name: 'ProfileMutations',
  fields: () => ({
    create: {
      type: new GraphQLNonNull(PayloadType),
      args: {
        dto: {
          type: new GraphQLNonNull(ProfileInput),
        },
      },
      resolve: async (_, { dto: data }: { dto: IProfileInput }, { prisma }: Context) => {
        const payload = Payload.withDefault();
        try {
          const item = await prisma.profile.create({ data });
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
        dto: { type: new GraphQLNonNull(ProfileUpdateInput) },
      },
      resolve: async (
        _,
        { id, dto: data }: { id: string; dto: IProfileInput },
        { prisma }: Context,
      ) => {
        const payload = Payload.withDefault();
        try {
          const item = await prisma.profile.update({ where: { id }, data });
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
      resolve: async (_, { id }: { id: string[] }, { prisma }: Context) => {
        const payload = Payload.withDefault();
        try {
          await prisma.profile.deleteMany({ where: { id: { in: id } } });
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

export const batchProfiles = async (userIds: readonly string[], prisma: PrismaClient) => {
  const profiles = await prisma.profile.findMany({
    where: { userId: { in: <string[]>userIds } },
  });

  const mappedProfiles = profiles.reduce<Record<string, IProfile>>((acc, profile) => {
    acc[profile.userId] = profile;
    return acc;
  }, {});

  return userIds.map((id) => mappedProfiles[id] ?? null);
};
