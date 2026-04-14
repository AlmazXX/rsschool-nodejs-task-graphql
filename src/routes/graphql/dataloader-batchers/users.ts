import { PrismaClient } from '@prisma/client';
import { IUser } from '../types/users.js';

export const batchUsers = async (userIds: readonly string[], prisma: PrismaClient) => {
  const users = await prisma.user.findMany({
    where: { id: { in: <string[]>userIds } },
  });

  const mappedUser = users.reduce((acc, user) => {
    acc.set(user.id, user);
    return acc;
  }, new Map<string, IUser>());

  return userIds.map((id) => mappedUser.get(id) ?? null);
};

export const batchSubscribers = async (
  authorIds: readonly string[],
  prisma: PrismaClient,
) => {
  const subscribers = await prisma.user.findMany({
    where: { userSubscribedTo: { some: { authorId: { in: <string[]>authorIds } } } },
    include: { userSubscribedTo: true },
  });

  const subscribersByAuthor = new Map<string, IUser[]>();

  for (const sub of subscribers) {
    for (const follow of sub.userSubscribedTo) {
      let list = subscribersByAuthor.get(follow.authorId);

      if (!list) {
        list = [];
        subscribersByAuthor.set(follow.authorId, list);
      }

      list.push(sub);
    }
  }

  return authorIds.map((id) => subscribersByAuthor.get(id) ?? []);
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

  const authorsBySubscriber = new Map<string, IUser[]>();

  for (const author of authors) {
    for (const sub of author.subscribedToUser) {
      let list = authorsBySubscriber.get(sub.subscriberId);

      if (!list) {
        list = [];
        authorsBySubscriber.set(sub.subscriberId, list);
      }

      list.push(author);
    }
  }

  return subscriberIds.map((id) => authorsBySubscriber.get(id) ?? []);
};
