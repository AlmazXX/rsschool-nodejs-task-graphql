import { PrismaClient } from '@prisma/client';
import { Context } from '../context/context.js';
import { IMember, MemberType } from '../types/members.js';

export const memberTypes = async (_, { prisma }: Context): Promise<IMember[]> => {
  return await prisma.memberType.findMany();
};

export const memberType = async (
  { id }: { id: MemberType },
  { prisma }: Context,
): Promise<IMember | null> => {
  return await prisma.memberType.findUnique({ where: { id } });
};

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
