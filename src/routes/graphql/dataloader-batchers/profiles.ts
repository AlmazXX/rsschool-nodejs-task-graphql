import { PrismaClient } from '@prisma/client';
import { IProfile } from '../types/profiles.js';

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
