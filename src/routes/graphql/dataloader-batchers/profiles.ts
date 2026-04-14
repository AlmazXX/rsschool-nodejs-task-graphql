import { PrismaClient } from '@prisma/client';
import { IProfile } from '../types/profiles.js';

export const batchProfiles = async (userIds: readonly string[], prisma: PrismaClient) => {
  const profiles = await prisma.profile.findMany({
    where: { userId: { in: <string[]>userIds } },
  });

  const profilesMap = profiles.reduce((acc, profile) => {
    acc.set(profile.userId, profile);
    return acc;
  }, new Map<string, IProfile>());

  return userIds.map((id) => profilesMap.get(id) ?? null);
};
