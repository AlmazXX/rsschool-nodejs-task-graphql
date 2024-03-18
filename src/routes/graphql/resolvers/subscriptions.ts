import { PrismaClient } from '@prisma/client';
import { ISubscription } from '../types/subscriptions.js';

export const subscriptions = async (_, context: PrismaClient) => {
  return await context.subscribersOnAuthors.findMany();
};

export const subscribeToUser = async (
  { subscriberId: id, authorId }: ISubscription,
  context: PrismaClient,
) => {
  return context.user.update({
    where: { id },
    data: { userSubscribedTo: { create: { authorId } } },
  });
};

export const unsubscribeFromUser = async (
  { subscriberId, authorId }: ISubscription,
  context: PrismaClient,
) => {
  return await context.subscribersOnAuthors.delete({
    where: { subscriberId_authorId: { subscriberId, authorId } },
  });
};
