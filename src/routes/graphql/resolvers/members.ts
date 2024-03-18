import { PrismaClient } from '@prisma/client';
import { IMember, MemberType } from '../types/members.js';

export const memberTypes = async (_, context: PrismaClient): Promise<IMember[]> => {
  return await context.memberType.findMany();
};

export const memberType = async (
  { memberTypeId: id }: { memberTypeId: MemberType },
  context: PrismaClient,
): Promise<IMember | null> => {
  return await context.memberType.findUnique({ where: { id } });
};
