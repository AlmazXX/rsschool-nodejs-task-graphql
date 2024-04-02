import {
  GraphQLFloat,
  GraphQLInputObjectType,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql';
import { Context } from '../context/context.js';
import { PostType } from './posts.js';
import { ProfileType } from './profiles.js';
import { UUIDType } from './uuid.js';

export interface IUser {
  id: string;
  name: string;
  balance: number;
}

export type IUserInput = Omit<IUser, 'id'>;

export const UserInput = new GraphQLInputObjectType({
  name: 'CreateUserInput',
  fields: () => ({
    name: { type: new GraphQLNonNull(GraphQLString) },
    balance: { type: new GraphQLNonNull(GraphQLFloat) },
  }),
});

export const UserUpdateInput = new GraphQLInputObjectType({
  name: 'ChangeUserInput',
  fields: () => ({
    name: { type: GraphQLString },
    balance: { type: GraphQLFloat },
  }),
});

export const UserType: GraphQLObjectType<IUser, Context> = new GraphQLObjectType<
  IUser,
  Context
>({
  name: 'User',
  fields: () => ({
    id: { type: UUIDType },
    name: { type: GraphQLString },
    balance: { type: GraphQLFloat },
    posts: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(PostType))),
      resolve: ({ id }, _, { postsLoader }) => postsLoader.load(id),
    },
    profile: {
      type: ProfileType,
      resolve: ({ id }, _, { profilesLoader }) => profilesLoader.load(id),
    },
    subscribedToUser: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(UserType))),
      resolve: ({ id }, _, { subscribersLoader }) => subscribersLoader.load(id),
    },
    userSubscribedTo: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(UserType))),
      resolve: ({ id }, _, { authorsLoader }) => authorsLoader.load(id),
    },
  }),
});

export const isUserRecord = (record: unknown): record is IUser => {
  return (
    !!record &&
    typeof record === 'object' &&
    'id' in record &&
    'name' in record &&
    'balance' in record
  );
};
