import {
  GraphQLFloat,
  GraphQLInputObjectType,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql';
import { Context } from '../context/context.js';
import { UUIDType } from './uuid.js';

export interface IUser {
  id: string;
  name: string;
  balance: number;
}

export type UserInput = Omit<IUser, 'id'>;

export const userInput = new GraphQLInputObjectType({
  name: 'UserInput',
  fields: () => ({
    name: { type: new GraphQLNonNull(GraphQLString) },
    balance: { type: new GraphQLNonNull(GraphQLFloat) },
  }),
});

export const userType = new GraphQLObjectType<IUser, Context>({
  name: 'User',
  fields: () => ({
    id: { type: UUIDType },
    name: { type: GraphQLString },
    balance: { type: GraphQLFloat },
  }),
});
