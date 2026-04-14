import { PrismaClient } from '@prisma/client';
import { IMember } from '../types/members.js';

export const batchMembers = async (
  memberTypeIds: readonly string[],
  prisma: PrismaClient,
) => {
  const memberTypes = await prisma.memberType.findMany({
    where: { profiles: { some: { memberTypeId: { in: <string[]>memberTypeIds } } } },
  });

  const memberTypesMap = memberTypes.reduce((acc, memberType) => {
    acc.set(memberType.id, memberType);
    return acc;
  }, new Map<string, IMember>());

  return memberTypeIds.map((id) => memberTypesMap.get(id) ?? null);
};
