import { PrismaClient } from '@prisma/client';
import { GraphQLBoolean, GraphQLList, GraphQLNonNull, GraphQLObjectType } from 'graphql';
import { Context } from '../context/context.js';
import {
  IProfile,
  IProfileInput,
  ProfileInput,
  ProfileType,
  ProfileUpdateInput,
} from '../types/profiles.js';
import { UUIDType } from '../types/uuid.js';

export const profiles = async (_, { prisma }: Context): Promise<IProfile[]> => {
  return await prisma.profile.findMany();
};

export const profile = async (
  { id }: { id: string },
  { prisma }: Context,
): Promise<IProfile | null> => {
  return await prisma.profile.findUnique({ where: { id } });
};

export const ProfileMutations = new GraphQLObjectType({
  name: 'ProfileMutations',
  fields: () => ({
    create: {
      type: ProfileType,
      args: {
        dto: {
          type: new GraphQLNonNull(ProfileInput),
        },
      },
      resolve: async (_, { dto: data }: { dto: IProfileInput }, { prisma }: Context) => {
        return prisma.profile.create({ data });
      },
    },
    change: {
      type: ProfileType,
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
        dto: { type: new GraphQLNonNull(ProfileUpdateInput) },
      },
      resolve: async (_, { dto: data }: { dto: IProfileInput }, { prisma }: Context) => {
        return prisma.profile.create({ data });
      },
    },
    delete: {
      type: new GraphQLNonNull(GraphQLBoolean),
      args: {
        id: { type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(UUIDType))) },
      },
      resolve: async (_, { id }: { id: string }, { prisma }: Context) => {
        try {
          await prisma.profile.deleteMany({ where: { id } });
          return true;
        } catch {
          return false;
        }
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
