import { PrismaClient } from '@prisma/client';
import { GraphQLResolveInfo } from 'graphql';
import { parseResolveInfo } from 'graphql-parse-resolve-info';
import { Context } from '../context/context.js';
import { IUser, UserInput } from '../types/users.js';

export const users = async (
  _,
  { prisma, subscribersLoader, authorsLoader }: Context,
  info: GraphQLResolveInfo,
): Promise<IUser[]> => {
  const parsedInfo = parseResolveInfo(info);

  const includesSubscriber = Object.keys(
    parsedInfo?.fieldsByTypeName?.User ?? {},
  ).includes('subscribedToUser');
  const includesAuthor = Object.keys(parsedInfo?.fieldsByTypeName?.User ?? {}).includes(
    'userSubscribedTo',
  );

  const users = await prisma.user.findMany({
    include: { subscribedToUser: includesSubscriber, userSubscribedTo: includesAuthor },
  });

  includesSubscriber &&
    users.forEach((author) => {
      const subscriberIds = author.subscribedToUser.map(
        ({ subscriberId }) => subscriberId,
      );
      subscribersLoader.prime(
        author.id,
        users.filter((user) => subscriberIds.includes(user.id)),
      );
    });

  includesAuthor &&
    users.forEach((subscriber) => {
      const authorIds = subscriber.userSubscribedTo.map(({ authorId }) => authorId);
      authorsLoader.prime(
        subscriber.id,
        users.filter((user) => authorIds.includes(user.id)),
      );
    });

  return users;
};

export const user = async (
  { id }: { id: string },
  { prisma }: Context,
): Promise<IUser | null> => {
  return await prisma.user.findUnique({
    where: { id },
  });
};

export const createUser = async (
  { dto: data }: { dto: UserInput },
  { prisma }: Context,
): Promise<IUser> => {
  return await prisma.user.create({ data });
};

export const changeUser = async (
  {
    id,
    dto: data,
  }: {
    id: string;
    dto: Partial<UserInput>;
  },
  { prisma }: Context,
): Promise<IUser> => {
  return await prisma.user.update({ where: { id }, data });
};

export const deleteUser = async (
  { id }: { id: string },
  { prisma }: Context,
): Promise<boolean> => {
  try {
    await prisma.user.delete({ where: { id } });
    return true;
  } catch {
    return false;
  }
};

export const subscribeTo = async (
  {
    userId: id,
    authorId,
  }: {
    userId: string;
    authorId: string;
  },
  { prisma }: Context,
) => {
  return await prisma.user.update({
    where: { id },
    data: { userSubscribedTo: { create: { authorId } } },
  });
};

export const unsubscribeFrom = async (
  {
    userId,
    authorId,
  }: {
    userId: string;
    authorId: string;
  },
  { prisma }: Context,
) => {
  try {
    await prisma.subscribersOnAuthors.delete({
      where: { subscriberId_authorId: { subscriberId: userId, authorId } },
    });
  } catch {
    return null;
  }
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

  return userIds.map((id) => mappedUser[id] ?? null);
};

export const batchSubscribers = async (
  authorIds: readonly string[],
  prisma: PrismaClient,
) => {
  const subscribers = await prisma.user.findMany({
    where: { userSubscribedTo: { some: { authorId: { in: <string[]>authorIds } } } },
    include: { userSubscribedTo: true },
  });

  return authorIds.map((authorId) =>
    subscribers.filter((subscriber) =>
      subscriber.userSubscribedTo.some((sub) => sub.authorId === authorId),
    ),
  );
};

export const batchAuthors = async (
  subscriberIds: readonly string[],
  prisma: PrismaClient,
) => {
  const authors = await prisma.user.findMany({
    where: {
      subscribedToUser: { some: { subscriberId: { in: <string[]>subscriberIds } } },
    },
    include: { subscribedToUser: true },
  });

  return subscriberIds.map((subscriberId) =>
    authors.filter((author) =>
      author.subscribedToUser.some((sub) => sub.subscriberId === subscriberId),
    ),
  );
};
