import { PrismaClient } from '@prisma/client';
import { Context } from '../context/context.js';
import { IUser, UserInput } from '../types/users.js';

export const users = async (_, { prisma, usersLoader }: Context): Promise<IUser[]> => {
  const users = await prisma.user.findMany({
    include: { subscribedToUser: true, userSubscribedTo: true },
  });

  users.forEach((user) => {
    usersLoader.prime(user.id, user);
  });

  return users;
};

export const user = async (
  { id }: { id: string },
  { prisma }: Context,
): Promise<IUser | null> => {
  return await prisma.user.findUnique({
    where: { id },
    include: { subscribedToUser: true, userSubscribedTo: true },
  });
};

export const createUser = async (
  { user }: { user: UserInput },
  { prisma }: Context,
): Promise<IUser> => {
  return await prisma.user.create({ data: user });
};

export const updateUser = async (
  {
    id,
    user,
  }: {
    id: string;
    user: Partial<UserInput>;
  },
  { prisma }: Context,
): Promise<IUser> => {
  return await prisma.user.update({ where: { id }, data: user });
};

export const deleteUser = async (
  { id }: { id: string },
  { prisma }: Context,
): Promise<IUser> => {
  return await prisma.user.delete({ where: { id } });
};

export const batchUsers = async (userIds: readonly string[], prisma: PrismaClient) => {
  const users = await prisma.user.findMany({
    where: { id: { in: <string[]>userIds } },
    include: { userSubscribedTo: true, subscribedToUser: true },
  });

  const mappedUser = users.reduce<Record<string, IUser>>((acc, user) => {
    acc[user.id] = user;
    return acc;
  }, {});

  return userIds.map((id) => mappedUser[id]);
};
