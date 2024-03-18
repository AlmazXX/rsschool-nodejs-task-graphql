import { GraphQLObjectType } from 'graphql';
import { userType } from './users.js';
import { PrismaClient } from '@prisma/client';

export interface ISubscription {
  subscriberId: string;
  authorId: string;
}

export const subscriptionType = new GraphQLObjectType<ISubscription, PrismaClient>({
  name: 'Subscription',
  fields: () => ({
    subscriber: {
      type: userType,
      async resolve({ subscriberId: id }, _, context) {
        return await context.user.findUnique({ where: { id } });
      },
    },
    author: {
      type: userType,
      async resolve({ authorId: id }, _, context) {
        return await context.user.findUnique({ where: { id } });
      },
    },
  }),
});
