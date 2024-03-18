import { Context } from '../context/context.js';
import { ISubscription } from '../types/subscriptions.js';

export const subscriptions = async (_, { prisma }: Context) => {
  return await prisma.subscribersOnAuthors.findMany();
};

export const subscribeToUser = async (
  { subscriberId: id, authorId }: ISubscription,
  { prisma }: Context,
) => {
  return prisma.user.update({
    where: { id },
    data: { userSubscribedTo: { create: { authorId } } },
  });
};

export const unsubscribeFromUser = async (
  { subscriberId, authorId }: ISubscription,
  { prisma }: Context,
) => {
  return await prisma.subscribersOnAuthors.delete({
    where: { subscriberId_authorId: { subscriberId, authorId } },
  });
};
