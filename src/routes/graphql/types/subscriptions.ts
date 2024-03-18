import { GraphQLObjectType } from 'graphql';
import { Context } from '../context/context.js';
import { userType } from './users.js';

export interface ISubscription {
  subscriberId: string;
  authorId: string;
}

export const subscriptionType = new GraphQLObjectType<ISubscription, Context>({
  name: 'Subscription',
  fields: () => ({
    subscriber: {
      type: userType,
      async resolve({ subscriberId }, _, { usersLoader }) {
        return await usersLoader.load(subscriberId);
      },
    },
    author: {
      type: userType,
      async resolve({ authorId }, _, { usersLoader }) {
        return await usersLoader.load(authorId);
      },
    },
  }),
});
