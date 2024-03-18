import {
  GraphQLFloat,
  GraphQLInputObjectType,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql';
import { Context } from '../context/context.js';
import { postType } from './posts.js';
import { profileType } from './profiles.js';
import { ISubscription } from './subscriptions.js';
import { UUIDType } from './uuid.js';

export interface IUser {
  id: string;
  name: string;
  balance: number;
}

export type UserInput = Omit<IUser, 'id'>;

export interface UserWithSubscriptions extends IUser {
  subscribedToUser: ISubscription[];
  userSubscribedTo: ISubscription[];
}

export const userInput = new GraphQLInputObjectType({
  name: 'UserInput',
  fields: () => ({
    name: { type: new GraphQLNonNull(GraphQLString) },
    balance: { type: new GraphQLNonNull(GraphQLFloat) },
  }),
});

export const userUpdateInput = new GraphQLInputObjectType({
  name: 'UserUpdateInput',
  fields: () => ({
    name: { type: GraphQLString },
    balance: { type: GraphQLFloat },
  }),
});

export const userType: GraphQLObjectType<UserWithSubscriptions, Context> =
  new GraphQLObjectType<UserWithSubscriptions, Context>({
    name: 'User',
    fields: () => ({
      id: { type: UUIDType },
      name: { type: GraphQLString },
      balance: { type: GraphQLFloat },
      posts: {
        type: new GraphQLList(postType),
        async resolve({ id }, _, { postsLoader }) {
          return await postsLoader.load(id);
        },
      },
      profile: {
        type: profileType,
        async resolve({ id }, _, { profilesLoader }) {
          return await profilesLoader.load(id);
        },
      },
      subscribedToUser: {
        type: new GraphQLList(userType),
        async resolve({ subscribedToUser }, _, { usersLoader }) {
          return subscribedToUser.length
            ? await usersLoader.loadMany(
                subscribedToUser.map(({ subscriberId }) => subscriberId),
              )
            : null;
        },
      },
      userSubscribedTo: {
        type: new GraphQLList(userType),
        async resolve({ userSubscribedTo }, _, { usersLoader }) {
          return userSubscribedTo.length
            ? await usersLoader.loadMany(userSubscribedTo.map(({ authorId }) => authorId))
            : null;
        },
      },
    }),
  });
