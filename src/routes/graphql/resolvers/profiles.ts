import { PrismaClient } from '@prisma/client';
import { Context } from '../context/context.js';
import { IProfile, ProfileInput } from '../types/profiles.js';

export const profiles = async (_, { prisma }: Context): Promise<IProfile[]> => {
  return await prisma.profile.findMany();
};

export const profile = async (
  { id }: { id: string },
  { prisma }: Context,
): Promise<IProfile | null> => {
  return await prisma.profile.findUnique({ where: { id } });
};

export const createProfile = async (
  { profile }: { profile: ProfileInput },
  { prisma }: Context,
): Promise<IProfile> => {
  return await prisma.profile.create({ data: profile });
};

export const updateProfile = async (
  { id, profile }: { id: string; profile: Partial<ProfileInput> },
  { prisma }: Context,
): Promise<IProfile> => {
  return await prisma.profile.update({ where: { id }, data: profile });
};

export const deleteProfile = async (
  { id }: { id: string },
  { prisma }: Context,
): Promise<IProfile> => {
  return await prisma.profile.delete({ where: { id } });
};

export const batchProfiles = async (userIds: readonly string[], prisma: PrismaClient) => {
  const profiles = await prisma.profile.findMany({
    where: { userId: { in: <string[]>userIds } },
  });

  const mappedProfiles = profiles.reduce<Record<string, IProfile>>((acc, profile) => {
    acc[profile.userId] = profile;
    return acc;
  }, {});

  return userIds.map((id) => mappedProfiles[id]);
};
