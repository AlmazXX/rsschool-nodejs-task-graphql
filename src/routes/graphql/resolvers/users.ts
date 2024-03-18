import { PrismaClient } from '@prisma/client';
import { IUser, UserInput } from '../types/users.js';

export const users = async (_, context: PrismaClient): Promise<IUser[]> => {
  return await context.user.findMany();
};

export const user = async (
  { id }: { id: string },
  context: PrismaClient,
): Promise<IUser | null> => {
  return await context.user.findUnique({ where: { id } });
};

export const createUser = async (
  { user }: { user: UserInput },
  context: PrismaClient,
): Promise<IUser> => {
  return await context.user.create({ data: user });
};

export const updateUser = async (
  {
    id,
    user,
  }: {
    id: string;
    user: Partial<UserInput>;
  },
  context: PrismaClient,
): Promise<IUser> => {
  return await context.user.update({ where: { id }, data: user });
};

export const deleteUser = async (
  { id }: { id: string },
  context: PrismaClient,
): Promise<IUser> => {
  return await context.user.delete({ where: { id } });
};
