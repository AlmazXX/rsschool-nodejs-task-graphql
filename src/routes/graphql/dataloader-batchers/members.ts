import { PrismaClient } from '@prisma/client';
import { IMember } from '../types/members.js';

export const batchMembers = async (
  memberTypeIds: readonly string[],
  prisma: PrismaClient,
) => {
  const memberTypes = await prisma.memberType.findMany({
    where: { profiles: { some: { memberTypeId: { in: <string[]>memberTypeIds } } } },
  });

  const mappedMemberTypes = memberTypes.reduce<Record<string, IMember>>(
    (acc, memberType) => {
      acc[memberType.id] = memberType;
      return acc;
    },
    {},
  );

  return memberTypeIds.map((id) => mappedMemberTypes[id] ?? null);
};
