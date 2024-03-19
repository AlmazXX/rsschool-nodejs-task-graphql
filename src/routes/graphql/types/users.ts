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
import { UUIDType } from './uuid.js';

export interface IUser {
  id: string;
  name: string;
  balance: number;
}

export type UserInput = Omit<IUser, 'id'>;

export const userInput = new GraphQLInputObjectType({
  name: 'CreateUserInput',
  fields: () => ({
    name: { type: new GraphQLNonNull(GraphQLString) },
    balance: { type: new GraphQLNonNull(GraphQLFloat) },
  }),
});

export const userUpdateInput = new GraphQLInputObjectType({
  name: 'ChangeUserInput',
  fields: () => ({
    name: { type: GraphQLString },
    balance: { type: GraphQLFloat },
  }),
});

export const userType: GraphQLObjectType<IUser, Context> = new GraphQLObjectType<
  IUser,
  Context
>({
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
      async resolve({ id }, _, { subscribersLoader }) {
        return subscribersLoader.load(id);
      },
    },
    userSubscribedTo: {
      type: new GraphQLList(userType),
      async resolve({ id }, _, { authorsLoader }) {
        return authorsLoader.load(id);
      },
    },
  }),
});
