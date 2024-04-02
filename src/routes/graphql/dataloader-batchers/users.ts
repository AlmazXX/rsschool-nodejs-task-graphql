import { PrismaClient } from '@prisma/client';
import { IUser } from '../types/users.js';

export const batchUsers = async (userIds: readonly string[], prisma: PrismaClient) => {
  const users = await prisma.user.findMany({
    where: { id: { in: <string[]>userIds } },
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
